from pydantic import Field, BaseModel
from datetime import datetime
from typing import List


class OrderItemCreateSchema(BaseModel):
    product_id : int = Field(..., description="Product ID")
    quantity: int = Field(..., ge=1, description="Quantity")


class OrderItemResponseSchema(BaseModel):
    id : int
    product_id : int
    quantity : int
    order_id : int
    price : float

    class Config:
        from_attributes=True

class OrderCreateSchema(BaseModel):
    shipping_address : str = Field(..., min_length=5, description="Shipping address")


class OrderResponseSchema(BaseModel):
    id : int
    shipping_address : str
    user_id : int
    total_price : float
    created_at : datetime
    status: str
    items : List[OrderItemResponseSchema]

    class Config:
        from_attributes=True