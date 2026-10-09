# Plan 218: Solicitudes de centros y sus ciclos

> **Fecha:** 9 de octubre de 2026
> **Estado:** Implementado (tarea 218)
> **Partes afectadas:** backend / frontend / datos / skills de Claude Code / despliegue

---

## 1. Objetivo
Hoy, para añadir un centro, hay que consultar a mano su oferta (`documentation/ciclos_ies_cap_de_llevant.md`) e incorporar los ciclos que falten con la skill `agregar-ciclo-educativo`. La idea es que un docente pida su centro desde la aplicación y que la petición quede registrada:
- La aplicación le dice al momento qué ciclos ya están disponibles y cuáles faltan.
- El administrador ve y gestiona las peticiones.
- En Claude Code, una skill `procesar-solicitudes` lee las pendientes e incorpora los ciclos que faltan con el flujo de siempre: rama, tests, commit, push y despliegue.

Los ciclos son globales: un ciclo que se incorpora para un centro sirve para todos. Este plan **no** introduce el centro como entidad del modelo de usuarios (ver §3).

## 2. Escenarios
- **Escenario: el docente ve la oferta de FP de Baleares y qué ciclos ya están disponibles**
  - **Dado** un docente autenticado
  - **Cuando** abre «Solicitar centro»
  - **Entonces** ve los ciclos de la oferta, con buscador y filtro por grado, y los que ya están en el catálogo aparecen marcados como «Disponible»
- **Escenario: el docente envía una solicitud**
  - **Dado** un docente que rellena el nombre del centro y el municipio y elige varios ciclos
  - **Cuando** envía el formulario
  - **Entonces** se guarda una solicitud `pendiente`, cada ciclo queda como `disponible` o `pendiente` según el catálogo, y el docente la ve en «Mis solicitudes»
- **Escenario: el docente pide un ciclo que no está en la oferta**
  - **Dado** un ciclo que no aparece en la lista
  - **Cuando** lo escribe en «Otros ciclos»
  - **Entonces** se guarda como ciclo `pendiente`, sin código, para que lo revise el administrador
- **Escenario: validación del formulario**
  - **Dado** una solicitud sin nombre de centro o sin ningún ciclo
  - **Cuando** se envía
  - **Entonces** el backend responde 400 y no guarda nada
- **Escenario: solo el administrador gestiona las solicitudes**
  - **Dado** un docente que no es administrador
  - **Cuando** llama a `GET /api/admin/solicitudes` o `PATCH /api/admin/solicitudes/:id`
  - **Entonces** recibe 403
- **Escenario: el administrador cambia el estado y el docente recibe un aviso**
  - **Dado** una solicitud pendiente
  - **Cuando** el administrador la marca `completada` (o un ciclo como `incorporado`, con el número de tarea)
  - **Entonces** se guarda el cambio y el docente recibe una notificación de tipo `INFO` en castellano o catalán
- **Escenario: el estado de los ciclos se recalcula con el catálogo**
  - **Dado** un ciclo pedido como `pendiente` que después se incorpora (aparece en `niveles.ts` con su `codigoCaib`)
  - **Cuando** se consulta la solicitud
  - **Entonces** el ciclo aparece como `disponible`
- **Escenario: la skill lista lo pendiente sin credenciales**
  - **Dado** solicitudes pendientes en producción
  - **Cuando** Claude Code ejecuta `scripts/solicitudes-pendientes.sh`
  - **Entonces** obtiene en JSON los ciclos que faltan, agrupados y sin duplicados entre solicitudes. La lectura se hace por SSH, sin escribir nada

## 3. Alternativas
1. **Solo la skill, sin cambios en la aplicación.** El usuario pasa a Claude Code el nombre y la web del centro, y la skill consulta la oferta del centro y crea un documento como el del IES Cap de Llevant.
   - Ventaja: coste mínimo.
   - Inconveniente: el docente no puede pedir nada, nadie ve el estado y todo depende de que alguien se acuerde.
2. **Formulario y cola de solicitudes en la aplicación, más una skill que lanza el usuario (recomendada).**
   - Deja rastro y estado, y avisa al docente.
   - La parte cara, incorporar ciclos, sigue supervisada: cada ciclo exige decisiones (erratas del BOE, nombres que no coinciden entre la CAIB y el BOE, traducción cuando no hay texto oficial) y un despliegue.
