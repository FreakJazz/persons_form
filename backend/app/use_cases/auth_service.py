from datetime import timedelta
from typing import Dict, Any
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.auth import authenticate_user, create_access_token_for_user
from app.core.security import (
    create_password_reset_token,
    verify_password_reset_token,
    get_password_hash
)
from app.repositories.user_repository import UserRepository
from app.schemas.auth_request_response import (
    LoginRequest,
    LoginResponse as TokenResponse,
    UserCreateRequest,
    UserResponse,
    ResetPasswordRequest as PasswordResetRequest,
    ChangePasswordRequest as PasswordChangeRequest,
)
from app.core.exceptions import (
    AuthenticationError,
    EntityNotFoundError,
    ValidationError,
    DuplicateEntityError
)


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repository = UserRepository(db)

    def login(self, login_data: LoginRequest) -> TokenResponse:
        """
        Autenticar usuario y generar tokens
        """
        user = authenticate_user(self.db, login_data.email, login_data.password)
        if not user:
            raise AuthenticationError("Email o contraseña incorrectos")
        
        if not user.is_active:
            raise AuthenticationError("Usuario inactivo")
        
        # Actualizar último login
        self.user_repository.update_last_login(user.id)
        
        # Generar tokens
        token_data = create_access_token_for_user(user)
        
        return TokenResponse(
            access_token=token_data["access_token"],
            refresh_token=token_data["refresh_token"],
            token_type=token_data["token_type"],
            expires_in=token_data["expires_in"],
            user=UserResponse.from_orm(user)
        )

    def register(self, user_data: UserCreateRequest) -> TokenResponse:
        """
        Registrar nuevo usuario
        """
        # Validar que el email no exista
        if self.user_repository.exists_by_email(user_data.email):
            raise DuplicateEntityError(f"Usuario con email {user_data.email} ya existe")
        
        # Validar que el username no exista
        if self.user_repository.exists_by_username(user_data.username):
            raise DuplicateEntityError(f"Usuario con username {user_data.username} ya existe")
        
        # Validar contraseña
        if len(user_data.password) < 8:
            raise ValidationError("La contraseña debe tener al menos 8 caracteres")
        
        # Crear usuario
        user = self.user_repository.create(user_data)
        
        # Generar tokens
        token_data = create_access_token_for_user(user)
        
        return TokenResponse(
            access_token=token_data["access_token"],
            refresh_token=token_data["refresh_token"],
            token_type=token_data["token_type"],
            expires_in=token_data["expires_in"],
            user=UserResponse.from_orm(user)
        )

    def refresh_token(self, refresh_token: str) -> TokenResponse:
        """
        Refrescar token de acceso
        """
        from app.core.security import verify_token
        
        # Verificar refresh token
        payload = verify_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise AuthenticationError("Token de refresh inválido")
        
        email = payload.get("sub")
        if not email:
            raise AuthenticationError("Token de refresh inválido")
        
        # Buscar usuario
        user = self.user_repository.get_by_email(email)
        if not user or not user.is_active:
            raise AuthenticationError("Usuario no encontrado o inactivo")
        
        # Generar nuevos tokens
        token_data = create_access_token_for_user(user)
        
        return TokenResponse(
            access_token=token_data["access_token"],
            refresh_token=token_data["refresh_token"],
            token_type=token_data["token_type"],
            expires_in=token_data["expires_in"],
            user=UserResponse.from_orm(user)
        )

    def request_password_reset(self, email: str) -> Dict[str, str]:
        """
        Solicitar reset de contraseña
        """
        user = self.user_repository.get_by_email(email)
        if not user:
            # Por seguridad, no revelamos si el email existe o no
            return {"message": "Si el email existe, recibirás instrucciones para resetear tu contraseña"}
        
        if not user.is_active:
            raise AuthenticationError("Usuario inactivo")
        
        # Generar token de reset
        reset_token = create_password_reset_token(email)
        
        # Aquí normalmente enviarías un email con el token
        # Por ahora solo retornamos el token para desarrollo
        return {
            "message": "Instrucciones enviadas al email",
            "reset_token": reset_token  # Solo para desarrollo
        }

    def reset_password(self, reset_data: PasswordResetRequest) -> Dict[str, str]:
        """
        Resetear contraseña con token
        """
        # Verificar token
        email = verify_password_reset_token(reset_data.token)
        if not email:
            raise AuthenticationError("Token de reset inválido o expirado")
        
        # Buscar usuario
        user = self.user_repository.get_by_email(email)
        if not user or not user.is_active:
            raise EntityNotFoundError("Usuario no encontrado o inactivo")
        
        # Validar nueva contraseña
        if len(reset_data.new_password) < 8:
            raise ValidationError("La contraseña debe tener al menos 8 caracteres")
        
        # Actualizar contraseña
        self.user_repository.update(user.id, {"password": reset_data.new_password})
        
        return {"message": "Contraseña actualizada exitosamente"}

    def change_password(self, user_id: int, password_data: PasswordChangeRequest) -> Dict[str, str]:
        """
        Cambiar contraseña del usuario autenticado
        """
        from app.core.security import verify_password
        
        # Buscar usuario
        user = self.user_repository.get_by_id(user_id)
        if not user:
            raise EntityNotFoundError("Usuario no encontrado")
        
        # Verificar contraseña actual
        if not verify_password(password_data.current_password, user.hashed_password):
            raise AuthenticationError("Contraseña actual incorrecta")
        
        # Validar nueva contraseña
        if len(password_data.new_password) < 8:
            raise ValidationError("La contraseña debe tener al menos 8 caracteres")
        
        # Actualizar contraseña
        self.user_repository.update(user.id, {"password": password_data.new_password})
        
        return {"message": "Contraseña cambiada exitosamente"}
