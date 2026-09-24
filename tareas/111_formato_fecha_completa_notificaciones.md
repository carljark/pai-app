# 111. Formato de Fecha Completa en Notificaciones a Partir del Día Anterior

## Propósito
Mejorar la visualización temporal en el panel de notificaciones y actividad reciente ([`recent-activity-modal.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.ts)). Anteriormente, todas las notificaciones utilizaban únicamente el formato `shortTime` (por ejemplo, `10:15`), impidiendo distinguir en qué día se generó cada proyecto cuando la notificación correspondía a días previos.

A partir de este cambio:
- Las notificaciones pertenecientes al **día actual (hoy)** continúan mostrando la hora (`shortTime`).
- Las notificaciones a partir del **día anterior al actual (ayer y anteriores)** muestran la **fecha completa** acompañada de la hora (`dd/MM/yyyy, HH:mm`, por ejemplo `23/09/2026, 14:30`).

---

## Arquitectura y Lógica Técnica

En el componente [`RecentActivityModalComponent`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.ts):

1. **Método de discriminación de calendario (`isToday`)**:
   Compara la fecha del elemento (`updatedAt`, `createdAt` o `timestamp`) contra la marca temporal `now` inyectada en el componente mediante año, mes y día de calendario local:

   ```typescript
   isToday(dateVal: any): boolean {
     if (!dateVal) return false;
     const d = new Date(dateVal);
     if (isNaN(d.getTime())) return false;
     const nowDate = new Date(this.now());
     return (
       d.getFullYear() === nowDate.getFullYear() &&
       d.getMonth() === nowDate.getMonth() &&
       d.getDate() === nowDate.getDate()
     );
   }
   ```

2. **Renderizado en Plantilla**:
   Se emplea la directiva de control de flujo `@if / @else` de Angular combinada con el `DatePipe`:

   ```html
   <span style="font-size: 0.85rem; color: #95a5a6; white-space: nowrap; margin-left: 15px;">
     @if (isToday(p.updatedAt || p.createdAt || p.timestamp)) {
       {{ (p.updatedAt || p.createdAt || p.timestamp) | date:'shortTime' }}
     } @else {
       {{ (p.updatedAt || p.createdAt || p.timestamp) | date:'dd/MM/yyyy, HH:mm' }}
     }
   </span>
   ```

---

## Archivos Modificados

1. [`frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.ts):
   - Inclusión del método `isToday(dateVal: any): boolean`.
   - Lógica condicional en plantilla para mostrar `shortTime` hoy y `dd/MM/yyyy, HH:mm` a partir de ayer.
2. [`frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.spec.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/features/notifications/components/recent-activity-modal/recent-activity-modal.component.spec.ts):
   - Tests unitarios exhaustivos para el método `isToday` (casos de hoy, ayer, fechas antiguas, null, undefined y fechas inválidas).
   - Test de integración en DOM verificando la presencia de la fecha completa (`23/09/2026`) para elementos del día anterior.

---

## Verificación y Pruebas

- **Compilación de producción (`npm run build`)**: ✅ Exit code 0 en 15.6 segundos.
- **Suite de pruebas unitarias (`npm test`)**: ✅ **378/378 tests pasados (100%)** con un **95.28%** de cobertura de ramas (*branch coverage*).