3. **Lo mismo, pero con la skill programada (rutina o cron) que procesa y despliega sola.**
   - Más automática.
   - Desplegaría sin revisión humana traducciones propias y erratas, y podría lanzar varias tareas grandes en paralelo.
   - Se puede añadir más adelante como una rutina que solo **avisa** de que hay solicitudes pendientes.
4. **Entidad `Centro` asignada a cada usuario**, con filtrado del catálogo por centro.
   - Útil si cada docente solo debe ver los ciclos de su centro, pero cambia el registro, el perfil y todas las vistas que filtran por nivel.
   - Queda fuera de este plan. La solicitud guarda el centro como texto y podría migrarse después a esa entidad.

**Oferta de ciclos.** Hace falta una lista de los ciclos que se pueden pedir, con su código de la CAIB (p. ej. `SSC33`). Se guarda como JSON en el backend (`backend/src/data/oferta-fp-ib.json`) y se genera una vez con un script temporal a partir de las páginas de la CAIB de grado básico, medio y superior. Los nombres en castellano salen de TodoFP; si alguno no se encuentra, lo traduce el agente `traductor-es-ca`. Así se respeta la paridad ES/CA. La alternativa de escribir los ciclos en texto libre es más barata, pero no permite saber qué ciclos ya están disponibles ni evita duplicados. Se mantiene solo como campo «Otros ciclos».

