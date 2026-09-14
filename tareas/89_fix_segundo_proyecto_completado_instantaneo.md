# Diseño Técnico - Tarea 89: Fix Segundo Proyecto Completado Instantáneo

## 1. Propósito
Al generar un proyecto después de haber generado otro previamente en la misma sesión, el modal informativo de «¡Proyecto Generado!» aparecía de forma prácticamente instantánea, provocando que el usuario interpretara que el segundo proyecto se había completado de inmediato sin esperar al procesamiento de la Inteligencia Artificial.

El propósito de esta tarea ha sido identificar y erradicar la causa raíz de este comportamiento en la capa reactiva del frontend (gestión de señales, notificaciones persistentes y eventos SSE), garantizando que:
1. El modal de éxito solo se renderice exactamente una vez por cada proyecto generado y completado por la IA.
2. Los eventos duplicados o notificaciones heredadas del proyecto anterior no contaminen ni activen el estado modal en la generación de nuevos proyectos.
3. Se mantenga una cobertura de pruebas unitarias superior al 90% en todas las métricas.

---

## 2. Diagnóstico y Causa Raíz
1. **Persistencia indefinida de `latestNotification`:**
   En `NotificationsFacade`, el signal `latestNotification` almacenaba el último evento SSE mapeado. Tras finalizar el primer proyecto, dicho signal contenía `{ type: 'COMPLETED', message: '...', projectId: '...' }`. Este signal nunca se restablecía a `null`, quedando permanentemente en estado completado.

2. **Doble emisión de eventos SSE desde el backend:**
   En `backend/src/services/queue.service.ts`, la función `notifyProjectSuccess` ejecutaba simultáneamente:
   - `sendToUser(userId, { type: 'PROJECT_COMPLETED', ... })` (mensaje directo a las conexiones del usuario).
   - `await syncProjectNotification(project, { type: 'PROJECT_COMPLETED', ... })`, que internamente ejecutaba `broadcast(...)` a todos los clientes SSE (incluidas las conexiones del mismo usuario).
   Esto provocaba que el frontend recibiera dos eventos `PROJECT_COMPLETED` consecutivos por cada proyecto finalizado.

3. **Ausencia de deduplicación de proyectos completados en `AppFacade`:**
   El `effect()` de `AppFacade` escuchaba reactivamente cambios en `latestNotification()`. Si llegaba un segundo evento o cualquier reactividad afectaba al estado, el efecto programaba con un `setTimeout` de 100ms la apertura del modal con el título `'¡Proyecto Generado!'` y el mensaje de éxito.

4. **Estado residual del modal:**
   Al cerrar el modal con `showInfoModal.set(false)`, no se limpiaban `infoTitle`, `infoMessage` ni `latestNotification`. Al llamar a `generateProject()` para el segundo proyecto, si cualquier notificación o reevaluación se producía, o antes de que el servidor respondiera, los valores residuales podían desencadenar la visualización del modal completado.

---

## 3. Arquitectura y Flujo de la Solución

```
[Usuario] ──(Genera Proyecto 1)──> [ProjectsFacade] ──(POST /generate)──> [Backend Queue]
                                                                                │
                                                                           (Procesa IA)
                                                                                │
[AppFacade] <──(SSE PROJECT_COMPLETED)── [NotificationsFacade] <───────────────┘
     │
     ├── ¿shownCompletedProjectIds.has(projectId)?
     │      ├── NO: Añadir al Set, mostrar Modal "¡Proyecto Generado!"
     │      └── SÍ: Ignorar (deduplicación activa de broadcasts)
     │
[Usuario Cierra Modal] ──(closeInfoModal)──> Resetea infoTitle, infoMessage, y llama a clearLatestNotification()
     │
[Usuario] ──(Genera Proyecto 2)──> [AppFacade.generateProject]
                                         │
                                         ├── clearLatestNotification() (limpia cualquier residuo)
                                         └── Pone en cola p2 (p1 sigue en el Set, no puede disparar modal)
```

---

## 4. Archivos Modificados

1. `frontend/src/app/features/notifications/services/notifications.facade.ts`:
   - Añadido el método público `clearLatestNotification()` para restablecer explícitamente `latestNotification.set(null)`.

2. `frontend/src/app/app.facade.ts`:
   - Añadido registro interno `shownCompletedProjectIds = new Set<string>()` para registrar los identificadores de proyectos cuyos modales de éxito ya han sido desplegados.
   - Refactorización de `initNotificationEffect()` y creación de `handleCompletedNotification()` para comprobar la clave única (`notif.projectId || notif.id || notif.message`) antes de lanzar el modal.
   - Implementación de `closeInfoModal()` que resetea `showInfoModal`, `infoTitle`, `infoMessage`, `infoType` y llama a `notifications.clearLatestNotification()`.
   - Limpieza preventiva de `clearLatestNotification()` al iniciar `generateProject()`.
   - Limpieza del identificador en `shownCompletedProjectIds` al invocar `deleteProject()` o `retryProject()`, permitiendo reintentos limpios.
   - Refactorización de todos los métodos para cumplir con la regla estricta de menos de 25 líneas por método y archivo menor de 200 líneas (194 líneas totales).

3. `frontend/src/app/app.html`:
   - Enlazado el evento `(close)` del `<app-info-modal>` con `appFacade.closeInfoModal()`.

4. `frontend/src/app/app.spec.ts`:
   - Actualizado el mock de `AppFacade` para incluir `closeInfoModal: vi.fn()`.

5. `frontend/src/app/app.facade.spec.ts`:
   - Actualizado el mock de `NotificationsFacade` con `clearLatestNotification: vi.fn()`.
   - Añadidos tests unitarios exhaustivos para:
     - Deduplicación de eventos `COMPLETED` para un mismo proyecto.
     - Comportamiento de `closeInfoModal()` reseteando estado y limpiando notificaciones.
     - Manejo de notificaciones de tipo `INFO`.
     - Casos límite en `deleteProject` con id vacío y `retryProject` sin `_id`.

6. `frontend/src/app/features/notifications/services/notifications.facade.spec.ts`:
   - Añadido test unitario para verificar que `clearLatestNotification()` deja el signal en `null`.

---

## 5. Detalles Técnicos y Reglas de Calidad

- **Angular 18 Signals & Reactividad Segura:**
  Se utilizan únicamente primitivas reactivas nativas de Angular 18 (`signal`, `effect`, `untracked`), sin ciclos de vida obsoletos como `ngOnInit`.
  Las llamadas de actualización de estado y lectura en efectos se ejecutan bajo bloques `untracked()` para evitar re-ejecuciones en cascada o bucles reactivos.

- **Límites de Código:**
  - `app.facade.ts`: 194 líneas (límite: 200 líneas).
  - Ningún método excede las 25 líneas de código.
  - `notifications.facade.ts`: 98 líneas (límite: 200 líneas).

- **Métricas de Cobertura Obtenidas:**
  - **Backend:**
    - Statements: 98.13%
    - Branches: 90.42%
    - Functions: 100%
    - Lines: 98.63%
  - **Frontend:**
    - Statements: 99.08%
    - Branches: 95.58%
    - Functions: 97.81%
    - Lines: 99.59%
    - `app.facade.ts`: 100% en Statements, 100% en Branches, 100% en Functions y 100% en Lines.
