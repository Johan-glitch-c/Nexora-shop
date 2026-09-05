from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from ..models import User
from ..repositories.cart_repo import CartRepository
from ..repositories.order_repo import OrderRepository
from ..repositories.product_repo import ProductRepository
from ..schemas.order import OrderCreateSchema,OrderResponseSchema

class OrderService:

    def __init__(self,db: Session):
        self.order_repo=OrderRepository(db)
        self.product_repo=ProductRepository(db)
        self.cart_repo=CartRepository(db)

    def get_order_by_id(self, order_id: int, current_user:User) -> OrderResponseSchema:
        order=self.order_repo.get_by_id(order_id)
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        if order.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return OrderResponseSchema.model_validate(order)

    def get_user_orders(self, current_user: User) -> List[OrderResponseSchema]:
        orders=self.order_repo.get_by_user_id(current_user.id)
        return [OrderResponseSchema.model_validate(order) for order in orders]

    def create_order(self, current_user: User, order_data: OrderCreateSchema) -> OrderResponseSchema:
      cart=self.cart_repo.get_by_user_id(current_user.id)
      if not cart:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
      items=cart.items
      if not items:
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")
      total_price=0
      for item in items:
          total_price+=(item.product.price * item.quantity)
      order=self.order_repo.create(user_id=current_user.id, total_price=total_price, status="pending", shipping_address=order_data.shipping_address)
      for item in items:
          self.order_repo.add_item(order_id=order.id, product_id=item.product.id, quantity=item.quantity, price=item.product.price)

      self.cart_repo.clear_cart(cart.id)
      order=self.order_repo.get_by_id(order.id)
      return OrderResponseSchema.model_validate(order)

    def get_all_orders(self) -> List[OrderResponseSchema]:
        orders=self.order_repo.get_all_orders()
        return [OrderResponseSchema.model_validate(order) for order in orders]

    def get_order_by_id_admin(self, order_id: int) -> OrderResponseSchema:
        order=self.order_repo.get_by_id(order_id)
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return OrderResponseSchema.model_validate(order)

    def change_status(self, order_id: int, new_status: str) -> OrderResponseSchema:
        allowed_status=["pending","shipped","cancelled", "confirmed","delivered"]
        if new_status not in allowed_status:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please use allowed status")
        order=self.order_repo.order_status(order_id, new_status)
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return OrderResponseSchema.model_validate(order)