from ..schemas.cart import CartItemUpdateSchema,CartItemCreateSchema,CartResponseSchema
from sqlalchemy.orm import Session
from ..repositories.product_repo import ProductRepository
from fastapi import HTTPException, status
from ..repositories.cart_repo import CartRepository
from ..models import User

class CartService:

    def __init__(self, db: Session):
        self.cart_repo = CartRepository(db=db)
        self.product_repo = ProductRepository(db=db)

    def get_cart(self, current_user: User) -> CartResponseSchema:
        cart=self.cart_repo.get_by_user_id(current_user.id)
        if not cart:
            cart=self.cart_repo.create(current_user.id)
        return CartResponseSchema.model_validate(cart)

    def add_item(self, current_user: User, item_data: CartItemCreateSchema):
        cart=self.cart_repo.get_by_user_id(current_user.id)
        if not cart:
            cart=self.cart_repo.create(current_user.id)
        product=self.product_repo.get_by_id(item_data.product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        existing_item=self.cart_repo.get_item(cart.id, product.id)
        if existing_item:
            return self.cart_repo.increment_quantity(existing_item, item_data.quantity)
        return self.cart_repo.add_item(cart.id, item_data)

    def update_item(self, item_data: CartItemUpdateSchema, current_user: User, item_id: int):
        cart=self.cart_repo.get_by_user_id(current_user.id)
        if not cart:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
        item=self.cart_repo.update_item(cart.id, item_id, item_data)
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

        return item

    def delete_item(self, item_id: int, current_user: User) -> bool:
        cart=self.cart_repo.get_by_user_id(current_user.id)
        if not cart:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
        deleted_item=self.cart_repo.delete_item(cart.id, item_id)
        if not deleted_item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
        return True

    def clear_cart(self, current_user: User):
        cart=self.cart_repo.get_by_user_id(current_user.id)
        if not cart:
            return True
        return self.cart_repo.clear_cart(cart.id)