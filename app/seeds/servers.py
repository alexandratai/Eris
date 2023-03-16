from app.models import db, Server, environment, SCHEMA

def seed_servers():
    server1 = Server(name="Harry Potter", owner_id=1, image="https://cdn.britannica.com/82/152982-050-11159CF4/Daniel-Radcliffe-Rupert-Grint-Emma-Watson-Harry.jpg")
    server2 = Server(name="Cafes", owner_id=2, image="https://www.iwanderlista.com/wp-content/uploads/2018/10/Stylenanda-Pink-Pool-Cafe-Seoul-1-1024x731.jpg")
    server3 = Server(name="Museums", owner_id=3, image="https://media.timeout.com/images/105963997/image.jpg")
    server4 = Server(name="Bookstores", owner_id=1, image="https://blogs.transparent.com/german/wp-content/uploads/sites/5/2021/10/sara-kurfess-5H08Y81JF_M-unsplash.jpg")
    server5 = Server(name="Restaurants", owner_id=3, image="https://resizer.otstatic.com/v2/photos/wide-huge/2/48638749.jpg")

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
