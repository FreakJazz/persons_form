# Person Registration Backend

Backend desarrollado con FastAPI y arquitectura limpia para el sistema de registro de personas.

## Estructura del Proyecto

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── persons.py          # Endpoints de personas
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py               # Configuración de la aplicación
│   ├── db/
│   │   ├── __init__.py
│   │   └── database.py             # Configuración de base de datos
│   ├── models/
│   │   ├── __init__.py
│   │   └── person.py               # Modelo de datos de Person
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── person.py               # Esquemas Pydantic
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── person_repository_interface.py
│   │   └── person_repository.py    # Lógica de acceso a datos
│   ├── services/
│   │   ├── __init__.py
│   │   └── file_service.py         # Servicio de manejo de archivos
│   ├── use_cases/
│   │   ├── __init__.py
│   │   └── person_use_case.py      # Casos de uso de negocio
│   └── __init__.py
├── uploads/                        # Directorio para fotos subidas
├── .env                           # Variables de entorno
├── .env.example                   # Ejemplo de variables de entorno
├── requirements.txt               # Dependencias Python
├── run.sh                        # Script de ejecución para Linux/Mac
├── run.bat                       # Script de ejecución para Windows
└── main.py                       # Punto de entrada de la aplicación
```

## Puesta en marcha (Windows PowerShell)

1. Clonar y entrar al backend

```powershell
git clone <repository-url>
cd reto_selection/backend
```

1. Crear y activar entorno virtual (recomendado .venv)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

1. Instalar dependencias

```powershell
pip install -r requirements.txt
```

1. Configurar PostgreSQL y variables de entorno

- Tener PostgreSQL en marcha y crear la base de datos `persons_db`.
- Copiar `.env.example` a `.env` y ajustar credenciales. Asegúrate que `DATABASE_URL` tenga este formato:
   `postgresql://<usuario>:<password>@localhost:5432/persons_db`.

1. Migraciones desde los modelos (Alembic)

El flujo recomendado es: las tablas se crean a partir de los modelos (autogenerate) y el seeding va en una migración separada.

```powershell
# 5.1) Generar la primera migración del esquema (si no existe)
python -m alembic revision --autogenerate -m "init tables"

# 5.2) Aplicar migraciones a la BD
$env:DATABASE_URL=(Get-Content .env | Select-String -Pattern '^DATABASE_URL=' | ForEach-Object { ($_ -split '=',2)[1] })
python -m alembic upgrade head

# 5.3) (Opcional) Ejecutar migración de seeding
python -m alembic upgrade head
```

Notas:

- Ya incluimos una migración separada para insertar el usuario admin (`0002_seed_admin_user.py`).
- Si modificas los modelos en `app/models`, vuelve a crear una nueva migración con `--autogenerate`.

1. Ejecutar la API

```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/persons_db
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=persons_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Application
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# File uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173

# Environment
ENVIRONMENT=development
```

## Endpoints de la API

### Personas

- `POST /api/v1/persons/` - Crear nueva persona
- `POST /api/v1/persons/batch` - Crear múltiples personas
- `GET /api/v1/persons/` - Obtener lista de personas
- `GET /api/v1/persons/{person_id}` - Obtener persona por ID
- `PUT /api/v1/persons/{person_id}` - Actualizar persona
- `DELETE /api/v1/persons/{person_id}` - Eliminar persona
- `GET /api/v1/persons/stats/dashboard` - Obtener estadísticas

### Documentación Automática

- **Swagger UI**: <http://localhost:8000/docs>
- **ReDoc**: <http://localhost:8000/redoc>

## Características

### Arquitectura Limpia

El proyecto sigue los principios de Clean Architecture:

- **Entities**: Modelos de dominio (`models/`)
- **Use Cases**: Lógica de negocio (`use_cases/`)
- **Interface Adapters**: Controladores y presentadores (`api/`, `schemas/`)
- **Frameworks & Drivers**: Base de datos, web framework (`db/`, FastAPI)

### Funcionalidades

1. **Registro de Personas**
   - Validación completa de datos
   - Cálculo automático de edad
   - Subida de fotos
   - Soporte para múltiples registros

2. **Dashboard de Estadísticas**
   - Conteo por profesión
   - Distribución por rangos de edad
   - Registros por mes

3. **Manejo de Archivos**
   - Subida segura de fotos
   - Validación de tamaño
   - Limpieza automática

### Base de Datos

Tabla `persons` con los siguientes campos:

```sql
CREATE TABLE persons (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    age INTEGER NOT NULL,
    profession VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    photo_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);
```

## Desarrollo

### Estructura de Archivos

- `main.py`: Configuración principal de FastAPI
- `app/core/config.py`: Configuración de la aplicación
- `app/db/database.py`: Configuración de SQLAlchemy
- `app/models/person.py`: Modelo SQLAlchemy
- `app/schemas/person.py`: Esquemas Pydantic para validación
- `app/repositories/`: Capa de acceso a datos
- `app/use_cases/`: Lógica de negocio
- `app/api/v1/`: Endpoints REST

### Próximas Mejoras

- [ ] Autenticación y autorización
- [ ] Paginación avanzada
- [ ] Filtros de búsqueda
- [ ] Logging estructurado
- [ ] Tests unitarios e integración
- [ ] Dockerización
- [ ] CI/CD pipelines
