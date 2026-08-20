# Diseño Técnico: Implementación del Sistema de Autenticación "Pro"

## 1. Propósito de la Tarea
El objetivo ha sido securizar la Plataforma PAI implementando un sistema completo de autenticación basado en usuarios (registro, inicio de sesión) y protegiendo el acceso a los endpoints críticos y a la interfaz principal de la aplicación.

## 2. Arquitectura y Flujo de Datos
El sistema se ha desarrollado bajo el estándar JWT (JSON Web Tokens) estructurado en dos capas:

- **Backend (Node.js/Express):** Se ha diseñado una colección `User` en MongoDB que almacena las credenciales de los usuarios con encriptación (bcrypt). Un middleware intercepta las peticiones a la API `/api/*` y verifica la firma del token JWT para permitir o denegar el acceso.
- **Frontend (Angular):** Se ha habilitado un `AuthService` para gestionar el estado de sesión (token en `localStorage`). Si el usuario no está logueado, se presenta la pantalla de registro/login. Si lo está, el `AuthInterceptor` adjunta de manera invisible el token en las cabeceras HTTP (Header `Authorization: Bearer <token>`) de cada petición.

## 3. Archivos Modificados y Creados
- `backend/src/auth.ts` *(Nuevo)*: Lógica central de JWT y middleware de validación HTTP.
- `backend/src/server.ts` *(Modificado)*: Creación del esquema Mongoose `User`, inyección del campo `userId` en el modelo `Project`, y creación de las rutas públicas `/api/auth/register` y `/api/auth/login`. Aplicación del `authMiddleware` a toda la API.
- `frontend/src/app/services/auth.service.ts` *(Nuevo)*: Servicio inyectable para manejar la lógica de sesión del cliente.
- `frontend/src/app/auth.interceptor.ts` *(Nuevo)*: Interceptor HTTP de Angular.
- `frontend/src/app/app.config.ts` *(Modificado)*: Registro del interceptor en los proveedores de Angular.
- `frontend/src/app/app.ts` y `app.html` *(Modificados)*: Implementación del estado reactivo de sesión (Signals), lógica condicional para mostrar la interfaz de inicio de sesión, botón de *Logout* y filtro del historial de proyectos privados por usuario.

## 4. Decisiones de Diseño y Detalles Técnicos
- **Seguridad en Reposo:** Las contraseñas se *hashean* mediante `bcryptjs` con un factor de "sal" de 10 iteraciones, evitando el almacenamiento en texto plano.
- **Middleware Exclusivo:** El interceptor en el backend excluye intencionalmente el prefijo `/auth` mediante `req.path.startsWith('/auth')` para evitar bloqueos cíclicos al intentar hacer login.
- **Privacidad del Archivo:** Se ajustó la consulta de historial `Project.find({ userId: req.user._id })`. Al enlazar criptográficamente el token con el ID en la base de datos, garantizamos que ningún usuario pueda obtener o modificar la lista de proyectos de otro usuario.
