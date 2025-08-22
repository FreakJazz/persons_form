@echo off
REM ================================================================
REM RETO SELECTION BACKEND - SCRIPT DE EJECUCIÓN
REM ================================================================

echo.
echo ========================================
echo   RETO SELECTION BACKEND SERVER
echo ========================================
echo.

REM Verificar si existe el archivo de configuración
if not exist ".env" (
    echo ❌ Archivo .env no encontrado
    echo Copiando archivo de configuración por defecto...
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo ✅ Archivo .env creado
    ) else (
        echo ❌ Archivo .env.example no encontrado
        echo Por favor, configure manualmente el archivo .env
        pause
        exit /b 1
    )
)

REM Verificar si existe la carpeta uploads
if not exist "uploads" (
    echo 📁 Creando carpeta uploads...
    mkdir uploads
    echo ✅ Carpeta uploads creada
)

echo.
echo 🚀 Iniciando servidor backend...
echo.
echo Servidor disponible en:
echo   - Local: http://localhost:8000
echo   - Red:   http://0.0.0.0:8000
echo   - Docs:  http://localhost:8000/docs
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

REM Ejecutar el servidor
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

echo.
echo 🛑 Servidor detenido
pause
