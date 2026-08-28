# Tarea 37: Recuperación automática de la cola de generación al arrancar el servidor

## Propósito
El usuario ha detectado que los proyectos se quedan en estado de carga "generando proyecto" indefinidamente en el servidor EC2 (incluso después de reiniciar el servidor). 
Esto sucede porque:
1. Si el servidor se apaga, reinicia o cae mientras un proyecto está en estado `'generando'`, el registro de dicho proyecto queda permanentemente estancado en la base de datos con ese estado.
2. Al volver a arrancar el servidor, el worker de la cola (`processQueue`) solo procesa los elementos en estado `'en_cola'`, ignorando los elementos que quedaron a medio procesar en estado `'generando'`.
3. Adicionalmente, el worker no se autoiniciaba al levantar el servidor, sino únicamente al recibir peticiones web nuevas.

## Arquitectura/Flujo
1. **Inicialización de la Cola (`initQueue`)**:
   - Se ha creado la función `initQueue` en [queue.service.ts](file:///Users/csgj/dev/pai-app/backend/src/services/queue.service.ts).
   - Al arrancar, el servidor busca cualquier proyecto estancado en estado `'generando'` en la base de datos y lo devuelve al estado `'en_cola'` para que el worker lo vuelva a tomar.
   - Acto seguido, arranca de forma inmediata y automática el worker de colas (`processQueue`) para reanudar el flujo en background sin esperar a que entre una nueva petición de generación.
2. **Ciclo de Vida de Arranque (`server.ts`)**:
   - En [server.ts](file:///Users/csgj/dev/pai-app/backend/src/server.ts), se ha secuenciado el arranque para que, tras realizar exitosamente la conexión a MongoDB y completar el motor de migraciones (`runMigrations`), se llame a `initQueue()`.
3. **Consistencia en Testing**:
   - Se configuró Vitest en [vitest.config.ts](file:///Users/csgj/dev/pai-app/backend/vitest.config.ts) con `sequence: { concurrent: false }` para evitar que la limpieza simultánea en memoria de la base de datos cause colisiones entre archivos de prueba durante ejecuciones concurrentes.
   - Se crearon pruebas unitarias en [queue.service.test.ts](file:///Users/csgj/dev/pai-app/backend/src/tests/queue.service.test.ts) cubriendo tanto la correcta restauración de estados como el control de errores de base de datos durante la inicialización, elevando la cobertura global por encima de los mínimos establecidos.

## Archivos Modificados
- `backend/src/services/queue.service.ts`
- `backend/src/server.ts`
- `backend/vitest.config.ts`
- `backend/src/tests/queue.service.test.ts`
