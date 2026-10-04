# Copias de seguridad y traspaso de proyectos entre instalaciones

## Copia de seguridad de producción
- Producción: EC2 Ubuntu `51.92.83.118` (`plappin.duckdns.org`). El contenedor de base de datos es `pai_mongodb_prod` (MongoDB 4.4) y la base, `pai_db`.
- `./scripts/backup-prod-db.sh`, desde el Mac del proyecto:
  1. Ejecuta por SSH `mongodump --db pai_db --archive --gzip` dentro del contenedor. Es solo lectura.
  2. Guarda la copia en el EC2, en `~/backups/pai/pai_db_<fecha>.archive.gz`, y conserva las 10 últimas (`PAI_BACKUP_KEEP`).
  3. La descarga a `./backups/`, carpeta ignorada por git porque contiene usuarios y proyectos reales.
  4. Comprueba la integridad del gzip en ambos lados.
- Variables de entorno opcionales:
  - `PAI_SSH_KEY`: por defecto `~/UJI/co2univ/co2univ-key.pem`;
  - `PAI_SSH_HOST`: por defecto `ubuntu@51.92.83.118`;
  - `PAI_BACKUP_KEEP`.
- Para programarla en el propio EC2 con cron, por ejemplo cada noche a las 3:00:
  ```
  0 3 * * * docker exec pai_mongodb_prod mongodump --db pai_db --archive --gzip > ~/backups/pai/pai_db_$(date +\%Y\%m\%d).archive.gz
  ```

## Restaurar una copia en local
- `./scripts/restore-db-local.sh backups/pai_db_<fecha>.archive.gz`
- Reemplaza por completo la base local `pai_db` del contenedor Docker `pai_db` (`mongorestore --drop`) y pide confirmación antes.
- No apunta nunca a producción.
- Después, el backend aplica las migraciones pendientes al arrancar, o con `docker exec pai_backend npm run migrate`.

## Exportar e importar proyectos desde la aplicación
Panel de administración → «Exportar e importar proyectos». Sirve para traspasar proyectos sin sustituir toda la base de datos (de producción a local o al revés) y para copiar a la cuenta propia proyectos de otros usuarios.

### Exportación
Se pueden exportar proyectos de **cualquier usuario**.
- `GET /api/admin/projects/exportable`: lista ligera de los proyectos `borrador` y `publicado`, sin contenido. Incluye título (o el título por defecto de los proyectos antiguos), nivel, curso, estado, idioma, fecha y autor.
- En el panel, esa lista tiene:
  - buscador por título, nombre o email del autor (sin distinguir acentos);
  - casillas y «Seleccionar todos los visibles»;
  - los botones «Exportar seleccionados (N)» y «Exportar todos (N)».
- `GET /api/admin/projects/export[?ids=a,b]` descarga `plappin-proyectos-AAAA-MM-DD.json` con el formato `{ format: 'plappin-projects', version: 1, exportedAt, count, projects }`.
  - Sin `ids` incluye todos los proyectos `borrador` y `publicado`.
  - Con `ids` incluye solo esos, y también deben estar terminados.
- Cada proyecto lleva:
  - sus metadatos;
  - el contenido;
  - las traducciones terminadas;
  - el autor y los colaboradores de origen por email, solo como información;
  - un `sourceId`: el id de origen, o el `importSourceId` si el proyecto ya venía de otra importación.
- No se exportan el prompt, las instrucciones internas de la IA ni las traducciones en curso o con error.

### Importación
`POST /api/admin/projects/import`, solo para administradores, con el mismo formato.
- **Todos los proyectos importados quedan a nombre del usuario activo** (quien importa) y sin colaboradores, sea cual sea su autor de origen.
- El panel envía el fichero en trozos de unos 3 MB, porque el backend acepta cuerpos JSON de hasta 10 MB y Nginx de hasta 50 MB. Si se interrumpe, se puede volver a importar el mismo fichero.
- **Sin duplicados para quien importa:** se omite un proyecto si el usuario activo ya tiene uno con `importSourceId` igual a su `sourceId`, o si el original (`_id` = `sourceId`) es suyo.
  - Reimportar el mismo fichero no duplica nada.
  - Un proyecto de otro usuario de la misma instalación sí se copia, una vez, a la cuenta propia.
- **Proyectos antiguos sin título ni nivel:** se aceptan con los mismos valores por defecto que al crear un proyecto (título formado por los módulos, nivel FP Básica).
- **Proyectos rechazados:** los que no tienen contenido o traen un nivel desconocido.
- Respuesta: `{ imported, skipped, errors: [{ title, error }] }`.
- Después de importar, el panel recarga la lista de proyectos exportables.
- Queda registrado en el ActivityLog: `EXPORT_PROJECTS` e `IMPORT_PROJECTS`.

## Implementación
- Backend:
  - `services/project-transfer.service.ts`;
  - `controllers/project-transfer.controller.ts`;
  - rutas en `routes/admin.routes.ts`;
  - campos `importSourceId` e `importedAt` en `models/Project.ts`.
- Frontend:
  - `features/admin/services/projects-transfer.service.ts` (lista, exportación por ids, validación del fichero y división en trozos);
  - componente `features/admin/components/projects-transfer/`, incluido en el panel de administración;
  - componente `features/admin/components/export-selection/` (lista con buscador y selección).
