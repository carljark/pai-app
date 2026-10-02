# Tarea 169: Proyectos coincidentes encima de "Selección actual"

## Propósito
El aviso de proyectos ya generados con la misma selección de RAs/CEs estaba al final del cuerpo del carrito flotante del generador. Solo se veía con el carrito desplegado y había que desplazarse hasta abajo, así que pasaba desapercibido.

## Arquitectura y flujo
- El bloque `floating-cart__matches` (un `<details>` con la lista de proyectos) pasa a ser el primer hijo de `.floating-cart`, justo encima de la cabecera "Selección actual".
- Ya no depende de `isOpen()`: se muestra siempre que `projects.matchingProjects()` tenga elementos, aunque el carrito esté recogido.
- Los datos y la acción no cambian (`openProject(match)` abre el proyecto en una ventana nueva).

## Archivos modificados
1. `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.html`: bloque movido delante de la cabecera, fuera del cuerpo plegable.
2. `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.scss`:
   - fondo de aviso `$color-warning-bg` y borde inferior `$color-warning` (paleta corporativa);
   - `max-height: 40vh` con scroll, para que una lista larga no tape la selección.
3. `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.spec.ts`: test que comprueba que el bloque es el primer hijo del carrito y que se ve con el carrito recogido.

## Decisiones técnicas
- Se usa el color de aviso porque el bloque advierte de posibles duplicados antes de generar, igual que el modal de duplicados.
- Se mantiene `<details>` plegado por defecto: el resumen ("📄 N proyectos con esta selección") es visible y la lista se abre bajo demanda.

## Verificación
- `npx ngc -p tsconfig.app.json --noEmit`, `npx tsc -p tsconfig.spec.json --noEmit` y ESLint, sin errores.
- Pendiente (usuario): `cd frontend && npm test` y revisión visual en el generador.
