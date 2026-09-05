from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..security.auth import require_admin
from ..services.order import OrderService
from ..models.user import User
from typing import List
from ..schemas.order import OrderResponseSchema, OrderStatusUpdateSchema

router = APIRouter(
    prefix="/api/admin/orders",
    tags=["admin orders"],
)

@router.get("/",response_model=List[OrderResponseSchema],status_code=status.HTTP_200_OK)
def get_orders(current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    service=OrderService(db)
    return service.get_all_orders()

@router.get("/{order_id}", response_model=OrderResponseSchema, status_code=status.HTTP_200_OK)
def get_order_by_id_admin(order_id: int,current_user: User=Depends(require_admin), db: Session = Depends(get_db)):
    service=OrderService(db)
    return service.get_order_by_id_admin(order_id)

@router.put("/{order_id}", response_model=OrderResponseSchema, status_code=status.HTTP_200_OK)
def change_status(order_id: int, status_data: OrderStatusUpdateSchema, current_user: User=Depends(require_admin), db: Session = Depends(get_db)):
    service=OrderService(db)
    return service.change_status(order_id=order_id, new_status=status_data.status)