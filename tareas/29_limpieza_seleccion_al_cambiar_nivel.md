# Tarea 29: Limpieza de selección al cambiar de nivel educativo

## Propósito
El usuario ha solicitado que, al cambiar de pestaña entre FP Básica y ESO (o viceversa) en la vista de generación de proyectos, la ventana de "Selección actual" se limpie automáticamente para evitar que queden seleccionados elementos de un nivel anterior que no se corresponden con el nuevo nivel seleccionado.

## Arquitectura/Flujo
1. **Lógica de Negocio (`CurriculumFacade`)**:
   - Se ha añadido un nuevo método `setTipoNivel(nivel)` en [curriculum.facade.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/features/curriculum/services/curriculum.facade.ts).
   - Este método compara el nivel educativo solicitado con el activo. Si hay un cambio de nivel, actualiza el valor de la señal `tipoNivel` y llama a `clearSelection()` para vaciar la señal `selectedRas`.
2. **Actualización de la Vista (`generator-view`)**:
   - En el template de [generator-view.component.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/features/generator/components/generator-view/generator-view.component.ts), las acciones de clic (`(click)`) de las pestañas "FP Básica" y "ESO" se han redirigido para invocar a `curriculum.setTipoNivel(...)` en lugar de mutar directamente la señal del facade.
3. **Tests Unitarios**:
   - Se ha mockeado el método `setTipoNivel` en `generator-view.component.spec.ts` para que los tests de interacción con el DOM sigan siendo válidos.
   - Se ha añadido un test de integración explícito en `curriculum.facade.spec.ts` (`should clear selection when setTipoNivel changes level`) para verificar que al cambiar el nivel en el facade, la selección efectivamente se limpie.

## Archivos Modificados
- `frontend/src/app/features/curriculum/services/curriculum.facade.ts`
- `frontend/src/app/features/curriculum/services/curriculum.facade.spec.ts`
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.ts`
- `frontend/src/app/features/generator/components/generator-view/generator-view.component.spec.ts`

## Detalles Técnicos
- La centralización de la transición en el facade a través del método `setTipoNivel` desacopla la vista de la lógica de limpieza y asegura que cualquier cambio futuro en el flujo de selección actúe de forma homogénea.
- Se mantuvieron los niveles óptimos de cobertura exigidos (>90%) sin alterar las pruebas de regresión.
