from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import re
import sys
from pathlib import Path

# Ensure project root (backend/) is on sys.path so 'app' package can be imported
BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
from app.db.database import Base
from app.models.person import Person
from app.models.profession import Profession

target_metadata = Base.metadata

def _load_database_url_from_env_file() -> str | None:
    env_path = BACKEND_ROOT / '.env'
    if env_path.exists():
        try:
            with env_path.open('r', encoding='utf-8') as f:
                for line in f:
                    s = line.strip()
                    if not s or s.startswith('#'):
                        continue
                    if s.startswith('DATABASE_URL='):
                        return s.split('=', 1)[1].strip()
        except Exception:
            pass
    return None


def _ensure_sqlalchemy_url() -> str:
    # 1) Use env var if set
    url = os.getenv('DATABASE_URL')
    if url:
        config.set_main_option('sqlalchemy.url', url)
        return url

    # 2) Try .env file in backend root
    url = _load_database_url_from_env_file()
    if url:
        config.set_main_option('sqlalchemy.url', url)
        return url

    # 3) Fallback to existing config value (might be empty)
    url = config.get_main_option('sqlalchemy.url')
    if url:
        return url

    raise RuntimeError(
        "DATABASE_URL not set and alembic.ini sqlalchemy.url is empty. "
        "Set DATABASE_URL in your environment or in backend/.env"
    )


def run_migrations_offline():
    url = _ensure_sqlalchemy_url()
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    url = _ensure_sqlalchemy_url()
    section = config.get_section(config.config_ini_section)
    if section is None:
        section = {}
    section['sqlalchemy.url'] = url
    # Ensure client encoding is UTF-8 for PostgreSQL
    if url.startswith('postgresql'):
        section['sqlalchemy.client_encoding'] = 'utf8'

    connectable = engine_from_config(
        section,
        prefix='sqlalchemy.',
        poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
