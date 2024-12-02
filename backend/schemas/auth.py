from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None
    expires_at: datetime

class TokenData(BaseModel):
    username: Optional[str] = None

class RefreshToken(BaseModel):
    refresh_token: str

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetVerify(BaseModel):
    token: str
    new_password: str

class LoginRequest(BaseModel):
    username: str
    password: str
