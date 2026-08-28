# Tarea 28: Botón de generación flotante siempre visible y renombrado de Diversificación a ESO

## Propósito
El usuario ha solicitado las siguientes mejoras y correcciones instruccionales en el módulo de generación:
1. Asegurar que el botón "Generar Proyecto" en el carrito flotante de selección (Floating Action Box) se muestre siempre, independientemente de si la lista detallada de elementos curriculares seleccionados está colapsada o no.
2. Eliminar el botón estático duplicado "Generar Proyecto Interdisciplinar" que aparecía al final de las pestañas de selección de currículum (FP o ESO).
3. Renombrar en toda la interfaz de generación la denominación "Diversificación Curricular" a la simplificación "ESO".

## Arquitectura/Flujo
1. **Carrito Flotante (`curriculum-selector`)**:
   - Se ha reemplazado la etiqueta nativa `<details>` por una estructura híbrida de contenedores `div` controlada por una señal reactiva `isOpen = signal(true)`.
   - Al colapsar el carrito haciendo clic en el cabecero (toggling de la señal `isOpen`), únicamente se oculta la lista intermedia (`floating-cart__body`).
   - El botón final de generación dentro de `floating-cart__footer` se posiciona de manera fija en el bloque y permanece siempre visible si hay al menos un elemento curricular seleccionado.
2. **Remoción de Botón Redundante (`generator-view`)**:
   - Se ha eliminado por completo el botón de generación estático que se posicionaba al fondo de las pestañas en la vista general.
   - En su lugar, el selector flotante (`app-curriculum-selector`) emite un output `@Output() generate = output<void>()` que es escuchado por la vista principal para desencadenar el flujo de generación del proyecto (`generateProject()`).
3. **Renombrado a "ESO"**:
   - En las pestañas de selección de nivel se cambió el literal duro a "ESO".
   - Se adaptó la lógica por defecto de creación de títulos en `projects.facade.ts` sustituyendo "Proyecto de Diversificación" por "Proyecto de ESO".
   - Se actualizaron las traducciones correspondientes a la ausencia de proyectos de este nivel en `translation.service.ts` (`noESO`).

## Archivos Modificados
- `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.ts`
- `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.spec.ts`
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.spec.ts`
- `frontend/src/app/features/projects/services/projects.facade.ts`
- `frontend/src/app/features/projects/services/projects.facade.spec.ts`
- `frontend/src/app/services/translation.service.ts`

## Detalles Técnicos
- La migración de `<details>` a una señal reactiva Angular 18 mejoró el control del DOM en testing, posibilitando testear el comportamiento del colapsado de forma mucho más limpia.
- Se mantuvieron los estándares de cobertura exigidos (>90%) adaptando los test suites para validar los nuevos comportamientos (como el toggle de colapsado y el disparo del output del botón flotante).
