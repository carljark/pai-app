# Mapa de afinidades curriculares de la ESO

El mapa intermodular de la ESO no sigue el modelo de la FP (módulos → RA → conexiones → actividades). Reproduce el formato del documento del IES Cap de Llevant *Afinitats curriculars · ESO 2027-2028*: **fichas de afinidad entre materias, sin actividades**, pensadas para programar por ámbitos (Decreto 42/2025, Illes Balears).

## Formato de una ficha

Cada ficha corresponde a un curso y relaciona dos o tres materias:

- **Ámbito propuesto.** El documento puede darle un nombre distinto según la materia desde la que se consulta. Por eso se guarda en `fuentes[].ambito_es/_ca` y la vista muestra el nombre que corresponde a la materia activa.
- **Vínculos.** Cada vínculo agrupa los criterios de evaluación relacionados de cada materia (`criterios: { materia: ['6.2'] }`), un resumen de cada uno (`resumen_es/_ca`) y la «relación que fundamenta el ámbito» (`relacion_es/_ca`).
- **Saberes básicos movilizados** por materia (`saberes[materia].es/ca`).
- **Conceptos comunes** (`conceptos_es/_ca`).
- **Origen:** `documento` (ficha del documento del centro) o `ampliacion` (propuesta nueva de la plataforma). La vista lo muestra con una insignia.

La ficha etiqueta cada criterio como **«CA x.y»** en los dos idiomas (criterio de evaluación / criteri d'avaluació), como el Decreto 42/2025; «CE» queda reservado a las competencias específicas.

Los textos oficiales de los criterios no se copian en las fichas. El endpoint los resuelve desde la colección `CE` (`tipoNivel: 'ESO_ORDINARIA'`) y los devuelve en `vinculos[].criteriosTexto`. **Los ids de criterio se repiten entre el bloque de 1.º-3.º (o 1.º-2.º) y el de 4.º** (p. ej. Biología 3.2), así que se resuelven por id **y** curso.

## Arquitectura

| Capa | Archivo |
|---|---|
| Datos | `backend/src/data/afinidades-eso/afinidades_eso_{1,2,3,4}.json` |
| Catálogo | `backend/src/data/niveles.ts`: pestañas `ESO_1`…`ESO_4` con `formato: 'afinidades'`. `MAPA_TABS` solo incluye las de módulos; `AFINIDADES_TABS` y `cursoDeTab` son las nuevas |
| Modelo | `backend/src/models/AfinidadEso.ts` (colección propia; el id de la ficha se guarda como `code`) |
| Migración | `backend/src/migrations/25_ingest_afinidades_eso.ts` (borra y reinserta solo esta colección) |
| API | `GET /api/afinidades-eso?tab=ESO_n` (pública, como el mapa de FP): `{ curso, materias, afinidades }`. `materias` son todas las del curso según `subjectTipos` de las CE, con el número de fichas de cada una |
| Frontend | `features/mapa-intermodular/`: `AfinidadesEsoService`, `AfinidadesEsoFacade` (signals y caché por pestaña), `AfinidadesEsoViewComponent` (materias y fichas) y `AfinidadCardComponent` (ficha) |

La vista del mapa (`mapa-intermodular-view`) elige entre el acordeón de FP y la vista de afinidades según el `formato` de la pestaña. Con una pestaña de afinidades, `MapaIntermodularFacade.setTab` no pide módulos. El selector de pestañas es el mismo: la ESO aparece como un ciclo más, con los botones de curso 1.º a 4.º.

## Fuentes y criterios de revisión

- **1.º-3.º.** 80 fichas del documento del centro (20 materias × 4 opciones). Todas las referencias «CA x.y» se validaron contra `curriculo-eso`: existen en la materia y se imparten en el curso de la ficha.
  - Las fichas recíprocas (el mismo par de materias visto desde cada materia) con las mismas relaciones se fusionan en una sola. Se conservan los dos nombres de ámbito en `fuentes`, la unión de criterios y la unión de conceptos.
  - Las parejas con propuestas distintas se mantienen como fichas separadas.
  - El documento solo está en catalán; el castellano es una traducción fiel.
- **Ampliación de 1.º-3.º.** Fichas nuevas hasta que cada materia de cada curso aparezca en al menos 3 fichas.
- **4.º de ESO.** Las 18 materias del curso, incluidas Digitalización, Economía y Emprendimiento, Valores Cívicos y Éticos, Expresión Artística, FOPP, Latín y Tecnología. Cada una aparece al menos en 4 fichas, todas con criterios del bloque de 4.º.
- Los saberes de las fichas nuevas se contrastan con los saberes básicos del decreto oficial (versiones castellana y catalana en `Proyecto_FPB_PAI/ESO/`, fuera de git).

Los tests de datos (`backend/src/tests/afinidades-datos.test.ts`) impiden citar criterios inexistentes o de otro curso, y exigen la paridad ES/CA y la cobertura mínima por materia y curso.

## Mantenimiento

Para cambiar o añadir fichas, edita los JSON y crea una **migración nueva** que vuelva a ejecutar la ingesta (`up` de la 25). La 25 ya consta como aplicada en producción y no se reejecuta. Las traducciones se hacen con el agente `traductor-es-ca` (`.claude/agents/traductor-es-ca.md`).
