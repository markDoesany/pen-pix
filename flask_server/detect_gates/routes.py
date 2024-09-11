from flask import request, jsonify, send_file
from utils.auth_helpers import login_required
from detect_gates import detect_gates_bp
from model import db, UploadedFile, CircuitAnalysis, PredictionResult
from sys_main_modules.contour_tracing.threshold_image import apply_threshold_to_image
from sys_main_modules.model_inference import infer_image
from sys_main_modules.filter_json import filter_detections
import os

@login_required
@detect_gates_bp.route('/set-filter-threshold', methods=['POST'])
def set_filter_threshold():
    threshold_value = request.json.get('thresholdValue')
    mode = request.json.get('mode')
    file_id = request.json.get('fileId')

    uploaded_file = UploadedFile.query.get(file_id)
    if not uploaded_file:
        return jsonify({"error": "File not found"}), 404

    task_id = uploaded_file.task_id  # Get taskId from the uploaded file

    # Update or create the CircuitAnalysis for the current file
    def update_or_create_analysis(file, threshold_value):
        circuit_analysis = CircuitAnalysis.query.filter_by(uploaded_file_id=file.id).first()
        if not circuit_analysis:
            circuit_analysis = CircuitAnalysis(
                threshold_value=threshold_value,
                predictions=[],
                boolean_expressions=[],
                netlist={},
                verilog_url_file='',
                uploaded_file_id=file.id
            )
            db.session.add(circuit_analysis)
        else:
            circuit_analysis.threshold_value = threshold_value
        return circuit_analysis

    try:
        if mode == 'single':
            # Process a single file
            source_file = os.path.join('static', uploaded_file.filepath)
            img_io = apply_threshold_to_image(source_file, threshold_value=threshold_value)
            if img_io is None:
                return jsonify({"error": "Failed to process image"}), 500
            
            # Update the CircuitAnalysis for the single file
            update_or_create_analysis(uploaded_file, threshold_value)
            db.session.commit()

            return send_file(img_io, mimetype='image/png', as_attachment=False)

        elif mode == 'multiple':
            # Process all files associated with the taskId
            uploaded_files = UploadedFile.query.filter_by(task_id=task_id).all()

            for file in uploaded_files:
                source_file = os.path.join('static', file.filepath)
                img_io = apply_threshold_to_image(source_file, threshold_value=threshold_value)
                
                if img_io is not None:
                    update_or_create_analysis(file, threshold_value)
                else:
                    return jsonify({"error": f"Failed to process image for file {file.filename}"}), 500

            db.session.commit()
            source_file = os.path.join('static', uploaded_file.filepath)
            img_io = apply_threshold_to_image(source_file, threshold_value=threshold_value)
            return send_file(img_io, mimetype='image/png', as_attachment=False)

        else:
            return jsonify({"error": "Invalid mode"}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@login_required
@detect_gates_bp.route('/get-circuit-data/<int:file_id>', methods=['GET'])
def get_circuit_analysis_by_file(file_id):
    uploaded_file = UploadedFile.query.get(file_id)
    if not uploaded_file:
        return jsonify({"error": "File not found"}), 404

    circuit_analysis = CircuitAnalysis.query.filter_by(uploaded_file_id=file_id).first()

    if not circuit_analysis:
        return jsonify({"message": "No circuit analysis found for this file"}), 404

    return jsonify({"circuit_analysis": circuit_analysis.to_dict()})


@login_required
@detect_gates_bp.route('/process-detection/<int:file_id>', methods=['POST'])
def detect_logic_gates(file_id):
    mode = request.json.get('mode')
    uploaded_file = UploadedFile.query.get(file_id)
    circuit_analysis = CircuitAnalysis.query.filter_by(uploaded_file_id=file_id).first()
    if not uploaded_file:
        return jsonify({"error": "File not found"}), 404

    try:
        if mode == "single":
            source_file = os.path.join('static', uploaded_file.filepath)
            img_io = apply_threshold_to_image(source_file, threshold_value=circuit_analysis.threshold_value)
            data = infer_image(image_bytes=img_io)

            filtered_data = filter_detections(data)
            PredictionResult.query.filter_by(circuit_analysis_id=circuit_analysis.id).delete()

            for obj in filtered_data:
                new_prediction = PredictionResult(
                    x=obj['x'],
                    y=obj['y'],
                    width=obj['width'],
                    height=obj['height'],
                    confidence=obj['confidence'],
                    class_name=obj['class'],
                    class_id=obj['class_id'],
                    detection_id=obj['detection_id'],
                    color=(obj['color']),  # Empty for now
                    object_id="",  # Empty for now
                    label=obj['label'],  # Empty for now
                    circuit_analysis_id=circuit_analysis.id
                )
                db.session.add(new_prediction)

            db.session.commit()

            predictions = PredictionResult.query.filter_by(circuit_analysis_id=circuit_analysis.id).all()
            prediction_dicts = [prediction.to_dict() for prediction in predictions]

            circuit_analysis.predictions = prediction_dicts
            db.session.commit()
            
        elif mode == "multiple":
            task_id = uploaded_file.task_id
            if not task_id:
                return jsonify({"error": "Task ID not found"}), 404

            uploaded_files = UploadedFile.query.filter_by(task_id=task_id).all()
            print("GOOOODfsdf")
            for file in uploaded_files:
                circuit_analysis = CircuitAnalysis.query.filter_by(uploaded_file_id=file.id).first()
                if circuit_analysis:
                    source_file = os.path.join('static', file.filepath)
                    img_io = apply_threshold_to_image(source_file, threshold_value=circuit_analysis.threshold_value)
                    data = infer_image(image_bytes=img_io)

                    filtered_data = filter_detections(data)
                    PredictionResult.query.filter_by(circuit_analysis_id=circuit_analysis.id).delete()

                    for obj in filtered_data:
                        new_prediction = PredictionResult(
                            x=obj['x'],
                            y=obj['y'],
                            width=obj['width'],
                            height=obj['height'],
                            confidence=obj['confidence'],
                            class_name=obj['class'],
                            class_id=obj['class_id'],
                            detection_id=obj['detection_id'],
                            color=(obj['color']),  # Use the color from filtered data
                            object_id="",  # Empty for now
                            label=obj['label'],  # Use the label from filtered data
                            circuit_analysis_id=circuit_analysis.id
                        )
                        db.session.add(new_prediction)

                    db.session.commit()

                    predictions = PredictionResult.query.filter_by(circuit_analysis_id=circuit_analysis.id).all()
                    prediction_dicts = [prediction.to_dict() for prediction in predictions]

                    circuit_analysis.predictions = prediction_dicts
                    db.session.commit()

        return jsonify({'predictions': circuit_analysis.predictions})

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
