from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class ChannelMessage(db.Model):
    __tablename__ = 'channel_messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, nullable=False, db.ForeignKey(add_prefix_for_prod("channels.id")))
    user_id = db.Column(db.Integer, nullable=False, db.ForeignKey(add_prefix_for_prod("users.id")))
    body = db.Column(db.String)
    image_url = db.Column(db.String)
    created_at = db.Column(db.Timestamp(timezone=True), server_default=func.now())
    updated_at = db.Column(db.Timestamp(timezone=True), onupdate=func.now())

    channel = db.relationship("Channel", back_populates="channel_messages")
    user = db.relationship("User", back_populates="channel_messages")

    def to_dict(self):
        return {
            'id': self.id,
            'channel_id': self.channel_id,
            'user_id': self.user_id,
            'body': self.body,
            'image_url': self.image_url,
        }