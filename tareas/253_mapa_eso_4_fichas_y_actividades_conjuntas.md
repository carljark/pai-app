# Tarea 253: Ampliación del mapa de afinidades de 4.º de ESO y actividades conjuntas

> **Plan:** [253 — Ampliación del mapa de afinidades de 4.º de ESO y actividades conjuntas](../planes/253_plan_mapa_eso_4_fichas_y_actividades_conjuntas.md)

## Propósito
El usuario pidió: «Haz también cuarto de la ESO», es decir, repetir en 4.º las tareas 247 (1.º) y 251 (2.º y 3.º).

| | Antes | Ahora |
|---|---|---|
| Fichas | 38, todas parejas | 54 |
| Materias con menos de 6 fichas | 18 (14 con 4 y 4 con 5) | Ninguna: las 18 tienen exactamente 6 |
| Actividades | 0 | 162, 3 por ficha |

Con esto, toda la ESO tiene al menos 6 fichas por materia y actividades conjuntas en todas las fichas.

## Arquitectura y flujo
No hay código nuevo de aplicación: el modelo, la API y el componente `AfinidadActividadesComponent` son los de la tarea 247.
- **Datos:** `afinidades_eso_4.json`, con las fichas `ESO4-39`…`ESO4-54` y `actividades` en las 54.
- **Migración 54** (`54_reload_afinidades_eso_4.ts`): reutiliza el `up` de la 25, como la 51 y la 53. Solo sustituye la colección `afinidadesos` y se puede reejecutar.

### Redacción con opencode y DeepSeek
1. **Catálogo (Claude Code):** 16 parejas nuevas, cada una con su ámbito ES/CA y dos vínculos de criterios del bloque de 4.º.
   - Cubren exactamente lo que faltaba a cada materia.
   - Ninguna pareja estaba usada, y Matemáticas A y B no se emparejan porque son alternativas.
   - Se validó contra `curriculo-eso` y **lo aprobó el usuario**.
2. **Herramientas:** copia de las de 3.º en `scripts/afinidades-eso/actividades_4/` (ignorada en git), adaptada a 4.º y a alumnado de 15-16 años.
3. **Tramos:** 16, en un worktree aparte y **lanzados todos a la vez**.
   - 8 de fichas nuevas (2 por tramo) y 8 de actividades de fichas existentes (hasta 5 por tramo).
   - Todos validaron sin necesitar corrección.
4. **Incorporación:** `incorporar.py`. Las 38 fichas originales solo ganan `actividades`.

## Archivos modificados
1. `backend/src/data/afinidades-eso/afinidades_eso_4.json`: fichas nuevas y actividades.
2. `backend/src/migrations/54_reload_afinidades_eso_4.ts` (nueva).
3. `backend/src/tests/afinidades-datos.test.ts`:
   - mínimo de 6 fichas por materia en los cuatro cursos;
   - comprobaciones de actividades en 1.º-4.º;
   - el test «4.º no tiene actividades» pasa a ser «todas las fichas de la ESO son de un curso con actividades».
4. `backend/src/tests/afinidades.test.ts`:
   - la API devuelve las actividades de los cuatro cursos;
   - en el test de la migración 51 se quita la comprobación de que 4.º no tenía actividades;
   - test nuevo de la migración 54.
5. `documentation/mapa_afinidades_eso.md`: actividades en toda la ESO, migración 54, sección «Ampliación de 4.º» y cobertura de 4.º.
6. `planes/253_*.md` y `planes/README.md`.

## Decisiones técnicas
- **Solo parejas:** 4.º no tenía tríos y quedaban parejas libres con fundamento para todas las materias.
- **Fichas más justas:**
  - ESO4-47, Educación Física + Lengua Catalana: juegos tradicionales y variedades dialectales.
  - ESO4-46, Tecnología + Educación Física: sensores y prevención de lesiones.

  En la revisión, las dos tienen actividades con sentido. Por ejemplo, en la 47 el alumnado recupera juegos tradicionales entrevistando a personas mayores.
- **Herramientas copiadas por curso,** como en la 251.

## Verificación
- Tests de afinidades (`afinidades-datos.test.ts` y `afinidades.test.ts`): 39 en verde.
- Backend:
  - `npm run typecheck`: 0 errores.
  - `npm test`: 41 archivos y 496 tests en verde, con los umbrales de cobertura.
- Frontend: `npm test` (lint, 126 archivos y 1181 tests, cobertura y zoneless) en verde, sin cambios de código.
- Revisión de muestra hecha por Claude Code:
  - las actividades de ESO4-46, 47, 53 y 54 y los saberes de las fichas nuevas;
  - la variedad de comienzos y de productos;
  - catalán sin apóstrofos rectos.
- **No medido:** el coste de DeepSeek en OpenRouter. La previsión era de unos 0,3 $.

## Desviaciones respecto al plan
Ninguna relevante.
