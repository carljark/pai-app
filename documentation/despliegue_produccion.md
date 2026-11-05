# Despliegue en producción

## Entorno
- **Servidor:** EC2 Ubuntu `51.92.83.118` (`plappin.duckdns.org`), con 908 MB de RAM y 2 GB de swap.
  - Acceso: `ssh -i ~/UJI/co2univ/co2univ-key.pem ubuntu@51.92.83.118`.
  - Comparte la máquina con otras aplicaciones (trincaunt, contenedor `mi-mongo`): no se tocan.
- **Código:** `~/pai-app`, un clon del repositorio puesto en el commit desplegado (`git checkout --detach`).
  - Contiene el `.env` de producción y los datos: `mongo_data/` y `backend/uploads/`. Todo ello está ignorado por git, así que un `checkout` no lo toca.
- **Contenedores:** `docker-compose.prod.yml` (Docker Compose v2):
  - `pai_mongodb_prod`: MongoDB 4.4;
  - `pai_backend_prod`: puerto 3000, imagen `ghcr.io/carljark/pai-app-backend`;
  - `pai_frontend_prod`: Nginx en el 8080, detrás del Nginx del host, imagen `ghcr.io/carljark/pai-app-frontend`.

  Las imágenes se construyen en GitHub Actions; el EC2 no compila nada.

## Flujo de cada tarea (AGENTS.md §1)
1. **Rama:** `main` para cambios pequeños; `feature/NNN_descripcion`, creada desde `main`, para tareas grandes.
2. **Verificación local:** lint y typecheck, y después `cd backend && npm test` y `cd frontend && npm test`.
3. **Commit y push.** El CI (`.github/workflows/ci.yml`) se ejecuta en cada push y en cada PR.
4. **Integración en `main`** (la hace el agente) con los tests y el CI de la rama en verde.
5. **Despliegue automático** (`.github/workflows/deploy.yml`) cuando el CI de ese commit de `main` termina en verde. Se sigue con `gh run watch`.

**Integrar en `main` es desplegar.** Si una tarea trae migraciones de datos delicadas, se avisa al usuario antes de integrar.

## CI (`ci.yml`)
Se ejecuta en cada push (cualquier rama) y en cada PR. Un push nuevo a la misma rama cancela el CI anterior.
- **backend:** `npm ci`, `npm run typecheck` y `npm run test:cov` (Vitest con `mongodb-memory-server` y umbral de cobertura del 90 %).
- **frontend:** `npm ci --legacy-peer-deps`, `npm test` (lint, tests, `check-coverage.js` y `check-zoneless.js`) y `npm run build -- --configuration production`.

El hook local `.git/hooks/pre-push`, que no está versionado, ejecuta las mismas suites antes de cada push. Es opcional: lo que decide es el CI.

## Despliegue (`deploy.yml`)
**Disparadores:**
- el CI terminado en verde de un **push a `main`**;
- a mano desde la pestaña Actions, o con `gh workflow run deploy.yml -f ref=<commit>`, para desplegar o volver a un commit concreto.

Solo hay un despliegue a la vez (`concurrency: deploy-production`).

**1. Job `build`** (matriz backend/frontend):
- construye en el runner (`linux/amd64`, como el EC2) con `backend/Dockerfile` y `frontend/Dockerfile.prod`;
- publica `ghcr.io/carljark/pai-app-<svc>:sha-<commit>` y `:latest`;
- usa la caché de capas de GitHub por servicio: si solo cambia el frontend, el backend no se reconstruye.

