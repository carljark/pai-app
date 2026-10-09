#!/usr/bin/env bash
# Muestra en JSON las solicitudes de centros abiertas en producción y los ciclos que faltan
# por incorporar. Solo lectura: no modifica la base de datos. Lo usa la skill `procesar-solicitudes`.
#
# Uso:  ./scripts/solicitudes-pendientes.sh
# Variables opcionales: PAI_SSH_KEY, PAI_SSH_HOST
set -euo pipefail

SSH_KEY="${PAI_SSH_KEY:-$HOME/UJI/co2univ/co2univ-key.pem}"
SSH_HOST="${PAI_SSH_HOST:-ubuntu@51.92.83.118}"

ssh -i "$SSH_KEY" -o ConnectTimeout=15 "$SSH_HOST" \
  "docker exec pai_backend_prod npx tsx scripts/solicitudes-pendientes.ts"
