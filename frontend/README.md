
# Person Registration Frontend

Frontend desarrollado con React, TypeScript y Vite, siguiendo principios de arquitectura limpia y buenas prácticas de desarrollo.

## Instalación y Uso

En el directorio del proyecto, ejecuta:

### `npm install`

Instala las dependencias del proyecto.

### `npm run dev`

Inicia la aplicación en modo desarrollo.\
Abre [http://localhost:5173](http://localhost:5173) para verla en el navegador.

La página se recargará automáticamente si realizas cambios en el código.\
Verás los errores de lint en la consola si existen.

### `npm run build`

Genera la versión optimizada para producción en la carpeta `dist`.

### `npm run preview`

Sirve localmente la build de producción para pruebas finales.

### `npm run lint`

Ejecuta el linter para asegurar el cumplimiento de las buenas prácticas y estilos de código.

## Estructura del Proyecto

El proyecto sigue una arquitectura limpia, separando claramente las capas de dominio, infraestructura y presentación:

- `src/domain`: Entidades, repositorios y casos de uso del dominio.
- `src/infrastructure`: Implementaciones de servicios, API y hooks.
- `src/presentation`: Componentes, páginas y lógica de UI.
- `src/shared`: Utilidades, tipos y constantes compartidas.

## Buenas Prácticas

- Uso de TypeScript para tipado estático.
- Separación de responsabilidades por capas.
- Componentes reutilizables y desacoplados.
- Hooks personalizados para lógica de negocio y datos.
- Linting y formateo automático.

## Más Información

- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de React](https://react.dev/)

