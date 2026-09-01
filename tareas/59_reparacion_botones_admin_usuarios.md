# Tarea 59: Reparación y Ampliación de las Acciones de Usuario en el Panel de Administración

## Propósito
Diagnosticar y reparar los botones de gestión de usuarios en el panel de administración (`/api/admin`), los cuales no ejecutaban acciones debido a una discordancia entre los endpoints invocados por el frontend y los registrados en el backend:
1. **Discordancia de Endpoints:**
   - El frontend invocaba `PUT /api/admin/users/:id/role` y `PUT /api/admin/users/:id/ai`, mientras que el backend sólo exponía `PUT /api/admin/users/:id/permissions`, devolviendo un error HTTP 404 silencioso.
2. **Corrección de Rutas en Backend:**
   - Se registraron en `admin.routes.ts` los alias directos `/users/:id/role`, `/users/:id/ai` y `/users/:id/permissions` apuntando a `updateUserPermissions`.
   - Se implementó y expuso la funcionalidad `deleteUser` (`DELETE /api/admin/users/:id`) con protección para evitar que un administrador elimine su propia cuenta.
3. **Ampliación de Controles en Frontend (`admin-dashboard.component.ts`):**
   - **Aprobar:** Convierte usuarios en espera (`pending`) a profesores (`teacher`).
   - **Conmutar Rol:** Permite alternar entre roles `teacher` y `admin` con un solo clic.
   - **Activar / Desactivar IA:** Conmuta el permiso `canUseAi` en tiempo real.
   - **Eliminar Usuario:** Permite eliminar cuentas de usuario obsoletas.
   - La reactividad recarga automáticamente el listado de usuarios tras cada mutación sin requerir recargar la página.

## Archivos Modificados
- `backend/src/routes/admin.routes.ts`
- `backend/src/controllers/admin.controller.ts`
- `backend/src/tests/admin.test.ts`
- `frontend/src/app/features/admin/components/admin-dashboard/admin-dashboard.component.ts`
- `frontend/src/app/features/admin/components/admin-dashboard/admin-dashboard.component.spec.ts`
- `tareas/59_reparacion_botones_admin_usuarios.md`

## Verificación
- **Frontend Vitest:** 239/239 tests pasados (98.26% cobertura global).
- **Backend Vitest:** 61/61 tests pasados (97.18% statements, 91.46% branches).
- **Build Frontend:** Compilación satisfactoria.
