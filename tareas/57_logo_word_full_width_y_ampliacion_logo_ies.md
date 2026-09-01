# Tarea 57: Logo Plappin en Ancho Completo y Ampliación del Logo del IES en Sidebar

## Propósito
1. **Home Dashboard:** Se retiró el isotipo de la cabecera (Hero), dejando exclusivamente el logotipo con el nombre de marca (`word-transparent.png`), configurado para ocupar todo el ancho disponible de forma centrada (`width: 100%; max-height: 180px; object-fit: contain;`).
2. **Sidebar Izquierdo:** Se incrementó sustancialmente el tamaño del logotipo del centro (*IES Cap de Llevant*) en el panel lateral entre *"Salir"* y el nombre del docente (`max-height: 150px; width: 100%`), manteniendo su reducción automática y compacta cuando el sidebar se encuentra colapsado (`max-height: 28px; max-width: 36px`).

## Archivos Modificados
- `frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts`
- `frontend/src/app/layout/components/sidebar/sidebar.component.ts`
- `tareas/57_logo_word_full_width_y_ampliacion_logo_ies.md`

## Verificación
- Frontend Vitest: 239/239 tests pasados (98.23% cobertura de sentencias).
- Backend Vitest: 60/60 tests pasados (97.09% cobertura de sentencias).
- Build de producción Frontend: compilación correcta.
