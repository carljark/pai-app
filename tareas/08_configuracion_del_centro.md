# Diseño Técnico: Configuración del Contexto del Centro

## 1. Propósito de la Tarea
- **Personalización Contextual de la IA:** Permitir a los administradores de la plataforma definir los datos específicos de su centro educativo (nombre, ciudad y contexto socioeconómico).
- **Generación Situada:** Lograr que los proyectos generados por el motor pedagógico (Gemini) no sean genéricos, sino que propongan recursos viables, conexiones con el entorno local y narrativas adaptadas a la realidad del alumnado y la localidad.

## 2. Arquitectura y Flujo de Datos

### 2.1. Base de Datos (Mongoose)
- Se ha creado un nuevo modelo `Settings` en MongoDB.
- Se utiliza el patrón "Singleton Document" (asegurado mediante `isSingleton: { type: Boolean, default: true, unique: true }`) para garantizar que exista un único registro maestro de configuración en toda la base de datos.

### 2.2. Endpoints API (`server.ts`)
- `GET /api/settings`: Devuelve la configuración actual. Si no existe, la crea vacía por defecto.
- `PUT /api/settings`: Endpoint protegido por el middleware `requireAdmin` que permite sobrescribir los datos del centro.

### 2.3. Inyección en el LLM (RAG Dinámico)
- En el endpoint `POST /api/projects/generate`, antes de lanzar el prompt a Gemini, se hace una consulta a `Settings`.
- Si el centro ha configurado su información, se inyecta un bloque titulado `CONTEXTO ESPECÍFICO DEL CENTRO EDUCATIVO` dentro de la variable `baseInstruction`.
- Se añade un prompt de sistema imperativo para forzar a Gemini a usar este contexto en el diseño de las actividades (ej: usar lugares de la ciudad, adaptarse al contexto socioeconómico rural/urbano).

### 2.4. Interfaz de Usuario (Angular)
- Se han añadido los métodos `getSettings` y `updateSettings` al servicio `pai.service.ts`.
- En el panel de **Administración** (`app.html`), se ha diseñado un nuevo bloque de "Configuración del Centro Educativo" con un formulario para rellenar:
  - Nombre del Centro.
  - Ciudad / Localidad.
  - Contexto Socioeconómico (textarea).
- Este formulario se carga automáticamente al cambiar a la vista `admin` gracias a la actualización de la función `switchView()` en `app.ts`.

## 3. Archivos Modificados
- `backend/src/server.ts` (Modelos, Endpoints y RAG)
- `frontend/src/app/services/pai.service.ts` (Cliente HTTP)
- `frontend/src/app/app.ts` (Lógica de estado y llamadas API)
- `frontend/src/app/app.html` (Vista del Panel Admin)
