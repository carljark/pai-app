# Plan 248: Despliegue automático desde main con GitHub Actions

> **Fecha:** 5 de noviembre de 2026
> **Estado:** Aprobado
> **Partes afectadas:** despliegue / CI / documentación y reglas del agente (AGENTS.md, CLAUDE.md)

---

## 1. Objetivo

Hasta ahora, `./scripts/deploy-prod.sh` despliega la rama de trabajo desde la máquina local y **construye las imágenes en el EC2**. El servidor tiene 908 MB de RAM y lo comparte con trincaunt: al inspeccionarlo usaba 829 MB de swap y el disco estaba al 79 %. Los tests solo se pasan en un hook local `pre-push`, que no está versionado.

Se pasa al modelo de trincaunt:
- un **CI** en GitHub Actions;
- un **despliegue automático de cada commit de `main` con el CI en verde**. Las imágenes se construyen en el runner de GitHub y se publican en GHCR; el EC2 solo las descarga y las levanta.

Al dejar de compilar en el servidor, desaparece el riesgo de quedarse sin memoria y los despliegues son más rápidos. La vuelta atrás también es inmediata, porque la imagen anterior ya está construida.

## 2. Escenarios

- **Escenario: el CI valida cualquier push y PR**
  - **Dado** un push a cualquier rama o un PR
  - **Cuando** se ejecuta `ci.yml`
  - **Entonces** pasan el typecheck y `npm test` del backend (con cobertura) y `npm test` del frontend (lint, tests, cobertura por archivo y comprobación zoneless), y el build de producción del frontend compila.
- **Escenario: un commit de main con el CI en verde se despliega solo**
  - **Dado** un push a `main`
  - **Cuando** el CI termina en verde
  - **Entonces** `deploy.yml`:
    - construye y publica `ghcr.io/carljark/pai-app-backend:sha-<commit>` y `ghcr.io/carljark/pai-app-frontend:sha-<commit>`;
    - hace la copia de seguridad de Mongo en el EC2;
    - pone el código del EC2 en ese commit;
    - descarga las imágenes y levanta los contenedores sin construir nada;
    - y la API (`/api/mapa-intermodular?tab=FPB`), el frontend (`:8080`) y `https://plappin.duckdns.org` responden 200.
- **Escenario: un CI en rojo no despliega**
  - **Dado** un push a `main` con un test que falla
  - **Cuando** termina el CI
  - **Entonces** `deploy.yml` no construye ni despliega nada.
- **Escenario: las ramas feature no despliegan**
  - **Dado** un push a `feature/NNN_*`
  - **Cuando** termina el CI
  - **Entonces** no se despliega.
- **Escenario: vuelta atrás automática si la verificación falla**
  - **Dado** un despliegue cuyos contenedores no responden en 3 minutos
  - **Cuando** falla la verificación
  - **Entonces** el EC2 vuelve a levantar las imágenes que estaban en marcha antes (etiqueta `previous`) y el código del commit anterior, y el workflow termina en rojo con el log del backend.
- **Escenario: despliegue manual de un commit concreto**
  - **Dado** la pestaña Actions, o `gh workflow run deploy.yml -f ref=<commit>`
  - **Cuando** se lanza con un commit anterior de `main`
  - **Entonces** se despliega ese commit; sirve para volver atrás a mano.
- **Escenario: los datos del servidor no se tocan**
  - **Dado** cualquier despliegue
  - **Entonces** `~/pai-app/.env`, `mongo_data/` y `backend/uploads/` siguen intactos.

## 3. Alternativas

**Disparador** (decidido por el usuario): **automático solo desde `main`**, como en trincaunt, más el lanzamiento manual con un commit concreto para volver atrás. Se descartan el despliegue manual por rama y los modelos mixtos.

**Cómo llega el código al EC2**
- **`git fetch` y `git checkout --detach <commit>` en el clon que ya existe en `~/pai-app` (recomendada).** El servidor solo necesita del commit `docker-compose.prod.yml` y los scripts, y git no toca los archivos ignorados (`.env`, `mongo_data/`, `backend/uploads/`).
- `rsync --delete` de `git archive`, como trincaunt: allí funciona porque sus datos viven fuera de la carpeta. Aquí `mongo_data/` y `backend/uploads/` están dentro de `~/pai-app`. Una exclusión olvidada **borraría la base de datos de producción**, así que se descarta.

**Dónde se construye**
- **Runner de GitHub (amd64, como el EC2) y publicación en GHCR, con caché de capas `type=gha` (recomendada).** Es lo que hace trincaunt; el repo es público y los minutos no cuestan nada.
- Construir en local y hacer `docker save`/`load`: depende de la máquina del usuario. Descartada.

**Vuelta atrás**
- **Antes de levantar, etiquetar como `previous` las imágenes que usan los contenedores en marcha (recomendada).** Funciona también en el primer despliegue, cuyas imágenes anteriores se construyeron en el EC2 y no están en GHCR.
- Volver a `sha-<commit anterior>` en GHCR: no sirve en la transición.

