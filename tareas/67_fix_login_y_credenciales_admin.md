# Tarea 67: Diagnóstico y Corrección de Login y Credenciales de Administrador

## Propósito
El usuario reportó la imposibilidad de acceder a la aplicación mediante el formulario de login tras las tareas recientes de analítica y telemetría de uso. El propósito de esta intervención fue identificar la causa raíz de la denegación de acceso, restablecer el funcionamiento correcto del login garantizando la coexistencia tanto del administrador por defecto (`admin@plappin.org`) como del administrador configurado por variables de entorno (`eva@plappin.org`), y normalizar la información del usuario devuelta en la respuesta de autenticación para que el frontend mantenga la consistencia de sesión e identidad.

---

## Causa Raíz
Tras el análisis detallado del entorno y los registros del sistema, se identificaron los siguientes factores concurrentes:

1. **Divergencia entre contenedores de base de datos:**
   - Existían dos instancias de MongoDB en la máquina de desarrollo: un contenedor `mongodev` (puerto 27017) y el contenedor de Docker Compose `pai_db` (mapeado internamente a 27017 y al host en 27018).
   - El backend en Docker Compose se conecta internamente a `pai_db`. En `pai_db`, la migración inicial `01_create_admin_user.ts` se había ejecutado condicionalmente usando las variables de entorno (`ADMIN_EMAIL=eva@plappin.org`), por lo que el usuario por defecto del sistema documentado en el proyecto (`admin@plappin.org` / `PlappinAdmin2026!`) no había sido sembrado en dicha base de datos. Si el usuario intentaba acceder con `admin@plappin.org`, la autenticación era rechazada con `400 Credenciales inválidas`.
   - Adicionalmente, la contraseña del usuario `eva@plappin.org` estaba definida en `.env` como `ev954_:`.

2. **Carencia de identificador `_id` y flag `canUseAi` en el payload de respuesta de `login`:**
   - El endpoint `POST /api/auth/login` (`backend/src/controllers/auth.controller.ts`) retornaba únicamente `{ token, user: { name, email, role } }`, omitiendo `_id` y `canUseAi`.
   - En el frontend, el mapper `AuthMapper.fromStorage` deserializaba este objeto almacenado en `localStorage` (`pai_user`). Al no recibir `canUseAi`, se evaluaba a `false`, deshabilitando funciones de IA y dejando inconsistente la identificación del usuario.

3. **Inconsistencia de claves en `localStorage` para telemetría:**
   - En `frontend/src/app/services/telemetry.service.ts`, el manejador de `navigator.sendBeacon` en el cierre de ventana consultaba la clave `token` en lugar de `pai_token`.

---

## Arquitectura y Flujo

```
[Usuario / Navegador]
       │  POST /api/auth/login
       ▼
[Angular Proxy :4200] ────► [Express Backend :3000]
                                   │
                                   ▼
                         [MongoDB pai_db :27017]
                                   │
                     Verificación bcrypt de hash
                                   │
                                   ▼
              Generación de JWT (id, role, canUseAi)
                                   │
                                   ▼
              Respuesta: { token, user: { _id, name, email, role, canUseAi } }
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
localStorage.setItem('pai_token', token)         localStorage.setItem('pai_user', user)
       │                                                       │
       ▼                                                       ▼
AuthFacade.currentUser (Signal)                  AuthInterceptor (Bearer Token)
       │                                                       │
       ▼                                                       ▼
Acceso Completo y Permisos de IA                 Telemetría y Peticiones API
```

---

## Archivos Modificados

1. [backend/src/controllers/auth.controller.ts](file:///Users/csgj/dev/pai-app/backend/src/controllers/auth.controller.ts):
   - Se modificó la respuesta del controlador de login para incluir de forma explícita `_id` y `canUseAi: user.canUseAi !== false`.

2. [backend/src/migrations/01_create_admin_user.ts](file:///Users/csgj/dev/pai-app/backend/src/migrations/01_create_admin_user.ts):
   - Se robusteció la migración de creación de administradores para que garantice siempre la existencia del usuario base `admin@plappin.org` (clave `PlappinAdmin2026!`, rol `admin`, `canUseAi: true`) y adicionalmente cree/verifique el usuario administrador especificado en variables de entorno si difiere del principal.

3. [frontend/src/app/services/telemetry.service.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/services/telemetry.service.ts):
   - Se ajustó la lectura del token de autenticación para consultar `localStorage.getItem("pai_token") || localStorage.getItem("token")` en eventos `sendBeacon` de cierre de ventana.

4. **Base de Datos `pai_db` (MongoDB):**
   - Se insertó/sincronizó el usuario `admin@plappin.org` con hash bcrypt correspondiente a `PlappinAdmin2026!`, rol `admin` y `canUseAi: true`.

---

## Credenciales Operativas Validadas

| Usuario | Contraseña | Rol | Acceso IA |
| :--- | :--- | :--- | :--- |
| `admin@plappin.org` | `PlappinAdmin2026!` | `admin` | Sí (`canUseAi: true`) |
| `eva@plappin.org` | `ev954_:` | `admin` | Sí (`canUseAi: true`) |

---

## Verificación y Pruebas
1. **Peticiones HTTP directas (curl):**
   - Ambas cuentas de administrador fueron probadas contra `http://localhost:4200/api/auth/login` a través del proxy de Angular, obteniendo respuestas `200 OK` con tokens JWT válidos y datos completos de usuario.
2. **Suite de Pruebas Automatizadas del Backend:**
   - Se ejecutaron todos los tests unitarios y de integración (`npm test` en `backend/`): 12 suites pasadas, 67 tests pasados (100% de éxito).
3. **Suite de Pruebas Automatizadas del Frontend:**
   - Se ejecutó Vitest con análisis de cobertura en `frontend/`: 27 archivos de test pasados, 285 tests pasados, cobertura global de líneas del 99.71% y ramas del 94.59%.
