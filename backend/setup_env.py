#!/usr/bin/env python3
"""
Script para configurar el entorno de desarrollo del backend.
Este script ayuda a configurar las variables de entorno necesarias.
"""

import os
import shutil
from pathlib import Path

def setup_environment():
    """Configura el entorno de desarrollo."""
    print("🚀 Configurando entorno de desarrollo...")
    
    # Directorio actual
    current_dir = Path(__file__).parent
    
    # Archivos de entorno
    env_development = current_dir / ".env.development"
    env_production = current_dir / ".env.production"
    env_file = current_dir / ".env"
    
    if not env_file.exists():
        print("📝 Creando archivo .env desde .env.development...")
        shutil.copy(env_development, env_file)
        print("✅ Archivo .env creado exitosamente")
    else:
        print("⚠️ El archivo .env ya existe")
        
    # Crear directorio de uploads si no existe
    uploads_dir = current_dir / "uploads"
    uploads_dir.mkdir(exist_ok=True)
    print("📁 Directorio de uploads configurado")
    
    print("\n📋 Variables de entorno configuradas:")
    print("   • DATABASE_URL: Conexión a PostgreSQL")
    print("   • SECRET_KEY: Clave secreta para JWT")
    print("   • UPLOAD_DIR: Directorio para archivos subidos")
    print("   • ALLOWED_ORIGINS: Orígenes permitidos para CORS")
    
    print("\n⚠️ IMPORTANTE:")
    print("   • Asegúrate de cambiar el SECRET_KEY en producción")
    print("   • Configura tu base de datos PostgreSQL")
    print("   • No subas el archivo .env al repositorio")
    
    print("\n🎉 Configuración completada!")

if __name__ == "__main__":
    setup_environment()
