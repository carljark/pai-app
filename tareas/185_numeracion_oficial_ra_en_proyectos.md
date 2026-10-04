# Tarea 185: Numeración oficial de los RA en los proyectos generados

## Propósito
Al crear un proyecto, los RA aparecían numerados según su posición en la selección (RA1, RA2, RA3…) y no con su número oficial dentro del módulo. Por ejemplo, si se seleccionaban el RA2 y el RA5 de un módulo, el proyecto los llamaba RA1 y RA2. El número de cada RA lo fija el currículo y no puede cambiar.

## Causa
- El frontend envía los RA seleccionados como descripciones de texto.
- `createProject` (`backend/src/controllers/project.controller.ts`) construía el prompt con «Resultado de Aprendizaje (RA): <descripción>», sin el número del RA ni el código del módulo.
- La IA no tenía forma de conocer la numeración oficial y numeraba por orden.
- Además, el RA se buscaba con el primer documento cuya descripción coincidiera, sin tener en cuenta el ciclo. Si dos ciclos comparten la misma descripción, podía tomarse el RA (y su número) de otro ciclo.

## Solución
Nuevos helpers exportados en `project.controller.ts`:
- **`officialRaCode(id)`:** número oficial del RA. Quita el prefijo de módulo de los ids que lo tienen («3160_RA2» → «RA2»).
- **`findSelectedRa(allRas, descripción, tipoNivel)`:**
  - entre los RA con esa descripción, prefiere el del nivel del proyecto;
  - los RA antiguos de FP Básica no tienen `tipoNivel` guardado y se tratan como `FP_BASICA`.
  - Se usa tanto para extraer los códigos de las coincidencias de FPB como para construir el prompt.
- **`describeRaForPrompt(ra, descripción, idioma)`:** cada RA se presenta así:

  ```
  - Módulo/Asignatura: 0843 <nombre del módulo>
    Resultado de Aprendizaje RA5 (numeración oficial, no la cambies): <descripción>
  ```

- **Competencias específicas de ESO:** se presentan igual, con su `ce_id` («Competencia Específica CE.1 …»).
- **Regla nueva en las instrucciones del sistema:** usar siempre el número oficial que acompaña a cada RA o CE, también en las rúbricas y en las tablas de evaluación, y no renumerar nunca por orden de aparición.

## Archivos
- `backend/src/controllers/project.controller.ts`: helpers, construcción del prompt y regla de numeración.
- `backend/src/tests/projects.test.ts`: tests de `officialRaCode`, `findSelectedRa` y `describeRaForPrompt`.

## Notas
- Afecta a los proyectos nuevos. Los ya generados conservan el texto que produjo la IA.
- La IA sigue pudiendo equivocarse, pero ahora recibe el número oficial explícito y una instrucción concreta, en lugar de tener que deducirlo.
