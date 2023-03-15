from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class Server(db.Model):
    __tablename__ = 'servers'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(45), nullable=False)
    owner_id = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'owner_id': self.owner_id,
            'image_url': self.image_url,
        }