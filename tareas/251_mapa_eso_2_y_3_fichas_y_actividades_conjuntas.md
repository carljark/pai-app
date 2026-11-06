# Tarea 251: Ampliación de los mapas de afinidades de 2.º y 3.º de ESO y actividades conjuntas

> **Plan:** [251 — Ampliación de los mapas de afinidades de 2.º y 3.º de ESO y actividades conjuntas](../planes/251_plan_mapa_eso_2_y_3_fichas_y_actividades_conjuntas.md)

## Propósito
El usuario pidió: «Haz también segundo y tercero de la ESO tal y como hicimos ayer», es decir, repetir la tarea 247 en 2.º y 3.º. Los dos cursos tenían pocas fichas por materia y ninguna actividad:

| Curso | Antes | Ahora | Actividades |
|---|---|---|---|
| 2.º | 29 fichas, 13 materias con menos de 6 | 48 fichas, todas las materias con 6 o más | 144 |
| 3.º | 37 fichas, 13 materias con menos de 6 | 53 fichas, todas las materias con 6 o más | 159 |

Cada ficha tiene 3 actividades conjuntas. 4.º no cambia.

## Arquitectura y flujo
No hay código nuevo de aplicación: el modelo, la API y el componente `AfinidadActividadesComponent` son los de la tarea 247.
- **Datos:** `afinidades_eso_2.json` y `afinidades_eso_3.json`, con las fichas `ESO2-30`…`ESO2-48` y `ESO3-38`…`ESO3-53`, y `actividades` en todas.
- **Migración 53** (`53_reload_afinidades_eso_2_3.ts`): reutiliza el `up` de la 25, como la 51. Solo sustituye la colección `afinidadesos` y se puede reejecutar.

### Redacción con opencode y DeepSeek
1. **Catálogo de fichas nuevas (Claude Code):** materias, ámbito ES/CA y criterios de cada vínculo, validados contra `curriculo-eso`. **Lo aprobó el usuario** antes de redactar, sabiendo cuáles eran las tres fichas más flojas (2.º-44, 3.º-46 y 3.º-47).
2. **Herramientas:** las de la 247 se copiaron a `scripts/afinidades-eso/actividades_2/` y `actividades_3/`, ignoradas en git, con su curso, su JSON, sus rutas, sus permisos de opencode y sesiones distintas por curso. Las instrucciones dan la edad del alumnado de cada curso.
3. **Tramos:** 16 por curso.
   - 2.º: 10 de fichas nuevas y 6 de actividades de fichas existentes.
   - 3.º: 8 de fichas nuevas y 8 de actividades.
4. **Ejecución:** a petición del usuario, **los 32 tramos se lanzaron a la vez**, cada uno en su proceso. Todos validaron.
   - Algunos necesitaron una corrección dentro de la propia sesión: títulos o comienzos de descripción repetidos, o criterios mal citados.
   - Se trabajó en un worktree aparte, para que las ediciones del repositorio no dispararan el control de archivos versionados de `lanzar.sh`.
5. **Incorporación:** `incorporar.py` de cada curso. Se comprobó que las fichas originales no cambian salvo por las actividades.

## Archivos modificados
1. `backend/src/data/afinidades-eso/afinidades_eso_2.json` y `afinidades_eso_3.json`: fichas nuevas y actividades.
2. `backend/src/migrations/53_reload_afinidades_eso_2_3.ts` (nueva).
3. `backend/src/tests/afinidades-datos.test.ts`:
   - mínimo de 6 fichas por materia en 1.º-3.º;
   - comprobaciones de actividades para 1.º-3.º;
   - títulos únicos por curso;
   - 4.º sin actividades.
4. `backend/src/tests/afinidades.test.ts`:
   - la API devuelve las actividades de 1.º-3.º y ninguna en 4.º;
   - test de la migración 51 ajustado;
   - test nuevo de la migración 53.
5. `documentation/mapa_afinidades_eso.md`: migración 53 y sección «Ampliación de 2.º y 3.º».
6. `.gitignore`: `scripts/afinidades-eso/actividades*/`.
7. `planes/251_*.md` y `planes/README.md`.
8. `tareas/250_*.md`: verificación en producción de la tarea 250.

## Decisiones técnicas
- **Una tarea para los dos cursos:** una sola migración y un solo despliegue.
- **Copias de las herramientas por curso** en lugar de parametrizarlas. Es el cambio mínimo sobre unas herramientas ya probadas, y deja intactas las de 1.º.
- **Tríos:** cada vínculo cita las tres materias, como en las fichas que ya había y como exige el test. El primer catálogo de ESO2-32 no lo cumplía; el validador lo detectó y se corrigió antes de redactar de nuevo ese tramo.
- **Paralelismo total:** los tramos son independientes, y los títulos repetidos entre tramos los detecta `comprobar.py`, que el modelo corrige en la misma sesión.

## Verificación
- `afinidades-datos.test.ts` y `afinidades.test.ts`: 38 tests en verde.
- Backend:
  - `npm run typecheck`: 0 errores, tras corregir un tipo en el test nuevo.
  - `npm test`: 41 archivos y 495 tests en verde, con los umbrales de cobertura.
- Frontend: `npm test` (lint, 126 archivos y 1181 tests, cobertura y zoneless) en verde, sin cambios de código.
- Revisión de muestra hecha por Claude Code:
  - la primera ficha nueva completa (ESO2-48);
  - las actividades de las fichas flojas (ESO2-44, ESO3-46 y ESO3-47) y de fichas existentes;
  - la variedad de comienzos y de productos;
  - que no haya apóstrofos rectos en catalán.
- **No medido:** el coste de DeepSeek en OpenRouter. La previsión era de unos 0,6 $.
- Despliegue: ver el commit de integración y el seguimiento del workflow Deploy.

## Desviaciones respecto al plan
- **ESO2-32:** el catálogo se corrigió durante la redacción (ver «Decisiones técnicas»).
- **Herramientas:** se copiaron por curso en vez de parametrizarlas.
- **Fichas nuevas:** salieron 19 en 2.º y 16 en 3.º, frente a las 18 y 16 estimadas.
