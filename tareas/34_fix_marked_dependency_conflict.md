# Tarea 34: Solución de falta de dependencia "marked" en Docker build

## Propósito
El usuario ha reportado un fallo en la etapa final de generación del bundle de Angular durante la compilación en producción dentro de Docker (`RUN npm run build -- --configuration production`). El error indica que no se puede resolver la ruta del módulo `"marked"`, requerido por `ngx-markdown`.

## Arquitectura/Flujo
1. **Origen del problema**: Al añadir `--legacy-peer-deps` en la tarea anterior para saltar conflictos peer, npm deja de instalar de forma automática las dependencias peer requeridas por los paquetes instalados. Dado que `ngx-markdown` define a `"marked"` como peer dependency (`^17.0.0 || ^18.0.0`) y esta no estaba declarada explícitamente en el `package.json` raíz del frontend, `marked` quedó totalmente ausente de la carpeta `node_modules` dentro del contenedor.
2. **Solución**:
   - Se ha añadido de forma explícita `"marked": "^18.0.11"` en la sección `dependencies` de [package.json](file:///Users/csgj/dev/pai-app/frontend/package.json) del frontend.
   - De esta forma, npm instala forzosamente el compilador Markdown independientemente del uso del flag `--legacy-peer-deps`.

## Archivos Modificados
- `frontend/package.json`
- `frontend/package-lock.json` (actualizado tras ejecutar `npm install` localmente para sincronizar el lockfile)

## Detalles Técnicos
- La versión `^18.0.11` se alinea con la versión que consume actualmente el backend del proyecto, simplificando la homogeneización de librerías.
- Se ha verificado que la suite completa de tests unitarios locales compila y pasa con cobertura en verde.
