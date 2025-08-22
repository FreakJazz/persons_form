import os
import json
from typing import List, Optional

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseSettings  # type: ignore
    SettingsConfigDict = None  # type: ignore


class Settings(BaseSettings):
    # Database configuration
    database_url: str = os.getenv("DATABASE_URL", "postgresql://postgres:admin12345@localhost:5432/persons_db")
    postgres_user: str = os.getenv("POSTGRES_USER", "postgres")
    postgres_password: str = os.getenv("POSTGRES_PASSWORD", "admin12345")
    postgres_db: str = os.getenv("POSTGRES_DB", "persons_db")
    postgres_host: str = os.getenv("POSTGRES_HOST", "localhost")
    postgres_port: int = int(os.getenv("POSTGRES_PORT", "5432"))

    # JWT configuration
    secret_key: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    # File upload configuration
    upload_dir: str = os.getenv("UPLOAD_DIR", "./uploads")
    max_file_size: int = int(os.getenv("MAX_FILE_SIZE", "5242880"))  # 5MB

    # CORS configuration
    allowed_origins_raw: Optional[str] = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://localhost:5174,http://localhost:4173"
    )

    # Environment / logging
    environment: str = os.getenv("ENVIRONMENT", "development")
    log_level: Optional[str] = os.getenv("LOG_LEVEL", None)

    # Pydantic v2 settings config; fall back to v1-style Config for older versions
    if SettingsConfigDict is not None:  # pydantic-settings v2
        model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    else:
        class Config:  # pydantic v1 fallback
            env_file = ".env"
            extra = "ignore"

    @property
    def allowed_origins_list(self) -> List[str]:
        v = self.allowed_origins_raw
        if not v:
            return ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:4173"]
        s = v.strip()
        if not s:
            return ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:4173"]
        # Try JSON array first
        try:
            data = json.loads(s)
            if isinstance(data, list):
                return [str(item).strip() for item in data if str(item).strip()]
        except Exception:
            pass
        # Fallback comma-separated
        return [item.strip() for item in s.split(",") if item.strip()]


settings = Settings()
