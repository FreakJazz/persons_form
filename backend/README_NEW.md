# 🚀 Reto Selection Backend

Sistema de gestión de personas y profesiones desarrollado con FastAPI, SQLAlchemy y PostgreSQL. Implementa una arquitectura limpia con separación de responsabilidades y patrones de diseño modernos.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Instalación Rápida](#-instalación-rápida)
- [Instalación Manual](#-instalación-manual)
- [Configuración](#-configuración)
- [Ejecutar el Proyecto](#-ejecutar-el-proyecto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#-base-de-datos)
- [Desarrollo](#-desarrollo)

## 🌟 Características

- ✅ **CRUD completo** de Personas y Profesiones
- ✅ **Subida de archivos** para fotos de perfil
- ✅ **Validaciones** robustas con Pydantic
- ✅ **Cálculo automático** de edad
- ✅ **Relacionales** entre tablas
- ✅ **Dashboard** con estadísticas
- ✅ **Registro múltiple** de personas
- ✅ **API RESTful** con documentación automática
- ✅ **Migraciones** de base de datos con Alembic
- ✅ **Arquitectura limpia** (Clean Architecture)

## ⚡ Instalación Rápida

### Opción 1: Script Automático (Recomendado)

```bash
# 1. Ejecutar configuración automática
setup.bat

# 2. Ejecutar servidor
run_server.bat
```

### Opción 2: Usando el Ejecutable

```bash
# 1. Descargar reto_selection_backend.exe
# 2. Configurar base de datos con database_complete.sql
# 3. Ejecutar
./reto_selection_backend.exe
```

## 🔧 Instalación Manual

### Prerrequisitos

- Python 3.8+
- PostgreSQL 12+
- Git

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd reto_selection/backend
```

### 2. Crear Entorno Virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
copy .env.example .env

# Editar .env con tu configuración
```

### 5. Configurar Base de Datos

```bash
# Opción A: Usar script SQL completo
psql -U postgres -d tu_base_datos -f database_complete.sql

# Opción B: Usar migraciones de Alembic
alembic upgrade head
```

### 6. Crear Carpetas Necesarias

```bash
mkdir uploads
```

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/reto_selection
POSTGRES_USER=usuario
POSTGRES_PASSWORD=contraseña
POSTGRES_DB=reto_selection
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Aplicación
SECRET_KEY=tu_clave_secreta_super_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Archivos
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif

# Entorno
ENVIRONMENT=development
DEBUG=True
```

## 🚀 Ejecutar el Proyecto

### Desarrollo

```bash
# Activar entorno virtual
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Ejecutar servidor de desarrollo
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Producción

```bash
# Con Gunicorn (recomendado para producción)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# Con Uvicorn
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### URLs Importantes

- **API**: http://localhost:8000
- **Documentación**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Archivos estáticos**: http://localhost:8000/uploads/

## 📁 Estructura del Proyecto

```
backend/
├── 📄 main.py                      # Punto de entrada de la aplicación
├── 📄 requirements.txt             # Dependencias de Python
├── 📄 alembic.ini                  # Configuración de Alembic
├── 📄 database_complete.sql        # Script SQL completo
├── 📄 setup.bat                    # Script de configuración
├── 📄 run_server.bat              # Script para ejecutar servidor
├── 📂 app/
│   ├── 📄 __init__.py
│   ├── 📂 api/                     # Endpoints de la API
│   │   ├── 📄 __init__.py
│   │   └── 📂 v1/
│   │       ├── 📄 persons.py       # Endpoints de personas
│   │       └── 📄 professions.py   # Endpoints de profesiones
│   ├── 📂 core/                    # Configuración central
│   │   ├── 📄 config.py            # Configuración de la app
│   │   ├── 📄 exceptions.py        # Excepciones personalizadas
│   │   └── 📄 security.py          # Utilidades de seguridad
│   ├── 📂 db/                      # Base de datos
│   │   ├── 📄 __init__.py
│   │   └── 📄 database.py          # Configuración de SQLAlchemy
│   ├── 📂 models/                  # Modelos de SQLAlchemy
│   │   ├── 📄 __init__.py
│   │   ├── 📄 person.py            # Modelo de Persona
│   │   └── 📄 profession.py        # Modelo de Profesión
│   ├── 📂 repositories/            # Repositorios (Acceso a datos)
│   │   ├── 📄 __init__.py
│   │   ├── 📄 person_repository.py
│   │   └── 📄 profession_repository.py
│   ├── 📂 schemas/                 # Esquemas de Pydantic
│   │   ├── 📄 __init__.py
│   │   ├── 📄 person_request_response.py
│   │   └── 📄 profession_request_response.py
│   ├── 📂 services/                # Servicios de la aplicación
│   │   ├── 📄 __init__.py
│   │   └── 📄 file_service.py      # Servicio de archivos
│   └── 📂 use_cases/               # Casos de uso (Lógica de negocio)
│       ├── 📄 __init__.py
│       ├── 📄 person_use_case.py
│       └── 📄 profession_use_case.py
├── 📂 alembic/                     # Migraciones de base de datos
│   ├── 📄 env.py
│   └── 📂 versions/
│       └── 📄 0001_initial_setup.py
└── 📂 uploads/                     # Archivos subidos
```

## 📚 API Endpoints

### 👥 Personas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/persons/` | Listar todas las personas |
| `GET` | `/api/v1/persons/{id}` | Obtener persona por ID |
| `POST` | `/api/v1/persons/` | Crear nueva persona |
| `PUT` | `/api/v1/persons/{id}` | Actualizar persona |
| `DELETE` | `/api/v1/persons/{id}` | Eliminar persona |
| `POST` | `/api/v1/persons/batch` | Crear múltiples personas |
| `GET` | `/api/v1/persons/stats/dashboard` | Estadísticas del dashboard |

### 🏢 Profesiones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/professions/` | Listar todas las profesiones |
| `GET` | `/api/v1/professions/{id}` | Obtener profesión por ID |
| `POST` | `/api/v1/professions/` | Crear nueva profesión |
| `PUT` | `/api/v1/professions/{id}` | Actualizar profesión |
| `DELETE` | `/api/v1/professions/{id}` | Eliminar profesión |
| `GET` | `/api/v1/professions/all` | Obtener todas para selector |

### 📋 Ejemplos de Uso

#### Crear Persona (con foto)

```bash
curl -X POST "http://localhost:8000/api/v1/persons/" \
  -F "first_name=Juan" \
  -F "last_name=Pérez" \
  -F "birth_date=1990-05-15" \
  -F "profession_id=1" \
  -F "address=Calle 123 #45-67" \
  -F "phone=3001234567" \
  -F "photo=@foto.jpg"
```

#### Crear Profesión

```bash
curl -X POST "http://localhost:8000/api/v1/professions/" \
  -H "Content-Type: application/json" \
  -d '{"name": "INGENIERO DE SISTEMAS"}'
```

#### Obtener Estadísticas

```bash
curl -X GET "http://localhost:8000/api/v1/persons/stats/dashboard"
```

## 🗄️ Base de Datos

### Modelos

#### Persona
```python
- id: int (PK)
- first_name: str(100)
- last_name: str(100)
- birth_date: date
- age: int (calculado automáticamente)
- profession_id: int (FK)
- address: text
- phone: str(20)
- photo_url: str(255) [opcional]
- created_at: datetime
- updated_at: datetime
```

#### Profesión
```python
- id: int (PK)
- name: str(255) [unique]
- created_at: datetime
- updated_at: datetime
```

### Migraciones

```bash
# Crear nueva migración
alembic revision --autogenerate -m "Descripción del cambio"

# Aplicar migraciones
alembic upgrade head

# Volver a migración anterior
alembic downgrade -1

# Ver historial
alembic history
```

### Backup y Restore

```bash
# Crear backup
pg_dump -U usuario -h localhost -d reto_selection > backup.sql

# Restaurar backup
psql -U usuario -h localhost -d reto_selection < backup.sql

# Usar script completo
psql -U usuario -h localhost -d reto_selection < database_complete.sql
```

## 🛠️ Desarrollo

### Ejecutar Tests

```bash
# Instalar dependencias de testing
pip install pytest pytest-asyncio httpx

# Ejecutar tests
pytest
```

### Linting y Formato

```bash
# Instalar herramientas
pip install black flake8 isort

# Formatear código
black .
isort .

# Verificar estilo
flake8
```

### Variables de Entorno para Desarrollo

```env
ENVIRONMENT=development
DEBUG=True
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/reto_selection_dev
```

## 🚀 Despliegue

### Docker (Opcional)

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Ejecutable

```bash
# Generar ejecutable
python generate_distribution.py

# Resultado: dist/reto_selection_backend.exe
```

## 📞 Soporte

- **Documentación API**: http://localhost:8000/docs
- **Logs**: Revisar consola del servidor
- **Issues**: Crear issue en el repositorio

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para Reto Selection**
