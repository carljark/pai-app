#!/usr/bin/env bash
# Copia de seguridad de la base de datos de producción (EC2) con mongodump.
#
# - Genera en el EC2 ~/backups/pai/pai_db_<fecha>.archive.gz (solo lectura: no modifica la base).
# - Conserva en el EC2 las últimas $PAI_BACKUP_KEEP copias (10 por defecto).
# - Descarga la copia a ./backups/ (carpeta ignorada por git).
#
# Uso:  ./scripts/backup-prod-db.sh
# Variables opcionales: PAI_SSH_KEY, PAI_SSH_HOST, PAI_BACKUP_KEEP
set -euo pipefail

SSH_KEY="${PAI_SSH_KEY:-$HOME/UJI/co2univ/co2univ-key.pem}"
SSH_HOST="${PAI_SSH_HOST:-ubuntu@51.92.83.118}"
KEEP="${PAI_BACKUP_KEEP:-10}"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)/backups"

remote_file=$(ssh -i "$SSH_KEY" -o ConnectTimeout=15 "$SSH_HOST" "KEEP=$KEEP bash -s" <<'REMOTE'
set -euo pipefail
dir="$HOME/backups/pai"
mkdir -p "$dir"
file="$dir/pai_db_$(date +%Y%m%d_%H%M%S).archive.gz"
docker exec pai_mongodb_prod mongodump --db pai_db --archive --gzip > "$file" 2> /tmp/pai_dump.log
gzip -t "$file"
# Rotación: borra las copias más antiguas por encima de KEEP
ls -1t "$dir"/pai_db_*.archive.gz | tail -n +"$((KEEP + 1))" | xargs -r rm -f
echo "$file"
REMOTE
)

mkdir -p "$LOCAL_DIR"
scp -i "$SSH_KEY" -q "$SSH_HOST:$remote_file" "$LOCAL_DIR/"
local_file="$LOCAL_DIR/$(basename "$remote_file")"
gzip -t "$local_file"
echo "✅ Copia en el EC2: $remote_file"
echo "✅ Copia local:     $local_file ($(du -h "$local_file" | cut -f1))"
