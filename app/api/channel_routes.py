from flask import Blueprint, jsonify, redirect, render_template, request
from app.models import Channel, db
from ..forms.channel_form import ChannelForm
from flask_login import current_user
from flask_login import login_required

channel_routes = Blueprint('channels', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field}: {error}')
    return errorMessages

@channel_routes.route('/')
def channels():
    """
    Query for all channels and returns them in a list of channel dictionaries.
    """
    channels = Channel.query.all()
    return {'channels': [channel.to_dict() for channel in channels]}

@channel_routes.route('/<int:channel_id>')
def channel(channel_id):
    """
    Query for one channel.
    """
    channel = Channel.query.get(channel_id)
    return channel.to_dict()