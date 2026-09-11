# 73. Migración a MongoDB 4.4, Optimización de Caché y Restauración de Backup en EC2

## Propósito
Configurar de forma definitiva el servicio de base de datos de producción en AWS EC2 (`plappin.duckdns.org`) utilizando **MongoDB 4.4** con un límite estricto de caché WiredTiger (256 MB), garantizando la coexistencia pacífica con el contenedor `mi-mongo` (perteneciente a otra aplicación) en un entorno de recursos limitados (908 MB RAM) y preservando los 57.5 MB de datos mediante el ciclo `mongodump` -> `mongorestore`.

---

## Razón Técnica: ¿Por qué ES OBLIGATORIO restaurar la copia de seguridad?

1. **Incompatibilidad de Archivos Binarios WiredTiger hacia atrás**:
   - La carpeta `./mongo_data` actual contiene archivos físicos formateados en **WiredTiger 12.0.0** (correspondiente a MongoDB 8.0).
   - MongoDB no soporta la lectura de archivos de almacenamiento creados por versiones mayores posteriores (downgrade de 8.0 a 4.4 a nivel de archivos de disco). Si MongoDB 4.4 intenta arrancar directamente sobre la carpeta existente `mongo_data`, crasheará inmediatamente con el error `unsupported WiredTiger file version`.
2. **El rol de `mongodump`**:
   - `mongodump` no copia archivos binarios de bajo nivel, sino que serializa colecciones y documentos en formato lógico BSON/JSON.
   - Los archivos BSON son 100% universales y pueden importarse en cualquier versión de MongoDB (incluida la 4.4) mediante `mongorestore`.

---

## Arquitectura y Convivencia en el Servidor (908 MB RAM)

```text
[Servidor AWS EC2: 908 MB RAM + 2 GB Swap]
   ├── [mi-mongo:27017]         -> MongoDB 4.4 (Otra aplicación - INTOCABLE)
   ├── [pai_mongodb_prod:27018] -> MongoDB 4.4 (PAI - WiredTigerCache 0.25 GB)
   ├── [pai_backend_prod:3000]  -> Node.js Express + Mongoose
   └── [pai_frontend_prod:8080] -> Nginx Web SPA
```

---

## Archivos Modificados

- `docker-compose.prod.yml`:
  - `image: mongo:4.4`
  - `command: mongod --wiredTigerCacheSizeGB 0.25` (limita el consumo a 256 MB evitando saturación de RAM/Swap).

---

## Procedimiento Paso a Paso para Producción

1. **Exportar la copia de seguridad lógica de los datos actuales (MongoDB 8)**:
   ```bash
   docker exec -it pai_mongodb_prod mongodump --out /backup_pai
   docker cp pai_mongodb_prod:/backup_pai /home/ubuntu/backup_pai
   ```

2. **Apartar la carpeta de datos antigua y preparar la nueva**:
   ```bash
   mv mongo_data mongo_data_v8_backup
   mkdir mongo_data
   ```

3. **Descargar los cambios del repositorio en EC2**:
   ```bash
   git pull origin feature/coincidenciasv2
   ```

4. **Levantar el nuevo contenedor de MongoDB 4.4**:
   ```bash
   docker compose -f docker-compose.prod.yml down
   docker compose -f docker-compose.prod.yml up -d mongodb
   ```

5. **Restaurar todos los datos en el nuevo Mongo 4.4**:
   ```bash
   docker cp /home/ubuntu/backup_pai pai_mongodb_prod:/backup_pai
   docker exec -it pai_mongodb_prod mongorestore /backup_pai
   ```

6. **Levantar el stack completo (backend y frontend)**:
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```
