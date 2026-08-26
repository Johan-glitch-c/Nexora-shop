from ..models import User
from sqlalchemy.orm import Session
from typing import List, Optional
from ..schemas.user import UserCreateSchema, UserLoginSchema

class UserRepository:

    def __init__(self, db: Session):
        self.db=db

    def get_users(self) -> List[User]:
        return self.db.query(User).all()

    def get_user_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email:str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_by_username(self, username:str) -> Optional[User]:
        return self.db.query(User).filter(User.username == username).first()

    def create(self,username: str,email: str,password_hash: str,) -> User:
        user = User(username=username,email=email,password_hash=password_hash,)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user