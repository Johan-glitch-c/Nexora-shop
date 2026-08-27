from pydantic import BaseModel, Field

class CartItemCreateSchema(BaseModel):
    product_id: int = Field(..., description=" Cart Item id")
    quantity: int = Field(..., ge=1, description="Quantity of the cart item")

class CartItemUpdateSchema(BaseModel):
    quantity: int = Field(..., ge=1, description="Quantity of the cart item")


class CartItemResponseSchema(BaseModel):
    id: int = Field(..., description="ID of the cart ")
    product_id: int = Field(..., discriminator=" Cart Item id")
    quantity: int = Field(..., ge=1, description="Quantity of the cart item")

    class Config:
        from_attributes=True

