from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

class UserCreateSchema(BaseModel):
    username: str = Field(..., description="User's username")
    email: EmailStr = Field(..., description="User's email")
    password: str = Field(...,min_length=8, description="")

class UserLoginSchema(BaseModel):
    username: str = Field(..., description="User's username")
    password: str = Field(...,min_length=8, description="")

class UserResponseSchema(BaseModel):
    id: int = Field(..., description="User's id")
    username: str = Field(..., description="User's username")
    email: EmailStr = Field(..., description="User's email")
    created_at: datetime = Field(..., description="User's created at")
    class Config:
        from_attributes = True

class TokenResponseSchema(BaseModel):
    access_token: str = Field(..., description="User's access token")
    token_type: str = Field(..., description="User's token type")