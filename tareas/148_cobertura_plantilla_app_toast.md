# Cobertura de la rama de toast en la plantilla raíz

## Propósito
Cubrir la condición y los bindings de `app-timed-toast` en `frontend/src/app/app.html` para alcanzar el umbral configurado de cobertura de plantilla.

## Cambio técnico
Se añadió una prueba de `App` que establece un mensaje y un token de reinicio en el mock de `AppFacade`, verifica el renderizado del toast y dispara el evento `dismissed` para comprobar su delegado.

## Archivos modificados
- `frontend/src/app/app.spec.ts`
- `tareas/148_cobertura_plantilla_app_toast.md`

## Verificación
No se ejecutaron tests ni build, conforme a `AGENTS.md`.
