from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.auth import get_current_active_user
from app.use_cases.auth_service import AuthService
from app.models.user import User
from app.schemas.auth_request_response import (
    LoginRequest as LoginRequest,
    LoginResponse as TokenResponse,
    UserCreateRequest,
    UserResponse,
    ResetPasswordRequest as PasswordResetRequest,
    ChangePasswordRequest as PasswordChangeRequest,
    RefreshTokenRequest,
)
from app.core.exceptions import (
    AuthenticationError,
    EntityNotFoundError,
    ValidationError,
    DuplicateEntityError
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Iniciar sesión de usuario
    """
    try:
        auth_service = AuthService(db)
        return auth_service.login(login_data)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )


@router.post("/register", response_model=TokenResponse)
async def register(
    user_data: UserCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Registrar nuevo usuario
    """
    try:
        auth_service = AuthService(db)
        return auth_service.register(user_data)
    except DuplicateEntityError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Refrescar token de acceso
    """
    try:
        auth_service = AuthService(db)
        return auth_service.refresh_token(refresh_data.refresh_token)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )


@router.post("/password-reset-request")
async def request_password_reset(
    email_request: dict,
    db: Session = Depends(get_db)
):
    """
    Solicitar reset de contraseña
    """
    try:
        auth_service = AuthService(db)
        return auth_service.request_password_reset(email_request.get("email"))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )


@router.post("/password-reset")
async def reset_password(
    reset_data: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """
    Resetear contraseña con token
    """
    try:
        auth_service = AuthService(db)
        return auth_service.reset_password(reset_data)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except EntityNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )


@router.post("/change-password")
async def change_password(
    password_data: PasswordChangeRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Cambiar contraseña del usuario autenticado
    """
    try:
        auth_service = AuthService(db)
        return auth_service.change_password(current_user.id, password_data)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except EntityNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """
    Obtener información del usuario autenticado
    """
    return UserResponse.from_orm(current_user)


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    """
    Cerrar sesión del usuario
    Nota: En una implementación real, aquí se invalidaría el token
    """
    return {"message": "Sesión cerrada exitosamente"}
