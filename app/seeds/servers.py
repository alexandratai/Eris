from app.models import db, User, Server, environment, SCHEMA

def seed_servers():
    server1 = Server(name="Harry Potter", owner_id=1, image="https://cdn.britannica.com/82/152982-050-11159CF4/Daniel-Radcliffe-Rupert-Grint-Emma-Watson-Harry.jpg")
    server2 = Server(name="Cafes", owner_id=2, image="https://www.iwanderlista.com/wp-content/uploads/2018/10/Stylenanda-Pink-Pool-Cafe-Seoul-1-1024x731.jpg")
    server3 = Server(name="Museums", owner_id=3, image="https://media.timeout.com/images/105963997/image.jpg")
    server4 = Server(name="Bookstores", owner_id=1, image="https://blogs.transparent.com/german/wp-content/uploads/sites/5/2021/10/sara-kurfess-5H08Y81JF_M-unsplash.jpg")
    server5 = Server(name="Restaurants", owner_id=3, image="https://resizer.otstatic.com/v2/photos/wide-huge/2/48638749.jpg")

    user1 = User(
        id=1,
        username="Demo",
        profile_photo="https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/02/hermione-making-the-polyjuice-potion.jpg"
    )

    user2 = User(
        id=2,
        username="marnie",
        profile_photo="https://cdn.britannica.com/81/152981-050-7891A7CF/Daniel-Radcliffe-Harry-Potter-and-the-Philosophers.jpg"
    )

    user3 = User(
        id=3,
        username="jane",
        profile_photo="http://images4.fanpop.com/image/photos/16600000/Ronald-Weasley-ronald-weasley-16679447-499-298.jpg"
    )

    server1.users.append(user1)
    server1.users.append(user2)
    server2.users.append(user2)
    server3.users.append(user3)
    server4.users.append(user1)
    server5.users.append(user3)
    server5.users.append(user2)

    servers = [server1, server2, server3, server4, server5]
    for server in servers:
        db.session.add(server)

    users = [user1, user2, user3]
    for user in users:
        db.session.add(user)

    db.session.commit()

def undo_servers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.servers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM servers")

    db.session.commit()
