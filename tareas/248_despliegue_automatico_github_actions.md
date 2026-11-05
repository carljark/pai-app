# Tarea 248: Despliegue automático desde main con GitHub Actions

> **Plan:** [248 — Despliegue automático desde main con GitHub Actions](../planes/248_plan_despliegue_automatico_github_actions.md)

## Propósito
Hasta ahora `./scripts/deploy-prod.sh` desplegaba desde la máquina local la rama de trabajo y **construía las imágenes en el EC2**. El servidor tiene 908 MB de RAM y lo comparte con trincaunt; usaba 829 MB de swap al inspeccionarlo. Los tests solo se pasaban en un hook local `pre-push`, que no está versionado. `main` llevaba 312 commits de retraso respecto a producción.

Se adopta el modelo de trincaunt:
- **CI** en GitHub Actions en cada push y cada PR;
- **despliegue automático** de cada commit de `main` con el CI en verde: las imágenes se construyen en GitHub y se publican en GHCR, y el EC2 solo las descarga y las levanta.

El usuario decidió que el despliegue sea **solo desde `main`** y que **sea el agente quien integre en `main`** al final de cada tarea.

## Arquitectura y flujo
- **`ci.yml`:**
  - backend: `npm ci`, `typecheck` y `test:cov`;
  - frontend: `npm ci --legacy-peer-deps`, `npm test` (lint, tests, cobertura por archivo y zoneless) y el build de producción.
- **`deploy.yml`:**
  - disparadores: el CI en verde de un push a `main` (`workflow_run`), o a mano (`workflow_dispatch` con `ref`); un solo despliegue a la vez;
  - job `build`: matriz backend/frontend con `docker/build-push-action` (`linux/amd64`), etiquetas `sha-<commit>` y `latest`, y caché `gha` separada por servicio;
  - job `deploy` (environment `production`):
    1. SSH con clave dedicada y `known_hosts` fijo;
    2. `git fetch` y `git checkout --detach <commit>` en `~/pai-app`;
    3. `docker login` con el token del job y `scripts/remote-deploy.sh`;
    4. `docker logout` siempre;
    5. comprobación de `https://plappin.duckdns.org`.
- **`scripts/remote-deploy.sh`** (se ejecuta en el EC2):
  1. copia de seguridad;
  2. etiqueta como `:previous` las imágenes en marcha;
  3. `docker compose pull` y `up -d --no-build`;
  4. verificación de la API y el frontend (hasta 3 minutos);
  5. si falla, vuelta atrás a `:previous` y al commit anterior;
  6. limpieza de las etiquetas `sha-*` antiguas.
- **`scripts/remote-backup.sh`:** mongodump con rotación de 10 copias. Lo comparten el despliegue y `backup-prod-db.sh`, que lo envía por SSH desde la copia local.
- **`docker-compose.prod.yml`:** `image: ghcr.io/carljark/pai-app-{backend,frontend}:${PAI_TAG:-latest}`. Se mantiene `build:` para la vía de emergencia.
- **`deploy-prod.sh`:** queda como vía de emergencia (construye en el EC2).

## Archivos modificados
1. `.github/workflows/ci.yml` (nuevo).
2. `.github/workflows/deploy.yml` (nuevo).
3. `scripts/remote-deploy.sh` (nuevo).
4. `scripts/remote-backup.sh` (nuevo).
5. `scripts/backup-prod-db.sh`: usa `remote-backup.sh` en lugar del script incrustado.
6. `scripts/deploy-prod.sh`: cabecera de vía de emergencia.
7. `docker-compose.prod.yml`: `image:` de GHCR en backend y frontend.
8. `backend/Dockerfile` y `frontend/Dockerfile.prod`: `LABEL org.opencontainers.image.source` y `LABEL app=pai-app`.
9. `documentation/despliegue_produccion.md`: reescrito (flujo, CI, despliegue, configuración de GitHub, vuelta atrás, emergencia y precauciones).
10. `AGENTS.md` §1:
    - ramas desde `main`;
    - CI en verde tras el push;
    - el agente integra en `main` y avisa antes si hay migraciones delicadas;
    - despliegue automático seguido con `gh run watch`;
    - `deploy-prod.sh` solo para emergencias.
11. `CLAUDE.md`: el mismo flujo en la nota de Claude Code.
12. `planes/248_plan_*.md`, `planes/README.md` y este registro.

