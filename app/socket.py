from flask_socketio import SocketIO, emit, join_room, leave_room
import os

# configure cors_allowed_origins
if os.environ.get('FLASK_ENV') == 'production':
    origins = [
        "https://eris-ryp5.onrender.com"
    ]
else:
    origins = "*"

# initialize your socket instance
socketio = SocketIO(cors_allowed_origins=origins, logger=True, engineio_logger=True)

@socketio.on("chat")
def handle_chat(data):
    channel_id = data['channel_id']
    room = f'channel:{channel_id}'
    emit("chat", data, room=room)

@socketio.on('subscribe')
def handle_subscribe(data):
    channel_id = data['channel_id']
    room = f'channel:{channel_id}'
    join_room(room)

@socketio.on('unsubscribe')
def handle_unsubscribe(data):
    channel_id = data['channel_id']
    room = f'channel:{channel_id}'
    leave_room(room)

# USE AN IS DELETED FLAG -> frontend, emit to chat,
# give it an object (should have the channelId to locate the proper room,
# have the id of deleted msg, and flag that says isDeleted)
# then add an if else statement in your if statements you have
# in MessagesGrid

# handle chat messages
# @socketio.on("chat")
# def handle_chat(data):
#     emit("chat", data, room=data['room'])

# @socketio.on("join_room")
# def on_join(data):
#     room = data['room']
#     join_room(room)
#     emit("join_room", data, broadcast=True)

# @socketio.on("leave_room")
# def on_leave(data):
#     leave_room(data["room"])