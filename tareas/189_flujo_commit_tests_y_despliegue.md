# Tarea 189: Flujo de trabajo con tests, commit y despliegue automáticos

## Propósito
El usuario pide que cada tarea la cierre el agente: tests en verde (corrigiendo los fallos), commit, push y despliegue en el EC2. Las tareas grandes van en una rama `feature/` nueva; los cambios mínimos, en la rama de trabajo actual. En producción se despliega la rama de trabajo, y el merge a `main` lo decide el usuario.

## Cambios
- **`AGENTS.md`:**
  - §1 pasa de «no hagas commits» a describir el flujo completo: rama según el tamaño de la tarea, verificación, commit y push sin forzar, y despliegue con copia de seguridad previa y vuelta atrás si falla;
  - §6 pide ejecutar las suites completas;
  - §7 aclara que el despliegue y sus migraciones son la excepción a no escribir en producción.
- **`GEMINI.md`** y **`CLAUDE.md`:** remiten a AGENTS.md §1. CLAUDE.md incluye el acceso SSH y la guía de despliegue.
- **`.claude/hooks/guard-bash.sh`:**
  - deja de bloquear `git commit` y los tests;
  - ahora bloquea solo las operaciones git destructivas: `push --force` o `-f` o `+refspec`, `reset --hard`, `clean -f`, `branch -D` y descartar todos los cambios.
  - Se ha probado con 14 comandos de ejemplo.
- **`scripts/deploy-prod.sh`:**
  1. Exige que no haya cambios sin commit y que la rama esté subida.
  2. Hace la copia de seguridad (`scripts/backup-prod-db.sh`).
  3. Hace `pull --ff-only` de la rama en el EC2 y `docker compose -f docker-compose.prod.yml up -d --build`.
  4. Comprueba durante hasta 3 minutos que la API y el frontend responden con 200.
  5. Si no responden, vuelve al commit desplegado antes.
- **`documentation/despliegue_produccion.md`:** entorno de producción, flujo, script y precauciones (memoria del EC2, interrupción de generaciones y traducciones, restauración de la base de datos).

## Decisiones técnicas
- **Vuelta atrás con `git checkout <commit>`** en el EC2, en lugar de `reset --hard`, que además bloquea el hook. El siguiente despliegue vuelve a hacer `checkout` de la rama.
- **La base de datos no se restaura automáticamente** si falla un despliegue: siempre queda la copia del paso 2 y se restaura con confirmación del usuario.
- **El build sigue haciéndose en el EC2**, como hasta ahora. Si un día no hay memoria suficiente, se construirá la imagen en local.

## Archivos
- `AGENTS.md`, `GEMINI.md` y `CLAUDE.md`.
- `.claude/hooks/guard-bash.sh`.
- Nuevos: `scripts/deploy-prod.sh` y `documentation/despliegue_produccion.md`.
