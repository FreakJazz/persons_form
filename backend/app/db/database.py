from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Ensure UTF-8 client encoding when connecting to PostgreSQL
engine = create_engine(settings.database_url, connect_args={"client_encoding": "utf8"} if settings.database_url.startswith("postgresql") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
