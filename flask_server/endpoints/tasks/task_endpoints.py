# tasks_endpoint.py
from flask import Flask, request, jsonify
from config import Config
from models import db, Task

app = Flask(__name__)
app.config.from_object(Config)

# Initialize the SQLAlchemy connection
db.init_app(app)

# Use the MySQL database for tasks
with app.app_context():
    app.config['SQLALCHEMY_DATABASE_URI'] = Config().MYSQL_DATABASE_URI

@app.route('/task', methods=['POST'])
def create_task():
    task_data = request.json
    title = task_data.get('title')
    description = task_data.get('description')

    task = Task(title=title, description=description)
    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Task created", "task_id": task.id}), 201

@app.route('/task/<int:task_id>', methods=['PATCH'])
def edit_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"message": "Task not found"}), 404

    task_data = request.json
    task.title = task_data.get('title', task.title)
    task.description = task_data.get('description', task.description)

    db.session.commit()

    return jsonify({"message": "Task updated", "task_id": task_id})

@app.route('/task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"message": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted", "task_id": task_id})

@app.route('/tasks', methods=['GET'])
def list_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

if __name__ == '__main__':
    app.run(debug=True)
