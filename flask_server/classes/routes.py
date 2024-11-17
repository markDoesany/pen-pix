from flask import request, jsonify, session
from model import db, Classes
from utils.auth_helpers import login_required
from classes import classes_bp

@login_required
@classes_bp.route('/create-class', methods=['POST'])
def create_class():
    user_id = session.get('user_id')  
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    data = request.json

    if not all(key in data for key in ['classCode','classGroup', 'classSchedule', 'studentList']):
        return jsonify({"error": "Missing required fields"}), 400

    classes = Classes(
        class_code=data['classCode'],
        class_group= data['classGroup'],
        class_schedule= data['classSchedule'],
        student_list= data['studentList'],
    )

    db.session.add(classes)
    db.session.commit()

    return jsonify(classes.to_dict()), 201


@login_required
@classes_bp.route('/edit-class/<int:class_id>', methods=['PUT'])
def edit_class(class_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    class_data = Classes.query.get(class_id)
    if not class_data:
        return jsonify({"error": "Class not found"}), 404

    data = request.json

    if not all(key in data for key in ['classCode', 'classGroup', 'classSchedule', 'studentList']):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        class_data.class_code = data['classCode']
        class_data.class_group = data['classGroup']
        class_data.class_schedule = data['classSchedule']
        class_data.student_list = data['studentList']

        db.session.commit()
        return jsonify({"message": "Class updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update class: {str(e)}"}), 500


@login_required
@classes_bp.route('/delete-class/<int:class_id>', methods=['DELETE'])
def delete_class(class_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    # Fetch the class by its ID
    class_to_delete = Classes.query.get(class_id)

    if not class_to_delete:
        return jsonify({"error": "Class not found"}), 404

    try:
        # Delete the class from the database
        db.session.delete(class_to_delete)
        db.session.commit()
        return jsonify({"message": f"Class with ID {class_id} deleted successfully"}), 200
    except Exception as e:
        # Handle any database errors
        db.session.rollback()
        return jsonify({"error": f"Failed to delete class: {str(e)}"}), 500


@login_required
@classes_bp.route('/get-classes', methods=['GET'])
def get_classes():
    user_id = session.get('user_id')  
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    classes = Classes.query.all()

    if not classes:
        return jsonify({"message": "No classes found"}), 404

    classes_data = [cls.to_dict() for cls in classes]
    return jsonify(classes_data), 200


@login_required
@classes_bp.route('/get-class/<int:class_id>', methods=['GET'])
def get_class_by_id(class_id):
    user_id = session.get('user_id')  
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    class_data = Classes.query.get(class_id)
    if not class_data:
        return jsonify({"error": "Class not found"}), 404

    return jsonify(class_data.to_dict()), 200
