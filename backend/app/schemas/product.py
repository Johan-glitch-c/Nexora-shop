from pydantic import BaseModel, Field
from typing import Optional,List
from .category import CategoryResponseSchema
from datetime import datetime

class ProductSchema(BaseModel):
    name: str = Field(..., min_length=5, max_length=100, description="Product name")
    description: Optional[str] = Field(None, description="Product description")
    price: float = Field(...,ge=0, description="Product price")
    category_id: int = Field(..., description="Product category id")
    image_url: Optional[str] = Field(None, description="Product image url")

class ProductCreateSchema(ProductSchema):
    pass

class ProductResponseSchema(BaseModel):
    id: int = Field(..., description="Product id")
    name: str
    description: Optional[str]
    price: float
    category_id: int
    created_at: datetime
    image_url: Optional[str]
    category : CategoryResponseSchema = Field(..., description="Product category")

    class Config:
        from_attributes = True

class ProductListResponseSchema(BaseModel):
    product: List[ProductResponseSchema]
    total: int = Field(..., description="Total product count")


class ProductUpdateSchema(BaseModel):
    name: str = Field(...,min_length=5,max_length=200,description="Product name")
    description: Optional[str]= Field(None,description="Product description")
    price: float = Field(...,gt=0,description="Product price (must be greater than 0)")
    category_id: int = Field(...,description="Product category id")
    image_url: Optional[str]= Field(None,description="Product image url")
