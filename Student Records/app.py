from flask import Flask, jsonify, request, render_template
app = Flask(__name__)

# Sample data
students = [
    {'id': 1, 'first_name': 'John', 'last_name': 'Doe', 'dob': '2000-01-01', 'amount_due': 100.0},
    {'id': 2, 'first_name': 'Jane', 'last_name': 'Smith', 'dob': '2001-02-02', 'amount_due': 150.0}
]

# Utility function to get the next student ID
def get_next_id():
    return max(student['id'] for student in students) + 1 if students else 1

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/students', methods=['GET'])
def get_students():
    return jsonify(students)

@app.route('/students', methods=['POST'])
def add_student():
    new_student = request.json
    new_student['id'] = get_next_id()
    students.append(new_student)
    return jsonify(new_student), 201

@app.route('/students/<int:id>', methods=['PUT'])
def update_student(id):
    updated_student = request.json
    for student in students:
        if student['id'] == id:
            student.update(updated_student)
            return jsonify(student)
    return jsonify({'error': 'Student not found'}), 404

@app.route('/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    global students
    students = [student for student in students if student['id'] != id]
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
