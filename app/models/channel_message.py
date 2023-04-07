from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class ChannelMessage(db.Model):
    __tablename__ = 'channel_messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("servers.id")), nullable=False)
    channel_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("channels.id")), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    body = db.Column(db.String)
    image = db.Column(db.String)
    created_at = db.Column(db.TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = db.Column(db.TIMESTAMP(timezone=True), onupdate=func.now())

    server = db.relationship("Server", back_populates="channel_messages")
    channel = db.relationship("Channel", back_populates="channel_messages")
    user = db.relationship("User", back_populates="channel_messages")

    def to_dict(self):
        return {
            'id': self.id,
            'server_id': self.server_id,
            'channel_id': self.channel_id,
            'user': self.user.to_dict(),
            'body': self.body,
            'image': self.image,
        }