from flask import Flask
from flask_mailman import Mail, EmailMessage

mail = Mail()

def create_app():
  app = Flask(__name__)
  app.config["MAIL_SERVER"] = "smtp.gmail.com"
  app.config["MAIL_PORT"] = 587
  app.config["MAIL_USERNAME"] = "20103214@usc.edu.ph"
  app.config["MAIL_PASSWORD"] = "gyqlwhioyccebnsb"
  app.config["MAIL_USE_TLS"] = True
  app.config["MAIL_USE_SSL"] = False
  
  
  mail.init_app(app)
  
  @app.route('/')
  def index():
    msg = EmailMessage(
      "test",
      "testtng lang",
      "20103214@usc.edu.ph",
      ["markcernal21@gmail.com"]
    )
    msg.send()
    return 'sent email'
  
  return app