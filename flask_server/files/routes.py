from werkzeug.utils import secure_filename
import os
from files import files_bp
from utils.auth_helpers import login_required
from models import db, UploadedFile, Task, CircuitAnalysis
from flask import jsonify, request, send_from_directory

@files_bp.route('/<int:task_id>/<filename>')
def serve_file(task_id, filename):
    TASK_FOLDER = os.path.join('static', 'images', str(task_id))
    return send_from_directory(TASK_FOLDER, filename)

@login_required
@files_bp.route('/upload-files', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return jsonify({"message": "No files part"}), 400

    files = request.files.getlist('files')
    task_id = request.form.get('task_id')
    
    if not task_id:
        return jsonify({"message": "Task ID is missing"}), 400

    task = Task.query.get(task_id)
    if not task:
        return jsonify({"message": "Task not found"}), 404

    uploaded_files = []
    skipped_files = []
    TASK_FOLDER = os.path.join('static', 'images', str(task_id))

    if not os.path.exists(TASK_FOLDER):
        os.makedirs(TASK_FOLDER)

    for file in files:
        if file.filename == '':
            return jsonify({"message": "Empty filename"}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(TASK_FOLDER, filename)

        if os.path.exists(filepath):
            skipped_files.append(filename)
            continue

        try:
            file.save(filepath)
        except Exception as e:
            return jsonify({"message": f"File save error: {str(e)}"}), 500

        new_file = UploadedFile(
            filename=filename,
            filepath=os.path.join('images', str(task_id), filename),
            mimetype=file.mimetype,
            task_id=task_id
        )
        
        db.session.add(new_file)
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Database commit error (during file save): {str(e)}"}), 500
        
        # Create CircuitAnalysis after getting the file ID
        new_circuit_analysis = CircuitAnalysis(
            threshold_value=0,
            predictions={},
            boolean_expressions=[],
            netlist={},
            verilog_url_file='',
            uploaded_file_id=new_file.id
        )
        
        db.session.add(new_circuit_analysis)
        uploaded_files.append(new_file.to_dict())

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Database commit error (during circuit analysis save): {str(e)}"}), 500

    return jsonify({"message": "Files uploaded", "files": uploaded_files, "skipped_files": skipped_files})


@login_required
@files_bp.route('/get-files/<int:task_id>', methods=['GET'])
def get_files(task_id):
    task = Task.query.get(task_id)

    if not task:
        return jsonify({"message": "Task not found"}), 404

    files = UploadedFile.query.filter_by(task_id=task_id).all()
    files_data = [file.to_dict() for file in files]

    return jsonify({"files": files_data})

@login_required
@files_bp.route('/delete-file/<int:file_id>', methods=['DELETE'])
def delete_file(file_id):
    file = UploadedFile.query.get(file_id)

    if not file:
        return jsonify({"message": "File not found"}), 404

    try:
        os.remove(os.path.join('static', file.filepath))  # Remove file from filesystem
        db.session.delete(file)   # Remove file record from database
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error deleting file: {str(e)}"}), 500

    return jsonify({"message": "File deleted successfully"})