**Script de despliegue manual (`deploy-prod.sh`)**: se conserva como **vía de emergencia** (construye en el EC2) por si GitHub Actions no está disponible, pero deja de formar parte del flujo normal.

## 4. Cambios por archivo

| Archivo | Cambio | Capa |
|---|---|---|
| `.github/workflows/ci.yml` (nuevo) | Push a cualquier rama y PR. Job `backend`: `npm ci`, `npm run typecheck`, `npm run test:cov`. Job `frontend`: `npm ci --legacy-peer-deps`, `npm test` (lint, tests, `check-coverage.js` y `check-zoneless.js`) y `npm run build -- --configuration production`. Node 22 con caché de npm | config |
| `.github/workflows/deploy.yml` (nuevo) | Ver detalle debajo de la tabla | config |
| `scripts/remote-deploy.sh` (nuevo) | Se ejecuta **en el EC2**. Ver detalle debajo de la tabla | infrastructure |
| `scripts/remote-backup.sh` (nuevo) | La parte remota de `backup-prod-db.sh` (mongodump a `~/backups/pai/` y rotación de las últimas 10), para usarla desde el workflow | infrastructure |
| `scripts/backup-prod-db.sh` | Llama por SSH a `remote-backup.sh` en lugar de llevar el script incrustado. Sigue descargando la copia a `backups/` cuando se usa en local | infrastructure |
| `docker-compose.prod.yml` | `image: ghcr.io/carljark/pai-app-{backend,frontend}:${PAI_TAG:-latest}` en los dos servicios. Se mantiene `build:` para la vía de emergencia | config |
| `backend/Dockerfile`, `frontend/Dockerfile.prod` | `LABEL org.opencontainers.image.source=https://github.com/carljark/pai-app` y `LABEL app=pai-app`, para enlazar el paquete al repo y para la limpieza | config |
| `scripts/deploy-prod.sh` | Comentario de cabecera: vía de emergencia. Etiqueta las imágenes construidas con los nombres de GHCR | infrastructure |
| `documentation/despliegue_produccion.md` | Reescrito con el nuevo flujo, la configuración de GitHub, cómo volver atrás y la vía de emergencia | docs |
| `AGENTS.md` §1 y `CLAUDE.md` | Ver detalle debajo de la tabla | docs |
| `.agents/rules/` | El mismo cambio, donde duplique §1 | docs |

**`deploy.yml`**
- Disparadores:
  - `workflow_run` del CI en `main` con `conclusion == success` y evento `push`;
  - `workflow_dispatch` con `ref`.
- `concurrency: deploy-production`, sin cancelar el despliegue en marcha.
- Job `build`: una matriz backend/frontend con `docker/build-push-action`, `linux/amd64`, etiquetas `sha-<commit>` y `latest`, y caché `gha`.
- Job `deploy`, en el environment `production` con la URL de `plappin.duckdns.org`:
  - SSH con la clave dedicada y `known_hosts` fijo;
  - en el EC2: `git fetch` y `checkout --detach`, y `PAI_TAG=sha-<commit> bash scripts/remote-deploy.sh`;
  - `docker logout` del EC2 en todos los casos;
  - comprobación pública de `https://plappin.duckdns.org`.

**`scripts/remote-deploy.sh`**
1. Comprueba que existe `.env`.
2. Copia de seguridad (`remote-backup.sh`).
3. Etiqueta como `previous` las imágenes de los contenedores en marcha.
4. `docker compose pull` de backend y frontend, y `up -d --no-build`.
5. Verificación: hasta 3 minutos, comprobando la API y el frontend con 200, y muestra las líneas de migraciones.
6. Si falla: `PAI_TAG=previous up -d --no-build`, checkout del commit anterior y error.
7. Limpieza de las etiquetas `sha-*` antiguas y `docker image prune` con `label=app=pai-app`.

**`AGENTS.md` §1 y `CLAUDE.md`**
- El paso 4 pasa a ser «integrar en `main`», según la decisión del §6.
- El despliegue lo hace GitHub Actions. El agente sigue el workflow con `gh run watch` y comprueba la API al terminar.
- `deploy-prod.sh` solo se usa como emergencia.
- El hook local `pre-push` queda opcional.

**Configuración en GitHub y en el EC2** (no son archivos del repo):
- **Clave SSH dedicada:** `ed25519`, con la parte pública en `~ubuntu/.ssh/authorized_keys` del EC2 y un comentario `github-actions-pai-app`.
- **Secreto** `EC2_SSH_KEY` y **variables** `EC2_HOST`, `EC2_USER`, `EC2_KNOWN_HOSTS` (con `ssh-keyscan`) y `DOMAIN`.
- **Environment** `production`.
- **Visibilidad pública de los paquetes de GHCR**, o bien `docker login` en cada despliegue con el token del job, como en trincaunt. Se usará el login, que funciona en los dos casos.

