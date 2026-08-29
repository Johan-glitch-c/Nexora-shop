from sqlalchemy import Column, Integer, ForeignKey, DateTime
from datetime import datetime
from ..database import Base
from sqlalchemy.orm import relationship

class Cart(Base):

    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")
    user=relationship("User", back_populates="cart")