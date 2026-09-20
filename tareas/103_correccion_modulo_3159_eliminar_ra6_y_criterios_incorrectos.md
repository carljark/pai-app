# 103 — Corrección módulo 3159: eliminación de RA6 inexistente y criterios incorrectos

## Propósito

El módulo **3159. Itinerari personal per a l'ocupabilitat** (FP Básica) tenía un error curricular grave: aparecía una **RA6 que no existe** en el currículo oficial, junto con criterios de evaluación con textos de Prevención de Riesgos Laborales (PRL) propios del módulo **1709** (Grado Medio/Superior). El módulo 3159 solo tiene 5 RA reales (RA1–RA5) con 20 criterios de evaluación.

## Arquitectura / Flujo

```
mapa-intermodular.seed.ts (frontend, datos del Mapa Intermodular)
    ↓ seed estático cargado por mapa-intermodular.facade.ts
    ↓ usado en el componente MapaIntermodularViewComponent
    
scratch/official_ras_ca.json (archivo de trabajo/caché de traducciones)
    ↓ NO se carga en producción, pero contenía el error como referencia
```

El seed del mapa intermodular es el fichero fuente de verdad para las conexiones entre módulos. La base de datos MongoDB (colección `ras`) ya tenía correctamente solo RA1–RA5 para "Itinerari per l'ocupabilitat" sin RA6.

## Errores encontrados y corregidos

### Error 1: Criterios de RA5 codificados como RA6

Los criterios del **RA5** (acceso al mercado de trabajo) habían sido codificados incorrectamente con el número `6` en lugar de `5`:

| Código erróneo | Código correcto | Descripción |
|---|---|---|
| `3159-6a` | `3159-5a` | Búsqueda de empleo como proceso |
| `3159-6b` | `3159-5b` | Fuentes de información de acceso al empleo |
| `3159-6c` | `3159-5c` | Técnicas de búsqueda de empleo por cuenta ajena |
| `3159-6d` | `3159-5d` | Herramientas para búsqueda de empleo óptima |

### Error 2: Criterios con textos de PRL (módulo 1709) bajo código 3159

Los criterios `3159-1x` tenían textos de Prevención de Riesgos Laborales del módulo **1709**, no del 3159:

| Código | Texto incorrecto (PRL) | Texto correcto (3159 RA1) |
|---|---|---|
| `3159-1a` | "cultura preventiva... normativa básica PRL" | "propios intereses, motivaciones, habilidades y destrezas (autoconocimiento)" |
| `3159-1b` | "factores de riesgo de la actividad" | "competencias personales y sociales con valor para el empleo" |
| `3159-1c` | "evaluación de riesgos y técnicas de prevención" | "autoestima en el proceso de búsqueda de empleo" |
| `3159-1d` | "protocolos de actuación en caso de emergencia" | "fortalezas, debilidades, amenazas y oportunidades propias para inserción profesional" |
| `3159-1e` | "plan preventivo en la empresa... documentación básica PRL" | "expectativas de futuro para la inserción profesional" |
| `3159-1f` | "técnicas básicas de primeros auxilios" | *(no existe 3159-1f — reasignado a 3159-1c)* |

### Error 3: Referencia narrativa "3159-6" en notas metodológicas

Las notas metodológicas en `diversitySupport_es/ca` mencionaban `"el proceso de inserción laboral (3159-6)"` como nombre descriptivo. Corregido a `"el proceso de inserción laboral (RA5 de 3159)"`.

### Error 4: `"3159_RA6"` en scratch/official_ras_ca.json

El archivo de caché de traducciones tenía una clave `"3159_RA6"` duplicando el texto del RA5. Eliminada.

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `frontend/src/app/features/mapa-intermodular/data/mapa-intermodular.seed.ts` | Reemplazo masivo de códigos erróneos `3159-6x` → `3159-5x` y corrección de textos PRL en criterios `3159-1x` |
| `scratch/official_ras_ca.json` | Eliminada la clave `"3159_RA6"` duplicada |

## Detalles técnicos

### ¿Por qué la BD estaba bien?

La migración `02_update_ras.ts` insertó correctamente 5 RAs para "Itinerari per l'ocupabilitat". La migración `03_sync_ras_excel.ts` reinsertta desde `ras_excel.json` que también tenía solo RA1–RA5. El error era exclusivamente en el **seed estático del frontend** y en el archivo de scratch.

### Currículo correcto del módulo 3159 (referencia)

- **RA1** (5 criterios: a, b, c, d, e): Autoconocimiento y orientación personal
- **RA2** (5 criterios: a, b, c, d, e): Habilidades sociales y trabajo en equipo
- **RA3** (3 criterios: a, b, c): Itinerarios académicos y profesionales
- **RA4** (3 criterios: a, b, c): Itinerario propio y toma de decisiones
- **RA5** (4 criterios: a, b, c, d): Acceso al mercado de trabajo por cuenta ajena

**Total: 20 criterios de evaluación. 0 referencias a RA6.**

### Método de corrección

Se usó `sed` para reemplazos globales en el fichero de 73.589 líneas, verificando tras cada paso con `grep -c`. El `targetRaCode: "RA6"` en línea 8147 pertenecía al módulo **3009 (Ciencias aplicadas I)** cuyo RA6 sí existe — no se tocó.

## Tests

- **Frontend**: 370 tests pasados. Cobertura del seed al 100% branches.
- **No se modificó el backend**: La BD ya estaba correcta.
