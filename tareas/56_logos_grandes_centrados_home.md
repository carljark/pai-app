# Tarea 56: Ampliación y Centrado de Logos en Home Dashboard

## Propósito
Ajustar la presentación visual de la cabecera (Hero) en la página principal (`home-dashboard.component.ts`) para que los logotipos de marca tengan un protagonismo visual superior:
- **Logo con la palabra *plappin*:** Se amplió a un tamaño destacado (`height: 115px; max-width: 65%`).
- **Logo de isotipo/marca:** Se amplió a su derecha (`height: 90px; max-width: 30%`).
- **Alineación:** El contenedor ocupa el 100% del ancho disponible de forma centrada (`justify-content: center; width: 100%`) con ajuste responsive adaptativo para dispositivos móviles.

## Archivos Modificados
- `frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts`
- `tareas/56_logos_grandes_centrados_home.md`

## Verificación
- Frontend Vitest: 239/239 tests pasados (>98% de cobertura global).
- Build de producción Frontend: compilado correctamente.
