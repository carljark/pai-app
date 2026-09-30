# Frontend Angular Zoneless

**Fecha:** 2026-09-30
**Autor:** Asistente IA (OpenCode)
**Ámbito:** `frontend/` (Angular 22.1.2)

---

## Resumen

Estudio y migración del frontend a **change detection zoneless**. Conclusión del estudio: **el frontend ya era zoneless en producción** (Angular 22 lo aplica por defecto), pero quedaban residuos de zone.js (devDependency + imports en `test-setup.ts`) y una inyección de `NgZone`. Se hizo explícito el modo zoneless, se eliminó zone.js por completo y se añadió un guardián anti-regresión.

---

## 1. Estudio inicial: ¿usaba zone.js?

| Punto | Hallazgo |
|-------|----------|
| Versión Angular | `@angular/core` **22.1.2** |
| CD por defecto | `bootstrapApplication` inyecta `provideZonelessChangeDetectionInternal()` **por defecto** en v22 |
| `app.config.ts` | No declaraba ningún provider de CD (usaba el zoneless por defecto) |
| `angular.json` | Sin `polyfills` → builder `@angular/build:application` usa `polyfills: []` |
| Bundle de producción | 0 firmas de zone.js (`__zone_symbol__`, `ZoneTask`, `ZoneAwarePromise`) |
| `package.json` | `zone.js` era **devDependency** |
| `test-setup.ts` | Único lugar con `import 'zone.js'` / `'zone.js/testing'` |
| `NgZone` en runtime | `ɵNoopNgZone` (no-op) |

**Conclusión:** zoneless en producción; zone.js residual solo en tests/devDependencies.

---

## 2. Implementación

### Fase 1 — Zoneless explícito
`src/app/app.config.ts`: añadido `provideZonelessChangeDetection()` a los providers.

### Fase 2 — Eliminar zone.js
- `test-setup.ts`: eliminados `import 'zone.js';` e `import 'zone.js/testing';`.
- `package.json`: eliminada la devDependency `zone.js`.
- `npm install --legacy-peer-deps`: `zone.js` fuera de `package-lock.json` y `node_modules`. (Es peer dependency *opcional* de `@angular/core`, por lo que no rompe nada.)

### Fase 3 — Limpiar patrones dependientes de zone
- `src/app/services/telemetry.service.ts`: eliminada la inyección de `NgZone` y el `runOutsideAngular` (el `setInterval` y los listeners no necesitan zona).

### Fase 4 — Terceros
- `ngx-markdown`: la app usa el componente `<markdown [data]>` (compatible zoneless). Se documenta evitar el `MarkdownPipe` (usa `NgZone.onStable`).

### Fase 5 — Verificación
- `npm run build`: correcto.
- `dist/`: 0 firmas de zone.js.
- `npm test`: **35 archivos / 545 tests pasan** (1 *skipped*), 0 errores no capturados, **cobertura ≥ 90%**.
- Se añadieron 2 tests a `telemetry.service.spec.ts` para cubrir el fallback de `sendBeacon` sin token y `stopTracking` sin intervalo → `telemetry.service.ts` al **100%** en todas las métricas.

### Fase 6 — Prevención de regresiones
- **Nuevo** `frontend/check-zoneless.js`: falla si `zone.js` aparece en `package.json`, si hay imports de `zone.js` en el código, o si hay firmas de zone.js en `dist/`.
- Integrado en `npm test` y disponible con `npm run check:zoneless`. Verificado que detecta una regresión simulada (exit code 1).
- **Nueva regla** `.agents/rules/05_zoneless_y_cd.md` documentando la política zoneless.

---

## 3. Archivos afectados

**Modificados:**
1. `frontend/src/app/app.config.ts` — `provideZonelessChangeDetection()`
2. `frontend/test-setup.ts` — sin imports de zone.js
3. `frontend/package.json` — sin `zone.js`; script `check:zoneless`; `test` actualizado
4. `frontend/package-lock.json` — regenerado
5. `frontend/src/app/services/telemetry.service.ts` — sin `NgZone`
6. `frontend/src/app/services/telemetry.service.spec.ts` — +2 tests

**Creados:**
1. `frontend/check-zoneless.js` — guardián anti-regresión
2. `.agents/rules/05_zoneless_y_cd.md` — regla de proyecto

---

## 4. Verificación final

```
npm run build   → OK
dist/           → 0 firmas de zone.js
npm test        → 35 archivos / 545 tests + coverage thresholds met + Zoneless check passed
```

Cobertura global: Statements **98.86%**, Branches **95.64%**, Functions **97.97%**, Lines **99.36%**.

---

## 5. Notas

- No se reescribió lógica de negocio: el código ya usaba **signals** en todas las fuentes asíncronas (HTTP, SSE, timers, listeners), que es lo que hace funcionar la detección de cambios sin zona.
- El contenedor `pai_frontend` monta el código y corre `ng serve`; al no importarse ya zone.js, el dev server también es zoneless.
