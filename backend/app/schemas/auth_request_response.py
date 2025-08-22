from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, validator

PASSWORD_MIN_LEN_MSG = 'La contraseña debe tener al menos 8 caracteres'
PASSWORD_REQ_UPPER_MSG = 'La contraseña debe contener al menos una letra mayúscula'
PASSWORD_REQ_LOWER_MSG = 'La contraseña debe contener al menos una letra minúscula'
PASSWORD_REQ_NUMBER_MSG = 'La contraseña debe contener al menos un número'
EMAIL_DESC = "Email del usuario"


class UserCreateRequest(BaseModel):
    email: EmailStr = Field(..., description=EMAIL_DESC)
    password: str = Field(..., min_length=8, max_length=100, description="Contraseña del usuario")
    first_name: str = Field(..., min_length=2, max_length=50, description="Nombre del usuario")
    last_name: str = Field(..., min_length=2, max_length=50, description="Apellido del usuario")

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError(PASSWORD_MIN_LEN_MSG)
        if not any(c.isupper() for c in v):
            raise ValueError(PASSWORD_REQ_UPPER_MSG)
        if not any(c.islower() for c in v):
            raise ValueError(PASSWORD_REQ_LOWER_MSG)
        if not any(c.isdigit() for c in v):
            raise ValueError(PASSWORD_REQ_NUMBER_MSG)
        return v


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description=EMAIL_DESC)
    password: str = Field(..., description="Contraseña del usuario")


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 3600
    user: dict
    success: bool = True
    message: str = "Login exitoso"


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="Token de actualización")


class RefreshTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 3600
    success: bool = True


class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description=EMAIL_DESC)


class ForgotPasswordResponse(BaseModel):
    success: bool = True
    message: str = "Se ha enviado un enlace de recuperación a su email"


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., description="Token de recuperación")
    new_password: str = Field(..., min_length=8, max_length=100, description="Nueva contraseña")

    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError(PASSWORD_MIN_LEN_MSG)
        if not any(c.isupper() for c in v):
            raise ValueError(PASSWORD_REQ_UPPER_MSG)
        if not any(c.islower() for c in v):
            raise ValueError(PASSWORD_REQ_LOWER_MSG)
        if not any(c.isdigit() for c in v):
            raise ValueError(PASSWORD_REQ_NUMBER_MSG)
        return v


class ResetPasswordResponse(BaseModel):
    success: bool = True
    message: str = "Contraseña actualizada exitosamente"


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., description="Contraseña actual")
    new_password: str = Field(..., min_length=8, max_length=100, description="Nueva contraseña")

    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError(PASSWORD_MIN_LEN_MSG)
        if not any(c.isupper() for c in v):
            raise ValueError(PASSWORD_REQ_UPPER_MSG)
        if not any(c.islower() for c in v):
            raise ValueError(PASSWORD_REQ_LOWER_MSG)
        if not any(c.isdigit() for c in v):
            raise ValueError(PASSWORD_REQ_NUMBER_MSG)
        return v


class ChangePasswordResponse(BaseModel):
    success: bool = True
    message: str = "Contraseña cambiada exitosamente"


class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Token data usado en la validación de credenciales
class TokenData(BaseModel):
    username: Optional[str] = None
