@echo off
REM ================================================================
REM RETO SELECTION BACKEND - CONFIGURACIÓN INICIAL
REM ================================================================

echo.
echo =========================================
echo   CONFIGURACIÓN RETO SELECTION BACKEND
echo =========================================
echo.

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python no está instalado o no está en el PATH
    echo Por favor, instale Python 3.8 o superior
    pause
    exit /b 1
)

echo ✅ Python encontrado
python --version

REM Crear entorno virtual si no existe
if not exist "venv" (
    echo.
    echo 📦 Creando entorno virtual...
    python -m venv venv
    if errorlevel 1 (
        echo ❌ Error creando entorno virtual
        pause
        exit /b 1
    )
    echo ✅ Entorno virtual creado
)

REM Activar entorno virtual
echo.
echo 🔄 Activando entorno virtual...
call venv\Scripts\activate.bat

REM Actualizar pip
echo.
echo 📈 Actualizando pip...
python -m pip install --upgrade pip

REM Instalar dependencias
echo.
echo 📚 Instalando dependencias...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)

REM Crear archivo .env si no existe
if not exist ".env" (
    echo.
    echo ⚙️ Configurando archivo de entorno...
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo ✅ Archivo .env creado desde .env.example
    ) else (
        echo ❌ Archivo .env.example no encontrado
    )
)

REM Crear carpeta uploads
if not exist "uploads" (
    echo.
    echo 📁 Creando carpeta uploads...
    mkdir uploads
    echo ✅ Carpeta uploads creada
)

REM Ejecutar migraciones
echo.
echo 🗄️ Configurando base de datos...
echo ⚠️ Asegúrate de que PostgreSQL esté ejecutándose
echo.
set /p continue="¿Continuar con las migraciones? (s/n): "
if /i "%continue%"=="s" (
    alembic upgrade head
    if errorlevel 1 (
        echo ❌ Error ejecutando migraciones
        echo Verifica la configuración de la base de datos en .env
    ) else (
        echo ✅ Migraciones ejecutadas correctamente
    )
) else (
    echo ⚠️ Migraciones omitidas - ejecuta manualmente: alembic upgrade head
)

echo.
echo ✅ CONFIGURACIÓN COMPLETADA
echo.
echo Para ejecutar el servidor:
echo   1. Activa el entorno virtual: call venv\Scripts\activate.bat
echo   2. Ejecuta el servidor: python -m uvicorn main:app --reload
echo   3. O ejecuta: run_server.bat
echo.
echo Documentación API disponible en: http://localhost:8000/docs
echo.
pause
