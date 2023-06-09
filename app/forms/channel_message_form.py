from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import ChannelMessage

class ChannelMessageForm(FlaskForm):
    body = StringField('Message')
    image = StringField('Attach an image')