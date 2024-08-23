from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Configure MySQL connection
db_config = {
    'user': 'root',
    'password': '12345678',
    'host': 'localhost',
    'database': 'task_manager'
}

conn = mysql.connector.connect(**db_config)
cursor = conn.cursor(dictionary=True)

# Endpoint to create a task (POST)
@app.route('/task', methods=['POST'])
def create_task():
    task_data = request.json
    title = task_data.get('title')
    description = task_data.get('description')
    
    cursor.execute("INSERT INTO tasks (title, description) VALUES (%s, %s)", (title, description))
    conn.commit()

    return jsonify({"message": "Task created", "task_id": cursor.lastrowid}), 201

# Endpoint to edit a task (PATCH)
@app.route('/task/<int:task_id>', methods=['PATCH'])
def edit_task(task_id):
    cursor.execute("SELECT * FROM tasks WHERE id = %s", (task_id,))
    task = cursor.fetchone()
    if not task:
        return jsonify({"message": "Task not found"}), 404

    task_data = request.json
    title = task_data.get('title', task['title'])
    description = task_data.get('description', task['description'])

    cursor.execute("UPDATE tasks SET title = %s, description = %s WHERE id = %s", (title, description, task_id))
    conn.commit()

    return jsonify({"message": "Task updated", "task_id": task_id})

# Endpoint to delete a task (DELETE)
@app.route('/task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    cursor.execute("SELECT * FROM tasks WHERE id = %s", (task_id,))
    task = cursor.fetchone()
    if not task:
        return jsonify({"message": "Task not found"}), 404

    cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
    conn.commit()

    return jsonify({"message": "Task deleted", "task_id": task_id})

# Endpoint to list all tasks (GET)
@app.route('/tasks', methods=['GET'])
def list_tasks():
    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    return jsonify(tasks)

if __name__ == '__main__':
    app.run(debug=True)
