# Tarea 58: Recorte y Transparencia del Logo Plappin y Corrección Integral de Traducciones

## Propósito
1. **Recorte y Optimización del Logotipo Plappin (`Palabra plappin.jpeg`):**
   - El archivo original de 1191x896 contenía un margen blanco excesivo vertical (más de 260px por arriba y por abajo).
   - Se procesó la imagen eliminando el fondo blanco con antialiasing/transparencia y recortando exactamente al contorno de la palabra (de 896px a 373px de alto, formato 1077x373).
   - Se guardó en `frontend/public/word-transparent.png`.
   - Ahora el logotipo llena el ancho disponible en la cabecera de la Home de forma limpia, sin dejar márgenes vacíos superiores o inferiores.

2. **Corrección Integral del Sistema Bilingüe (Castellano / Catalán):**
   - **Persistencia de Idioma:** Se agregó la persistencia y carga automática del idioma en `localStorage` (`pai_lang`) dentro de `LayoutService` para que no se reinicie a castellano al recargar la página.
   - **Reactividad en Carga Curricular:** Se corrigió el efecto en `AppFacade` eliminando el `untracked` sobre `layout.language()` que impedía que `loadRas()` y `loadCes()` se recargasen en catalán al pulsar el botón de idioma del sidebar.
   - **Selects y Textos:** Se tradujeron todas las opciones de curso (`1r`, `2n`, `3r`, `4t`), estados y tooltips en los componentes del Generador, Taller, Historial y Selector Curricular.

## Archivos Modificados
- `frontend/public/word-transparent.png`
- `frontend/src/app/services/layout.service.ts`
- `frontend/src/app/services/layout.service.spec.ts`
- `frontend/src/app/services/translation.service.ts`
- `frontend/src/app/app.facade.ts`
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.html`
- `frontend/src/app/features/history/components/history-view/history-view.component.ts`
- `frontend/src/app/features/history/components/history-view/history-view.component.spec.ts`
- `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.ts`
- `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.spec.ts`
- `tareas/58_recorte_logo_plappin_y_correccion_traducciones.md`

## Verificación
- **Frontend Vitest:** 239/239 tests pasados (98.24% cobertura de sentencias, >95% de ramas).
- **Backend Vitest:** 60/60 tests pasados (97.09% cobertura de sentencias, 91.32% de ramas).
- **Build de producción Frontend:** Compilación exitosa.
