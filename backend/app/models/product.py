from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from ..database import Base
from sqlalchemy.orm import relationship
from datetime import datetime


class Product(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    slug = Column(String, index=True)
    description = Column(Text)
    price= Column(Float)
    created_at = Column(DateTime, default=datetime.now)
    image_url= Column(String)

    category = relationship("Category", back_populates="products")

    def __repr__(self):
        return f"<Product (id: {self.id}, name: '{self.name}')>"