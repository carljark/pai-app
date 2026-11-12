# Plan 256: Servidor MCP para usar Plappin desde Claude o Gemini

> **Fecha:** 12 de noviembre de 2026
> **Estado:** Aprobado
> **Partes afectadas:** backend / frontend / despliegue

---

## 1. Objetivo
Exponer Plappin como **servidor MCP** (Model Context Protocol) remoto en `https://plappin.org/api/mcp`, para que un docente conecte Claude (Claude Code, Claude Desktop) o Gemini CLI con su cuenta. Desde allí podrá consultar el currículo y los mapas, y listar, leer, generar, revisar, traducir, clonar y editar sus proyectos. Lo hará con las mismas reglas de permisos que en la web. Si la cuenta es de administrador, aparecen además las herramientas de administración (usuarios, permisos, solicitudes, actividad, ajustes y exportación).

## 2. Escenarios
- **Escenario: crear un token de conexión**
  - **Dado** un docente aprobado en «Mi perfil → Conectar con IA»
  - **Cuando** crea un token con nombre «Claude Code portátil»
  - **Entonces** ve el token **una sola vez** (`plp_…`) con instrucciones copiables para Claude Code, Claude Desktop y Gemini CLI; en Mongo solo queda su hash SHA-256 y el prefijo.
- **Escenario: revocar un token**
  - **Dado** un token activo
  - **Cuando** el docente lo revoca
  - **Entonces** la siguiente petición MCP con él responde 401.
- **Escenario: sin token o con token no válido**
  - **Cuando** se llama a `/api/mcp` sin `Authorization: Bearer` o con un token desconocido o revocado
  - **Entonces** responde 401 y no se ejecuta nada.
- **Escenario: herramientas de un docente**
  - **Dado** un token de un usuario `teacher`
  - **Cuando** el cliente pide `tools/list`
  - **Entonces** recibe las herramientas de docente y **ninguna** de administración.
- **Escenario: herramientas de un administrador**
  - **Dado** un token de un usuario `admin`
  - **Cuando** pide `tools/list`
  - **Entonces** recibe también las herramientas `admin_*`.
- **Escenario: el rol se lee en cada petición**
  - **Dado** un administrador que pasa a `teacher`
  - **Cuando** usa su token de antes
  - **Entonces** ya no ve ni puede ejecutar las herramientas `admin_*` (403).
- **Escenario: cuenta pendiente o borrada**
  - **Dado** un usuario `pending`, o uno borrado (sus tokens se borran con él)
  - **Cuando** usa un token
  - **Entonces** responde 403 o 401.
- **Escenario: mismos permisos que la web**
  - **Dado** un docente sin permiso de IA
  - **Cuando** llama a `generate_project`
  - **Entonces** recibe el mismo error 403 que en la web, como resultado de herramienta con `isError: true`.
- **Escenario: proyecto ajeno**
  - **Dado** un docente
  - **Cuando** llama a `get_project` con el id de un proyecto en el que no participa
  - **Entonces** recibe «Proyecto no encontrado».
- **Escenario: editar una sección respetando el turno de edición**
  - **Dado** un proyecto propio sin nadie editando
  - **Cuando** llama a `update_project_content`
  - **Entonces** la herramienta toma el turno, guarda, lo libera, y el cambio queda en el registro de cambios.
  - **Y si** otra persona tiene el turno, devuelve el error de turno ocupado sin escribir.
- **Escenario: generación de un proyecto**
  - **Dado** un docente con permiso de IA
  - **Cuando** llama a `generate_project` con nivel, módulos y RA/CE
  - **Entonces** el proyecto entra en la cola habitual y la herramienta devuelve su id; `get_project_status` informa del avance.
- **Escenario: trazabilidad**
  - **Cuando** se ejecuta cualquier herramienta que escribe
  - **Entonces** `ActivityLog` la registra con `source: 'mcp'` y el nombre del token.

## 3. Alternativas
**Transporte**
1. **Servidor local por stdio** (un paquete `npx plappin-mcp` en el ordenador del docente). No toca el EC2, pero obliga a instalar Node y a mantener un paquete publicado, y no sirve para clientes web.
2. **Servidor remoto Streamable HTTP dentro del backend** en `/api/mcp` (**recomendada**). Una sola URL y nada que instalar. El Nginx del host ya envía `/api` al backend, así que no hace falta tocarlo, y se despliega con el flujo normal.