## 4. Cambios por archivo
| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/data/oferta-fp-ib.json` (nuevo) | Oferta de FP de Baleares: `codigo`, `etapa` (FPB/CFGM/CFGS), `familia`, `nombre_es`, `nombre_ca` | datos |
| `backend/src/data/niveles.ts` | Campo opcional `codigoCaib` en `NivelEducativo` y valor en los ciclos de FP ya incorporados (p. ej. `CFGS_INTEGRACION_SOCIAL` → `SSC33`) | domain |
| `backend/src/models/Solicitud.ts` (nuevo) | `userId`, `userName`, `userEmail`, `centro { nombre, municipio, web }`, `ciclos [{ codigo?, nombre, estado: 'disponible' \| 'pendiente' \| 'incorporado' \| 'descartado', tarea? }]`, `comentario`, `status: 'pendiente' \| 'en_curso' \| 'completada' \| 'descartada'`, `adminNotes`, timestamps | domain |
| `backend/src/services/solicitudes.service.ts` (nuevo) | Oferta marcada con el catálogo (`disponible: tipoNivel \| null`), alta con validación, recálculo del estado de los ciclos y notificación al docente | application |
| `backend/src/controllers/solicitudes.controller.ts` (nuevo) | `GET /api/solicitudes/oferta`, `POST /api/solicitudes`, `GET /api/solicitudes/mias` | presentation |
| `backend/src/controllers/admin.controller.ts` + `routes/admin.routes.ts` | `GET /api/admin/solicitudes` y `PATCH /api/admin/solicitudes/:id`, detrás de `requireAdmin`. Si el controlador pasa de unas 150 líneas, irán en un `admin-solicitudes.controller.ts` propio | presentation |
| `backend/src/routes/solicitudes.routes.ts` (nuevo) + `server.ts` | Montaje en `/api/solicitudes`, detrás de `authMiddleware` | config |
| `backend/scripts/solicitudes-pendientes.ts` (nuevo) | Imprime en JSON las solicitudes pendientes y los ciclos que faltan, agrupados por código. Solo lectura | infrastructure |
| `scripts/solicitudes-pendientes.sh` (nuevo) | Ejecuta el script anterior en `pai_backend_prod` por SSH (`docker exec … npx tsx scripts/solicitudes-pendientes.ts`) | infrastructure |
| `backend/src/tests/solicitudes.test.ts` (nuevo) | Escenarios de §2 en el backend (supertest y mongodb-memory-server) y paridad ES/CA de la oferta | tests |
| `frontend/src/app/features/solicitudes/` (nuevo) | `SolicitudesService` (signals) y los componentes `solicitud-form` (centro, buscador, filtro por grado y «Otros ciclos») y `mis-solicitudes` (lista con estados). Plantillas y SCSS propios, BEM y menos de 200 líneas cada uno | presentation |
| `frontend/src/app/services/view-route.ts`, `layout/components/sidebar/sidebar.component.html`, `app.html` | Nueva vista `solicitudes` y su entrada en la barra lateral | presentation |
| `frontend/src/app/features/admin/components/admin-solicitudes/` (nuevo) | Tabla de solicitudes con cambio de estado por solicitud y por ciclo, número de tarea y notas. Se inserta en `admin-dashboard.component.html` como `<app-projects-transfer />`, sin hacer crecer ese archivo de 804 líneas | presentation |
| `frontend/src/app/services/translations.es.ts` / `translations.ca.ts` | Textos de las tres vistas en los dos idiomas | presentation |
| `.claude/skills/procesar-solicitudes/SKILL.md` (nuevo) | Flujo de la skill (ver §5) | config |
| `documentation/solicitudes_de_centros.md` (nuevo) | Modelo, endpoints, estados, cómo regenerar la oferta y cómo se usa la skill | docs |
| `AGENTS.md` §8 y `CLAUDE.md` | Una línea que remite a la skill `procesar-solicitudes` | docs |

## 5. Tareas
- [ ] Crear la rama `feature/218_solicitudes_de_centros` desde la rama actual.
- [ ] Generar `oferta-fp-ib.json` con un script temporal (CAIB y TodoFP), revisar la paridad con `traductor-es-ca` y borrar el script.
- [ ] Añadir `codigoCaib` a `niveles.ts` y a los 10 niveles de FP ya incorporados, con un test que compruebe que cada código existe en la oferta.
- [ ] Modelo, servicio, controladores y rutas del backend. Ninguna función de más de 25 líneas.
- [ ] Tests del backend para todos los escenarios de §2.
- [ ] Script de solo lectura `solicitudes-pendientes` y su envoltorio por SSH.
- [ ] Frontend: servicio, formulario, «Mis solicitudes», vista de administración, barra lateral y traducciones. Specs que hagan clic en los botones reales del DOM, para cubrir las funciones de las plantillas.
- [ ] Skill `procesar-solicitudes`:
  1. Ejecuta `scripts/solicitudes-pendientes.sh`.
  2. Presenta los ciclos que faltan y pregunta cuáles abordar.
  3. Para cada ciclo, sigue `agregar-ciclo-educativo` en su propia rama y tarea, sin mapa.
  4. Al terminar, recuerda al administrador que marque los ciclos como `incorporado` con el número de tarea. La skill no escribe en producción (AGENTS.md §7).
- [ ] Documentación, lint, typecheck, `npm test` en backend y frontend, commit, push y despliegue.
- [ ] Registrar la tarea con `/registrar-tarea`.

## 6. Riesgos y verificación prevista
- **Oferta de la CAIB:** el formato de las páginas puede cambiar y la web devuelve 502 a menudo. El JSON se genera una vez y se versiona, y se documenta cómo regenerarlo. No se consulta la CAIB en tiempo de ejecución.
- **Paridad ES/CA de la oferta:** nunca catalán en `nombre_es`. El test de paridad lo comprueba.
- **Escrituras en producción:** la skill solo lee. Los cambios de estado los hace el administrador desde la aplicación.
- **Abuso del formulario:** solo docentes autenticados, con un máximo de solicitudes pendientes por usuario (p. ej. 5) y longitudes acotadas.
- **Datos:** la colección es nueva y no requiere migración de datos existentes. Mongoose crea la colección; no hacen falta índices especiales.
- **Frontend:**
  - Cobertura del 90 % por archivo y del 80 % de funciones en las plantillas.
  - Zoneless: el estado en signals y specs con `await fixture.whenStable()`.
  - ESLint a 0 hallazgos.
  - Máximo de 200 líneas por componente; por eso la vista de administración va en un componente aparte.
- **Verificación:**
  - `cd backend && npm run typecheck && npm test` y `cd frontend && npm test`.
  - Prueba manual con Docker (`docker compose up -d --build`): enviar una solicitud como docente, gestionarla como administrador y ejecutar `scripts/solicitudes-pendientes.sh` contra producción tras el despliegue.
