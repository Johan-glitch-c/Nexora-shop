from fastapi import APIRouter, status, Depends
from ..models.user import User
from ..services.user import UserService
from ..schemas.user import UserLoginSchema, UserResponseSchema, UserCreateSchema, TokenResponseSchema
from ..database import get_db
from sqlalchemy.orm import Session
from typing import List
from ..security.auth import get_current_user, require_admin


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

@router.post("/login",response_model=TokenResponseSchema, status_code=status.HTTP_200_OK)
def login_user(user_data: UserLoginSchema, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.login_user(user_data)

@router.get("/me",response_model=UserResponseSchema, status_code=status.HTTP_200_OK)
def get_current(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/username/{username}", response_model=UserResponseSchema, status_code=status.HTTP_200_OK)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user_by_username(username)

@router.get("/{user_id}", response_model=UserResponseSchema, status_code=status.HTTP_200_OK)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user_by_id(user_id)


@router.get("/admin-test")
def admin_test(
    current_user: User = Depends(require_admin),
):
    return {
        "message": "Welcome admin",
        "username": current_user.username,
        "role": current_user.role,
    }
