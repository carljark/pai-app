# Tarea 69: Garantía de Persistencia e Inmutabilidad de Usuarios Auto-Registrados en Migraciones

## Propósito
El usuario solicitó asegurar explícitamente que los usuarios que se auto-registren en la plataforma (a través del formulario de registro `/api/auth/register`) no sean eliminados, sobrescritos ni alterados en futuras ejecuciones de migraciones del sistema.

---

## Análisis y Verificación de Migraciones
Se realizó una auditoría completa del directorio [backend/src/migrations/](file:///Users/csgj/dev/pai-app/backend/src/migrations/):

1. **[runner.ts](file:///Users/csgj/dev/pai-app/backend/src/migrations/runner.ts):**
   - El ejecutor de migraciones mantiene una colección en base de datos (`migrations`) donde registra el nombre de cada script ejecutado con éxito.
   - **Idempotencia:** Cada migración se ejecuta una única vez por base de datos. En reinicios posteriores del contenedor de backend, los scripts ya ejecutados son omitidos (`if (!exists)`).

2. **[01_create_admin_user.ts](file:///Users/csgj/dev/pai-app/backend/src/migrations/01_create_admin_user.ts):**
   - Su propósito es asegurar la cuenta del administrador definida en `.env` (`ADMIN_EMAIL`).
   - El código busca exclusivamente el correo objetivo (`User.findOne({ email: targetEmail })`).
   - Si no existe, lo crea; si existe, únicamente garantiza que su rol sea `admin` y `canUseAi: true`.
   - Únicamente purga la cuenta transitoria del sistema `admin@plappin.org` si difiere del administrador de entorno configurado.
   - **Garantía:** No contiene llamadas a `User.deleteMany({})` globales ni modifica a usuarios con otros correos o con roles `pending` o `teacher`.

3. **[02_update_ras.ts](file:///Users/csgj/dev/pai-app/backend/src/migrations/02_update_ras.ts) y [03_sync_ras_excel.ts](file:///Users/csgj/dev/pai-app/backend/src/migrations/03_sync_ras_excel.ts):**
   - Operan única y exclusivamente sobre la colección de Resultados de Aprendizaje (`RA`), sin interactuar bajo ninguna circunstancia con la colección de usuarios (`User`).

---

## Nuevas Pruebas Automatizadas de Seguridad e Idempotencia
Se ha creado una suite de tests unitarios dedicada en [backend/src/tests/migrations.test.ts](file:///Users/csgj/dev/pai-app/backend/src/tests/migrations.test.ts) que valida dos invariantes críticas:
1. **Preservación estricta de usuarios auto-registrados:**
   - Se crean usuarios con roles `pending` y `teacher` con contraseñas y permisos propios.
   - Se dispara la ejecución de la migración.
   - Se comprueba que dichos usuarios permanecen exactamente intactos en MongoDB con sus respectivos IDs, hashes de contraseña, roles y flags `canUseAi`.
2. **Idempotencia sin duplicación:**
   - La ejecución repetida de migraciones no crea duplicados de administradores ni elimina usuarios existentes.

---

## Archivos Afectados
- [backend/src/migrations/01_create_admin_user.ts](file:///Users/csgj/dev/pai-app/backend/src/migrations/01_create_admin_user.ts): Importación directa del modelo `User` para robustez y aislamiento de esquemas.
- [backend/src/tests/migrations.test.ts](file:///Users/csgj/dev/pai-app/backend/src/tests/migrations.test.ts): Tests de regresión e idempotencia.
- [tareas/69_garantia_persistencia_usuarios_en_migraciones.md](file:///Users/csgj/dev/pai-app/tareas/69_garantia_persistencia_usuarios_en_migraciones.md): Documento técnico de la tarea.
