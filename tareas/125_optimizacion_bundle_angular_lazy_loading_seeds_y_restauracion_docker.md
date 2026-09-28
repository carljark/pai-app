# Diseño Técnico 125: Optimización de Bundles en Angular (Lazy Loading de Seeds), Reducción de Memoria y Restauración de Contenedores Docker

## 1. Propósito
Resolver de raíz la indisponibilidad de la aplicación en `http://localhost:4200` tras el despliegue con `docker compose up -d --build`.

El problema se originó por el empaquetado monolítico de cuatro ficheros de datos (seeds curriculares del mapa intermodular: FPB, CFGM Estética, CFGM Peluquería 1.er curso y CFGM Peluquería 2.º curso), los cuales sumaban más de 37.3 MB de datos TypeScript estáticos cargados directamente en el bundle inicial (`main.js`). Durante el arranque del contenedor de desarrollo (`ng serve`), el compilador de Angular/esbuild generaba árboles de sintaxis abstracta (AST) y mapas de fuentes en memoria superiores a 2.5 GB de RAM. Al operar sobre la máquina virtual de Rancher Desktop/Lima (con un límite de 4 GB compartidos con el clúster de Kubernetes k3s), el sistema operativo activaba `kswapd0` entrando en un bucle severo de thrashing de swap (load average > 108), provocando la congelación del demonio Docker, la caída de los multiplexores de socket SSH y el bloqueo total del puerto 4200.

## 2. Arquitectura y Flujo de la Solución

### A. Lazy Loading Dinámico de Seeds Curriculares
En lugar de importar estáticamente los 37.3 MB en `MapaIntermodularFacade`:
```typescript
// ANTES (Monolítico):
import { FPB_MODULES_SEED } from '../data/mapa-intermodular.seed';
import { CFGM_MODULES_SEED } from '../data/mapa-intermodular-cfgm.seed';
import { CFGM_PELUQUERIA_MODULES_SEED } from '../data/mapa-intermodular-cfgm-peluqueria.seed';
import { CFGM_PELUQUERIA_2_MODULES_SEED } from '../data/mapa-intermodular-cfgm-peluqueria-2.seed';
```
Se implementó un patrón de carga diferida bajo demanda con caché en memoria (`seedCache`):
```typescript
// AHORA (Lazy Chunks en Facade):
async loadSeed(tab: MapaTab): Promise<FPBModule[]> {
  if (this.seedCache[tab]) return this.seedCache[tab]!;
  let data: FPBModule[] = [];
  switch (tab) {
    case 'FPB': {
      const m = await import('../data/mapa-intermodular.seed');
      data = m.FPB_MODULES_SEED;
      break;
    }
    case 'CFGM': {
      const m = await import('../data/mapa-intermodular-cfgm.seed');
      data = m.CFGM_MODULES_SEED;
      break;
    }
    case 'CFGM_PELUQUERIA': {
      const m = await import('../data/mapa-intermodular-cfgm-peluqueria.seed');
      data = m.CFGM_PELUQUERIA_MODULES_SEED;
      break;
    }
    case 'CFGM_PELUQUERIA_2': {
      const m = await import('../data/mapa-intermodular-cfgm-peluqueria-2.seed');
      data = m.CFGM_PELUQUERIA_2_MODULES_SEED;
      break;
    }
  }
  this.seedCache[tab] = data;
  return data;
}
```

### B. Impacto en el Bundle Inicial
- **Antes:**
  - `main.js`: **40.04 MB** (excedía el presupuesto de producción por más de 24 MB; bloqueaba la compilación en caliente).
- **Después:**
  - `main.js`: **1.91 MB** en producción (**1.03 MB** en desarrollo).
  - Reducción del **95.2%** del tamaño del bundle principal.
  - Los datos curriculares quedan segregados en chunks independientes que solo se descargan cuando el usuario hace clic en su pestaña correspondiente:
    - `chunk-mapa-intermodular-cfgm-peluqueria-seed.js` (14.49 MB)
    - `chunk-mapa-intermodular-cfgm-peluqueria-2-seed.js` (11.85 MB)
    - `chunk-mapa-intermodular-seed.js` (6.23 MB)
    - `chunk-mapa-intermodular-cfgm-seed.js` (4.17 MB)

