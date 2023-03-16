from .db import db, environment, SCHEMA, add_prefix_for_prod
from membership import memberships

class Server(db.Model):
    __tablename__ = 'servers'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(45), nullable=False)
    owner_id = db.Column(db.Integer, nullable=False, db.ForeignKey(add_prefix_for_prod("users.id")))
    image = db.Column(db.String)

    channels = db.relationship("Channel", back_populates="server", cascade="all, delete")
    users = db.relationship("User", secondary=memberships, back_populates="server", cascade="all, delete-orphan")
    channel_messages = db.relationship("ChannelMessage", back_populates="server", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'owner_id': self.owner_id,
            'image': self.image,
        }