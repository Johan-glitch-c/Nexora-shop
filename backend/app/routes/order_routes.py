from sqlalchemy.orm import Session
from ..services.order import OrderService
from fastapi import APIRouter, status, Depends
from ..database import get_db
from ..schemas.order import OrderResponseSchema, OrderCreateSchema
from ..models.user import User
from ..security.auth import get_current_user
from typing import List

router = APIRouter(
    prefix="/api/orders",
    tags=["orders"],
)


@router.post("/",response_model=OrderResponseSchema,status_code=status.HTTP_201_CREATED)
def create_order(order_data: OrderCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = OrderService(db)
    return service.create_order(current_user, order_data)

@router.get("/",response_model=List[OrderResponseSchema],status_code=status.HTTP_200_OK)
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = OrderService(db)
    return service.get_user_orders(current_user)

@router.get("{order_id}", response_model=OrderResponseSchema,status_code=status.HTTP_200_OK)
def get_order(order_id: int, current_user: User = Depends(get_current_user) ,db: Session = Depends(get_db)):
    service = OrderService(db)
    return service.get_order_by_id(order_id, current_user)