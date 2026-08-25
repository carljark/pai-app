# Refactorización MVC, Tests Unitarios y Correcciones Curriculares

## Propósito
Esta tarea engloba una reestructuración profunda del backend de la aplicación para mejorar su mantenibilidad, la implementación de una batería de pruebas unitarias como red de seguridad, y la aplicación de correcciones curriculares críticas solicitadas por la creadora del proyecto (Eva Peralta) a través de documentos normativos y hojas de Excel. Adicionalmente, se integraron masivamente los proyectos del INTEF para potenciar el "cerebro" de la IA.

## Arquitectura y Flujo

1. **Refactorización a Arquitectura MVC:**
   - El antiguo archivo monolítico `server.ts` (que rozaba las 700 líneas) fue completamente desmantelado.
   - Se ha adoptado un patrón Modelo-Vista-Controlador (MVC) y diseño orientado al dominio.
   - **Flujo actual:** `server.ts` (solo montado de middlewares) -> `routes/` (enrutadores de Express) -> `controllers/` (lógica de negocio HTTP) -> `services/` (lógica pesada, como IA) -> `models/` (esquemas de Mongoose).
   - Se han respetado límites estrictos de líneas por archivo para garantizar máxima legibilidad humana (archivos de ~50-150 líneas).

2. **Testing Automático con Vitest:**
   - Se ha implementado `vitest` junto con `supertest` y `mongodb-memory-server` para probar la API sin tocar la base de datos real.
   - Se han creado suites de tests en `backend/src/tests/` cubriendo los flujos principales (Auth, Admin, Settings, Proyectos y Archivos DOCX).
   - Los tests actúan como red de seguridad (coverage > 75%) que impidió que rutas mal declaradas rompieran la aplicación durante el refactor.

3. **Inyección de Resultados de Aprendizaje (RAs):**
   - Se ha creado un script (`extract_excel_ras.ts`) que parseó directamente el documento Excel normativo (`FULL AUTOAVALUACIÓ RA_CE_GB .xlsx`).
   - Una nueva migración (`03_sync_ras_excel.ts`) borró la base de datos de RAs anterior y la reconstruyó con el orden, texto e idioma exactos del Excel oficial, incorporando además las asignaturas separadas de "Ciencias aplicadas I", "Ciencias aplicadas II" e "Itinerari per l'ocupabilitat".
   
4. **Endurecimiento del Prompt de IA:**
   - Se ha inyectado una "REGLA CRÍTICA INQUEBRANTABLE" en el controlador de la IA (`project.controller.ts`), obligando a Gemini a contemplar siempre los criterios de evaluación de todos y cada uno de los RAs seleccionados por el usuario, sin obviar ninguno.

5. **Mejoras UX/UI en el Frontend:**
   - Se ha eliminado la agrupación forzosa de asignaturas ("I y II") en el desplegable de Angular.
   - Se ha añadido interpolación reactiva al título del encabezado para mostrar "Plataforma de projectes interdisciplinars" cuando se selecciona el idioma catalán.
   - Se ha insertado CSS global para renderizar las tablas de Markdown con bordes claros y filas sombreadas, mejorando drásticamente la legibilidad del apartado "Integración Curricular".

## Archivos Modificados/Creados

**Backend (Refactor y Tests):**
- `backend/src/server.ts` (Refactorizado)
- `backend/src/models/*` (User, Project, Settings, RA, CE)
- `backend/src/middlewares/*` (auth, upload)
- `backend/src/controllers/*` (auth, admin, project, settings, files, docx, curriculum)
- `backend/src/routes/*` (auth, admin, project, settings, curriculum)
- `backend/src/services/ai.service.ts`
- `backend/src/tests/*` (testSetup, testUtils, *.test.ts)
- `backend/vitest.config.ts`

**Backend (Datos y Migraciones):**
- `backend/scripts/extract_excel_ras.ts` (Nuevo)
- `backend/scripts/prepare_for_web.ts` (Nuevo)
- `backend/src/migrations/03_sync_ras_excel.ts` (Nuevo)
- `backend/src/data/intef_examples.json` (Poblado masivamente con 26 proyectos vía web)

**Frontend:**
- `frontend/src/app/app.ts` (Lógica de agrupación de RAs eliminada)
- `frontend/src/app/app.html` (Título bilingüe)
- `frontend/src/styles.scss` (Bordes de tablas)

## Detalles Técnicos y Decisiones
- **Bypass de Cuota de API:** Para superar la cuota gratuita de peticiones diarias a la API de Gemini (20 req/día), se desarrolló un script que extraía y convertía a texto plano los paquetes SCORM, permitiendo al administrador introducir los prompts manualmente en la interfaz web de Gemini y pegar el JSON resultante en `intef_examples.json`.
- **Desvinculación del Runner de Migraciones:** Durante el refactor se reintegró el `runMigrations()` en el inicio del servidor en modo producción para asegurar que al desplegar en AWS, la nueva tabla de RAs se reconstruyese automáticamente.
- **Mocking en Vitest:** Para poder testear el endpoint de generación de proyectos sin gastar cuota real de Gemini y sin demoras, se empleó `vi.mock('@google/genai')` a nivel superior en los tests correspondientes.
