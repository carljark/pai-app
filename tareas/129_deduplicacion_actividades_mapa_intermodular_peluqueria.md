# 129 — Deduplicación de Actividades en el Mapa Intermodular (CFGM Peluquería 1º y 2º)

## Propósito

El usuario reportó que, al seleccionar un módulo-RA en el Mapa Intermodular de los CFGM de Peluquería (1º y 2º curso), las actividades intermodulares aparecían repetidas un gran número de veces. Por ejemplo, para el módulo **0845 RA1**, la actividad *"Control de calidad entre iguales"* aparecía **49 veces** y *"Simulación integral de salón"* también **49 veces**, cuando en realidad solo debería aparecer una sola vez.

El objetivo es que, cuando se seleccione un módulo-RA, todas las actividades únicas que se recogen en los documentos de cada módulo se muestren **exactamente una vez**.

---

## Causa Raíz

La estructura de los archivos JSON del mapa intermodular almacena las actividades **dentro de cada conexión** individual:

```
LearningOutcome {
  connections: [
    {
      targetModuleCode: "0842",
      activities: [{ title_es: "Control de calidad entre iguales", ... }]
    },
    {
      targetModuleCode: "0844",
      activities: [{ title_es: "Control de calidad entre iguales", ... }]  // ← repetida
    },
    // ... 200 conexiones en total para RA1 del módulo 0845
  ]
}
```

Para el RA1 del módulo 0845, hay **200 conexiones** y las mismas 12 actividades únicas se repiten distribuidas entre múltiples conexiones, resultando en **205 entradas totales** (49x algunas actividades). El template anterior iteraba sobre cada conexión y dentro de cada una sobre sus actividades, generando la repetición visible.

---

## Arquitectura / Flujo

### Decisión de diseño

La deduplicación se implementa **exclusivamente en el frontend**, sin modificar los archivos JSON del backend (84 MB para 1º curso, 68 MB para 2º). Modificar esos archivos sería costoso, podría romper otras partes del sistema, y el problema es fundamentalmente de visualización.

### Cambio en la Facade

Se añadió el computed `uniqueActivities` en [`mapa-intermodular.facade.ts`](../frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.ts):

```typescript
uniqueActivities = computed<IntermodularActivity[]>(() => {
  const seen = new Set<string>();
  const result: IntermodularActivity[] = [];
  for (const conn of this.filteredConnections()) {
    for (const act of conn.activities) {
      const key = act.title_es || act.title_ca;
      if (key && !seen.has(key)) {
        seen.add(key);
        result.push(act);
      }
    }
  }
  return result;
});
```

- **Agrega** todas las actividades de todas las `filteredConnections()` del RA seleccionado.
- **Deduplica** por `title_es` (fallback a `title_ca` si `title_es` está vacío).
- **Ignora** actividades sin ningún título.
- Es un computed Angular Signal, reactivo a cambios de módulo, RA o filtro de criterio.

### Cambio en el Template

Anteriormente el bloque `<div class="mapa-activities-container">` vivía **dentro del `@for` de conexiones**, renderizándose una vez por cada conexión. Ahora se ha movido **fuera del bucle** de conexiones, al nivel de la sección de conexiones del Paso 3, iterando sobre `facade.uniqueActivities()`:

```html
<!-- Al final del contenido del Paso 3, fuera del @for de conexiones -->
@if (facade.uniqueActivities().length > 0) {
  <div class="mapa-activities-container">
    <h4 class="mapa-activities-title">...</h4>
    <div class="mapa-activities-grid">
      @for (act of facade.uniqueActivities(); track act.id) {
        <!-- tarjeta de actividad -->
      }
    </div>
  </div>
}
```

**Nota técnica:** En el template se usa la comilla tipográfica `'` (U+2019) en lugar del apóstrofo ASCII `'` (U+0027) en las cadenas catalanas del template Angular (p.ej. `'Propostes d'Activitats'`). Esto es obligatorio para que el parser de expresiones de Angular no confunda el apóstrofo con el cierre de cadena.

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.ts` | +Computed `uniqueActivities` (deduplicación por `title_es`/`title_ca`) |
| `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.html` | Bloque de actividades sacado del `@for` de conexiones; ahora usa `facade.uniqueActivities()` una sola vez al final del Paso 3 |
| `frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.spec.ts` | +4 tests en `describe('uniqueActivities')`: vacío sin conexiones, deduplicación por `title_es`, fallback a `title_ca`, ignorar sin título |
| `tareas/129_deduplicacion_actividades_mapa_intermodular_peluqueria.md` | Este documento |

---

## Detalles Técnicos

### Algoritmo de deduplicación

- **Complejidad:** O(n) donde n = total de actividades en todas las conexiones filtradas.
- **Clave de dedup:** `title_es` tiene prioridad; si está vacío/nulo, se usa `title_ca`. Actividades sin ningún título se omiten.
- **Orden:** Se preserva el orden de primera aparición (primer módulo → primera conexión → primera actividad).
- **Reactivo:** Al cambiar el módulo, RA o criterio seleccionado, `filteredConnections()` cambia y por tanto `uniqueActivities()` se recalcula automáticamente.

### Separación de responsabilidades

- La **facade** calcula `uniqueActivities` (lógica de negocio / agregación de datos).
- El **template** solo itera sobre el array resultado sin lógica adicional.
- El idioma activo (`isCa()`) solo se usa en el template para decidir qué campo renderizar (`title_ca` vs `title_es`), **no** en la lógica de deduplicación (la clave de dedup siempre es `title_es` para consistencia).

### Tests añadidos

```
describe('uniqueActivities')
  ✓ should return empty array when no connections
  ✓ should deduplicate activities with the same title_es across connections
  ✓ should fall back to title_ca as dedup key when title_es is empty
  ✓ should skip activities with no title_es and no title_ca
```

### Cobertura de tests

- `mapa-intermodular-view`: **99.8%** statements, **96.75%** branch
- `mapa-intermodular.facade.ts`: **98.47%** statements, **91.71%** branch
- Todos los umbrales ≥90% superados ✅
