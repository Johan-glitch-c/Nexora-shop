from fastapi import APIRouter, status, Depends
from ..services.user import UserService
from ..schemas.user import UserLoginSchema, UserResponseSchema, UserCreateSchema
from ..database import get_db
from sqlalchemy.orm import Session
from typing import List


router = APIRouter(
    prefix="/api/users",
    tags=["users"],
)

@router.get("/",response_model=List[UserResponseSchema], status_code=status.HTTP_200_OK)
def get_users(db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_all_users()

@router.post("/",response_model=UserResponseSchema, status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreateSchema, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.create_user(user_data)

@router.post("/login",response_model=UserResponseSchema, status_code=status.HTTP_200_OK)
def login_user(user_data: UserLoginSchema, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.login_user(user_data)

@router.get("username/{username}", response_model=UserResponseSchema, status_code=status.HTTP_200_OK)
def get_user_by_username(user_username: str, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user_by_username(user_username)

@router.get("/{user_id}", response_model=UserResponseSchema, status_code=status.HTTP_200_OK)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user_by_id(user_id)
