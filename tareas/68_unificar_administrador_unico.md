# Tarea 68: Unificación de Usuario Administrador Único

## Propósito
De acuerdo con las directrices del usuario, se debe mantener un único usuario administrador en la plataforma, eliminando cualquier cuenta administrativa por defecto o secundaria, y dejando exclusivamente a `eva@plappin.org`. Asimismo, se implementó tolerancia a erratas tipográficas comunes en el inicio de sesión para admitir tanto `eva@plappin.org` como `eva@plapping.org`.

---

## Arquitectura y Flujo

```
[Usuario / Login] 
  │ Entrada: eva@plappin.org O eva@plapping.org
  ▼
[auth.controller.ts : login()]
  │ Normaliza email (toLowerCase, trim)
  │ Si coincide con eva@plapping.org o eva@plappin.org ──► Busca $in ['eva@plappin.org', 'eva@plapping.org']
  ▼
[MongoDB pai_db]
  │ Localiza el único registro de usuario administrador: eva@plappin.org
  │ Valida hash bcrypt con la contraseña ev954_:
  ▼
[Respuesta 200 OK]
  Token JWT emitido con _id, rol admin y canUseAi: true
```

---

## Archivos Modificados

1. [backend/src/controllers/auth.controller.ts](file:///Users/csgj/dev/pai-app/backend/src/controllers/auth.controller.ts):
   - Se añadió resolución flexible de correo electrónico en la función `login`, permitiendo el acceso exitoso tanto si el usuario escribe `eva@plappin.org` como si escribe la variante tipográfica `eva@plapping.org`.

2. [backend/src/migrations/01_create_admin_user.ts](file:///Users/csgj/dev/pai-app/backend/src/migrations/01_create_admin_user.ts):
   - Se modificó la migración para que se aplique estrictamente el principio de administrador único: cuando se define `ADMIN_EMAIL` en el entorno (o en su defecto), se elimina cualquier cuenta por defecto residual (`admin@plappin.org`) y solo se crea/mantiene la cuenta objetivo.

3. [backend/src/tests/auth.test.ts](file:///Users/csgj/dev/pai-app/backend/src/tests/auth.test.ts):
   - Se incorporó un test unitario automatizado que valida que el inicio de sesión funciona correctamente tanto con `eva@plappin.org` como con la variante `eva@plapping.org`.

4. **Base de Datos `pai_db` (MongoDB):**
   - Se purgó de la base de datos el usuario secundario `admin@plappin.org`.
   - Se verificó que únicamente existe el registro del usuario administrador `eva@plappin.org` con permisos completos de IA y rol de administrador.

---

## Detalles Técnicos y Decisiones de Diseño
- **Tolerancia a errores de tipeo sin duplicar entidades:** En vez de crear dos documentos de usuario separados en la colección (lo que violaría el requisito de un único administrador y la restricción de índice único de MongoDB sobre `email`), la normalización se realiza en la capa de servicio/controlador mediante una consulta `$in`. De esta forma, existe exactamente un único registro en la base de datos y un único historial de auditoría/telemetría.
- **Limpieza de cuentas residuales:** La migración garantiza que si el entorno define un administrador personalizado, cualquier cuenta anterior del sistema queda automáticamente eliminada, evitando brechas de seguridad o confusión entre credenciales.

---

## Estado Actual de Credenciales

| Usuario | Contraseña | Rol | Acceso IA | Estado en DB |
| :--- | :--- | :--- | :--- | :--- |
| **`eva@plappin.org`** (admite también `eva@plapping.org`) | `ev954_:` | `admin` | Habilitado | **Único administrador activo** |
| `admin@plappin.org` | - | - | - | **Eliminado** |
