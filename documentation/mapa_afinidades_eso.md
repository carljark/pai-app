# Mapa de afinidades curriculares de la ESO

El mapa intermodular de la ESO no sigue el modelo de la FP (módulos → RA → conexiones → actividades). Reproduce el formato del documento del IES Cap de Llevant *Afinitats curriculars · ESO 2027-2028*: **fichas de afinidad entre materias**, pensadas para programar por ámbitos (Decreto 42/2025, Illes Balears). El documento no trae actividades; desde la tarea 247 las fichas de 1.º, y desde la 251 las de 2.º y 3.º, llevan además **actividades conjuntas** de ejemplo (ver más abajo).

## Formato de una ficha

Cada ficha corresponde a un curso y relaciona dos o tres materias:

- **Ámbito propuesto.** El documento puede darle un nombre distinto según la materia desde la que se consulta. Por eso se guarda en `fuentes[].ambito_es/_ca` y la vista muestra el nombre que corresponde a la materia activa.
- **Vínculos.** Cada vínculo agrupa los criterios de evaluación relacionados de cada materia (`criterios: { materia: ['6.2'] }`), un resumen de cada uno (`resumen_es/_ca`) y la «relación que fundamenta el ámbito» (`relacion_es/_ca`).
- **Saberes básicos movilizados** por materia (`saberes[materia].es/ca`).
- **Conceptos comunes** (`conceptos_es/_ca`).

