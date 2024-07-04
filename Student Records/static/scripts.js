const apiUrl = '/students';

document.addEventListener('DOMContentLoaded', () => {
    fetchStudents();

    const studentForm = document.getElementById('student-form');
    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(studentForm);
        const studentData = Object.fromEntries(formData.entries());

        try {
            await addStudent(studentData);
            studentForm.reset();
            fetchStudents();
        } catch (error) {
            console.error('Error adding student:', error);
        }
    });

    const editStudentForm = document.getElementById('edit-student-form');
    editStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editStudentForm);
        const studentData = Object.fromEntries(formData.entries());

        try {
            await updateStudent(studentData.id, studentData);
            closeModal();
            fetchStudents();
        } catch (error) {
            console.error('Error updating student:', error);
        }
    });

    const modal = document.getElementById('edit-modal');
    const closeModalBtn = document.getElementsByClassName('close')[0];
    closeModalBtn.onclick = () => closeModal();
    window.onclick = (event) => {
        if (event.target == modal) {
            closeModal();
        }
    };
});

async function fetchStudents() {
    try {
        const response = await fetch(apiUrl);
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

function displayStudents(students) {
    const studentsTableBody = document.querySelector('#students-table tbody');
    studentsTableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.first_name}</td>
            <td>${student.last_name}</td>
            <td>${student.dob}</td>
            <td>${student.amount_due}</td>
            <td>
                <button onclick="editStudent(${student.id})">Edit</button>
                <button onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;
        studentsTableBody.appendChild(row);
    });
}

async function addStudent(studentData) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    });

    if (!response.ok) {
        throw new Error('Failed to add student');
    }
}

async function updateStudent(studentId, studentData) {
    const response = await fetch(`${apiUrl}/${studentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    });

    if (!response.ok) {
        throw new Error('Failed to update student');
    }
}

async function deleteStudent(studentId) {
    const response = await fetch(`${apiUrl}/${studentId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete student');
    }

    fetchStudents();
}

function editStudent(studentId) {
    const student = students.find(student => student.id === studentId);
    if (student) {
        document.getElementById('edit_id').value = student.id;
        document.getElementById('edit_first_name').value = student.first_name;
        document.getElementById('edit_last_name').value = student.last_name;
        document.getElementById('edit_dob').value = student.dob;
        document.getElementById('edit_amount_due').value = student.amount_due;
        openModal();
    }
}

function openModal() {
    document.getElementById('edit-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}
