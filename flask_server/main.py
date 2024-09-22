from flask import Flask
from model import db
from auth import auth_bp
from task import task_bp
from files import files_bp
from detect_gates import detect_gates_bp
from config import Config
from flask_cors import CORS
from flask_mailman import Mail
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

db.init_app(app)

mail = Mail()
mail.init_app(app)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True) 

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(task_bp, url_prefix='/task')
app.register_blueprint(files_bp, url_prefix='/files')
app.register_blueprint(detect_gates_bp, url_prefix='/detect-gates')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
