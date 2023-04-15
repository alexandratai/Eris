from flask import Blueprint, jsonify, redirect, render_template, request
from app.models import ChannelMessage, db
from ..forms.channel_message_form import ChannelMessageForm
from flask_login import current_user
from flask_login import login_required

channel_message_routes = Blueprint('channel_messages', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field}: {error}')
    return errorMessages

# @channel_message_routes.route('/')
# def channel_messages():
#     """
#     Query for all channel messages and returns them in a list of channel message dictionaries.
#     """
#     channel_messages = ChannelMessage.query.all()
#     return {'channel_messages': [channel_message.to_dict() for channel_message in channel_messages]}

@channel_message_routes.route('/<int:channel_message_id>')
@login_required
def channel_message(channel_message_id):
    """
    Query for one channel message.
    """
    channel_message = ChannelMessage.query.get(channel_message_id)
    return channel_message.to_dict()