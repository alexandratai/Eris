from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User
import re

def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')

def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')

class SignUpForm(FlaskForm):
    username = StringField(
        'Username', validators=[DataRequired(), username_exists])
    email = StringField('Email', validators=[DataRequired(), Email(), user_exists])

    def validate_email(self, field):
        # Email validation function using regular expression
        if not field.data or not re.match(r"[^@]+@[^@]+\.[^@]+", field.data):
            raise ValidationError('Please enter a valid email address.')
        
    password = StringField('Password', validators=[DataRequired()])
    profile_photo = StringField('Profile Photo')
    # class Meta:
    #     csrf=False