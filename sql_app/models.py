import datetime
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, JSON
from sqlalchemy.dialects.mysql import DATETIME
from sqlalchemy.orm import relationship


from database import Base


# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True)
#     hashed_password = Column(String)
#     is_active = Column(Boolean, default=True)

#     items = relationship("Item", back_populates="owner")


# class Item(Base):
#     __tablename__ = "items"

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, index=True)
#     description = Column(String, index=True)
#     owner_id = Column(Integer, ForeignKey("users.id"))

#     owner = relationship("User", back_populates="items")


class Temperature(Base):
    __tablename__ = "temperature"

    id = Column(Integer, primary_key=True, index=True)
    value = Column(JSON, index=True)
    time = Column(DATETIME(fsp=0), default=datetime.datetime.utcnow)

class Valve(Base):
    __tablename__ = "valve"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    value = Column(JSON, index=True)
    time = Column(DATETIME(fsp=0), default=datetime.datetime.utcnow)

