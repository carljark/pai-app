# Despliegue en producción

## Entorno
- **Servidor:** EC2 Ubuntu `51.92.83.118` (`plappin.duckdns.org`), con 908 MB de RAM y 2 GB de swap.
  - Acceso: `ssh -i ~/UJI/co2univ/co2univ-key.pem ubuntu@51.92.83.118`.
  - Comparte la máquina con otra aplicación (contenedor `mi-mongo`): no se toca.
- **Repositorio:** `~/pai-app`, con el `.env` de producción. Las imágenes se construyen en el propio EC2 con `docker-compose.prod.yml` (Docker Compose v2):
  - `pai_mongodb_prod`: MongoDB 4.4;
  - `pai_backend_prod`: puerto 3000;
  - `pai_frontend_prod`: Nginx en el 8080, detrás del Nginx del host.
- **Rama desplegada:** la rama de trabajo de la tarea, sin pasar por `main` (AGENTS.md §1). El merge a `main` lo decide el usuario.

## Flujo de cada tarea (AGENTS.md §1)
1. **Rama:** la actual para cambios pequeños; `feature/NNN_descripcion` para tareas grandes.
2. **Verificación:** lint y typecheck, y después `cd backend && npm test` y `cd frontend && npm test`, todo en verde.
3. **Commit y push** de la rama.
4. **Despliegue:** `./scripts/deploy-prod.sh`.

## `scripts/deploy-prod.sh`
1. Se niega a desplegar si hay cambios sin commit o si la rama local no coincide con `origin`.
2. Copia de seguridad de la base de datos con `scripts/backup-prod-db.sh`: queda en el EC2 (`~/backups/pai/`, últimas 10) y en local (`backups/`).
3. En el EC2: `git fetch`, `checkout` y `pull --ff-only` de la rama, y `docker compose -f docker-compose.prod.yml up -d --build`.
4. **Verificación:** espera hasta 3 minutos a que respondan con 200 la API (`/api/mapa-intermodular?tab=FPB`) y el frontend (`localhost:8080`), y muestra las líneas de migraciones y errores del arranque.
5. **Si la verificación falla:** vuelve al commit desplegado antes (`git checkout <commit>` y reconstrucción) y termina con error.
   - La base de datos no se restaura automáticamente.
   - Si una migración la dejó mal, se restaura la copia del paso 2 con `mongorestore --archive --gzip --drop` dentro de `pai_mongodb_prod`, siempre con confirmación del usuario.

## Precauciones
- Reiniciar el backend interrumpe las generaciones y traducciones en curso. La cola reanuda los proyectos `generando` al arrancar, pero las traducciones en curso se marcan como fallidas. En despliegues grandes, avisar antes.
- Construir el frontend en el EC2 consume mucha memoria (`NODE_OPTIONS=--max-old-space-size=512`) y usa swap. Si algún día falla por falta de memoria, la alternativa es construir la imagen en local y subirla.
