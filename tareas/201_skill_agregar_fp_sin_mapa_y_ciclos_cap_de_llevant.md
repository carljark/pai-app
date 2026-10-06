# Tarea 201: Skill `agregar-fp` sin mapa intermodular y lista de ciclos del IES Cap de Llevant

## Propósito

Preparar la incorporación masiva de ciclos de FP (primero los del IES Cap de Llevant de Maó, luego el resto de Baleares y de España) reduciendo su coste: el **mapa intermodular pasa a ser opcional** (por defecto no se hace; se añade más adelante o bajo demanda) y la skill cubre también el grado superior.

## Cambios

1. `.agents/skills/agregar-fp/SKILL.md`:
   - descripción y avisos: el mapa es opcional; ciclo válido sin `mapas` en el catálogo;
   - añade el grado superior (`CFGS_<SLUG>`, `etapa: 'CFGS'`);
   - extracción determinista de RA y criterios con validación literal contra la fuente oficial (método de la tarea 197), reintentos ante los 502 de la CAIB y prohibición de copiar castellano en `_ca`;
   - Paso 5, parte del Paso 7 y los prompts de las secciones 4 y 5 quedan marcados «solo con mapa»; la plantilla del subagente es sin mapa por defecto.
2. `scripts/scaffold_cfgm.py`: `--etapa {cfgm,cfgs}` y `--con-mapa` (por defecto no crea el JSON del mapa); ficheros `ras_<etapa>_<slug>.data.ts` y migración `NN_ingest_<etapa>_<slug>_ras.ts`.
3. `scripts/verify_cfgm_integration.sh`: acepta `CFGM_`/`CFGS_`, y solo valida el mapa si el catálogo declara `mapas` o con `--con-mapa`.
4. `references/checklist_archivos.md`: secciones de mapa marcadas como opcionales y test de paridad ES/CA siempre.
5. `AGENTS.md` §8: el mapa es opcional y sus reglas aplican solo si se pide.
6. `documentation/ciclos_ies_cap_de_llevant.md` (nuevo): lista de los 7 ciclos pendientes (3 CFGM y 4 CFGS) obtenida de la web del centro, con los cambios anunciados para 2026-27.

## Decisiones

- Sin mapa no se toca el frontend ni el catálogo de mapas; `mapas` ya era opcional en `niveles.ts`.
- Las reglas del mapa (cero conexiones vacías, 6-15 por RA, ≥3 actividades) se conservan intactas para cuando se haga.
- La lista del centro está pendiente de contrastar con TodoFP/BOE y BOIB (nombres oficiales, códigos y cursos); los nombres en castellano son provisionales.
- Solo documentación y scripts de la skill: no hay cambios de aplicación, por lo que no se despliega.
