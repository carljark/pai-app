# Tarea 24: Traducción al catalán del "Empty State" en Taller Editor

## Propósito
El usuario ha detectado que la vista de "Taller Editor", cuando no hay ningún proyecto seleccionado (el estado vacío inicial), mostraba diversos textos "hardcodeados" en español. El objetivo era incorporar dichos textos al servicio de traducción y garantizar el soporte dual bilingüe (Castellano / Catalán).

## Arquitectura/Flujo
1. **Extracción de Cadenas**: Se han extraído los literales de la plantilla `taller-view.component.html` (título, descripción, botón de crear, texto separador, y "empty state" de proyectos nulos) y se han sustituido por el getter dinámico `{{ trans.t().CLAVE }}`.
2. **Diccionario Bilingüe**: Se han expandido los diccionarios retornados por `TranslationService` (`translation.service.ts`) para incluir los nuevos nodos correspondientes a ambos idiomas.
3. **Reutilización**: Se han reaprovechado claves existentes (como `homeEmpty` para el mensaje de cuando no hay historial general, y `homeDefaultModules` para "Proyecto interdisciplinar") para evitar redundancias.

## Archivos Modificados
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.html`: Sustitución de los literales en español por las llamadas de internacionalización.
- `frontend/src/app/services/translation.service.ts`: Alta de las siguientes nuevas claves en el mapa de Castellano y Catalán:
  - `workshopEmptyTitle` ("Taller de Edición" / "Taller d'Edició")
  - `workshopEmptyDesc` ("Selecciona un proyecto..." / "Selecciona un projecte...")
  - `createProjectBtn` ("Crear Proyecto Nuevo" / "Crear Projecte Nou")
  - `workshopOrRecent` ("— O continúa con..." / "— O continua amb...")
  - `courseLevelFP` y `courseLevelPDC`

## Detalles Técnicos
- Se utilizó la misma directiva y sistema estructural de las traducciones iniciales (`trans.t()`). 
- Se ha re-verificado mediante Vitest que ninguna de las sustituciones afectase la cobertura de código exigida del 90%. Todos los test unitarios y validaciones de cobertura siguen en verde.
