from flask import request, jsonify, send_file
from utils.auth_helpers import login_required
from detect_gates import detect_gates_bp
from models import UploadedFile, CircuitAnalysis, db
from sys_main_modules.contour_tracing.threshold_image import apply_threshold_to_image
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

    circuit_analysis = CircuitAnalysis.query.filter_by(uploaded_file_id=file_id).first()

    if not circuit_analysis:
        circuit_analysis = CircuitAnalysis(
            threshold_value=threshold_value,
            predictions={},
            boolean_expressions=[],
            netlist={},
            verilog_url_file='',
            uploaded_file_id=file_id
        )
        db.session.add(circuit_analysis)
    else:
        circuit_analysis.threshold_value = threshold_value
    source_file = os.path.join('static', uploaded_file.filepath)

    try:
        if mode == 'single':
            img_io = apply_threshold_to_image(source_file, threshold_value=threshold_value)
            if img_io is None:
                return jsonify({"error": "Failed to process image"}), 500
            
            db.session.commit()

            return send_file(img_io, mimetype='image/png', as_attachment=False)

        elif mode == 'multiple':
            return jsonify({"error": "Multiple images mode not implemented"}), 400

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