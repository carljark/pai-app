# 133 – Corrección de Warning de Deprecación Mongoose (`new: true` vs `returnDocument: 'after'`)

## Propósito

Eliminar la advertencia de deprecación emitida por Mongoose durante la ejecución de los tests del backend (`npm test` / Vitest):
```text
(node:10024) [MONGOOSE] Warning: mongoose: the `new` option for `findOneAndUpdate()` and `findOneAndReplace()` is deprecated. Use `returnDocument: 'after'` instead.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:10024) [MONGOOSE] Warning: mongoose: the `new` option for `findOneAndUpdate()` and `findOneAndReplace()` is deprecated. Use `returnDocument: 'after'` instead.
```

---

## Análisis Técnico y Diagnóstico

1. **Evolución del Driver de MongoDB y Mongoose (v8/v9):**
   - En versiones históricas de Mongoose y MongoDB Driver, `{ new: true }` era la opción utilizada en métodos de actualización atómica como `findOneAndUpdate()`, `findOneAndReplace()` y `findByIdAndUpdate()` para retornar el documento resultante tras la modificación en lugar del original.
   - En las versiones modernas de Mongoose (v8.x y preparación para v9), la opción `new` ha quedado formalmente obsoleta (*deprecated*) para alinearse con la API nativa estandarizada del driver oficial de MongoDB (`mongodb`), que utiliza:
     ```ts
     { returnDocument: 'after' } // Retorna el documento después de aplicar el update
     { returnDocument: 'before' } // Retorna el documento previo al update (por defecto)
     ```
2. **Localización de la Causa Raíz:**
   - La advertencia aparecía reportada dos veces consecutivas durante las pruebas.
   - Se ejecutó un análisis exhaustivo del código backend mediante regex `new:\s*(true|false)`. Se constató que los controladores `admin.controller.ts`, `project.controller.ts` y los servicios `notification.service.ts` y `queue.service.ts` ya habían sido migrados con anterioridad a `{ returnDocument: 'after' }`.
   - Se identificó la única ocurrencia restante en:
     [`backend/src/controllers/feedback.controller.ts`](file:///Users/csgj/dev/pai-app/backend/src/controllers/feedback.controller.ts#L77-L81) dentro de `updateFeedbackStatus`:
     ```ts
     const updated = await Feedback.findByIdAndUpdate(
       req.params.id,
       updateData,
       { new: true } // <-- Causa raíz de la deprecación
     );
     ```
   - En la suite de tests [`backend/src/tests/feedback.test.ts`](file:///Users/csgj/dev/pai-app/backend/src/tests/feedback.test.ts), el test del endpoint `PATCH /api/feedback/:id` ejecutaba dos peticiones que alcanzaban `findByIdAndUpdate` (una para actualización exitosa de estado por admin y otra para id inexistente 404), provocando exactamente los dos avisos `[MONGOOSE] Warning` en consola.

---

## Archivos Modificados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| [`backend/src/controllers/feedback.controller.ts`](file:///Users/csgj/dev/pai-app/backend/src/controllers/feedback.controller.ts) | **MODIFICADO** | Reemplazada la opción obsoleta `{ new: true }` por `{ returnDocument: 'after' }` en la llamada a `Feedback.findByIdAndUpdate()`. |

---

## Verificación y Pruebas

1. **Test unitario en aislamiento (`feedback.test.ts`):**
   - Ejecutado `npx vitest run src/tests/feedback.test.ts`.
   - **Resultado:** 11/11 tests superados al 100% con **0 warnings**.

2. **Suite completa del backend (`npm test`):**
   - Ejecutado `npm test` en `backend/` abarcando los 16 archivos de prueba.
   - **Resultado:**
     - **16 archivos de test** superados.
     - **129 tests** ejecutados y aprobados (100%).
     - **0 advertencias** de Mongoose (`No warnings found!`).
