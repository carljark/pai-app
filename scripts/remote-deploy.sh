#!/usr/bin/env bash
# Levanta en el EC2 las imágenes de GHCR de un commit. Se ejecuta EN EL EC2, desde ~/pai-app ya puesto
# en ese commit (git checkout --detach), y lo lanza .github/workflows/deploy.yml.
#
#   PAI_TAG=sha-<commit> PREV_COMMIT=<commit anterior> bash scripts/remote-deploy.sh
#
# 1. Copia de seguridad de Mongo (scripts/remote-backup.sh).
# 2. Etiqueta como :previous las imágenes de los contenedores en marcha (para volver atrás).
# 3. docker compose pull + up -d --no-build: el EC2 no construye nada.
# 4. Verifica que la API y el frontend responden. Si no, vuelve a :previous y al commit anterior.
# 5. Limpia las imágenes que ya no se usan.
# No toca .env, mongo_data/ ni backend/uploads/ (ignorados por git).
set -euo pipefail
cd "$(dirname "$0")/.."

: "${PAI_TAG:?Falta PAI_TAG (sha-<commit>)}"
PREV_COMMIT="${PREV_COMMIT:-}"
COMPOSE=(docker compose -f docker-compose.prod.yml)
REGISTRY=ghcr.io/carljark
declare -A CONTENEDOR=([backend]=pai_backend_prod [frontend]=pai_frontend_prod)

[ -f .env ] || { echo "❌ Falta ~/pai-app/.env en el EC2. Abortando." >&2; exit 1; }

copia() {
  echo "💾 Copia de seguridad: $(bash scripts/remote-backup.sh)"
}

marcar_previas() {
  for svc in backend frontend; do
    local id
    id=$(docker inspect -f '{{.Image}}' "${CONTENEDOR[$svc]}" 2>/dev/null || true)
    if [ -n "$id" ]; then docker tag "$id" "$REGISTRY/pai-app-$svc:previous"; fi
  done
}

levantar() {  # $1 = etiqueta de las imágenes
  PAI_TAG="$1" "${COMPOSE[@]}" up -d --no-build
}

verificar() {
  local api web
  for _ in $(seq 1 36); do
    api=$(curl -s -o /dev/null -w '%{http_code}' 'http://localhost:3000/api/mapa-intermodular?tab=FPB' || true)
    web=$(curl -s -o /dev/null -w '%{http_code}' 'http://localhost:8080/' || true)
    if [[ "$api" == 200 && "$web" == 200 ]]; then
      docker logs --since 10m pai_backend_prod 2>&1 | grep -E 'Migraci|Error' | tail -8 || true
      return 0
    fi
    sleep 5
  done
  echo "API: $api  Frontend: $web" >&2
  docker logs --tail 40 pai_backend_prod >&2 || true
  return 1
}

volver_atras() {
  echo "⚠️  La verificación falló: vuelvo a las imágenes anteriores (:previous)." >&2
  # Se levantan con el docker-compose.prod.yml de este commit: el del commit anterior puede no usar
  # las imágenes de GHCR (p. ej. uno anterior a la tarea 248). El código vuelve después.
  if levantar previous && verificar; then
    if [ -n "$PREV_COMMIT" ]; then git checkout -q --detach "$PREV_COMMIT"; fi
    echo "↩️  Restaurada la versión anterior (${PREV_COMMIT:-desconocida}). La base de datos tiene copia en ~/backups/pai." >&2
  else
    echo "❌ La versión anterior tampoco responde. Revisa el EC2 a mano." >&2
  fi
  exit 1
}

limpiar() {
  for svc in backend frontend; do
    docker image ls "$REGISTRY/pai-app-$svc" --format '{{.Tag}}' \
      | { grep -v -x -e latest -e previous -e "$PAI_TAG" || true; } \
      | sed "s#^#$REGISTRY/pai-app-$svc:#" | xargs -r docker rmi >/dev/null 2>&1 || true
    # Imágenes que se construían en el EC2 antes de usar GHCR (tarea 248)
    docker image rm "pai-app-$svc:latest" >/dev/null 2>&1 || true
  done
  docker image prune -f --filter label=app=pai-app >/dev/null
}

copia
marcar_previas
echo "⬇️  Descargando $PAI_TAG..."
PAI_TAG="$PAI_TAG" "${COMPOSE[@]}" pull backend frontend
levantar "$PAI_TAG"
echo "🔎 Comprobando el despliegue..."
verificar || volver_atras
limpiar
echo "✅ Desplegado $PAI_TAG en producción."