**Configuración fuera del repo:**
- clave SSH ed25519 dedicada (`github-actions-pai-app`), autorizada en `~ubuntu/.ssh/authorized_keys` del EC2;
- en GitHub: el secreto `EC2_SSH_KEY`, las variables `EC2_HOST`, `EC2_USER`, `EC2_KNOWN_HOSTS` y `DOMAIN`, y el environment `production`.

`EC2_KNOWN_HOSTS` se obtuvo con `ssh-keyscan` y se contrastó con el `known_hosts` local; las tres claves coinciden. La copia local de la clave privada se borró tras subir el secreto.

## Decisiones técnicas
- **`git checkout` en lugar de `rsync --delete` (el método de trincaunt).** En pai-app, `mongo_data/` y `backend/uploads/` viven dentro de `~/pai-app`; una exclusión olvidada en el rsync borraría la base de datos de producción. Con git, los archivos ignorados no se tocan.
- **Vuelta atrás con la etiqueta `:previous`** en lugar de `sha-<commit anterior>` de GHCR. Funciona también cuando la versión anterior se construyó en el EC2 y no está en GHCR.
- **La vuelta atrás levanta `:previous` con el compose del commit nuevo y solo después vuelve el código al commit anterior.** La prueba de vuelta atrás encontró un fallo en el orden inicial: volver primero al commit anterior a esta tarea dejaba un compose sin `image:`, que buscaba una imagen ya borrada.
- **Prueba del despliegue antes de tocar `main`** con un disparador temporal por push a la rama 248. `workflow_dispatch` solo está disponible cuando el workflow está en la rama por defecto. El disparador se quitó antes de integrar.
- **`docker login` en cada despliegue** con el token efímero del job, como trincaunt, aunque el repo sea público. Funciona con cualquier visibilidad del paquete y no deja credenciales en el EC2.
- **No se tocan las demás imágenes ni la caché de builds del EC2** (unos 5,7 GB de caché, casi toda de los builds antiguos de pai-app), porque la máquina es compartida. Queda propuesto al usuario limpiar la caché.

## Verificación
- **CI** en GitHub para cada push de la rama 248: backend y frontend en verde.
- **Hook local `pre-push`** (suites completas): en verde en todos los pushes.
  - Una vez falló un test del backend que pasó al repetirlo. Es intermitente, probablemente por los tiempos de `mongodb-memory-server`, y no se ha reproducido.
- **`./scripts/backup-prod-db.sh` refactorizado**, contra producción: copia en el EC2 y en local de 13 MB.
- **Primer despliegue con Actions** (commit `f090b6d`, con el disparador temporal):
  - build de las dos imágenes en GitHub;
  - copia de seguridad, descarga en el EC2 en unos 27 s y migraciones al día;
  - API y frontend con 200, y `https://plappin.duckdns.org` con 200;
  - en el EC2: contenedores con las imágenes `sha-f090b6d`, `git status` limpio, 43 fichas y 129 actividades en 1.º, `backend/uploads/` intacto y sin credenciales de GHCR.
- **Prueba de vuelta atrás** con una copia temporal de `remote-deploy.sh` que fuerza el fallo de la verificación, sin descarga ni copia:
  - primera prueba: detectó el fallo de orden descrito arriba. Producción siguió respondiendo 200;
  - segunda prueba, con el script corregido: levantó `:previous`, verificó, dejó el código en el commit anterior y terminó en error.
- **Segundo despliegue con Actions** (commit `79d4d8b`), partiendo del estado tras la vuelta atrás: correcto. Las imágenes construidas antes en el EC2 ya no están; solo quedan la versión actual y `previous`.

- **Integración en `main` y primer despliegue automático real** (5-11-2026):
  - `main` avanzó con fast-forward de `ea1fec2` a `f9c004c`, sin reescribir historia;
  - el CI de `main` pasó y disparó `deploy.yml` (`workflow_run`), que terminó en verde: copia `pai_db_20261105_204151.archive.gz`, migraciones al día y `https://plappin.duckdns.org` con 200;
  - el EC2 queda en `f9c004c` con las imágenes `sha-f9c004c`, y la API devuelve las 43 fichas y 129 actividades de 1.º;
  - disco al 83 %.

## Desviaciones respecto al plan
- **Disparador temporal por push a la rama** en lugar de `workflow_dispatch` para la prueba previa a `main` (ver «Decisiones técnicas»).
- **Corrección del orden de la vuelta atrás**, detectada en la prueba.
- **Ramas desde `main`.** El plan no lo preveía, pero con `main` al día las ramas `feature/` y los cambios pequeños pasan a partir de `main`. AGENTS.md §1 lo recoge.
