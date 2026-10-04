# Tarea 188: Copia de seguridad de producción y exportación e importación de proyectos

## Propósito
- Hacer una copia de seguridad de la base de datos de producción (EC2 Ubuntu) y poder repetirla.
- Poder exportar proyectos de una instalación e importarlos en otra: de producción a local y al revés.

## Copia de seguridad realizada (4 de octubre de 2026)
- `mongodump --db pai_db --archive --gzip` sobre el contenedor `pai_mongodb_prod`, una operación de solo lectura.
- Contenido: 73 proyectos, 9 usuarios, 254 RA, 65 CE, 51 módulos de mapa, 129 registros de actividad, 124 sesiones, 73 notificaciones, 26 migraciones, 1 configuración y 1 sugerencia.
- Dónde está:
  - en el EC2: `~/backups/pai/pai_db_20261004_160017.archive.gz` (3,3 MB) y `pai_db_20261004_160113.archive.gz` (generada al probar el script);
  - en local: las mismas copias en `backups/`, carpeta añadida a `.gitignore`.

## Scripts
- `scripts/backup-prod-db.sh`: copia por SSH con rotación (10 copias en el EC2) y descarga local, comprobando la integridad del gzip. Probado contra producción.
- `scripts/restore-db-local.sh`: restaura una copia en la base local de Docker. Pide confirmación y usa `--drop` solo sobre la base local `pai_db`.

## Exportación e importación de proyectos
- **Backend:**
  - `GET /api/admin/projects/export[?ids=]` y `POST /api/admin/projects/import`, solo para administradores;
  - lógica en `project-transfer.service.ts`.
  - Los usuarios se identifican por email.
  - El origen de cada proyecto (`sourceId` → `importSourceId`) evita duplicados al reimportar y en los viajes de ida y vuelta.
- **Frontend:** componente `app-projects-transfer` en el panel de administración, con:
  - botón de exportar (descarga el JSON);
  - selector de fichero para importar, que valida el formato y envía trozos de unos 3 MB;
  - progreso y resumen (importados, ya existentes, errores y proyectos asignados a quien importa).
- **Modelo:** `Project.importSourceId` (indexado) e `importedAt`.
- Detalle del formato y de las reglas: `documentation/exportacion_importacion_proyectos.md`.

## Decisiones técnicas
- **JSON propio en lugar de `mongoexport`:**
  - los ids de usuario no coinciden entre bases de datos, así que el autor y los colaboradores viajan por email;
  - los campos internos (prompts, traducciones a medias) no deben viajar;
  - el formato permite validar el fichero antes de escribir nada.
- **Solo proyectos `borrador` y `publicado`:** los que están en cola, generándose o con error no tienen contenido útil.
- **Importación permisiva con los proyectos antiguos:** en producción hay 12 sin título y 2 sin nivel. Se importan con los mismos valores por defecto que usa la aplicación.
- **Envío en trozos desde el navegador:** evita los límites de tamaño de Express (10 MB) y Nginx (50 MB) sin abrirlos para todas las rutas.

## Archivos
- Nuevos:
  - `scripts/backup-prod-db.sh`;
  - `scripts/restore-db-local.sh`;
  - `backend/src/services/project-transfer.service.ts`;
  - `backend/src/controllers/project-transfer.controller.ts`;
  - `backend/src/tests/project-transfer.test.ts`;
  - `frontend/src/app/features/admin/services/projects-transfer.service.ts` y su spec;
  - `frontend/src/app/features/admin/components/projects-transfer/`: `.ts`, `.html`, `.scss` y spec;
  - `documentation/exportacion_importacion_proyectos.md`.
- Modificados:
  - `.gitignore`;
  - `backend/src/models/Project.ts`;
  - `backend/src/routes/admin.routes.ts`;
  - `admin-dashboard.component.ts`, `.html` y su spec (mock del servicio nuevo).

## Observaciones
- En producción hay 1 proyecto en estado `generando` y 2 en `error`.
- La carpeta `mongo_dump/` del repositorio está versionada en git y contiene un volcado de `projects`, `ras` y `ces`, sin usuarios.

## Pendiente
- Ejecutar `cd backend && npm test` y `cd frontend && npm test`.
- Desplegar en producción para tener allí la exportación.
