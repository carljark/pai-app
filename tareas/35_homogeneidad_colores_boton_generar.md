# Tarea 35: Homogeneidad de colores en el botón Generar y creación de la regla de diseño

## Propósito
El usuario ha detectado que el botón de "Generar Proyecto" en el selector flotante utilizaba un color verde chillón (`#27ae60`) no homogeneizado con el resto de la aplicación.
Se ha procedido a:
1. Adecuar dicho botón a los colores corporativos primarios de la paleta.
2. Definir una directriz clara sobre consistencia de diseño para futuros desarrollos.

## Arquitectura/Flujo
1. **Refactorización de Botón (`curriculum-selector`)**:
   - En el template de [curriculum-selector.component.ts](file:///Users/csgj/dev/pai-app/frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.ts), se removió el estilo en línea duro de fondo verde y sombra verde.
   - Se le aplicó la clase global `class="btn-primary"`, la cual delega automáticamente la apariencia visual en la paleta sage-green definida corporativamente en el SCSS (`$color-primary`).
2. **Establecimiento de Regla de Estilos**:
   - Se redactó una nueva regla de diseño en el directorio de políticas: `.agents/rules/04_diseno_y_colores_homogeneos.md`.
   - La regla prohíbe inyectar colores en código duro a mano en las plantillas y prescribe el uso obligatorio de clases de utilidad globales o variables semánticas SCSS.

## Archivos Modificados
- `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.ts`
- `frontend/src/app/features/curriculum/components/curriculum-selector/curriculum-selector.component.spec.ts`
- `.agents/rules/04_diseno_y_colores_homogeneos.md` (creado)

## Detalles Técnicos
- Se añadió una instrucción de detección de cambios (`fixture.detectChanges()`) en las pruebas unitarias del selector de currículum para garantizar que los test de toggling cubrieran el 100% de las ramas de renderizado de la plantilla tras la remoción del estilo en línea.
