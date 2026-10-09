# Tarea 206: Ruta ESO en la skill `agregar-ciclo-educativo`

## Propósito
Tras el renombrado de la tarea 205, la skill incorpora tanto ciclos de FP como niveles de la ESO. Hasta ahora su procedimiento solo cubría la FP (RA por módulo). Se añade una ruta ESO a partir de lo hecho en la ESO ordinaria (tareas 197, 200 y 202).

## Arquitectura y flujo
- **Dos rutas en `SKILL.md`:** una tabla inicial las compara (unidad curricular, agrupación, colección, terminología, mapa opcional y referencias). Fuentes, información mínima y pasos van separados por ruta; la extracción determinista y los tests son secciones comunes.
- **Ruta FP:** pasos 1-7 sin cambios de fondo. La plantilla del subagente ya no pide el mapeo `isCa` en `curriculum.facade.ts` ni `targetCourseDescription`, que quedaron obsoletos con el catálogo de niveles. Ahora pide registrar el ciclo en `niveles.ts`.
- **Ruta ESO (pasos E0-E6):**
  - **E0. Caso A o B:** el caso A amplía o actualiza `ESO_ORDINARIA` y solo requiere datos y una migración nueva. El caso B incorpora otra ESO (`ESO_<SUFIJO>`), es una tarea grande y lleva plan y rama.
  - **E1. Extracción de CE y criterios:** formato JSON por materia, cursos de cada criterio, tipo de materia por curso, materias con niveles separados, validaciones sin absorciones y contraste con la web LOMLOE de la CAIB.
  - **E2. Catálogo:** `unidad: 'CE'`, `terminologia: 'situacion_aprendizaje'`, cursos con `edad` y sin `modulos`.
  - **E3. Migración:** patrón de la 23. Al estar ya aplicada, un cambio de datos necesita una migración nueva.
  - **E4. Solo caso B:** tabla de los puntos de backend y frontend que comparan con `ESO_ORDINARIA` y deben decidir por el catálogo.
  - **E5. Mapa de afinidades opcional:** fichas entre materias, sin actividades.
  - **E6. Tests.**
- El PDC queda fuera de la skill salvo que se pida.

## Archivos modificados
1. `.agents/skills/agregar-ciclo-educativo/SKILL.md`: descripción del frontmatter, tabla de rutas, fuentes e información mínima por ruta, ruta ESO, reglas comunes de extracción y tests, y plantilla de delegación para la ESO.
2. `.agents/skills/agregar-ciclo-educativo/references/checklist_archivos.md`: sección 4 «Ruta ESO» (datos, catálogo, migración, código del caso B, mapa de afinidades y tests).
3. `AGENTS.md` §8: fuentes de la ESO, directriz propia de la ESO y precisión de que las reglas de conexiones son del mapa de FP.
4. `documentation/uso_skill_agregar_ciclo_educativo.md`: fuentes de la ESO y ejemplo de invocación de la ruta ESO.

## Decisiones técnicas
- **Generalizar el código no entra en esta tarea.** Hoy solo hay una ESO, y generalizar sin un segundo nivel real sería especulativo. La skill deja inventariados los puntos atados a `ESO_ORDINARIA` (6 en el backend y 2 en el frontend) para hacerlo cuando llegue el caso B.
- **No hay scaffold para la ESO.** Los datos de cada decreto tienen una estructura distinta (bloques de cursos, erratas), así que la extracción es un script temporal por tarea, como en la tarea 197.
- **Mínimo de tres actividades por conexión** en las reglas del mapa de FP, alineado con el prompt de la sección 7 y la práctica de CFGM Estética. `activities.length >= 1` queda como mínimo absoluto.
- **Ampliación posterior: tres actividades también en las reglas generales.** `AGENTS.md` §8, el checklist de la skill y `documentation/procesamiento_actividades_mapa_intermodular.md` pasan de `activities.length >= 1` a `>= 3`. Se comprobaron los mapas existentes:
  - FPB, CFGM Estética y CFGS Educación Infantil ya cumplen (mínimo 5, 3 y 3);
  - CFGM Peluquería no: 254 de 377 conexiones en 1.º y 189 de 367 en 2.º tienen menos de tres. Se anota como excepción anterior a la regla y no se regenera.

  `scripts/verify_cfgm_integration.sh` sigue comprobando solo que no haya conexiones vacías.
- **Revertido a petición del usuario: mapa solo bajo petición expresa y mínimo de una actividad.** Como el mapa es muy costoso:
  - `AGENTS.md` §8 y la skill (frontmatter, aviso inicial, reglas del paso 5, prompt de la sección 7 y plantilla del subagente) dejan claro que añadir un ciclo **no** incluye el mapa. Una petición como «añade el ciclo X» no lo incluye: no se genera ni se propone; solo se hace si se pide expresamente.
  - El mínimo vuelve a ser una actividad por conexión (`activities.length >= 1`) en `AGENTS.md`, `SKILL.md`, el checklist y `documentation/procesamiento_actividades_mapa_intermodular.md`. Desaparece la nota de excepción de CFGM Peluquería, que ya cumple.
- `lecciones_aprendidas_cobertura.md` no cambia: sus lecciones son de FP y siguen vigentes.

## Verificación
- Revisión de las rutas y los nombres citados contra el código: `ESO_ORDINARIA` en los 8 archivos listados, migraciones 23-25, `AFINIDADES_TABS`, `cursoDeTab` y tests `eso.test.ts`, `afinidades*.test.ts` y `niveles-catalogo.test.ts`.
- Suites completas ejecutadas por el hook de `git push`.
- Cambio solo de documentación e instrucciones: no se despliega en el EC2.
