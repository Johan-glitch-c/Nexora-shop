from sqlalchemy.orm import Session
from fastapi import APIRouter, status, Depends
from ..services.cart import CartService
from ..database import get_db
from ..models import User
from ..security.auth import get_current_user
from ..schemas.cart import CartItemCreateSchema,CartItemResponseSchema,CartItemUpdateSchema,CartResponseSchema

router = APIRouter(
    prefix="/api/cart",
    tags=["cart"],
)

@router.get("/",response_model=CartResponseSchema, status_code=status.HTTP_200_OK)
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service=CartService(db)
    return service.get_cart(current_user)

@router.post("/items",response_model=CartItemResponseSchema, status_code=status.HTTP_201_CREATED)
def add_item_to_cart( item_data: CartItemCreateSchema,current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service=CartService(db)
    return service.add_item(current_user, item_data)

@router.put("/items/{item_id}",response_model=CartItemResponseSchema, status_code=status.HTTP_200_OK)
def change_item_data(item_id:int,item_data: CartItemUpdateSchema,current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service=CartService(db)
    return service.update_item( item_data,current_user,item_id)

@router.delete("/items/{item_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service=CartService(db)
    service.delete_item(item_id, current_user)

@router.delete("/",status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(current_user: User = Depends(get_current_user),db: Session = Depends(get_db)):
    service=CartService(db)
    service.clear_cart(current_user)
