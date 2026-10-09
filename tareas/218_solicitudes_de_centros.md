# Tarea 218: Solicitudes de centros y sus ciclos

> **Plan:** [218 — Solicitudes de centros y sus ciclos](../planes/218_plan_solicitudes_de_centros.md)

## Propósito
Hasta ahora, para añadir un centro había que consultar su oferta a mano (como en `documentation/ciclos_ies_cap_de_llevant.md`) e incorporar los ciclos que faltaban. Con esta tarea:
- un docente pide su centro y sus ciclos desde la aplicación, y ve al momento cuáles ya están en Plappin;
- el administrador gestiona las solicitudes, y el docente recibe un aviso cuando cambia el estado de la suya;
- en Claude Code, la skill `procesar-solicitudes` incorpora los ciclos que faltan con el flujo habitual.

## Arquitectura y flujo
- **Oferta de FP de Baleares:**
  - `backend/src/data/oferta-fp-ib.json` recoge 117 ciclos (19 FPB, 38 CFGM y 60 CFGS) con su código de la CAIB, grado, familia y nombres ES/CA.
  - `oferta-fp-ib.ts` la carga y la cruza con el catálogo mediante el nuevo campo `codigoCaib` de `niveles.ts`, que se ha añadido a los 10 ciclos de FP.
- **Backend:**
  - modelo `Solicitud` (colección `solicitudes`), con un estado por solicitud y por ciclo;
  - servicio `solicitudes.service.ts` (validación, límite de 5 solicitudes abiertas, estado recalculado con el catálogo, aviso al docente y `resumenPendientes()`);
  - controlador y rutas: `GET /api/solicitudes/oferta`, `POST /api/solicitudes` y `GET /api/solicitudes/mias` para docentes aprobados; `GET` y `PATCH /api/admin/solicitudes` para administradores.
- **Aviso al docente:** cuando cambia el estado de la solicitud, se crea una `Notification` de tipo `INFO` dirigida al docente (`recipientId`), en el idioma en que la envió. Aparece en su actividad reciente.
- **Lectura desde Claude Code:** `scripts/solicitudes-pendientes.sh` ejecuta por SSH `backend/scripts/solicitudes-pendientes.ts` en el contenedor de producción. Es solo lectura y devuelve en JSON las solicitudes abiertas y los ciclos que faltan, sin duplicados.
- **Frontend:**
  - nueva vista `solicitudes` («Solicitar centro», en la barra lateral), con `solicitud-form`, `oferta-selector` (buscador sin tildes, filtro por grado y marca «Disponible») y `mis-solicitudes`;
  - componente `admin-solicitudes` en el panel de administración, que guarda cada cambio al momento;
  - estado en signals de `SolicitudesService`.
- **Skill** `.claude/skills/procesar-solicitudes/SKILL.md`:
  1. lee lo pendiente;
  2. pregunta al usuario qué ciclos abordar;
  3. incorpora cada ciclo con `agregar-ciclo-educativo` en su propia tarea y rama;
  4. recuerda al administrador que cierre las solicitudes en la aplicación.

## Archivos modificados
1. `backend/src/data/oferta-fp-ib.json` y `oferta-fp-ib.ts` (nuevos): oferta y su cruce con el catálogo.
2. `backend/src/data/niveles.ts`: campo `codigoCaib` y su valor en los ciclos de FP.
3. `backend/src/models/Solicitud.ts`, `services/solicitudes.service.ts`, `controllers/solicitudes.controller.ts` y `routes/solicitudes.routes.ts` (nuevos).
4. `backend/src/routes/admin.routes.ts` y `backend/src/server.ts`: rutas de administración y montaje en `/api/solicitudes`.
5. `backend/scripts/solicitudes-pendientes.ts` y `scripts/solicitudes-pendientes.sh` (nuevos): lectura de lo pendiente.
6. `backend/src/tests/solicitudes.test.ts` (nuevo): 15 tests con los escenarios del plan y la paridad ES/CA de la oferta.
7. `frontend/src/app/features/solicitudes/` (nuevo): modelo, servicio, cuatro componentes y sus specs.
8. `frontend/src/app/features/admin/components/admin-solicitudes/` (nuevo), con su spec; se inserta en `admin-dashboard`.
9. `frontend/src/app/services/view-route.ts`, `app.ts`, `app.html` y `layout/components/sidebar/`: vista nueva y su botón, cubierto en el spec de la barra lateral.
10. `frontend/src/app/services/translations.es.ts` y `translations.ca.ts`: claves `sol*` y `sidebarSolicitudes`.
11. `.claude/skills/procesar-solicitudes/SKILL.md` (nuevo), `documentation/solicitudes_de_centros.md` (nuevo), `AGENTS.md` §8 y `CLAUDE.md`.

## Decisiones técnicas
- **Oferta generada una vez y versionada**, no consultada en tiempo de ejecución, porque la web de la CAIB falla a menudo («Error de Pàgina»).
  - Los códigos y los nombres catalanes salen de las páginas de familias profesionales de la CAIB.
  - Los castellanos salen de TodoFP, emparejados por grado y parecido del nombre y revisados a mano. Hubo que corregir IMA12 («Mantenimiento de Viviendas») y la familia del FME11.
  - La CAIB no tiene versión castellana.
- **Ciclos escritos a mano** («Otros ciclos»): se guardan en un único campo `nombre`, sin traducir, porque es texto libre del docente.
- **Estado recalculado:** el estado guardado no se reescribe. Un ciclo `pendiente` se muestra como `disponible` en cuanto el catálogo tiene su `codigoCaib`, sin que haya que actualizar ninguna solicitud.
- **Idioma del aviso:** `User` no guarda el idioma, así que la solicitud registra el de la interfaz al enviarla.
- **La skill no escribe en producción** (AGENTS.md §7). Los cambios de estado los hace el administrador desde la aplicación.
- **Panel de administración en castellano**, como el resto del panel. Va en un componente propio porque `admin-dashboard.component.html` ya tiene 804 líneas.
- **Enlace bidireccional:** `[(seleccionados)]` con un signal genera en la plantilla una rama que nunca se ejecuta y que bajaba la cobertura de ramas por archivo. Se sustituye por `[seleccionados]` y `(seleccionadosChange)`.
- **Specs en catalán:** restauran el castellano y borran `pai_lang` al acabar. Si no, el idioma quedaba guardado en `localStorage` y hacía fallar los specs de notificaciones.

## Verificación
- `cd backend && npm run typecheck`: 0 errores.
- `cd backend && npm test`: 35 archivos y 414 tests en verde. `npm run test:cov`: 98,79 % de sentencias y 93,9 % de ramas.
- `cd frontend && npx ngc -p tsconfig.app.json --noEmit` y `npx tsc -p tsconfig.spec.json --noEmit`: sin errores.
- `cd frontend && npx eslint` sobre los archivos tocados: sin hallazgos.
- `cd frontend && npm test`: en verde.
  - Lint, y 72 archivos con 854 tests superados (1 omitido).
  - Cobertura: 99,32 % de sentencias; se cumplen los umbrales globales y por archivo.
  - La comprobación zoneless pasa.

## Desviaciones respecto al plan
- La oferta tiene un `.ts` que la carga, además del JSON previsto.
- No ha hecho falta separar un `admin-solicitudes.controller.ts`: las rutas de administración usan el mismo controlador que las de los docentes.
- La vista del docente se divide en cuatro componentes en vez de dos, para respetar el límite de 200 líneas.
- Las rutas de docentes exigen además una cuenta aprobada (`requireApproved`).
