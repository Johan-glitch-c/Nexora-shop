from sqlalchemy import Column, Integer, DateTime, String, ForeignKey, Float
from ..database import Base
from datetime import datetime
from sqlalchemy.orm import relationship

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    shipping_address = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    items = relationship("OrderItem", back_populates="order",cascade="all,delete")
    user = relationship("User", back_populates="orders")