### C. Ajuste de Entorno de Desarrollo y Docker
1. **`frontend/angular.json`**: Se desactivó `"sourceMap": false` en la configuración `development` para evitar que el dev server intente generar mapas de fuentes de decenas de megabytes en memoria.
2. **`docker-compose.yml`**: Se añadió `NODE_OPTIONS=--max-old-space-size=2048` al contenedor de frontend para acotar y controlar el heap de Node.js.
3. **Restablecimiento de Socket y Reenvío de Puertos**: Se limpiaron los sockets huérfanos generados durante la saturación de memoria de Lima y se reanudaron los reenvíos de los puertos 4200 y 3000.

## 3. Archivos Modificados
- [`frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.ts):
  - Sustitución de imports estáticos por imports dinámicos asíncronos en `loadSeed()`.
  - Añadido sistema de caché `seedCache` y control de estado reactivo mediante señales (`isLoadingSeed`).
  - Actualización de `setTab(tab, directData?)` para soportar tanto carga diferida como inyección directa síncrona en tests unitarios.
- [`frontend/angular.json`](file:///Users/csgj/dev/pai-app/frontend/angular.json):
  - Ajuste de presupuestos de producción a 4MB advertencia / 8MB error para el bundle inicial.
  - Desactivación de `sourceMap` en el perfil de desarrollo.
- [`docker-compose.yml`](file:///Users/csgj/dev/pai-app/docker-compose.yml):
  - Inclusión de variable de entorno `NODE_OPTIONS=--max-old-space-size=2048` en el servicio `frontend`.
- [`tareas/125_optimizacion_bundle_angular_lazy_loading_seeds_y_restauracion_docker.md`](file:///Users/csgj/dev/pai-app/tareas/125_optimizacion_bundle_angular_lazy_loading_seeds_y_restauracion_docker.md):
  - Este documento técnico de diseño.

## 4. Detalles Técnicos y Verificación

### A. Pruebas Unitarias y Cobertura (Frontend)
- Suites ejecutadas: **31 / 31 pasadas** (100%).
- Tests unitarios: **404 / 404 pasados** (100%).
- Cobertura global:
  - Sentencias (Statements): **98.78%** (Umbral $\ge 90\%$)
  - Ramas (Branches): **95.61%** (Umbral $\ge 90\%$)
  - Funciones (Functions): **97.78%** (Umbral $\ge 90\%$)
  - Líneas (Lines): **99.12%** (Umbral $\ge 90\%$)
  - Funciones de plantillas HTML: $\ge 80\%$.
- Script `check-coverage.js`: `All coverage thresholds met.` (Exit code 0).

### B. Pruebas Unitarias de Backend
- Suites ejecutadas: **15 / 15 pasadas** (100%).
- Tests unitarios: **123 / 123 pasados** (100%).

### C. Estado del Entorno Docker
- Contenedores activos y saludables:
  - `pai_frontend`: Up, escuchando en `0.0.0.0:4200->4200/tcp` (Bundle compilado en 12s, 1.03 MB inicial).
  - `pai_backend`: Up, escuchando en `0.0.0.0:3000->3000/tcp` (API operativa).
  - `pai_db`: Up, escuchando en `0.0.0.0:27018->27017/tcp` (MongoDB conectado).
### D. Resolución de Timeout en Resolución de Metadatos de `node:22-alpine`
- **Incidencia:** Al ejecutar `docker compose up -d --build`, Docker BuildKit intentó consultar remotamente los metadatos de `node:22-alpine` en Docker Hub (`registry-1.docker.io`), provocando un `i/o timeout (DeadlineExceeded)` debido a la saturación previa de los sockets de red.
- **Acción:** Se ejecutó `docker pull node:22-alpine` directamente hacia la caché del demonio local.
- **Resultado:** Reconstrucción posterior completada en 0.7s con éxito absoluto (`docker compose up -d --build` exit code 0).

