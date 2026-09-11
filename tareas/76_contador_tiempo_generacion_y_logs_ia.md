# Diseño Técnico: Contador de Tiempo en Generación de Proyectos (Notificaciones) y Registro de Tiempo de Respuesta IA en Logs

## Propósito
1. **Contador de Tiempo en Notificaciones:** Proporcionar al usuario feedback visual en tiempo real del tiempo transcurrido mientras la Inteligencia Artificial está generando un proyecto. El contador se visualiza tanto en la píldora informativa del botón de notificaciones del sidebar lateral como dentro del modal de notificaciones ("Actividad Reciente"), incrementando segundo a segundo de forma dinámica. Además, al completarse el proyecto, se muestra el tiempo final de generación empleado por la IA.
2. **Registro del Tiempo de Respuesta de la IA en los Logs:** Medir con precisión milimétrica la duración de la llamada al modelo generativo (Gemini) en el worker de la cola (`queue.service`), registrando el tiempo tanto en la salida estándar de logs del servidor (`console.log` / `console.error`) con prefijos estructurados, como en la colección de persistencia de auditoría `ActivityLog` (para proyectos exitosos y fallidos) y en el propio documento del `Project` (`generationStartedAt`, `generationTimeMs`).

---

## Arquitectura y Flujo

```mermaid
sequenceDiagram
    participant User as Usuario / UI (Sidebar / Notificaciones)
    participant Badge as NotificationsBadgeComponent
    participant SSE as SSE Service / EventSource
    participant Queue as QueueService Worker
    participant Gemini as Gemini AI API
    participant DB as MongoDB (Project & ActivityLog)

    Note over Queue,DB: Proyecto entra en estado 'generando'
    Queue->>DB: findOneAndUpdate({ status: 'generando', generationStartedAt: Date.now() })
    Queue->>SSE: sendToUser('PROJECT_STATUS', status: 'generando', generationStartedAt)
    SSE-->>Badge: Actualiza estado reactivo de proyectos
    Note over Badge: effect() activa setInterval cada 1000ms incrementando 'now'
    Badge-->>User: Visualiza '⏱️ 00:01', '⏱️ 00:02', ... en sidebar y modal

    Note over Queue,Gemini: Ejecución de la inferencia IA
    Queue->>Queue: startTime = Date.now()
    Queue->>Gemini: generateGeminiContent(aiPrompt, aiInstruction)
    Gemini-->>Queue: Respuesta de texto generado
    Queue->>Queue: generationTimeMs = Date.now() - startTime

    Note over Queue,DB: Registro y persistencia de logs
    Queue->>Queue: console.log('[Queue/AI] Proyecto generado en X ms (Y s)')
    Queue->>DB: project.generationTimeMs = generationTimeMs, status = 'borrador'
    Queue->>DB: new ActivityLog({ action: 'GENERATE_PROJECT', details: { generationTimeMs, title } })
    Queue->>SSE: sendToUser('PROJECT_COMPLETED', generationTimeMs)
    SSE-->>Badge: Notificación de finalización recibida
    Note over Badge: effect() cancela el intervalo; se muestra 'Completado (14.2s)'
```

---

## Archivos Modificados y Creados

1. **`backend/src/models/Project.ts`:**
   - Incorporación de los campos `generationStartedAt: { type: Date }` y `generationTimeMs: { type: Number }` en el esquema del modelo Mongoose para almacenar el momento de inicio y la duración total de la llamada a la IA.

2. **`backend/src/services/queue.service.ts`:**
   - Refactorización modular de `processQueue` dividiéndolo en funciones auxiliares independientes (`executeProjectGeneration`, `handleProjectSuccess`, `handleProjectError`), cumpliendo estrictamente la regla de modularidad de funciones < 25 líneas.
   - Al marcar el proyecto en `generando`, se asigna `generationStartedAt: new Date()` y se transmite por SSE al cliente.
   - Medición precisa del tiempo de ejecución `generationTimeMs = Date.now() - startTime`.
   - Salida estructurada en logs del servidor (`console.log` / `console.error`) con identificación del proyecto, estado y tiempo en milisegundos y segundos formateados.
   - Inclusión de `generationTimeMs` en los registros de auditoría de MongoDB (`ActivityLog`) tanto en caso de éxito (`GENERATE_PROJECT`) como en caso de excepción (`ERROR_GENERATE_PROJECT`).
   - Envío de `generationTimeMs` en los eventos de Server-Sent Events (`PROJECT_COMPLETED` y `PROJECT_ERROR`).

