from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import Server

class ServerForm(FlaskForm):
    name = StringField('Server Name', validators=[DataRequired()])
    image = StringField('Server Image')