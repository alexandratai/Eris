from flask import Blueprint, jsonify, redirect, render_template, request
from app.models import Server, db
from ..forms.server_form import ServerForm
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

@server_routes.route('/<int:server_id>')
def server(server_id):
    """
    Query for one server.
    """
    server = Server.query.get(server_id)
    return server.to_dict()