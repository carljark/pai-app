# Tarea 171: Mostrar el error de generación en el histórico

## Propósito
En el histórico (archivo) los proyectos con estado `error` no mostraban el motivo del fallo, aunque el modal de notificaciones sí lo mostraba.

## Causa
- El backend (`GET /api/projects`) devuelve el documento completo del proyecto, incluido `errorDetail`, que guarda `saveProjectError` en `queue.service.ts`.
- En el frontend, `fromProjectDto` (`features/projects/mappers/projects.mapper.ts`) solo copiaba los campos básicos y **descartaba** `error`, `errorDetail`, `generationTimeMs`, `aiProvider`, `usedAiProvider` y `usedModel`.
- La tarjeta del histórico (`history-project-card`) muestra `project().errorDetail || project().error`, pero siempre le llegaba vacío.
- Las notificaciones no tenían el problema porque leen la colección `notifications`, que copia el `errorDetail` en su propio documento.

## Arquitectura y flujo
`ProjectDto` declara esos campos como opcionales y `fromProjectDto` los traslada al modelo de dominio `Project`, que ya los tenía tipados. Ninguna plantilla cambia.

Efectos:
- **Histórico**: se muestra "⚠️ Error: …" en los proyectos fallidos.
- **Mi área personal**: aparecen el error, el tiempo de generación y la etiqueta del proveedor de IA (primario/secundario).
- **Botón "Ver error"** (`AppFacade.viewPastProject`): el modal muestra el detalle real en lugar de "Error desconocido".

## Archivos modificados
1. `frontend/src/app/features/projects/mappers/projects.mapper.ts`: campos opcionales en `ProjectDto` y su mapeo en `fromProjectDto`.
2. `frontend/src/app/features/projects/mappers/projects.mapper.spec.ts`: test que comprueba que se conservan el error y los metadatos de IA.

## Decisiones técnicas
- Se copian los valores tal cual, sin lógica condicional nueva, para no añadir ramas en `features/projects/**`, que exige un 90 % de cobertura por archivo.
- `aiProvider`/`usedAiProvider` se tipan como `AIProvider` en el DTO porque el backend solo guarda `gemini` u `openrouter`.

## Verificación
- `npx ngc -p tsconfig.app.json --noEmit`, `npx tsc -p tsconfig.spec.json --noEmit` y ESLint, sin errores.
- Pendiente (usuario): `cd frontend && npm test` y comprobar en el histórico un proyecto con estado `error`.
