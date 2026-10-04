#!/usr/bin/env bash
# Restaura una copia (pai_db_*.archive.gz) en la base de datos LOCAL de Docker (contenedor pai_db).
#
# ⚠️ Sustituye por completo la base local pai_db (mongorestore --drop). Nunca apunta a producción.
#
# Uso:  ./scripts/restore-db-local.sh backups/pai_db_20261004_160017.archive.gz
set -euo pipefail

archive="${1:-}"
if [[ -z "$archive" || ! -f "$archive" ]]; then
  echo "Uso: $0 <ruta a pai_db_*.archive.gz>" >&2
  exit 1
fi
gzip -t "$archive"

read -r -p "Se reemplazará la base de datos LOCAL pai_db con $(basename "$archive"). ¿Continuar? (escribe 'si'): " answer
[[ "$answer" == "si" ]] || { echo "Cancelado."; exit 1; }

docker exec -i pai_db mongorestore --archive --gzip --drop --nsInclude='pai_db.*' < "$archive"
echo "✅ Base local restaurada. Las migraciones pendientes se aplican al reiniciar el backend (o con: docker exec pai_backend npm run migrate)."
