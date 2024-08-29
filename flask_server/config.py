# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'something')
    
    # Existing configuration for user authentication
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI', 'sqlite:///users.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Email configuration for user authentication
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False

    # MySQL configuration for task management
    MYSQL_DB_USER = os.environ.get('MYSQL_DB_USER', 'root')
    MYSQL_DB_PASSWORD = os.environ.get('MYSQL_DB_PASSWORD', '12345678')
    MYSQL_DB_HOST = os.environ.get('MYSQL_DB_HOST', 'localhost')
    MYSQL_DB_NAME = os.environ.get('MYSQL_DB_NAME', 'task_manager')

    @property
    def MYSQL_DATABASE_URI(self):
        return f"mysql+pymysql://{self.MYSQL_DB_USER}:{self.MYSQL_DB_PASSWORD}@{self.MYSQL_DB_HOST}/{self.MYSQL_DB_NAME}"
