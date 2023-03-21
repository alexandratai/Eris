from flask import Blueprint, jsonify, redirect, render_template, request
from app.models import Server, Channel, User, memberships, db
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
    servers = Server.query.join(Server.users).filter(User.id == current_user.id).all()
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
    channels = Channel.query.join(Server).join(memberships).join(User).filter(Server.id == server_id).filter(User.id == current_user.id).all()
    return {'channels': [channel.to_dict() for channel in channels]}

@server_routes.route('/new', methods=['POST'])
@login_required
def add_servers():
    """
    This function creates a new server with a default General Info channel.
    """
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        server = Server(
            name = form.name.data,
            owner_id = current_user.id,
            image = form.image.data,
        )

        server.users.append(current_user)
        db.session.add(server)
        db.session.commit()

        channel = Channel(
            name = "general-info",
            server_id = server.id,
        )
        db.session.add(channel)
        db.session.commit()

        return server.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@server_routes.route('/<int:server_id>', methods=["PUT"])
@login_required
def edits_a_server(server_id):
    """
    Edits a server by ID.
    """
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        server = Server.query.get(server_id)

        if server is None:
            return {'errors': ['Server not found']}, 404

        if server.owner_id != current_user.id:
            return {'errors': ['You are not authorized to edit this server']}, 403

        server.name = form.name.data
        server.image = form.image.data

        db.session.commit()
        return server.to_dict()

    return {'errors': validation_errors_to_error_messages(form.errors)}, 400
