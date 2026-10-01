# Tarea 152: Renombrado de "FPB / FP Básica" a "CFGB Peluquería y Estética"

## Propósito

Renombrar la etiqueta visible del nivel **FPB / FP Básica** a **CFGB Peluquería y Estética** (castellano) y **CFGB Perruqueria i Estètica** (catalán) en el generador de proyectos, el archivo (historial) y el mapa intermodular.

## Alcance

Se modifican únicamente los textos visibles. Los identificadores internos (`tipoNivel: 'FP_BASICA'`, pestaña de mapa `'FPB'`, tipo `FPBModule`, endpoint `?tab=FPB`) se mantienen intactos para no romper API, base de datos, migraciones ni tipados.

## Cambios

| Archivo | Cambio |
|---|---|
| `frontend/src/app/services/translations.es.ts` | `courseLevelFP` → `CFGB Peluquería y Estética`; `fpBtn`, `firstYearFP`, `secondYearFP`, `homePill4` y mención en `homeDescription` actualizadas. |
| `frontend/src/app/services/translations.ca.ts` | `courseLevelFP` → `CFGB Perruqueria i Estètica`; resto de claves equivalentes en catalán. |
| `frontend/src/app/curriculum/services/curriculum.facade.ts` | Texto de reserva del "carrito" de selección del generador actualizado a CFGB. |
| `frontend/src/app/features/mapa-intermodular/components/ui/tabs/tabs.component.html` | Pestaña `FPB` ahora muestra "CFGB Peluquería y Estética" / "CFGB Perruqueria i Estètica". |
| `frontend/src/app/features/mapa-intermodular/components/ui/header/header.component.html` | Título, subtítulo y etiqueta de estadística de módulos del mapa. |
| `frontend/src/app/features/mapa-intermodular/components/ui/activities-grid/activities-grid.component.ts` | Títulos "Retos CFGB" y "Diversidad CFGB". |
| `frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.ts` | Cabecera del resumen exportado, ahora dependiente del tab activo (helper `getMapaTabLabel`). |
| `frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.spec.ts` | Nuevo test de la cabecera exportada para los cuatro tabs en ES y CA. |
| `frontend/src/app/features/mapa-intermodular/data/mapa-intermodular.seed.ts` | Comentario del seed. |
| `frontend/src/app/features/curriculum/services/curriculum.facade.spec.ts` | Ajuste de las dos aserciones del texto de reserva. |

## Verificación

No se ejecutaron tests ni builds (queda a cargo del usuario, según las instrucciones del repositorio). Los tests existentes que usan `courseLevelFP` lo hacen mediante mocks, por lo que siguen siendo coherentes; el click de pestañas del mapa se hace por índice, no por texto.
