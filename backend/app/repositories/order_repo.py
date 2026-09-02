from typing import List, Optional
from ..models.order import Order
from ..models.order_item import OrderItem
from sqlalchemy.orm import Session, joinedload

class OrderRepository:

    def __init__(self, db: Session):
        self.db= db


    def get_all_orders(self) -> List[Order]:
        return self.db.query(Order).all()

    def get_by_id(self, order_id: int) -> Optional[Order]:
        return self.db.query(Order).options(joinedload(Order.items)).filter(Order.id == order_id).first()

    def get_by_user_id(self, user_id: int) ->List[Order]:
        return self.db.query(Order).filter(Order.user_id == user_id).all()

    def create(self,user_id: int, total_price:float , shipping_address:str, status:str) -> Order:
        new_order = Order(total_price=total_price, user_id=user_id, shipping_address=shipping_address, status="pending")
        self.db.add(new_order)
        self.db.commit()
        self.db.refresh(new_order)
        return new_order

    def add_item(self,order_id: int, product_id: int, quantity: int, price:float) -> OrderItem:
        item=OrderItem(order_id=order_id, product_id=product_id, quantity=quantity, price=price)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def get_items(self, order_id: int) -> List[OrderItem]:
        return self.db.query(OrderItem).filter(OrderItem.order_id == order_id).all()