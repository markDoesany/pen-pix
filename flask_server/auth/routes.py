# auth/routes.py
from functools import wraps
from flask import request, session, jsonify
from auth import auth_bp
from models import User, db  # Use absolute import here
from flask_mailman import EmailMessage
from config import Config

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized access. Please log in."}), 403
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        session['email'] = user.id
        return jsonify({"message": "User logged in successfully", "user": user.to_dict()})
    else:
        return jsonify({"error": "Unauthorized"}), 401

@auth_bp.route("/register", methods=["POST"])
def register():
    email = request.json.get("email")
    password = request.json.get("password")
    
    user = User.query.filter_by(email=email).first()
    
    if user:
        return jsonify({"error": "User already exists"}), 400
    else:
        new_user = User(email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        session['email'] = email
        return jsonify({"message": "User registered successfully"})

@auth_bp.route("/logout", methods=["PUT"])
def logout():
    session.pop("email", None)
    return jsonify({"message": "User logged out successfully"})

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    email = request.json.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    user = User.query.filter_by(email=email).first()
    if user:
        token = user.generate_reset_token()
        reset_link = f"http://localhost:5173/reset-password?token={token}"
        
        msg = EmailMessage(
            "Password Recovery",
            f"To reset your password, visit the following link: {reset_link}",
            Config.MAIL_USERNAME, 
            [email]
        )
        msg.send()
        return jsonify({"message": "A password recovery link has been sent to your email address."})
    else:
        return jsonify({"error": "No account found with that email address."}), 404


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    token = request.json.get("token")
    new_password = request.json.get("new_password")

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400

    user = User.query.filter_by(reset_token=token).first()

    if user and user.verify_reset_token(token):
        user.set_password(new_password)
        user.reset_token = None  # Clear the reset token
        user.reset_token_expiry = None  # Clear the token expiry
        db.session.commit()
        return jsonify({"message": "Password has been reset successfully."})
    
    return jsonify({"error": "Invalid or expired token."}), 400

@auth_bp.route("/verify-reset-token", methods=["POST"])
def verify_reset_token():
    token = request.json.get("token")

    if not token:
        return jsonify({"error": "Token is required"}), 400

    user = User.query.filter_by(reset_token=token).first()

    if user and user.verify_reset_token(token):
        return jsonify({"message": "Token is valid"})
    else:
        return jsonify({"error": "Invalid or expired token"}), 400

@auth_bp.route("/user/<string:user_id>", methods=["GET"])
# @login_required
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({"user":user.to_dict()})
    else:
        return jsonify({"error": "User not found"}), 404