from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
import datetime
import jwt
import os

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(150), nullable=False)
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)
    SECRET_KEY = os.environ.get("SECRET_KEY")
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def generate_reset_token(self):
        """Generate and return a reset token as a JWT."""
        payload = {
            'reset_token': secrets.token_urlsafe(),  # Unique token part
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }
        
        token = jwt.encode(payload, self.SECRET_KEY, algorithm='HS256')
        self.reset_token = token
        self.reset_token_expiry = payload['exp']
        db.session.commit()
        
        return token

    def verify_reset_token(self, token):
        """Verify the reset token and its expiry."""
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=['HS256'])
            if 'reset_token' in payload:
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
        }