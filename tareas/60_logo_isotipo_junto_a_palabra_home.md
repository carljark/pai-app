# Tarea 60: Integración del Isotipo a la Derecha del Logo Plappin con Altura Proporcional

## Propósito
Integrar el logotipo tradicional (isotipo `logo-transparent.png`) a la derecha de la marca tipográfica (`word-transparent.png`) en la cabecera de la página principal (Home):
- **Tamaño Proporcional:** Ambos logotipos comparten exactamente la misma altura (`height: 130px;` en escritorio y `75px` en móviles).
- **Mantener Escala:** El logotipo tipográfico *plappin* mantiene su tamaño sin reducciones indebidas.
- **Alineación:** Disposición centrada (`justify-content: center`) con separación equilibrada (`gap: 24px`).

## Archivos Modificados
- `frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts`
- `tareas/60_logo_isotipo_junto_a_palabra_home.md`

## Verificación
- Frontend Vitest: 239/239 tests pasados (98.2% cobertura global).
- Backend Vitest: 61/61 tests pasados (97.18% statements, 91.46% branches).
- Build Frontend: Compilado exitosamente.