**Autenticación**
1. **Tokens personales** (`Authorization: Bearer plp_…`), creados y revocados desde el perfil (**recomendada para esta tarea**). Funcionan hoy con Claude Code (`claude mcp add --transport http plappin https://plappin.org/api/mcp --header "Authorization: Bearer plp_…"`), con Claude Desktop y con Gemini CLI (`httpUrl` + `headers` en `settings.json`). Son simples, revocables y no caducan solos.
2. **OAuth 2.1 con PKCE y registro dinámico de clientes.** Es lo que piden los conectores personalizados de **claude.ai web y móvil**, que no permiten poner cabeceras. Es bastante más trabajo (autorización, consentimiento, refresco y metadatos `/.well-known`), así que se propone como **tarea posterior** sobre la misma base: el servidor y las herramientas no cambian, solo se añade otra forma de identificar al usuario.
3. Reutilizar el JWT de sesión de la web: caduca a los 7 días y no se puede revocar uno solo. Descartada.

**Cómo ejecutan las herramientas**
1. **Reimplementar la lógica en cada herramienta.** Duplica permisos y reglas, y se desincronizaría con la web.
2. **Adaptador fino sobre la API REST existente** (**recomendada**). Cada herramienta llama a `http://127.0.0.1:${PORT}/api/…` con un JWT interno de 5 minutos emitido para ese usuario con su rol actual. Así se aplican exactamente los mismos middlewares (`requireApproved`, `requireAiAccess`, `projectEditGuards`, `requireAdmin`) y validaciones, y todo lo nuevo de la web llega al MCP añadiendo solo la definición de la herramienta. El coste es una petición local más, que es despreciable frente a la IA.

**Librería:** `@modelcontextprotocol/sdk` (oficial), en modo **sin estado** (un servidor MCP por petición, filtrado según el rol), porque no hace falta sesión y aguanta reinicios del contenedor.

## 4. Cambios por archivo
| Archivo | Cambio | Capa |
|---|---|---|
| `backend/package.json` | Dependencias `@modelcontextprotocol/sdk` y `zod` | config |
| `backend/src/models/ApiToken.ts` (nuevo) | `userId`, `name`, `tokenHash` (único), `prefix`, `createdAt`, `lastUsedAt`, `revokedAt`; índice por `userId` | domain |
| `backend/src/services/api-token.service.ts` (nuevo) | Crear (máx. 5 activos por usuario), listar, revocar y resolver token → usuario actual (rol leído de `User`) | application |
| `backend/src/controllers/api-token.controller.ts` (nuevo) + `routes/user.routes.ts` | `GET/POST /api/users/me/tokens`, `DELETE /api/users/me/tokens/:id` (requieren cuenta aprobada) | presentation |
| `backend/src/controllers/admin.controller.ts` | Al borrar un usuario, borrar también sus tokens | application |
| `backend/src/mcp/mcp-auth.middleware.ts` (nuevo) | Bearer → usuario o 401/403; actualiza `lastUsedAt` como mucho una vez por minuto | presentation |
| `backend/src/mcp/internal-api.client.ts` (nuevo) | Emite el JWT interno y hace la petición a la API local; convierte errores HTTP en resultados `isError` | infrastructure |
| `backend/src/mcp/tools/curriculum.tools.ts` (nuevo) | `list_levels`, `list_ras`, `list_ces`, `get_filter_index`, `get_intermodular_map`, `get_eso_affinities`, `list_ai_models`, `get_fp_offer` | presentation |
| `backend/src/mcp/tools/project.tools.ts` (nuevo) | `list_projects`, `get_project` (markdown), `get_project_status`, `generate_project`, `retry_project`, `rename_project`, `update_project_content` (turno → guardar → liberar), `translate_project`, `clone_project`, `delete_project`, `list_project_changes`, `add_collaborator`, `remove_collaborator`, `review_project` / `get_project_review` (si la tarea 255 ya está integrada) | presentation |
| `backend/src/mcp/tools/user.tools.ts` (nuevo) | `whoami`, `find_users` (directorio, para colaboradores), `create_request` / `list_my_requests` (solicitudes de centro), `send_feedback` | presentation |
| `backend/src/mcp/tools/admin.tools.ts` (nuevo) | `admin_list_users`, `admin_update_user` (rol y permiso de IA), `admin_delete_user`, `admin_get_logs`, `admin_get_analytics`, `admin_list_requests`, `admin_update_request`, `admin_list_feedback`, `admin_update_feedback`, `admin_get_settings`, `admin_update_settings`, `admin_list_exportable_projects` | presentation |
| `backend/src/mcp/server.ts` (nuevo) | `buildMcpServer(user)` registra las herramientas según el rol, con anotaciones `readOnlyHint` / `destructiveHint`, descripciones en castellano y entradas validadas con zod | presentation |
| `backend/src/routes/mcp.routes.ts` (nuevo) + `server.ts` | `POST /api/mcp` (Streamable HTTP, sin estado); `GET`/`DELETE` → 405. Se monta **antes** de `app.use('/api', authMiddleware)` con su propio middleware | config |
| `backend/src/models/ActivityLog.ts` | Campo opcional `source` (`web`/`mcp`) y `tokenName` | domain |
| `backend/src/tests/mcp-*.test.ts` (nuevos) | Escenarios de §2 con el cliente MCP del SDK contra la app escuchando en un puerto efímero | test |
| `frontend/src/app/features/personal/components/api-tokens/` (nuevo) | Panel BEM `.api-tokens`: crear, mostrar una vez y copiar, listar (nombre, prefijo, último uso) y revocar con confirmación, más pestañas de instrucciones para Claude Code, Claude Desktop y Gemini CLI | presentation |
| `frontend/src/app/features/personal/services/api-tokens.service.ts` (nuevo) | Llamadas HTTP y signals | application |
| `frontend/src/app/services/translations.es.ts` / `translations.ca.ts` | Textos del panel con paridad ES/CA | presentation |
| `documentation/servidor_mcp.md` (nuevo) | Arquitectura, catálogo de herramientas, seguridad, configuración de cada cliente y siguiente paso (OAuth) | docs |