**2. Job `deploy`** (environment `production`):
1. SSH con la clave dedicada y la huella fija del servidor.
2. En el EC2: `git fetch` y `git checkout --detach <commit>`. Se guarda el commit anterior.
3. `docker login ghcr.io` con el token del job, que solo vale mientras dura. Después, `scripts/remote-deploy.sh` con `PAI_TAG=sha-<commit>` y `PREV_COMMIT`:
   1. copia de seguridad con `scripts/remote-backup.sh`: `~/backups/pai/pai_db_<fecha>.archive.gz`, se conservan las últimas 10;
   2. etiqueta como `:previous` las imágenes de los contenedores en marcha;
   3. `docker compose pull` y `up -d --no-build`;
   4. verificación: hasta 3 minutos esperando un 200 de la API (`/api/mapa-intermodular?tab=FPB`) y del frontend (`localhost:8080`), y muestra las líneas de migraciones;
   5. **si falla, vuelta atrás automática:** levanta `:previous` con el compose del commit nuevo (el del anterior puede no usar GHCR), lo verifica, deja el código en el commit anterior y termina en error;
   6. limpieza de las etiquetas `sha-*` antiguas y de las imágenes sin uso con `label=app=pai-app`.
4. `docker logout ghcr.io` en el EC2, siempre.
5. Comprobación de que `https://plappin.duckdns.org` responde 200 desde fuera.

Las migraciones las aplica el propio backend al arrancar (`prestart` → `npm run migrate`). La base de datos **no** se restaura automáticamente. Si una migración la dejó mal, se restaura la copia con `mongorestore --archive --gzip --drop` dentro de `pai_mongodb_prod`, siempre con confirmación del usuario.

### Configuración en GitHub (Settings del repo)
| Tipo | Nombre | Valor |
|---|---|---|
| Secreto | `EC2_SSH_KEY` | Clave privada ed25519 dedicada (comentario `github-actions-pai-app`), autorizada en `~ubuntu/.ssh/authorized_keys` |
| Variable | `EC2_HOST` | `51.92.83.118` |
| Variable | `EC2_USER` | `ubuntu` |
| Variable | `EC2_KNOWN_HOSTS` | Salida de `ssh-keyscan` del EC2, contrastada con el `known_hosts` local |
| Variable | `DOMAIN` | `plappin.duckdns.org` |
| Environment | `production` | Sin reglas de protección |

Para **revocar** el acceso del workflow, se borra la línea `github-actions-pai-app` de `authorized_keys` en el EC2. Para **rotar** la clave, se genera otra, se autoriza y se actualiza el secreto con `gh secret set EC2_SSH_KEY`.

## Volver a una versión anterior
- **Automático:** si la verificación del despliegue falla.
- **A mano:** `gh workflow run deploy.yml -f ref=<commit>`, con un commit anterior de `main`. Reconstruye en GHCR si hace falta (con caché) y lo despliega con el mismo procedimiento, incluida la copia de seguridad.

## Copia de seguridad en local
`./scripts/backup-prod-db.sh` ejecuta en el EC2 la copia de `scripts/remote-backup.sh` (la local, enviada por SSH) y la descarga a `backups/`, que está ignorada por git.

## Vía de emergencia: `scripts/deploy-prod.sh`
Solo se usa si GitHub Actions o GHCR no están disponibles, o si el usuario lo pide. Despliega la rama actual desde la máquina local:
1. Comprueba que no hay cambios sin commit y que la rama está subida.
2. Hace la copia de seguridad.
3. En el EC2: `checkout` y `pull` de la rama y `docker compose up -d --build`.
4. Verifica y, si falla, vuelve al commit anterior.

**Construye las imágenes en el EC2**, con memoria muy justa (`NODE_OPTIONS=--max-old-space-size=512` y swap). Las etiqueta como `ghcr.io/carljark/pai-app-*:latest`, así que el siguiente despliegue con Actions las reemplaza sin más.

## Precauciones
- Reiniciar el backend interrumpe las generaciones y traducciones en curso. La cola reanuda los proyectos `generando` al arrancar, pero las traducciones en curso se marcan como fallidas. Conviene no integrar en `main` en horas de uso intenso.
- **Disco del EC2** (en torno al 80 %): cada despliegue limpia sus imágenes antiguas. Las demás imágenes y la caché de builds pertenecen también a otras aplicaciones y no se tocan sin preguntar.
- El repositorio es público: los logs de Actions no deben imprimir el `.env` ni los secretos.
