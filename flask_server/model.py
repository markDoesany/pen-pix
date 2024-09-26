# models.py
import uuid
from flask_sqlalchemy import SQLAlchemy
from flask import url_for
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
import datetime
import jwt
import os

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4().hex))
    email = db.Column(db.String(50), unique=True, nullable=False, index=True)
    recovery_email = db.Column(db.String(50), nullable=True, index=True)
    contact_number = db.Column(db.String(50), nullable=True)
    name = db.Column(db.String(50), nullable=True)
    password_hash = db.Column(db.String(150), nullable=False)
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)
    verification_token = db.Column(db.String(100), nullable=True)  # Token for email verification
    verification_token_expiry = db.Column(db.DateTime, nullable=True)  # Expiry for email verification
    email_verified = db.Column(db.Boolean, default=False)  # Whether the email has been verified
    tasks = db.relationship('Task', backref='user', lazy=True, cascade="all, delete-orphan")
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)
    SECRET_KEY = os.environ.get("SECRET_KEY")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def generate_reset_token(self):
        payload = {
            'reset_token': secrets.token_urlsafe(),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }
        
        token = jwt.encode(payload, self.SECRET_KEY, algorithm='HS256')
        self.reset_token = token
        self.reset_token_expiry = payload['exp']
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
        
        return token

    def verify_reset_token(self, token):
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=['HS256'])
            if 'reset_token' in payload:
                return True
        except jwt.ExpiredSignatureError:
            return False
        except jwt.InvalidTokenError:
            return False
        
        return False

    # Generate email verification token
    def generate_verification_token(self):
        payload = {
            'verification_token': secrets.token_urlsafe(),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # 24-hour expiry
        }
        
        token = jwt.encode(payload, self.SECRET_KEY, algorithm='HS256')
        self.verification_token = token
        self.verification_token_expiry = payload['exp']
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
        
        return token

    def verify_verification_token(self, token):
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=['HS256'])
            if 'verification_token' in payload:
                return True
        except jwt.ExpiredSignatureError:
            return False
        except jwt.InvalidTokenError:
            return False
        
        return False

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'email_verified': self.email_verified,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)  
    class_group = db.Column(db.String(100), nullable=False)  
    class_schedule = db.Column(db.String(100), nullable=False)  
    total_submissions = db.Column(db.Integer, default=0) 
    reviewed_submissions = db.Column(db.Integer, default=0) 
    due_date = db.Column(db.DateTime, nullable=False)  
    status = db.Column(db.String(50), default='Ongoing')  
    type = db.Column(db.String(50), nullable=False) 
    answer_keys = db.Column(db.JSON, nullable=True)  
    ask_boolean = db.Column(db.Boolean, nullable=False)  
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationship with UploadedFile
    attached_files = db.relationship('UploadedFile', backref='task', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'user_id': self.user_id,
            'class_group': self.class_group,
            'class_schedule': self.class_schedule,
            'total_submissions': self.total_submissions,
            'reviewed_submissions': self.reviewed_submissions,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'status': self.status,
            'type': self.type,
            'answer_keys': self.answer_keys,
            'ask_boolean': self.ask_boolean,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'files': [file.to_dict() for file in self.attached_files]  
        }

class UploadedFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.String(255), nullable=False)
    mimetype = db.Column(db.String(50), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    graded = db.Column(db.Boolean, default=False, nullable=False) 
    circuit_analysis = db.relationship('CircuitAnalysis', backref='uploaded_file', lazy=True, cascade="all, delete-orphan")
     
    @property
    def file_url(self):
        return url_for('files.serve_file', task_id=self.task_id, filename=self.filename, _external=True)

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'filepath': self.filepath,
            'mimetype': self.mimetype,
            'file_url': self.file_url,
            'graded': self.graded  # Include graded in the dict
        }
        
        
class CircuitAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    threshold_value = db.Column(db.Integer, nullable=False)
    predictions = db.Column(db.JSON, nullable=False)  # Revert to JSON array to hold predictions
    boolean_expressions = db.Column(db.JSON, nullable=False)
    netlist = db.Column(db.JSON, nullable=False)
    verilog_url_file = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)
    truth_table = db.Column(db.JSON, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)
    uploaded_file_id = db.Column(db.Integer, db.ForeignKey('uploaded_file.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'threshold_value': self.threshold_value,
            'predictions':self.predictions, 
            'boolean_expressions': self.boolean_expressions,
            'uploaded_file_id': self.uploaded_file_id,
            'netlist': self.netlist,
            'truth_table': self.truth_table,
            'verilog_url_file': self.verilog_url_file,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class PredictionResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Integer, nullable=False)
    y = db.Column(db.Integer, nullable=False)
    width = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    class_name = db.Column(db.String(50), nullable=False)
    class_id = db.Column(db.Integer, nullable=False)
    detection_id = db.Column(db.String(36), nullable=False)
    color = db.Column(db.JSON, nullable=False)
    object_id = db.Column(db.String(50), nullable=False)
    label = db.Column(db.String(50), nullable=False)
    circuit_analysis_id = db.Column(db.Integer, db.ForeignKey('circuit_analysis.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'x': self.x,
            'y': self.y,
            'width': self.width,
            'height': self.height,
            'confidence': self.confidence,
            'class_name': self.class_name,
            'class_id': self.class_id,
            'detection_id': self.detection_id,
            'color': self.color,
            'object_id': self.object_id,
            'label': self.label,
            'circuit_analysis_id': self.circuit_analysis_id
        }
