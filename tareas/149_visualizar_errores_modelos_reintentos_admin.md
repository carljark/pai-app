# Tarea 149: Visualizar errores de modelos en los reintentos de generación

## Propósito

Mostrar en el Registro de Actividad del panel de administración los errores de cada modelo que haya fallado durante una generación, incluso cuando un reintento posterior haya generado el proyecto correctamente.

## Arquitectura y flujo

1. `ai.service.ts` recopila los intentos de modelos de Gemini y de proveedores alternativos en `cascadeLog`.
2. La cola persiste el `cascadeLog` en los detalles del evento `GENERATE_PROJECT` y, en caso de fallo total, también en el evento `ERROR_GENERATE_PROJECT`.
3. El panel administrativo presenta solo las entradas fallidas junto al modelo; los intentos exitosos no se muestran como errores.

## Archivos modificados

- `backend/src/services/ai.service.ts`: adjunta al error final la cascada completa de modelos probados por Gemini, incluidos errores y timeouts.
- `backend/src/services/queue.service.ts`: persiste el array de intentos en los detalles de los eventos de generación fallida; las generaciones exitosas ya lo guardaban.
- `frontend/src/app/features/admin/components/admin-dashboard/admin-dashboard.component.ts`: presenta los errores de reintento a partir de `details.cascadeLog` en la tarjeta de actividad.
- `backend/src/tests/ai.service.test.ts`: verifica que un fallo exhaustivo de Gemini conserva los errores y los nombres de todos los modelos intentados.
- `backend/src/tests/queue.service.test.ts`: verifica la persistencia del historial de intentos en una generación con fallback exitoso.
- `frontend/src/app/features/admin/components/admin-dashboard/admin-dashboard.component.spec.ts`: verifica la visualización de errores de reintento y que el intento final exitoso no se presenta como error.

## Decisiones técnicas

- Se reutiliza el formato existente de `cascadeLog` (`modelo: resultado`) para evitar cambios de esquema o migraciones.
- Se conserva el registro del intento exitoso en los datos persistidos por trazabilidad, pero la interfaz filtra las entradas terminadas en `: OK`.
- Los eventos antiguos sin `cascadeLog` continúan siendo compatibles; no se muestra la sección de errores de reintento si no hay datos.
- No se ejecutaron tests ni builds, de acuerdo con las instrucciones del repositorio.
