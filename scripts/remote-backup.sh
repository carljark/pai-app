#!/usr/bin/env bash
# Copia de seguridad de la base de datos de producción. Se ejecuta EN EL EC2.
#
# - Genera ~/backups/pai/pai_db_<fecha>.archive.gz con mongodump (solo lectura: no modifica la base).
# - Conserva las últimas $KEEP copias (10 por defecto).
# - Escribe en la salida estándar solo la ruta de la copia.
#
# Lo usan scripts/remote-deploy.sh (despliegue con GitHub Actions) y scripts/backup-prod-db.sh (en local).
set -euo pipefail

KEEP="${KEEP:-10}"
dir="$HOME/backups/pai"
mkdir -p "$dir"
file="$dir/pai_db_$(date +%Y%m%d_%H%M%S).archive.gz"
docker exec pai_mongodb_prod mongodump --db pai_db --archive --gzip > "$file" 2> /tmp/pai_dump.log
gzip -t "$file"
# Rotación: borra las copias más antiguas por encima de KEEP
ls -1t "$dir"/pai_db_*.archive.gz | tail -n +"$((KEEP + 1))" | xargs -r rm -f
echo "$file"
