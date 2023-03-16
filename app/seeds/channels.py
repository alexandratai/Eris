from app.models import db, Channel, environment, SCHEMA

def seed_channels():
    channel1 = Channel(name="introductions", server_id=1)
    channel2 = Channel(name="gryffindor", server_id=1)
    channel3 = Channel(name="ravenclaw", server_id=1)
    channel4 = Channel(name="hufflepuff", server_id=1)
    channel5 = Channel(name="slytherin", server_id=1)
    channel6 = Channel(name="general", server_id=2)
    channel7 = Channel(name="london", server_id=2)
    channel8 = Channel(name="seoul", server_id=2)
    channel9 = Channel(name="general", server_id=3)
    channel10 = Channel(name="paris", server_id=3)
    channel11 = Channel(name="general-info", server_id=4)
    channel12 = Channel(name="los angeles", server_id=4)
    channel13 = Channel(name="introductions", server_id=5)
    channel14 = Channel(name="la-restaurants", server_id=5)

    channels = [channel1, channel2, channel3, channel4, channel5, channel6, channel7, channel8, channel9, channel10, channel11, channel12, channel13, channel14]
    for channel in channels:
        db.session.add(channel)

    db.session.commit()

def undo_channels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM channels")

    db.session.commit()
