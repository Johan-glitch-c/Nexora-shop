from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from ..database import Base
from sqlalchemy.orm import relationship
from datetime import datetime


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    slug = Column(String, index=True)
    description = Column(Text)
    category_id= Column(Integer, ForeignKey("categories.id"), nullable=False)
    price= Column(Float)
    created_at = Column(DateTime, default=datetime.now)
    image_url= Column(String)
    category = relationship("Category", back_populates="products")
    cart_item=relationship("CartItem", back_populates="product")

    def __repr__(self):
        return f"<Product (id: {self.id}, name: '{self.name}')>"