from flask import Flask
from models import db
from auth import auth_bp
from task import task_bp
from files import files_bp
from config import Config
from flask_cors import CORS
from flask_mailman import Mail

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

mail = Mail()
mail.init_app(app)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)  # Allow all origins

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(task_bp, url_prefix='/task')
app.register_blueprint(files_bp, url_prefix='/files')


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
