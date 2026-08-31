from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from repositories.user_repo import UserRepository
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