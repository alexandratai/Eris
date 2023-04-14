from app.models import db, ChannelMessage, environment, SCHEMA
from datetime import datetime 

def seed_channel_messages():
    message1 = ChannelMessage(server_id=1, channel_id=1, user_id=1, body="Welcome to the Harry Potter server! Feel free to begin by joining your house channel.", image="https://imgix.bustle.com/uploads/image/2018/8/23/11f6be12-0404-4d88-8902-dfb3595d9764-harrypotterhalloween.jpg?w=1200&h=630&fit=crop&crop=faces&fm=jpg", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    message2 = ChannelMessage(server_id=1, channel_id=2, user_id=2, body="Party party!", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    message3 = ChannelMessage(server_id=2, channel_id=6, user_id=2, body="Welcome to the Cafe server!", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    message4 = ChannelMessage(server_id=3, channel_id=9, user_id=3, body="Welcome to the Museums server!", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    message5 = ChannelMessage(server_id=4, channel_id=11, user_id=1, body="Welcome to the Bookstores server!", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    message6 = ChannelMessage(server_id=5, channel_id=13, user_id=3, body="Welcome to the Restaurants server!", created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    message7 = ChannelMessage(server_id=5, channel_id=13, user_id=2, body="So excited to be here! Thanks for making this.", created_at=datetime.utcnow(), updated_at=datetime.utcnow())

    messages = [message1, message2, message3, message4, message5, message6, message7]
    for message in messages:
        db.session.add(message)

    db.session.commit()

def undo_channel_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channel_messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM channel_messages")

    db.session.commit()
