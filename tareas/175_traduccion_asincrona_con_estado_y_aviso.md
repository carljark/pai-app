# Tarea 175: Traducción asíncrona con estado por proyecto y aviso al terminar

## Propósito
Corregir dos puntos débiles de la traducción de la tarea 172:
1. El estado "Traduciendo…" era global en el frontend: al abrir otro proyecto durante una traducción también aparecía como "traduciendo" y no se podía traducir.
2. Tras recargar la página se perdía el estado y se podía lanzar una segunda traducción del mismo proyecto, con el coste doble de IA.

Además se avisa con un toast al terminar, aunque el usuario esté en otra pantalla.

## Arquitectura y flujo
- **Backend**
  - `TranslationSchema` añade `status` (`traduciendo` | `completada` | `error`), `startedAt` y `error`.
  - `translation.controller.ts`:
    - `acquireTranslationLock`: un `updateOne` condicional y atómico marca `traduciendo` si no hay otra traducción en curso a ese idioma o si la anterior caducó (`TRANSLATION_LOCK_MS` = 30 min). Si no lo obtiene responde 409.
    - Respuesta **202** con el proyecto en estado `traduciendo`, leído antes de lanzar el trabajo para no competir con él.
    - `runProjectTranslation` traduce en segundo plano. Al terminar guarda `status: 'completada'`; si falla guarda `status: 'error'` y `error`, conservando la traducción anterior.
    - `failInterruptedTranslations` (llamada al arrancar en `server.ts`): marca como fallidas las traducciones interrumpidas por un reinicio o despliegue, que si no quedarían bloqueadas hasta 30 min. Motivo: un intento real se cortó cuando el backend de desarrollo se reinició a mitad de la traducción.
- **Frontend**
  - `project.model.ts`:
    - `TranslationStatus`, `TRANSLATION_LOCK_MS` e `isTranslationInProgress`;
    - `resolveProjectContent` añade `translating` y `translationFailed` (este último incluye el bloqueo abandonado), calculados por proyecto.
  - `ProjectsService.getProject(id)`.
  - `ProjectTranslationFacade`:
    - `isTranslating` y `translationError` pasan a ser `computed` por proyecto;
    - seguimiento por sondeo (4 s) de las traducciones en curso, solo activo mientras haya alguna;
    - un efecto retoma el seguimiento si el proyecto abierto está `traduciendo` (tras recargar);
    - 409 → se sigue la traducción ya en curso;
    - al terminar, toast vía `AppFacade.showToast` y carga de la traducción si se está viendo ese proyecto en ese idioma.
  - `AppFacade.showQueueToast` (privado) pasa a ser `showToast` (público) para reutilizar el toast existente.
  - Textos nuevos ES/CA: `translationCompletedToast`, `translationFailedToast` y el mensaje de progreso ampliado.

## Archivos modificados
- Backend: `models/Project.ts`, `controllers/translation.controller.ts`, `tests/translation.test.ts`.
- Frontend: `project.model.ts` (+ spec), `projects.service.ts`, `project-translation.facade.ts` (+ spec reescrito), `app.facade.ts`, `translations.{es,ca}.ts`.
- Documentación: `documentation/traduccion_proyectos.md`.

## Decisiones técnicas
- **Bloqueo en base de datos con caducidad**: protege frente a doble clic, varias pestañas y varios usuarios, y no queda bloqueado para siempre si el servidor se reinicia a mitad.
- **Sondeo frente a SSE**: más simple, sin estado de conexión y suficiente para tareas de minutos.
- La interfaz del banner no cambia (`isTranslating`, `translationError`), así que su spec sigue siendo válido.

## Verificación
- `ngc`, `tsc` de specs y ESLint del frontend, sin errores. Los módulos del backend cargan con `tsx`.
- Pendiente (usuario):
  - `cd backend && npm run test:cov` y `cd frontend && npm test`;
  - en la aplicación: lanzar una traducción, navegar a otra pantalla y comprobar el toast; recargar durante una traducción y comprobar que el aviso "Traduciendo…" se mantiene y no se puede lanzar otra.
