from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func

class Channel(db.Model):
    __tablename__ = 'channels'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(45), nullable=False)
    server_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.Timestamp(timezone=True), server_default=func.now())
    updated_at = db.Column(db.Timestamp(timezone=True), onupdate=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'server_id': self.server_id,
        }