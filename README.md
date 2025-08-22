# 🏢 Sistema Reto Selection

**Sistema completo de gestión de personas y profesiones** desarrol## 📚 API Endpoints Disponibles

### 👥 Gestión de Personas
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/api/v1/persons/` | Listar todas las personas | - |
| `GET` | `/api/v1/persons/{id}` | Obtener persona por ID | `id: int` |
| `POST` | `/api/v1/persons/` | Crear nueva persona | `FormData` con foto |
| `PUT` | `/api/v1/persons/{id}` | Actualizar persona existente | `id: int`, `FormData` |
| `DELETE` | `/api/v1/persons/{id}` | Eliminar persona | `id: int` |
| `POST` | `/api/v1/persons/batch` | Crear múltiples personas | `Array<PersonCreate>` |
| `GET` | `/api/v1/persons/stats/dashboard` | Estadísticas para dashboard | - |

### 🏢 Gestión de Profesiones  
| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `GET` | `/api/v1/professions/` | Listar profesiones | - |
| `GET` | `/api/v1/professions/{id}` | Obtener profesión por ID | `id: int` |
| `POST` | `/api/v1/professions/` | Crear nueva profesión | `ProfessionCreate` |
| `PUT` | `/api/v1/professions/{id}` | Actualizar profesión | `id: int`, `ProfessionUpdate` |
| `DELETE` | `/api/v1/professions/{id}` | Eliminar profesión | `id: int` |
| `GET` | `/api/v1/professions/all` | Todas para selectores | - |

## 🗄️ Modelo de Base de Datos

### Relación entre Entidades
- **Personas** ← FK → **Profesiones** (relación muchos a uno)
- **Cálculo automático** de edad mediante triggers
- **Validaciones** de integridad referencial

```sql
-- Tabla profesiones (catálogo)
CREATE TABLE professions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla personas (principal)
CREATE TABLE persons (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    age INTEGER, -- Calculado automáticamente
    profession_id INTEGER REFERENCES professions(id),
    address TEXT,
    phone VARCHAR(20),
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```con **FastAPI** (backend) y **React + TypeScript** (frontend), implementando arquitectura limpia y las mejores prácticas de desarrollo.

## 🚀 Características Principales

### 👥 Gestión de Personas
- ✅ **CRUD completo** con validaciones robustas
- ✅ **Subida de fotos** con preview y validaciones
- ✅ **Cálculo automático** de edad por fecha de nacimiento
- ✅ **Registro individual** y **múltiple en lote**
- ✅ **Búsqueda avanzada** por nombre, profesión, teléfono
- ✅ **Paginación personalizada** con textos en español
- ✅ **Ordenamiento** por cualquier columna

### 🏢 Gestión de Profesiones
- ✅ **Catálogo completo** con CRUD
- ✅ **Validación de unicidad** automática
- ✅ **Conversión a mayúsculas** automática
- ✅ **Búsqueda y filtros** en tiempo real
- ✅ **Relación con personas** mediante FK

### 📊 Dashboard Analytics
- 📊 **Gráfico de barras**: Personas por profesión
- 🍩 **Gráfico donut**: Distribución por rangos de edad
- 📈 **Gráfico de líneas**: Registros por mes
- 🔄 **Actualización en tiempo real**

### 🎨 Interfaz Moderna
- � **Diseño oscuro** con Material-UI v5
- 📱 **Responsive** para desktop, tablet y móvil
- 🎯 **Formularios inteligentes** con Formik + Zod
- ⚡ **Estados de carga** y manejo de errores
- 🔍 **Búsqueda instantánea** con debounce

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI** - Framework web moderno y rápido
- **SQLAlchemy** - ORM con soporte PostgreSQL
- **Alembic** - Sistema de migraciones
- **Pydantic** - Validaciones y serialización
- **PostgreSQL** - Base de datos con triggers

### Frontend  
- **React 18** - Framework UI con hooks modernos
- **TypeScript** - Tipado estático
- **Material-UI v5** - Componentes Material Design
- **React Query** - Gestión de estado del servidor
- **Formik + Zod** - Formularios con validaciones
- **ApexCharts** - Gráficos interactivos para dashboard

## ⚡ Inicio Rápido

### Opción 1: Scripts Automatizados (Recomendado)

**Windows:**
```bash
# Desde la raíz del proyecto
start_dev.bat
```

**Linux/Mac:**
```bash
# Desde la raíz del proyecto
chmod +x start_dev.sh
./start_dev.sh
```

### Opción 2: Configuración Manual

1. **Configurar Backend:**
```bash
cd backend
python setup_env.py  # Configura variables de entorno
pip install -r requirements.txt
uvicorn main:app --reload
```

2. **Configurar Frontend:**
```bash
cd frontend
node setup_env.js  # Configura variables de entorno
npm install
npm start
```

## 🔧 Configuración de Variables de Entorno

El sistema utiliza archivos `.env` para configuración:

- `.env.development` - Configuración para desarrollo
- `.env.production` - Configuración para producción  
- `.env` - Archivo local (auto-generado, no incluido en git)

Los scripts de configuración (`setup_env.py` y `setup_env.js`) crean automáticamente los archivos `.env` necesarios.

## 📚 Documentación

- **[� Documentación Completa](./README_COMPLETO.md)** - Guía detallada de instalación y uso
- **[📋 Historial de Desarrollo](./DESARROLLO_HISTORIAL.md)** - Registro completo del proceso de desarrollo
- **[🔗 API Docs](http://localhost:8000/docs)** - Documentación automática de la API (cuando esté ejecutándose)

## 🏃‍♂️ URLs de Acceso

Una vez iniciado el sistema:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Documentación API:** [http://localhost:8000/docs](http://localhost:8000/docs)

## 🤝 Contribuir al Proyecto

1. **Fork** del repositorio
2. **Crear rama** para feature (`git checkout -b feature/NuevaFuncionalidad`)
3. **Commit** de cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/NuevaFuncionalidad`)
5. **Abrir Pull Request** con descripción detallada

## 🆘 Soporte y Contacto

Para reportar bugs, solicitar features o hacer preguntas:

- **Issues**: Crear un issue en GitHub
- **GitHub**: [https://github.com/FreakJazz/](https://github.com/FreakJazz/)
- **LinkedIn**: [Jazmin Rodriguez Bermeo](https://www.linkedin.com/in/jazmin-rodriguez-bermeo/)
- **API Docs**: http://localhost:8000/docs (cuando el servidor esté ejecutándose)

## 📝 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver archivo `LICENSE` para detalles.

---

**¡Sistema completo y listo para producción!** ✨

**Desarrollado por:** **FreakJazz** - Full Stack Developer  
**Tecnologías:** FastAPI + React + TypeScript + Material-UI + PostgreSQL  
**Arquitectura:** Clean Architecture con mejores prácticas de desarrollo
