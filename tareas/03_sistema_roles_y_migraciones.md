# Diseño Técnico: Sistema de Roles, Migraciones y Panel de Administración

## 1. Propósito de la Tarea
- **Control de Acceso (Roles):** Evitar que cualquier usuario registrado pueda generar proyectos sin autorización, manteniendo los recursos bajo control.
- **Panel de Administración:** Proveer una interfaz gráfica (oculta al público general) desde la cual un usuario administrador pueda revisar los registros pendientes y promover usuarios al rol de profesor.
- **Motor de Migraciones Automáticas:** Establecer una infraestructura madura para ejecutar scripts de alteración de base de datos de manera controlada, secuencial y sin riesgo de duplicidades durante los arranques del backend.

## 2. Arquitectura y Flujo de Datos

### 2.1. Motor de Migraciones (`runner.ts`)
Se ha implementado un motor en el arranque de la aplicación (`server.ts`) que intercepta la inicialización de la conexión con MongoDB.
- El motor lee el directorio `backend/src/migrations/`.
- Compara los archivos existentes con el registro histórico de la colección `Migration` en la base de datos.
- Ejecuta la función `up()` de cualquier script que no conste como ejecutado, y lo registra, previniendo dobles ejecuciones.

### 2.2. Semilla de Superusuario (`01_create_admin_user.ts`)
La primera migración oficial inyecta el administrador por defecto. Para cumplir con los estándares de seguridad, este script lee las credenciales `ADMIN_EMAIL` y `ADMIN_PASSWORD` desde el archivo `.env`. Si no se provee contraseña en el entorno, genera una por defecto pero alerta en consola.

### 2.3. Sistema de Roles
La base de datos y los JWT ahora manejan tres estados:
- `pending`: Rol por defecto al registrarse. Tienen interfaz de solo lectura.
- `teacher`: Rol operativo. Puede usar la API generativa.
- `admin`: Superusuario. Accede al Panel de Administración.

### 2.4. Protección de Endpoints
Se han creado los middlewares `requireApproved` y `requireAdmin` en `server.ts` que bloquean las llamadas a la API a nivel servidor, previniendo accesos directos maliciosos (código 403 Forbidden).

### 2.5. Frontend y Panel Admin
En Angular, se ha añadido un botón dinámico "⚙️ Admin" condicionado a la decodificación del JWT. La interfaz del generador ha sido envuelta en una estructura condicional que renderiza un mensaje amigable de "Cuenta pendiente de aprobación" si el rol es `pending`. 
En la vista del panel, el administrador consume los nuevos endpoints `GET /api/admin/users` y `PUT /api/admin/users/:id/role` para autorizar a los docentes.

## 3. Archivos Modificados
- `backend/src/migrations/*` *(Nuevos)*: Motor de migraciones y scripts.
- `backend/src/server.ts`: Sustitución del antiguo `seedDB` por el Runner de migraciones. Adición de middlewares y validación de endpoints HTTP.
- `frontend/src/app/services/pai.service.ts`: Nuevos métodos HTTP de administración.
- `frontend/src/app/app.html` y `app.ts`: Inyección de la vista de Panel, y lógica de permisos visuales.
