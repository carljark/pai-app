# Tarea 207: Siglas «CA» para los criterios de evaluación de la ESO

## Propósito
En el mapa de afinidades de la ESO, cada criterio de evaluación aparecía como «CE 1.1», también en catalán. En la ESO (LOMLOE) «CE» es la **competencia específica**, que es la categoría superior, así que la etiqueta inducía a confusión. Además, en catalán un criterio es un *criteri d'avaluació*. Se corrige la etiqueta y se fija la regla en las instrucciones de los agentes.

## Arquitectura y flujo
- La jerarquía curricular de la ESO es saberes básicos ➡️ competencias específicas (CE) ➡️ criterios de evaluación (CA).
- El Decreto 42/2025 (BOIB) escribe los criterios como «CA x.y» en sus dos versiones (151 apariciones en el texto castellano y 156 en el catalán, contadas en los PDF oficiales de `Proyecto_FPB_PAI/ESO/`). Por decisión del usuario, la interfaz usa «CA» en castellano y en catalán.
- En FP la sigla «CE» sí corresponde al criterio de evaluación de un RA, así que la regla es exclusiva de la ESO.

## Archivos modificados
1. `frontend/src/app/features/mapa-intermodular/components/ui/afinidad-card/afinidad-card.component.html`: el `summary` de cada criterio pasa de «CE {{ c.id }}» a «CA {{ c.id }}».
2. `afinidad-card.component.spec.ts`: espera «CA x.y» y comprueba que la sigla se mantiene al cambiar a catalán.
3. `.agents/skills/agregar-ciclo-educativo/SKILL.md`: aviso de siglas de la ESO en la ruta ESO, tabla de rutas y regla en el paso E5 (mapa de afinidades).
4. `.agents/skills/agregar-ciclo-educativo/references/checklist_archivos.md`: sección 4.6 «Siglas».
5. `.claude/agents/traductor-es-ca.md`: siglas fijas CE/CA de la ESO en la terminología del traductor.
6. `AGENTS.md` §8: siglas en la directriz de la ESO.
7. `documentation/mapa_afinidades_eso.md`: la ficha etiqueta los criterios como «CA x.y».

## Decisiones técnicas
- No hace falta migrar datos: los JSON de afinidades guardan solo el id del criterio («6.2»), y sus textos no usan «CE x.y». La sigla la pone la plantilla.
- Es el único punto de la interfaz con esa etiqueta. El selector curricular de la ESO muestra los criterios dentro de su CE, sin sigla.

## Ajuste posterior: «CE» en castellano
A petición del usuario, en castellano el criterio vuelve a etiquetarse «CE x.y» (criterio de evaluación) y en catalán se mantiene «CA x.y» (criteri d'avaluació). La plantilla elige la sigla con `isCa()`. La competencia específica sigue siendo «CE1»; en castellano el formato distingue el criterio («CE 1.1») de la competencia («CE1»). Se actualizaron con la misma regla la skill, su checklist, el agente `traductor-es-ca`, `AGENTS.md` §8 y `documentation/mapa_afinidades_eso.md`. El spec comprueba las dos siglas.

## Verificación
- `npx eslint` de la ficha sin hallazgos y spec de la ficha en verde (10 tests).
- Suites completas ejecutadas por el hook de `git push`.
- Desplegado en el EC2 con `./scripts/deploy-prod.sh`.
