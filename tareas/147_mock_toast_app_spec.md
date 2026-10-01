# Actualización del mock de AppFacade para el toast

## Propósito
Corregir los errores de plantilla en `app.spec.ts` causados por la incorporación del componente reutilizable `TimedToastComponent`.

## Cambio técnico
Se añadieron al mock de `AppFacade` las señales `queueToastMessage` y `queueToastRestartToken`, junto con el callback `dismissQueueToast`, completando el contrato utilizado por la plantilla raíz.

## Archivos modificados
- `frontend/src/app/app.spec.ts`
- `tareas/147_mock_toast_app_spec.md`

## Verificación
No se ejecutaron tests ni build, conforme a `AGENTS.md`.