## 5. Tareas

1. [ ] Crear la rama `feature/248_despliegue_automatico_github_actions` desde la rama actual (`feature/247_*`, que contiene todo lo desplegado).
2. [ ] Escribir `ci.yml` y comprobar con el push de la rama que el CI pasa en GitHub. Si falla algo propio del entorno de CI, corregirlo; por ejemplo, la descarga de `mongodb-memory-server` o `--legacy-peer-deps`.
3. [ ] `remote-backup.sh` y adaptación de `backup-prod-db.sh`; probar `./scripts/backup-prod-db.sh` contra producción, que solo lee.
4. [ ] `remote-deploy.sh`, cambios de `docker-compose.prod.yml`, etiquetas `LABEL` de los Dockerfiles y `deploy.yml`.
5. [ ] **Con confirmación del usuario:** generar la clave dedicada, añadirla al EC2 y configurar el secreto, las variables y el environment con `gh secret set` y `gh variable set`.
6. [ ] Probar `deploy.yml` antes de tocar `main`: lanzarlo a mano con `workflow_dispatch` y `ref` = el commit de la rama 248, que es el mismo código que ya está en producción más estos archivos. Comprobar el pull desde GHCR, el arranque, la verificación y la limpieza.
7. [ ] Probar la vuelta atrás una vez: lanzar con un `PAI_TAG` inexistente, o forzar el fallo de la verificación, y comprobar que vuelve a `previous`.
8. [ ] Documentación: `despliegue_produccion.md`, AGENTS.md §1, CLAUDE.md y `.agents/rules/`.
9. [ ] Suites completas en local y en el CI. Commit y push.
10. [ ] **Integración en `main`, con el OK del usuario:** avanzar `main` hasta la rama 248 con fast-forward. `main` va 312 commits por detrás y la rama 248 los contiene todos, así que no hay conflictos. Ese push dispara el primer despliegue automático real; se sigue con `gh run watch` y se comprueba la API.
11. [ ] Registrar la tarea en `tareas/248_*.md` y actualizar la memoria del agente sobre el flujo de cada tarea.

## 6. Riesgos y verificación prevista

- **`main` está muy por detrás de producción** (312 commits). Si se despliega `main` antes de avanzarlo, producción vuelve a una versión de hace semanas, y las migraciones no se deshacen. Por eso el paso 10 va al final, y antes nada dispara un despliegue desde `main`. Las pruebas del paso 6 se hacen a mano y con el mismo código que ya está en producción.
- **Borrar datos del EC2.** Se descarta `rsync --delete`. Con `git checkout`, los archivos ignorados no se tocan. Antes de la primera prueba se comprueba que `mongo_data/` y `backend/uploads/` están en `.gitignore` y que `git status` del EC2 está limpio.
- **Primer `git checkout --detach` en el EC2:** hoy tiene la rama `feature/247_*`. Si hay cambios locales en el EC2 sin commit, el checkout se detendría; se revisa antes.
- **Memoria del EC2 durante el pull:** las capas del backend pesan unos 800 MB en disco, pero descargarlas no compila nada. Con el disco al 79 %, la limpieza de imágenes y un `docker image prune` inicial de las imágenes `pai-app-*` construidas en el EC2 liberan espacio.
- **Seguridad:**
  - clave SSH dedicada y revocable, separada de `co2univ-key.pem`;
  - `known_hosts` fijo para no aceptar un servidor falso;
  - token de GHCR válido solo durante el job, con `docker logout` al acabar.

  El repo es público: los logs de Actions no deben imprimir el `.env` ni los secretos.
- **Interrupción de generaciones en curso** al reiniciar el backend: igual que ahora. Al desplegar desde `main`, conviene evitar merges en horas de uso.
- **Migraciones delicadas:** el despliegue automático las aplica sin avisar. La regla de AGENTS.md cambia a «avisar al usuario **antes de integrar en `main`** si la tarea trae migraciones de datos delicadas».
- **Quién integra en `main` (decidido por el usuario: opción a).** El agente, al final de cada tarea con los tests en verde y el CI de la rama en verde, avanza `main` (fast-forward o merge sin reescribir historia) y hace push; el despliegue es automático. Se descartó la opción b (PR que fusiona el usuario).
- **Verificación prevista:**
  - el CI en verde en GitHub para la rama 248;
  - una ejecución manual de `deploy.yml` correcta, con producción respondiendo 200 y los mismos datos;
  - la prueba de vuelta atrás;
  - el primer despliegue automático desde `main`;
  - `curl` a la API de producción tras cada paso (p. ej. `GET /api/afinidades-eso?tab=ESO_1` con 43 fichas);
  - `docker ps` y `df -h` en el EC2.
