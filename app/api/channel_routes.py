from flask import Blueprint, jsonify, redirect, render_template, request
from app.models import Channel, ChannelMessage, db
from ..forms.channel_form import ChannelForm
from ..forms.channel_message_form import ChannelMessageForm
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

@channel_routes.route('/<int:channel_id>/messages')
def messages_by_channel(channel_id):
    """
    Query for all messages by channel and returns them in a list of message dictionaries.
    """
    messages = ChannelMessage.query.filter(ChannelMessage.channel_id == channel_id).all()
    return {'messages': [message.to_dict() for message in messages]}