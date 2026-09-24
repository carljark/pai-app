# Tarea 114: Verificación de Funcionalidades y Migración Automática de CEs de ESO

## Propósito
Responder a la duda planteada por la project manager (Eva) respecto a si se habían eliminado la generación de proyectos para FP Básica, ESO y el Panel de Control. Tras una exhaustiva auditoría del código, se constató que **ninguna de estas funcionalidades ha sido eliminada**; la percepción de desaparición se debe a:
1. **Navegación UX:** Al entrar directamente a la vista del Mapa Intermodular (`/mapa`), con el sidebar colapsado por defecto, el usuario solo ve las pestañas de FPB y CFGM del mapa.
2. **Permisos de Administrador:** El Panel de Control está restringido a usuarios con `role === 'admin'`. Los usuarios recién registrados como docentes (`teacher`) no ven dicho acceso.
3. **Persistencia Curricular:** Se identificó que las Competencias Específicas de la ESO (`CE`) no contaban con una migración automática en el arranque del servidor, lo que podía causar que en despliegues con bases de datos limpias la pestaña de ESO no mostrara asignaturas.

## Arquitectura y Acciones Realizadas

1. **Migración Automática de ESO (`06_ingest_ces_eso.ts`):**
   - Se creó una nueva migración en `backend/src/migrations/06_ingest_ces_eso.ts` que se ejecuta de forma automática con `runMigrations()` al iniciar la aplicación.
   - Detecta si la colección `CE` está vacía o incompleta y carga de forma segura las 65 CEs bilingües oficiales desde `ces_eso_bilingual.json`, resolviendo la ruta tanto en entornos locales como en contenedores Docker.
   - Se actualizó la resolución de rutas en `03_sync_ras_excel.ts` para que soporte múltiples ubicaciones del archivo `ras_excel.json`.

2. **Verificación de la Interfaz:**
   - **Nuevo Proyecto (`GeneratorViewComponent`):** Mantiene operativas las 3 pestañas:
     - `FP Básica` (con módulos de 1º y 2º de FPB y RAs asociados).
     - `CFGM Estética y Belleza` (con módulos de 1º de Grado Medio).
     - `ESO (PDC)` (con los ámbitos y competencias específicas de 3º y 4º de ESO).
   - **Panel de Control (`AdminDashboardComponent`):** Sigue 100% implementado y accesible en `/admin` mediante el botón del sidebar cuando el usuario autenticado tiene el rol de administrador.
   - **Histórico (`HistoryViewComponent`):** Dispone de los 3 filtros (`FPB`, `CFGM` y `ESO`).

## Archivos Modificados / Creados
- [`backend/src/migrations/06_ingest_ces_eso.ts`](file:///Users/csgj/dev/pai-app/backend/src/migrations/06_ingest_ces_eso.ts): Nueva migración para carga automática de CEs de ESO.
- [`backend/src/migrations/03_sync_ras_excel.ts`](file:///Users/csgj/dev/pai-app/backend/src/migrations/03_sync_ras_excel.ts): Robustecimiento de la resolución de rutas del archivo de RAs.

## Detalles Técnicos
- Se verificó que todas las pruebas automatizadas (120 de backend y 388 de frontend) se ejecutan con éxito manteniendo >95% de cobertura de branches.
- No se han realizado commits automáticos según las directrices del proyecto.
