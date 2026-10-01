# Barra temporal de confirmación de generación

## Propósito
Al iniciar una generación válida, abrir inmediatamente la actividad reciente y mostrar una confirmación inferior durante cinco segundos, sin presentar el modal «Proyecto en Cola».

## Arquitectura y flujo
`AppFacade` valida la selección y coordina el caso de uso. Antes de suscribirse a la petición de generación, solicita la apertura del modal mediante `NotificationsFacade` y actualiza el estado signal del aviso. La plantilla raíz actúa como composition root y renderiza el componente standalone reutilizable `TimedToastComponent`, que se encarga del temporizador y emite `dismissed`; la señal de estado se limpia desde la fachada.

El componente admite mensaje, duración y token de reinicio como inputs, de modo que se reutiliza sin acoplarlo al dominio de generación. El texto se obtiene de las traducciones ES/CA. Si la generación falla, se conserva el manejo de error existente; la confirmación temporal ya se habrá mostrado, tal como se solicitó.

## Archivos modificados
- `frontend/src/app/app.facade.ts`: estado del aviso, apertura inmediata de notificaciones y limpieza al vencer.
- `frontend/src/app/app.ts` y `frontend/src/app/app.html`: registro y renderizado del componente reutilizable.
- `frontend/src/app/components/timed-toast/timed-toast.component.ts`, `.html`, `.scss`: componente temporal accesible y estilos de barra inferior.
- `frontend/src/app/components/timed-toast/timed-toast.component.spec.ts`: pruebas de renderizado, accesibilidad, duración y reinicio del temporizador.
- `frontend/src/app/app.facade.spec.ts`: prueba de que el aviso y el modal se activan antes de recibir respuesta del servidor.
- `frontend/src/app/services/translations.es.ts` y `translations.ca.ts`: textos de confirmación.

## Decisiones técnicas
- El componente temporal mantiene la responsabilidad de temporización y libera el timeout mediante la limpieza del `effect`.
- El token permite reiniciar los cinco segundos aunque el usuario vuelva a generar mientras el mismo texto sigue visible.
- No se ejecutaron tests ni build, conforme a `AGENTS.md`.
