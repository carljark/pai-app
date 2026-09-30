# Regla estricta: Frontend Zoneless (sin zone.js)

El frontend de PAI usa **change detection zoneless**. Angular 22 ya lo aplica por defecto, y además está declarado explícitamente con `provideZonelessChangeDetection()` en `src/app/app.config.ts`.

## Directivas

1. **No reintroducir zone.js.**
   Está prohibido:
   - Añadir `zone.js` a `package.json` (`dependencies`, `devDependencies` o `peerDependencies`).
   - Hacer `import 'zone.js'` o `import 'zone.js/testing'`, ni en la app ni en `test-setup.ts`.
   - Añadir `zone.js` a `polyfills` de `angular.json`.

2. **Actualizar el estado con signals.**
   Cualquier fuente asíncrona que deba refrescar la vista (HTTP, SSE/`EventSource`, `setTimeout`/`setInterval`, listeners de DOM, websockets, librerías externas) **debe escribir en un `signal`** (o `computed` dependiente). Los signals notifican al scheduler de Angular y disparan la detección de cambios sin zona.

   Si se actualiza estado que no son signals y usado en plantilla, hay que notificar manualmente con `ChangeDetectorRef.markForCheck()` o `ApplicationRef.tick()`.

3. **Preferir `afterNextRender` / `afterEveryRender`.**
   No usar `NgZone.onStable` / `onMicrotaskEmpty` (no emiten en zoneless). Para trabajo tras render, usar las APIs de render hooks de Angular.

4. **Tener cuidado con librerías de terceros.**
   Antes de adoptar una librería que dependa de `NgZone.onStable` (por ejemplo, el `MarkdownPipe` de `ngx-markdown`), verificar compatibilidad zoneless. El componente `<markdown>` de `ngx-markdown` sí es compatible; el pipe no.

5. **Tests sin zone.js.**
   No importar `zone.js` en `test-setup.ts`. `TestBed` en Angular 22 ya es zoneless por defecto. No se usan `fakeAsync`/`async`; para esperar estabilidad usar `await fixture.whenStable()`.

## Verificación automática

El script `frontend/check-zoneless.js` falla si detecta `zone.js` en `package.json`, imports de `zone.js` en el código, o firmas de zone.js en `dist/`. Se ejecuta automáticamente como parte de `npm test` (`node check-zoneless.js`) y también de forma aislada con `npm run check:zoneless`.

Antes de dar una tarea por completada: `npm run build && npm test` deben pasar sin errores.
