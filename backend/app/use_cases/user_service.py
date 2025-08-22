from typing import Optional
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth_request_response import UserCreateRequest, UserResponse
from app.core.exceptions import (
    EntityNotFoundError,
    DuplicateEntityError,
    ValidationError
)


class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def get_user_by_id(self, user_id: int) -> UserResponse:
        """
        Obtener usuario por ID
        """
        user = self.user_repository.get_by_id(user_id)
        if not user:
            raise EntityNotFoundError(f"Usuario con ID {user_id} no encontrado")
        
        return UserResponse.from_orm(user)

    def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        """
        Obtener usuario por email
        """
        user = self.user_repository.get_by_email(email)
        if not user:
            return None
        
        return UserResponse.from_orm(user)

    def create_user(self, user_data: UserCreateRequest) -> UserResponse:
        """
        Crear nuevo usuario
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
        return UserResponse.from_orm(user)

    def update_user(self, user_id: int, user_data: dict) -> UserResponse:
        """
        Actualizar usuario
        """
        # Verificar que el usuario existe
        existing_user = self.user_repository.get_by_id(user_id)
        if not existing_user:
            raise EntityNotFoundError(f"Usuario con ID {user_id} no encontrado")
        
        # Si se está actualizando el email, verificar que no exista
        if "email" in user_data and user_data["email"] != existing_user.email:
            if self.user_repository.exists_by_email(user_data["email"]):
                raise DuplicateEntityError(f"Usuario con email {user_data['email']} ya existe")
        
        # Si se está actualizando el username, verificar que no exista
        if "username" in user_data and user_data["username"] != existing_user.username:
            if self.user_repository.exists_by_username(user_data["username"]):
                raise DuplicateEntityError(f"Usuario con username {user_data['username']} ya existe")
        
        # Actualizar usuario
        updated_user = self.user_repository.update(user_id, user_data)
        return UserResponse.from_orm(updated_user)

    def delete_user(self, user_id: int) -> bool:
        """
        Eliminar usuario
        """
        user = self.user_repository.get_by_id(user_id)
        if not user:
            raise EntityNotFoundError(f"Usuario con ID {user_id} no encontrado")
        
        return self.user_repository.delete(user_id)

    def activate_user(self, user_id: int) -> UserResponse:
        """
        Activar usuario
        """
        user = self.user_repository.activate_user(user_id)
        if not user:
            raise EntityNotFoundError(f"Usuario con ID {user_id} no encontrado")
        
        return UserResponse.from_orm(user)

    def deactivate_user(self, user_id: int) -> UserResponse:
        """
        Desactivar usuario
        """
        user = self.user_repository.deactivate_user(user_id)
        if not user:
            raise EntityNotFoundError(f"Usuario con ID {user_id} no encontrado")
        
        return UserResponse.from_orm(user)

    def get_all_users(self, skip: int = 0, limit: int = 100) -> list[UserResponse]:
        """
        Obtener todos los usuarios
        """
        users = self.user_repository.get_all(skip=skip, limit=limit)
        return [UserResponse.from_orm(user) for user in users]
