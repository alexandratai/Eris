from flask import Blueprint, jsonify, redirect, render_template, request
from app.models import Channel, ChannelMessage, db, Server
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
@login_required
def messages_by_channel(channel_id):
    """
    Query for all messages by channel and returns them in a list of message dictionaries.
    """
    messages = ChannelMessage.query.filter(ChannelMessage.channel_id == channel_id).all()
    return {'messages': [message.to_dict() for message in messages]}

@channel_routes.route('/<int:server_id>/channels', methods=['POST'])
@login_required
def add_channels(server_id):
    """
    This function creates a new channel.
    """
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    server = Server.query.get(server_id)

    if server.owner_id != current_user.id:
        return {'error': 'You do not own this server'}, 403

    if form.validate_on_submit(): 
        channel = Channel(
            name = form.name.data,
            server_id = server_id
        )

        db.session.add(channel)
        db.session.commit()

        return channel.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401