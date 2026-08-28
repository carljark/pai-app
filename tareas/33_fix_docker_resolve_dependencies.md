# Tarea 33: Solución de conflicto de dependencias peer en Docker build (EC2)

## Propósito
El usuario ha reportado un fallo en el despliegue/construcción del contenedor de Docker en la máquina EC2 (`EROSOLVE could not resolve`). Esto es debido a un conflicto de dependencias secundarias (peer dependencies) de Angular (como `@angular/platform-browser-dynamic@22.1.4` demandando una versión de `@angular/common` distinta de la instalada por otras dependencias).

## Arquitectura/Flujo
1. **Identificación**: Al instalar dependencias en entornos limpios de Docker (`RUN npm install` en `alpine`), npm intenta resolver el árbol de dependencias de forma estricta. Si encuentra discrepancias menores de dependencias peer entre subpaquetes de Angular, aborta con error `ERESOLVE`.
2. **Solución**: Se ha forzado a npm a tolerar e ignorar discrepancias de peer dependencies delegando la resolución en versiones legacy. Esto se logra agregando el flag `--legacy-peer-deps` a la directiva de instalación de paquetes de Node.

## Archivos Modificados
- `frontend/Dockerfile.prod` (Producción)
- `frontend/Dockerfile` (Desarrollo)

## Detalles Técnicos
- Se añadió `--legacy-peer-deps` a `npm install` en ambos Dockerfiles para unificar comportamientos y prevenir que fallos análogos detengan entornos locales o productivos.
