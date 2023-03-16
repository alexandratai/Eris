from app.models import db, ChannelMessage, environment, SCHEMA
from datetime import datetime 

def seed_channel_messages():
    message1 = ChannelMessage(server_id=1, channel_id=1, user_id=1, body="Welcome to the Harry Potter server! Feel free to begin by joining your house channel.", image="https://imgix.bustle.com/uploads/image/2018/8/23/11f6be12-0404-4d88-8902-dfb3595d9764-harrypotterhalloween.jpg?w=1200&h=630&fit=crop&crop=faces&fm=jpg", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    message2 = ChannelMessage(server_id=1, channel_id=2, user_id=2, body="Party party!", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    message3 = ChannelMessage(server_id=2, channel_id=1, user_id=2, body="Party party!", created_at=datetime.utcnow(), updated_at=datetime.utcnow())

    servers = [server1, server2, server3, server4, server5]
    for server in servers:
        db.session.add(server)

    db.session.commit()

def undo_servers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.servers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM servers")

    db.session.commit()
