#!/usr/bin/env bash
# Despliega en producción (EC2) la rama de trabajo actual. Ver documentation/despliegue_produccion.md.
#
# 1. Comprueba que no hay cambios sin commit y que la rama está subida a origin.
# 2. Hace una copia de seguridad de la base de datos (scripts/backup-prod-db.sh).
# 3. En el EC2: fetch + checkout + pull --ff-only de la rama y docker compose up -d --build.
# 4. Verifica que la API y el frontend responden. Si no, vuelve al commit desplegado antes.
#
# Uso:  ./scripts/deploy-prod.sh            (rama actual)
#       ./scripts/deploy-prod.sh <rama>
set -euo pipefail

SSH_KEY="${PAI_SSH_KEY:-$HOME/UJI/co2univ/co2univ-key.pem}"
SSH_HOST="${PAI_SSH_HOST:-ubuntu@51.92.83.118}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BRANCH="${1:-$(git -C "$ROOT" branch --show-current)}"
ssh_ec2() { ssh -i "$SSH_KEY" -o ConnectTimeout=15 "$SSH_HOST" "$@"; }

if [[ -n "$(git -C "$ROOT" status --porcelain)" ]]; then
  echo "❌ Hay cambios sin commit. Haz commit antes de desplegar." >&2
  exit 1
fi
git -C "$ROOT" fetch -q origin "$BRANCH"
if [[ "$(git -C "$ROOT" rev-parse HEAD)" != "$(git -C "$ROOT" rev-parse "origin/$BRANCH")" ]]; then
  echo "❌ La rama $BRANCH no coincide con origin/$BRANCH. Haz push antes de desplegar." >&2
  exit 1
fi

echo "💾 Copia de seguridad de producción..."
"$ROOT/scripts/backup-prod-db.sh"

echo "🚀 Desplegando $BRANCH ($(git -C "$ROOT" rev-parse --short HEAD))..."
PREV=$(ssh_ec2 "BRANCH='$BRANCH' bash -s" <<'REMOTE'
set -euo pipefail
cd ~/pai-app
prev=$(git rev-parse HEAD)
git fetch -q origin "$BRANCH"
git checkout -q "$BRANCH" 2>/dev/null || git checkout -q -b "$BRANCH" "origin/$BRANCH"
git pull -q --ff-only origin "$BRANCH"
docker compose -f docker-compose.prod.yml up -d --build >/tmp/pai_deploy.log 2>&1 || { tail -40 /tmp/pai_deploy.log >&2; exit 1; }
echo "$prev"
REMOTE
) || { echo "❌ Falló la construcción en el EC2 (no se ha cambiado lo que estaba en marcha si el build no terminó)." >&2; exit 1; }

echo "🔎 Comprobando el despliegue..."
if ssh_ec2 'bash -s' <<'REMOTE'
for i in $(seq 1 36); do
  api=$(curl -s -o /dev/null -w '%{http_code}' 'http://localhost:3000/api/mapa-intermodular?tab=FPB' || true)
  web=$(curl -s -o /dev/null -w '%{http_code}' 'http://localhost:8080/' || true)
  if [[ "$api" == 200 && "$web" == 200 ]]; then
    docker logs --since 10m pai_backend_prod 2>&1 | grep -E 'Migraci|Error' | tail -8
    exit 0
  fi
  sleep 5
done
echo "API: $api  Frontend: $web" >&2
docker logs --tail 40 pai_backend_prod >&2
exit 1
REMOTE
then
  echo "✅ Desplegado $BRANCH ($(git -C "$ROOT" rev-parse --short HEAD)) en producción."
else
  echo "⚠️  La verificación falló: volviendo al commit anterior ($PREV)..." >&2
  ssh_ec2 "cd ~/pai-app && git checkout -q '$PREV' && docker compose -f docker-compose.prod.yml up -d --build >/tmp/pai_rollback.log 2>&1" \
    && echo "↩️  Restaurado el commit $PREV. La base de datos tiene copia en backups/ por si una migración la dejó mal." >&2
  exit 1
fi
