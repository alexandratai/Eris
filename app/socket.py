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
socketio = SocketIO(cors_allowed_origins=origins)

# handle chat messages
# @socketio.on("chat")
# def handle_chat(data):
#     emit("chat", data, room=data['room'])

@socketio.on("chat")
def handle_chat(data):
    emit("chat", data, broadcast=True)

# @socketio.on("join_room")
# def on_join(data):
#     room = data['room']
#     join_room(room)
#     emit("join_room", data, broadcast=True)

# @socketio.on("leave_room")
# def on_leave(data):
#     leave_room(data["room"])