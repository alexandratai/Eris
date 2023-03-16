from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password', profile_photo='https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/02/hermione-making-the-polyjuice-potion.jpg')
    marnie = User(
        username='marnie', email='marnie@aa.io', password='password', profile_photo='https://cdn.britannica.com/81/152981-050-7891A7CF/Daniel-Radcliffe-Harry-Potter-and-the-Philosophers.jpg')
    jane = User(
        username='jane', email='jane@aa.io', password='password', profile_photo='http://images4.fanpop.com/image/photos/16600000/Ronald-Weasley-ronald-weasley-16679447-499-298.jpg')

    users = [demo, marnie, jane]
    for user in users:
        db.session.add(user)

    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()