## 5. Tareas
- [ ] Crear la rama `feature/256_servidor_mcp`.
- [ ] Modelo, servicio, rutas y tests de los tokens personales.
- [ ] Middleware MCP, cliente interno y ruta `/api/mcp` con una herramienta (`whoami`) y su test de extremo a extremo.
- [ ] Herramientas de currículo, proyectos y usuario, con tests de permisos (docente, sin IA, proyecto ajeno, turno de edición).
- [ ] Herramientas de administración y tests de visibilidad y de bajada de rol.
- [ ] `ActivityLog` con origen MCP.
- [ ] Panel «Conectar con IA» en el perfil, con traducciones ES/CA y specs.
- [ ] Documentación, lint y typecheck, suites completas y registro de la tarea 256.
- [ ] Commit, push, CI en verde, integración en `main` y seguimiento del despliegue.
- [ ] En producción: conectar Claude Code con un token de prueba y comprobar `whoami`, `list_projects` y `get_project`, y que un token de docente no ve herramientas `admin_*`.

## 6. Riesgos y verificación prevista
- **Seguridad:** un token da acceso a la cuenta entera, así que se guarda solo como hash, se puede revocar y se muestra una vez. El rol se consulta en cada petición, nunca se guarda en el token. Las herramientas `admin_*` se comprueban dos veces: no se registran para no administradores y `requireAdmin` las vuelve a validar. Las herramientas que borran llevan `destructiveHint` para que el cliente pida confirmación.
- **Inyección de instrucciones:** el contenido de los proyectos vuelve al asistente como datos; las descripciones de las herramientas lo advierten. No hay herramientas que ejecuten código ni accedan a archivos del servidor.
- **Coste de IA:** `generate_project`, `translate_project` y `review_project` pasan por la cola y los permisos de siempre (`canUseAi`), sin atajos.
- **Tamaño de las respuestas:** `get_project` devuelve el markdown (de 35.000 a 85.000 caracteres) con un parámetro opcional `section` para pedir solo una parte; los listados van paginados.
- **TypeScript 7 y SDK:** comprobar que `@modelcontextprotocol/sdk` y `zod` tipan bien con `exactOptionalPropertyTypes` y `verbatimModuleSyntax`; si falla algo, se aísla en `mcp/`.
- **Nginx del host y timeouts:** `/api` ya llega al backend. Se verifica que no se almacene en búfer el `text/event-stream` de las respuestas largas (si hiciera falta, la herramienta devuelve el id y se consulta el estado, sin esperar).
- **Sin migraciones de datos:** solo una colección nueva (`apitokens`).
- **Límites de código:** un archivo de herramientas por área, para no pasar de 200 líneas; helpers de menos de 25 líneas por función.
- **Cobertura:** 90 % en backend; en el frontend, por archivo y en plantillas.
- **Verificación:** `cd backend && npm run typecheck && npm test`; `cd frontend && npx eslint <archivos> && npm test`; en local, `claude mcp add --transport http plappin http://localhost:3000/api/mcp --header "Authorization: Bearer …"` y una sesión real de prueba con un docente y con un administrador.
