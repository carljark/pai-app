# Tarea 94: Mejora en la Visibilidad y Persistencia del Tiempo de Generación de IA

## Propósito
El usuario detectó que en el Panel de Administración (logs de actividad) y en el Historial de Proyectos no siempre se mostraba el "Tiempo de generación de la IA" (`generationTimeMs`), especialmente al utilizar el motor Secundario (OpenRouter). 

Tras investigar el ciclo de vida de los proyectos y las llamadas a la API:
1. **Pérdida en Logs Posteriores**: Al generarse un proyecto se creaba un log `GENERATE_PROJECT` con `details.generationTimeMs`. No obstante, cualquier acción subsecuente sobre el proyecto (como la transición automática a `borrador` al abrir el taller o actualizaciones manuales) generaba logs `UPDATE_PROJECT` o `UPDATE_STATUS` cuyos `details` no replicaban `generationTimeMs`. Dado que la vista de administración mostraba únicamente el log más reciente y solo consultaba `log.details?.generationTimeMs`, la etiqueta de tiempo desaparecía.
2. **Falta de Población de `generationTimeMs`**: El endpoint `GET /api/admin/logs` (`admin.controller.ts`) poblaba `projectId` pero omitía el campo `generationTimeMs` en la proyección Mongoose (`.populate('projectId', 'title usedModel usedAiProvider')`).
3. **Ausencia en Historial**: Las tarjetas del Historial de Proyectos no mostraban la duración de generación, a pesar de que el modelo `Project` ya persistía dicho valor en base de datos.
4. **Resiliencia en Motor Secundario**: En llamadas a OpenRouter con latencias prolongadas, rate limits o reintentos, era fundamental garantizar que una vez persistido el tiempo en el documento `Project`, este dato se propagara y fuera visible en todos los registros relacionados.

El objetivo fue asegurar la visibilidad consistente del tiempo de generación tanto en los logs de actividad del Panel de Administración como en las tarjetas del Historial de Proyectos.

---

## Arquitectura y Flujo

```
[ Worker / IA Generator ]
           │  Calcula durationMs y guarda en Project.generationTimeMs
           ▼
[ MongoDB: Project ] ◄─────────────────────────┐
           │                                   │
           │ (Enlaza projectId)                │ (Fallback)
           ▼                                   │
[ MongoDB: ActivityLog ]                       │
           │                                   │
           ▼                                   │
[ Backend: admin.controller.ts ]               │
   .populate('projectId',                      │
      'title usedModel usedAiProvider          │
       generationTimeMs') ─────────────────────┘
           │
           ▼
[ Frontend: AdminDashboardComponent ]
   getLogGenerationTime(log):
   1. log.details?.generationTimeMs
   2. log.projectId?.generationTimeMs (Fallback)
   3. null
           │
           ▼
[ UI: Historial & Panel Admin ]
   Muestra badge/texto: "⏱️ X.Xs"
```

1. **Persistencia en el Modelo**: El worker de colas (`queue.worker.ts`) mide el tiempo transcurrido desde el inicio de la llamada a la IA hasta la recepción del JSON y lo almacena en `project.generationTimeMs`.
2. **Población en Backend**: Al solicitar los logs en `admin.controller.ts`, Mongoose recupera `generationTimeMs` junto a los metadatos del proyecto (`title`, `usedModel`, `usedAiProvider`).
3. **Resolución en Frontend (Admin Dashboard)**: El método helper `getLogGenerationTime(log)` resuelve prioritariamente el valor en `log.details?.generationTimeMs`, y en caso de no existir (p. ej., logs de edición o guardado posterior), recurre a `log.projectId?.generationTimeMs`.
4. **Visualización en Historial**: En `HistoryViewComponent`, cada tarjeta de proyecto evalúa `@if (project.generationTimeMs)` y renderiza una insignia estilizada con el tiempo en segundos formateado a un decimal (`(project.generationTimeMs / 1000).toFixed(1) + 's'`).

---

## Archivos Modificados

### Backend
- [`backend/src/controllers/admin.controller.ts`](file:///Users/csgj/dev/pai-app/backend/src/controllers/admin.controller.ts):
  - Inclusión de `generationTimeMs` en la lista de campos proyectados por `.populate('projectId', ...)` en `getLogs`.
- [`backend/src/tests/admin.test.ts`](file:///Users/csgj/dev/pai-app/backend/src/tests/admin.test.ts):
  - Añadido caso de prueba para verificar que `generationTimeMs` se puebla correctamente desde la colección de proyectos en la respuesta de logs administrativos.

### Frontend
- [`frontend/src/app/features/admin/components/admin-dashboard/admin-dashboard.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/admin/components/admin-dashboard/admin-dashboard.component.ts):
  - Implementación del método `getLogGenerationTime(log: any): number | null`.
  - Actualización del template `@if (getLogGenerationTime(log))` para mostrar el tiempo formateado independientemente de si el log específico es de generación o de modificación posterior.
- [`frontend/src/app/features/admin/components/admin-dashboard/admin-dashboard.component.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/admin/components/admin-dashboard/admin-dashboard.component.spec.ts):
  - Tests unitarios exhaustivos para `getLogGenerationTime` validando resolución desde `details`, resolución desde `projectId` y casos nulos/vacíos.
- [`frontend/src/app/features/history/components/history-view/history-view.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/history/components/history-view/history-view.component.ts):
  - Incorporación del badge verde suave (`⏱️ X.Xs`) junto al proveedor de IA en la cabecera de cada tarjeta de proyecto en el historial.
- [`frontend/src/app/features/history/components/history-view/history-view.component.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/history/components/history-view/history-view.component.spec.ts):
  - Actualización del test para validar la correcta representación del tiempo de generación en el DOM.

---

## Detalles Técnicos

1. **Patrón Fallback / Graceful Degradation**:
   Al desacoplar el log puntual de los metadatos persistentes de la entidad `Project`, garantizamos que la UI no sufra pérdida de contexto temporal cuando se desencadenan múltiples eventos sobre un mismo recurso.
2. **Formateo y Rendimiento en UI**:
   Tanto en el Dashboard como en el Historial, la transformación milisegundos a segundos (`(ms / 1000).toFixed(1)`) se realiza de forma directa y ligera en la vista, evitando sobrecargar el modelo o requerir pipes pesados innecesarios.
3. **Compatibilidad con Ambos Motores de IA**:
   Tanto el motor Primario (Google Gemini) como el Secundario (OpenRouter) registran el tiempo en `generationTimeMs`. La unificación en la lectura garantiza una experiencia idéntica sin importar el proveedor utilizado.
4. **Mantenimiento de Cobertura de Tests**:
   - Backend: 14 suites, 103 tests (100% éxito), cobertura global >98% statements y >90% branches.
   - Frontend: 28 suites, 333 tests (100% éxito), cobertura global >99% statements, >95% branches y >99% lines.