La ficha etiqueta cada criterio como **«CE x.y»** en castellano (criterio de evaluación) y **«CA x.y»** en catalán (criteri d'avaluació).

Los textos oficiales de los criterios no se copian en las fichas. El endpoint los resuelve desde la colección `CE` (`tipoNivel: 'ESO_ORDINARIA'`) y los devuelve en `vinculos[].criteriosTexto`. **Los ids de criterio se repiten entre el bloque de 1.º-3.º (o 1.º-2.º) y el de 4.º** (p. ej. Biología 3.2), así que se resuelven por id **y** curso.

## Arquitectura

| Capa | Archivo |
|---|---|
| Datos | `backend/src/data/afinidades-eso/afinidades_eso_{1,2,3,4}.json` |
| Catálogo | `backend/src/data/niveles.ts`: pestañas `ESO_1`…`ESO_4` con `formato: 'afinidades'`. `MAPA_TABS` solo incluye las de módulos; `AFINIDADES_TABS` y `cursoDeTab` son las nuevas |
| Modelo | `backend/src/models/AfinidadEso.ts` (colección propia; el id de la ficha se guarda como `code`) |
| Migración | `backend/src/migrations/25_ingest_afinidades_eso.ts` (borra y reinserta solo esta colección); `38_quitar_origen_afinidades_eso.ts` elimina el antiguo campo `origen` (documento del centro o ampliación), que ya no se guarda ni se muestra; `51_reload_afinidades_eso.ts` vuelve a ejecutar la ingesta con la ampliación y las actividades de 1.º (tarea 247); `53_reload_afinidades_eso_2_3.ts` hace lo mismo con las de 2.º y 3.º (tarea 251) |
| API | `GET /api/afinidades-eso?tab=ESO_n` (pública, como el mapa de FP): `{ curso, materias, afinidades }`. `materias` son todas las del curso según `subjectTipos` de las CE, con el número de fichas de cada una |
| Frontend | `features/mapa-intermodular/`: `AfinidadesEsoService`, `AfinidadesEsoFacade` (signals y caché por pestaña), `AfinidadesEsoViewComponent` (materias y fichas), `AfinidadCardComponent` (ficha) y `AfinidadActividadesComponent` (actividades conjuntas de la ficha) |

La vista del mapa (`mapa-intermodular-view`) elige entre el acordeón de FP y la vista de afinidades según el `formato` de la pestaña. Con una pestaña de afinidades, `MapaIntermodularFacade.setTab` no pide módulos. El selector de pestañas es el mismo: la ESO aparece como un ciclo más, con los botones de curso 1.º a 4.º.

### Crear un proyecto desde una ficha

Cada ficha tiene el botón «Crear Proyecto con estos criterios» / «Crear Projecte amb aquests criteris», equivalente al «Crear Proyecto» de las conexiones de FP. `AfinidadProyectoService.crearProyecto` (en `features/mapa-intermodular/services/`):

1. Fija en el generador la ESO ordinaria y el curso de la pestaña.
2. Pide las CE de ese curso (`CurriculumFacade.fetchEsoCes`) en lugar de esperar al efecto que las recarga, para no seleccionar sobre las CE del nivel anterior.
3. Traduce la ficha con `seleccionDeAfinidad` (`utils/afinidad-seleccion.ts`): cada criterio citado («2.1» de `MAT`) se asigna a su CE (`subjectCode` + `ce_num`); las materias van en el orden de la ficha, con la consultada primero. Las CE o criterios que no existen en el curso se omiten.
4. Selecciona cada CE con solo los criterios citados (`CriteriosFacade.fijar`); si se citan todos, la CE queda completa.
5. Abre el generador. Si falla la carga de CE, abre el generador con el nivel y el curso pero sin selección.

## Fuentes y criterios de revisión

- **1.º-3.º.** 80 fichas del documento del centro (20 materias × 4 opciones). Todas las referencias «CA x.y» se validaron contra `curriculo-eso`: existen en la materia y se imparten en el curso de la ficha.
  - Las fichas recíprocas (el mismo par de materias visto desde cada materia) con las mismas relaciones se fusionan en una sola. Se conservan los dos nombres de ámbito en `fuentes`, la unión de criterios y la unión de conceptos.
  - Las parejas con propuestas distintas se mantienen como fichas separadas.
  - El documento solo está en catalán; el castellano es una traducción fiel.
- **Ampliación de 1.º-3.º.** Fichas nuevas hasta que cada materia de cada curso aparezca en al menos 3 fichas.
- **4.º de ESO.** Las 18 materias del curso, incluidas Digitalización, Economía y Emprendimiento, Valores Cívicos y Éticos, Expresión Artística, FOPP, Latín y Tecnología. Cada una aparece al menos en 4 fichas, todas con criterios del bloque de 4.º.
- Los saberes de las fichas nuevas se contrastan con los saberes básicos del decreto oficial (versiones castellana y catalana en `Proyecto_FPB_PAI/ESO/`, fuera de git).

Los tests de datos (`backend/src/tests/afinidades-datos.test.ts`) impiden citar criterios inexistentes o de otro curso, y exigen la paridad ES/CA y la cobertura mínima por materia y curso.

## Actividades conjuntas (tarea 247)

Campo opcional `actividades` de la ficha. Lo tienen todas las fichas de 1.º, 2.º y 3.º, con al menos 3 cada una; 4.º no lo guarda.

- **Formato.** Los mismos campos que las actividades del mapa de FP (`title`, `motivatingFactor`, `description`, `evidence` y `diversitySupport`, cada uno en `_es`/`_ca`), un `id` estable (`ESO1-22-A1`) y `criterios: { materia: ['x.y'] }` con los criterios que trabaja de cada materia.
- **Reglas** (`afinidades-datos.test.ts`):
  - al menos 3 actividades por ficha de 1.º, 2.º y 3.º, con ids consecutivos;
  - todos los campos rellenos y distintos entre idiomas, con las mismas comprobaciones de idioma que el resto de la ficha;
  - al menos 2 materias citadas, todas de la ficha, con criterios que existen en el curso;
  - títulos únicos dentro del curso.
- **Vista.** `AfinidadActividadesComponent` (`components/ui/afinidad-actividades/`) se muestra dentro de `AfinidadCardComponent`, antes de los conceptos, y por tanto también en el panel del mapa mental. Cada actividad es un desplegable con la idea motivadora, el desarrollo, el producto, la atención a la diversidad y los criterios por materia («CE x.y» / «CA x.y»), con el texto oficial del criterio como `title`.
- **Origen.** Las redactó DeepSeek V4.1 Flash con opencode, en tramos validados, a partir de los criterios de cada ficha. El procedimiento es el mismo de la tarea 245 (`tareas/247_*.md`).

### Ampliación de 1.º (tarea 247)

22 fichas nuevas (`ESO1-22` a `ESO1-43`), hasta 43 fichas y 42 de las 66 parejas posibles de materias. Cada materia aparece en al menos 6 fichas de 1.º. El esqueleto de cada ficha (materias, ámbito y criterios de cada vínculo) se eligió a mano y se validó contra `curriculo-eso`. Los resúmenes, las relaciones, los saberes y los conceptos se redactaron con DeepSeek. Su única fuente es la de la materia que va primero.

### Ampliación de 2.º y 3.º (tarea 251)

Mismo procedimiento que en 1.º, hasta que cada materia aparezca en al menos 6 fichas de su curso. En 4.º el mínimo sigue siendo 3.

| Curso | Fichas nuevas | Total de fichas | Actividades |
|---|---|---|---|
| 2.º | 19 (`ESO2-30` a `ESO2-48`) | 48 | 144 |
| 3.º | 16 (`ESO3-38` a `ESO3-53`) | 53 | 159 |

- **Tríos:** cada vínculo cita criterios de las tres materias, como en las fichas que ya había. El test de datos lo exige.
- **Optativas:** las fichas más justas son las que llevan a 6 a algunas optativas, como 2.º-44 (Cultura Clásica I y Plástica), 3.º-46 (Lengua Extranjera y Taller de Finanzas) y 3.º-47 (Música y Matemáticas). Se aprobaron sabiendo que eran las más débiles.

## Cesta (tarea 249)

Cada ficha tiene «Añadir a la cesta» junto a «Crear Proyecto con estos criterios», y en el mapa mental las materias se arrastran a la cesta para reunir sus criterios en común. Detalles: [`cesta_mapas.md`](cesta_mapas.md).

## Mantenimiento

Para cambiar o añadir fichas, edita los JSON y crea una **migración nueva** que vuelva a ejecutar la ingesta (`up` de la 25). La 25 ya consta como aplicada en producción y no se reejecuta. Las traducciones se hacen con el agente `traductor-es-ca` (`.claude/agents/traductor-es-ca.md`).