3. **`backend/src/tests/queue.service.test.ts`:**
   - Actualización de los tests unitarios verificando que `generationTimeMs` es calculado y guardado en el proyecto, que los logs de consola contienen las marcas temporales esperadas y que el SSE propaga el tiempo al usuario.

4. **`frontend/src/app/features/notifications/models/notification.model.ts`:**
   - Ampliación de las interfaces `RawNotificationEvent` y `AppNotification` con las propiedades opcionales `generationTimeMs` y `generationStartedAt`.

5. **`frontend/src/app/features/notifications/mappers/notification.mapper.ts` y `notification.mapper.spec.ts`:**
   - Refactorización a funciones auxiliares (`buildCompletedMessage`, `resolveNotificationMeta`), manteniendo métodos < 25 líneas.
   - Enriquecimiento del mensaje de notificación para eventos `PROJECT_COMPLETED`, incorporando el tiempo empleado por la IA (ej. `(tiempo IA: 14.5s)`).

6. **`frontend/src/app/features/notifications/components/notifications-badge/notifications-badge.component.ts`:**
   - Implementación de un reloj reactivo con Angular 18 Signals: signal `now = signal(Date.now())` y un `effect` con ciclo de limpieza (`onCleanup`) que inicia un `setInterval` de 1 segundo únicamente mientras haya proyectos con `status === 'generando'`, deteniéndose automáticamente cuando cesa la generación.
   - Métodos auxiliares de formateo: `getElapsedTime(project)` (calcula la diferencia en segundos respecto a `generationStartedAt` o `createdAt` y lo formatea como `mm:ss`), `formatElapsed(seconds)` y `formatDurationMs(ms)`.
   - Interfaz en sidebar: si hay un proyecto generándose, la píldora numérica del botón de notificaciones se transforma dinámicamente en el cronómetro en vivo `⏱️ mm:ss`.
   - Interfaz en modal de notificaciones: junto a la etiqueta animada `Generando IA...`, se renderiza una etiqueta tipo badge con el contador `⏱️ mm:ss`. Para proyectos completados con registro temporal, se añade la píldora informativa `(X.Ys)`.

7. **`frontend/src/app/features/notifications/components/notifications-badge/notifications-badge.component.spec.ts`:**
   - Tests unitarios completos que verifican el cómputo de `generatingProject`, los métodos de formateo, la actualización periódica del signal `now` con timers simulados y la renderización en el DOM.

---

## Detalles Técnicos y Decisiones de Diseño

### 1. Gestión Reactiva y Limpieza del Temporizador en Angular 18
En lugar de mantener un temporizador `setInterval` global o persistente que consuma recursos del navegador de manera innecesaria, se utilizó la API `effect` de Angular con su callback `onCleanup`:
```typescript
constructor() {
  effect((onCleanup) => {
    const hasGenerating = this.projects().some(p => p.status === 'generando');
    if (hasGenerating) {
      const timer = setInterval(() => this.now.set(Date.now()), 1000);
      onCleanup(() => clearInterval(timer));
    }
  });
}
```
- Cuando un proyecto pasa a `generando` (a través de SSE o recarga del historial), el efecto se dispara y crea el intervalo.
- En cuanto el proyecto pasa a `borrador` o `error`, la condición evalúa a falso y el framework invoca inmediatamente la función de limpieza, eliminando el intervalo sin riesgo de fugas de memoria (*memory leaks*).

### 2. Formateo de Cronómetro Tabular Digital
Para evitar saltos visuales en la interfaz al cambiar los dígitos cada segundo, se implementó el formateo en base `mm:ss` con relleno de ceros (`padStart(2, '0')`) y la propiedad CSS `font-variant-numeric: tabular-nums; font-family: monospace;`.

### 3. Trazabilidad en Logs del Backend
Las líneas de log se estructuran con el tag `[Queue/AI]` para facilitar el filtrado y monitorización mediante herramientas de agregación de logs (como CloudWatch, Datadog o `docker logs`):
- Éxito: `[Queue/AI] Proyecto "Título" (id) generado por la IA en 14320ms (14.32s).`
- Error: `[Queue/AI] Error al generar proyecto "Título" (id) tras 14320ms (14.32s): [detalles]`
- Auditoría persistente: Los registros en `ActivityLog` permiten al administrador visualizar en el panel de control los tiempos de respuesta de cada proyecto generado históricamente.

### 4. Cobertura de Pruebas
- **Backend:** 76/76 tests superados, Statements: 97.64%, Branches: 90.39%, Functions: 100%, Lines: 98.27%.
- **Frontend:** 303/303 tests superados, Statements: 99.12%, Branches: 95.1%, Functions: 97.6%, Lines: 99.72%.
- **Git Hook pre-push:** Validación conjunta exitosa con código de salida 0.
