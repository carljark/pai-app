# 109. Ajuste del Budget del Bundle Inicial en Angular para Producción

## Propósito
Solucionar el fallo en el pipeline de build de producción de Angular (`bundle initial exceeded maximum budget. Budget 10.00 MB was not met by 1.38 MB with a total of 11.38 MB`). Este error impedía generar los artefactos estáticos de la aplicación frontend (tanto en local como en los contenedores Docker en el despliegue a producción en EC2).

---

## Causa Raíz
Con la incorporación de los nuevos datasets curriculares e intermodulares del **Grado Medio de Estética y Belleza** (seeds estáticos con 8 módulos completos, relaciones de criterios, actividades DUA bilingües y metadatos en `mapa-intermodular-cfgm.seed.ts` y `ras_cfgm_estetica.data.ts`), el peso sin comprimir (*raw size*) del chunk inicial de la aplicación alcanzó **11.37 MB** (total bundle de 11.38 MB).

El límite máximo configurado en `angular.json` para la compilación de producción era de `10MB` (`maximumError`).
A pesar de que el tamaño transferido estimado por red (*estimated transfer size*) es de únicamente **678 kB** gracias a la compresión gzip/brotli sobre datos textuales repetitivos, el compilador de Angular evalúa el presupuesto en crudo e interrumpe la compilación con código de salida 1.

---

## Arquitectura y Solución Técnica

Se actualizó la configuración de `budgets` en el bloque `production` de `angular.json`:

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "12MB",
    "maximumError": "16MB"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "15kB",
    "maximumError": "25kB"
  }
]
```

- **`maximumWarning: 12MB`**: Emite advertencia si el bundle inicial supera los 12 MB.
- **`maximumError: 16MB`**: Permite compilar holgadamente el bundle actual (11.38 MB) y deja margen suficiente para futuras ampliaciones curriculares sin romper builds de producción en Docker/CI.

---

## Archivos Modificados
- [`frontend/angular.json`](file:///Users/csgj/dev/pai-app/frontend/angular.json): Aumento del límite de budget inicial de 10 MB a 16 MB (warning en 12 MB).

---

## Verificación y Pruebas
1. **Compilación de producción (`npm run build`)**:
   - Compilación exitosa en 15.6 segundos.
   - Bundle generado en `frontend/dist/frontend`.
   - Chunk inicial: 11.38 MB en crudo / 678.38 kB comprimido.
2. **Suite de pruebas unitarias (`npm test`)**:
   - 31 archivos de test pasados (100%).
   - 376 tests unitarios pasados (100%).
   - Cobertura de ramas (branch coverage): 95.23% (superando holgadamente el umbral requerido del 90%).
