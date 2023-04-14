from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import Channel

class ChannelForm(FlaskForm):
    name = StringField('Channel Name', validators=[DataRequired()])