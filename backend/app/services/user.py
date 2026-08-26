from fastapi import HTTPException, status
from ..repositories.user_repo import UserRepository
from ..schemas.user import UserCreateSchema, UserResponseSchema, UserLoginSchema
from typing import List
from sqlalchemy.orm import Session
from ..security.password import hash_password, verify_password


class UserService:
    def __init__(self, db: Session):
        self.service = UserRepository(db)

    def get_all_users(self) -> List[UserResponseSchema]:
        users = self.service.get_users()
        return [UserResponseSchema.model_validate(user) for user in users]

    def get_user_by_id(self, user_id: int) -> UserResponseSchema:
        user = self.service.get_user_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return UserResponseSchema.model_validate(user)

    def get_user_by_email(self, email: str) -> UserResponseSchema:
        user = self.service.get_by_email(email)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return UserResponseSchema.model_validate(user)

    def get_user_by_username(self, username: str) -> UserResponseSchema:
        user = self.service.get_by_username(username)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return UserResponseSchema.model_validate(user)

    def create_user(self, user_data: UserCreateSchema) -> UserResponseSchema:
        existing_user = self.service.get_by_email(user_data.email)
        if existing_user:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
        existing_user = self.service.get_by_username(user_data.username)
        if existing_user:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")
        password_hash = hash_password(user_data.password)
        new_user = self.service.create(username=user_data.username, email=user_data.email,password_hash=password_hash)
        return UserResponseSchema.model_validate(new_user)

    def login_user(self, user_data: UserLoginSchema) -> UserResponseSchema:
        user_exist= self.service.get_by_username(user_data.username)
        if not user_exist:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        password=verify_password(user_data.password, user_exist.password_hash)
        if not password:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
        return UserResponseSchema.model_validate(user_exist)
