# import eventlet
# eventlet.monkey_patch()

from flask_socketio import SocketIO, emit, join_room, leave_room
import os
from .models import db, ChannelMessage
import json


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
    if "isEdited" in data:
        channel_message = ChannelMessage.query.get(data["id"])

        for key, value in data.items():
            setattr(channel_message, key, value)
        db.session.commit()
    else:
        channel_message = ChannelMessage(
            server_id = data["serverId"],
            channel_id = data["channelId"],
            user_id = data["userId"],
            body = data["body"],
            image = data["image"],
        )

    db.session.add(channel_message)
    db.session.commit()

    chatData = channel_message.to_dict();
    channel_id = data['channelId']
    room = f'channel:{channel_id}'
    emit("chat", json.dumps(chatData, indent=4, sort_keys=True, default=str), room=room)

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

@socketio.on("delete")
def on_delete(data):
    message = ChannelMessage.query.get(data["id"])
    db.session.delete(message)
    room = str(data["channelId"])
    emit("delete", data["id"], room=room)

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