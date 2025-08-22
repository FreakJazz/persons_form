#!/usr/bin/env node
/**
 * Script para configurar el entorno de desarrollo del frontend.
 * Este script ayuda a configurar las variables de entorno necesarias.
 */

const fs = require('fs');
const path = require('path');

function setupEnvironment() {
    console.log('🚀 Configurando entorno de desarrollo del frontend...');
    
    // Directorio actual
    const currentDir = __dirname;
    
    // Archivos de entorno
    const envDevelopment = path.join(currentDir, '.env.development');
    const envProduction = path.join(currentDir, '.env.production');
    const envFile = path.join(currentDir, '.env');
    
    if (!fs.existsSync(envFile)) {
        console.log('📝 Creando archivo .env desde .env.development...');
        fs.copyFileSync(envDevelopment, envFile);
        console.log('✅ Archivo .env creado exitosamente');
    } else {
        console.log('⚠️ El archivo .env ya existe');
    }
    
    console.log('\n📋 Variables de entorno configuradas:');
    console.log('   • REACT_APP_API_URL: URL de la API backend');
    console.log('   • REACT_APP_ENVIRONMENT: Entorno de ejecución');
    console.log('   • REACT_APP_DEBUG: Modo debug activado/desactivado');
    
    console.log('\n⚠️ IMPORTANTE:');
    console.log('   • Las variables deben empezar con REACT_APP_ para ser accesibles');
    console.log('   • Configura la URL correcta de tu API backend');
    console.log('   • No subas archivos .env al repositorio');
    
    console.log('\n🎉 Configuración completada!');
}

if (require.main === module) {
    setupEnvironment();
}

module.exports = { setupEnvironment };
