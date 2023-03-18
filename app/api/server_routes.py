from flask import Blueprint, jsonify, redirect, render_template, request
from app.models import Server, Channel, db
from ..forms.server_form import ServerForm
from ..forms.channel_form import ChannelForm
from flask_login import current_user
from flask_login import login_required

server_routes = Blueprint('servers', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field}: {error}')
    return errorMessages

@server_routes.route('/')
def servers():
    """
    Query for all servers and returns them in a list of server dictionaries.
    """
    servers = Server.query.all()
    return {'servers': [server.to_dict() for server in servers]}

@server_routes.route('/current')
@login_required
def user_servers():
    """
    Query for all servers that a user is of a part of 
    and return them in a list of server dictionaries
    """
    servers = Server.query.join(Server.users).filter(memberships.member_id == current_user.id).all()
    return {'servers': [server.to_dict() for server in servers]}

# @server_routes.route('/<int:server_id>')
# def server(server_id):
#     """
#     Query for one server.
#     """
#     server = Server.query.get(server_id)
#     return server.to_dict()

@server_routes.route('/<int:server_id>/channels')
@login_required
def server_channels(server_id):
    """
    Query for all channels by server id and returns them in a list of channel dictionaries.
    """
    channels = Channel.query.filter(Channel.server_id == server_id).all()
    return {'channels': [channel.to_dict() for channel in channels]}