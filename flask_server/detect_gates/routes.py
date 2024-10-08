from flask import request, jsonify, send_file
from utils.auth_helpers import login_required
from detect_gates import detect_gates_bp
from model import db, UploadedFile, CircuitAnalysis, PredictionResult

from sys_main_modules.contour_tracing.threshold_image import apply_threshold_to_image
from sys_main_modules.contour_tracing.binary_image import binarize_image
from sys_main_modules.contour_tracing.mask_image import mask_image
from sys_main_modules.contour_tracing.netlist import process_circuit_connection, get_class_count
from sys_main_modules.contour_tracing.boolean_function import convert_to_sympy_expression, evaluate_boolean_expression, generate_truth_table, string_to_sympy_expression
from sys_main_modules.contour_tracing.export_verilog import export_to_verilog
from sys_main_modules.model_inference import infer_image
from sys_main_modules.filter_json import filter_detections

import os
import io

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
                    object_id=obj['object_id'],  # Empty for now
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


@login_required
@detect_gates_bp.route('/analyze-circuit/<int:file_id>', methods=['POST'])
def analyze_circuit(file_id):
    try:
        uploaded_file = UploadedFile.query.get(file_id)
        circuit_analysis = CircuitAnalysis.query.filter_by(uploaded_file_id=file_id).first()
        
        if not uploaded_file:
            return jsonify({"error": "File not found"}), 404

        if not circuit_analysis:
            return jsonify({"error": "Circuit analysis not found"}), 404

        source_file = os.path.join('static', uploaded_file.filepath)

        try:
            img_io = apply_threshold_to_image(source_file, threshold_value=circuit_analysis.threshold_value)
        except Exception as e:
            return jsonify({"error": f"Error applying threshold: {str(e)}"}), 500

        try:
            binary_img_io = binarize_image(img_io)
        except Exception as e:
            return jsonify({"error": f"Error binarizing image: {str(e)}"}), 500

        try:
            mask_img_io = mask_image(binary_img_io, circuit_analysis.predictions)
        except Exception as e:
            return jsonify({"error": f"Error masking image: {str(e)}"}), 500

        try:
            boolean_functions, input_count = process_circuit_connection(mask_img_io, circuit_analysis.predictions)
        except Exception as e:
            return jsonify({"error": f"Error processing circuit connections: {str(e)}"}), 500

        try:
            expressions = []
            for key, value in boolean_functions.items():
                symp_expression = convert_to_sympy_expression(value, input_count)
                expressions.append({key: str(symp_expression)})
            circuit_analysis.boolean_expressions = expressions
            db.session.commit()
        except Exception as e:
            return jsonify({"error": f"Error converting to sympy expressions: {str(e)}"}), 500

        return jsonify({"boolean_expressions": expressions})

    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


from flask import jsonify, abort
from sympy import SympifyError

@login_required
@detect_gates_bp.route('/get-truth-table/<int:file_id>', methods=['GET'])
def get_truth_table(file_id):
    try:
        circuit_analysis = CircuitAnalysis.query.filter_by(uploaded_file_id=file_id).first()
        
        if not circuit_analysis:
            return jsonify({"error": "Circuit analysis not found for the given file ID"}), 404
        
        boolean_expressions = circuit_analysis.boolean_expressions
        input_count = get_class_count(circuit_analysis.predictions, 'input')
        
        truth_table_serializable = []
        
        for expression in boolean_expressions:
            for key, value in expression.items():
                try:
                    sympy_expression = string_to_sympy_expression(value)
                except SympifyError:
                    return jsonify({"error": f"Failed to parse boolean expression: {value}"}), 400
                
                try:
                    truth_table = generate_truth_table(sympy_expression, input_count)
                except Exception as e:
                    return jsonify({"error": f"Error generating truth table: {str(e)}"}), 500
                
                for row in truth_table:
                    truth_table_serializable.append([str(item) for item in row])
        
        circuit_analysis.truth_table = truth_table_serializable
        db.session.commit()
        return jsonify({"truth_table": truth_table_serializable})
    
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@login_required
@detect_gates_bp.route('/export-verilog/<int:file_id>', methods=['GET'])
def get_exported_verilog(file_id):
    circuit_analysis = CircuitAnalysis.query.filter_by(uploaded_file_id=file_id).first()
    
    expression_dict_list = circuit_analysis.boolean_expressions

    combined_expression_dict = {}
    for expression in expression_dict_list:
        combined_expression_dict.update(expression)  
        
    verilog_content = export_to_verilog(combined_expression_dict)
    verilog_file = io.StringIO(verilog_content)
    verilog_filename = f"circuit_{file_id}.v"

    return send_file(
        io.BytesIO(verilog_file.getvalue().encode('utf-8')),
        mimetype='text/plain',
        as_attachment=True,
        download_name=verilog_filename 
    )
