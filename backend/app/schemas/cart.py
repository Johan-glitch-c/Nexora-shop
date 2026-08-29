from typing import List

from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class CartItemCreateSchema(BaseModel):
    product_id: int = Field(..., description=" Cart Item id")
    quantity: int = Field(..., ge=1, description="Quantity of the cart item")

class CartItemUpdateSchema(BaseModel):
    quantity: int = Field(..., ge=1, description="Quantity of the cart item")


class CartItemResponseSchema(BaseModel):
    id: int = Field(..., description="ID of the cart ")
    product_id: int = Field(..., description=" Cart Item id")
    quantity: int = Field(..., ge=1, description="Quantity of the cart item")

    model_config=ConfigDict(
        from_attributes=True
    )

class CartResponseSchema(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    items: List[CartItemResponseSchema]

    model_config=ConfigDict(
        from_attributes=True)
