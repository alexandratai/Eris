from .db import db, environment, SCHEMA, add_prefix_for_prod

memberships = db.Table (
    "memberships",

    db.Column("server_id", db.Integer, db.ForeignKey(add_prefix_for_prod("servers.id"), ondelete="CASCADE"), primary_key=True),
    db.Column("member_id", db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"), ondelete="CASCADE"), primary_key=True),
)

if environment == "production":
    memberships.schema = SCHEMA