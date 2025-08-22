from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth_request_response import UserCreateRequest
from app.core.security import get_password_hash


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        """
        Obtener usuario por ID
        """
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        """
        Obtener usuario por email
        """
        return self.db.query(User).filter(User.email == email).first()

    # Username is not part of the current User model; using email as unique identifier.

    def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Obtener todos los usuarios con paginación
        """
        return self.db.query(User).offset(skip).limit(limit).all()

    def create(self, user_data: UserCreateRequest) -> User:
        """
        Crear nuevo usuario
        """
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=True,
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update(self, user_id: int, user_data: dict) -> Optional[User]:
        """
        Actualizar usuario
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return None
        
        for field, value in user_data.items():
            if hasattr(db_user, field) and value is not None:
                if field == "password":
                    # Encriptar nueva contraseña
                    setattr(db_user, "hashed_password", get_password_hash(value))
                else:
                    setattr(db_user, field, value)
        
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def delete(self, user_id: int) -> bool:
        """
        Eliminar usuario (soft delete)
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return False
        
        db_user.is_active = False
        self.db.commit()
        return True

    def activate_user(self, user_id: int) -> Optional[User]:
        """
        Activar usuario
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return None
        
        db_user.is_active = True
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def deactivate_user(self, user_id: int) -> Optional[User]:
        """
        Desactivar usuario
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return None
        
        db_user.is_active = False
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update_last_login(self, user_id: int) -> Optional[User]:
        """
        Actualizar último login
        """
        from datetime import datetime
        
        db_user = self.get_by_id(user_id)
        if not db_user:
            return None
        
        db_user.last_login = datetime.utcnow()
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def exists_by_email(self, email: str) -> bool:
        """
        Verificar si existe usuario con email
        """
        return self.db.query(User).filter(User.email == email).first() is not None

    def exists_by_username(self, username: str) -> bool:
        """
        Verificar si existe usuario con username
        """
        return self.db.query(User).filter(User.username == username).first() is not None
