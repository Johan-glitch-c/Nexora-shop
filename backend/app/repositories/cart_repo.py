from ..models.cart_item import CartItem
from ..models.cart import Cart
from sqlalchemy.orm import Session
from ..schemas.cart import CartItemCreateSchema, CartItemUpdateSchema
from typing import Optional

class CartRepository:

    def __init__(self, db: Session):
        self.db = db


    def get_by_user_id(self, user_id: int) -> Optional[Cart]:
        return self.db.query(Cart).filter(Cart.user_id == user_id).first()

    def create(self, user_id: int) -> Cart:
        cart=Cart(user_id=user_id)

        self.db.add(cart)
        self.db.commit()
        self.db.refresh(cart)
        return cart


    def get_item(self,cart_id:int, item_id: int) -> Optional[CartItem]:
        return self.db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id==cart_id).first()

    def add_item(self,cart_id:int, item_data: CartItemCreateSchema) -> CartItem:
        item=CartItem(cart_id=cart_id, **item_data.model_dump())
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update_item(self,cart_id:int, item_id: int, item_data: CartItemUpdateSchema) -> Optional[CartItem]:
        existing_item=self.db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id==cart_id).first()
        if not existing_item:
            return None
        existing_item.quantity=item_data.quantity
        self.db.commit()
        self.db.refresh(existing_item)
        return existing_item

    def delete_item(self, item_id: int, cart_id: int) -> bool:
        item=self.db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id==cart_id).first()
        if not item:
            return False
        self.db.delete(item)
        self.db.commit()
        return True

    def clear_cart(self,cart_id: int) -> bool:
        self.db.query(CartItem).filter(CartItem.cart_id == cart_id).delete()
        self.db.commit()
        return True

    def increment_quantity(self, item: CartItem, quantity: int) -> CartItem:

        item.quantity+=+quantity
        self.db.commit()
        self.db.refresh(item)
        return item