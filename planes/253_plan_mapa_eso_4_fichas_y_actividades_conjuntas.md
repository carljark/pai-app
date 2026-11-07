# Plan 253: Ampliación del mapa de afinidades de 4.º de ESO y actividades conjuntas

> **Fecha:** 7 de noviembre de 2026
> **Estado:** Implementado (tarea 253)
> **Partes afectadas:** backend (datos, tests) / migraciones / despliegue. El frontend ya muestra las actividades desde la tarea 247.

---

## 1. Objetivo

El usuario pide: «Haz también cuarto de la ESO», es decir, repetir en 4.º lo que hicieron las tareas 247 (1.º) y 251 (2.º y 3.º).

**Situación actual de 4.º:**
- 18 materias y 38 fichas, todas parejas.
- 38 de las 153 parejas posibles cubiertas.
- 14 materias aparecen en 4 fichas y otras 4 en 5. Ninguna ficha tiene actividades.

**Cambios:**
1. **Más conexiones:** 16 fichas nuevas (`ESO4-39` a `ESO4-54`), todas parejas que aún no existen. Con ellas, cada materia aparece **exactamente en 6 fichas** y 4.º pasa a 54 fichas.
2. **Actividades conjuntas:** **3 por ficha** en las 54 fichas, 162 en total.

Al terminar, toda la ESO tiene al menos 6 fichas por materia y actividades en todas las fichas.

## 2. Escenarios

- **Escenario: cada materia de 4.º aparece en al menos 6 fichas**
  - **Dado** los JSON de afinidades
  - **Cuando** se cuentan las fichas de cada curso por materia
  - **Entonces** ninguna materia de 1.º a 4.º tiene menos de 6.
- **Escenario: todas las fichas de la ESO tienen al menos 3 actividades con ids consecutivos**
  - **Dado** las fichas de 1.º a 4.º
  - **Cuando** se leen sus `actividades`
  - **Entonces** hay 3 o más por ficha, con todos los campos `_es`/`_ca` rellenos y distintos.
- **Escenario: las actividades de 4.º citan criterios del bloque de 4.º**
  - **Dado** una actividad de 4.º
  - **Cuando** se validan sus `criterios` contra `curriculo-eso`
  - **Entonces** cada criterio existe y se imparte en 4.º, y la actividad cita al menos 2 materias.
  - Los ids se repiten entre el bloque de 1.º-3.º y el de 4.º, así que la validación es por id y curso.
- **Escenario: títulos únicos por curso**
  - **Dado** las actividades de cada curso
  - **Cuando** se comparan los títulos
  - **Entonces** no se repite ninguno dentro del curso, y se mantienen las comprobaciones de idioma.
- **Escenario: la API y la migración 54**
  - **Dado** la migración 54 aplicada
  - **Cuando** se llama a `GET /api/afinidades-eso?tab=ESO_4`
  - **Entonces** cada ficha incluye sus actividades.
  - La migración sustituye la colección sin duplicar y se puede reejecutar.

## 3. Catálogo de fichas nuevas (para aprobar)

Validado contra `curriculo-eso`: todos los criterios existen en 4.º y ninguna pareja se repite con las existentes. Matemáticas A y B no se emparejan entre sí, porque son alternativas.

| Ficha | Materias | Ámbito | Criterios (vínculo 1 · vínculo 2) |
|---|---|---|---|
| ESO4-39 | Música + Digitalización | Producción musical y sonido digital | MU 2.2, 4.1 / DIG 2.3 · MU 1.2 / DIG 4.1 |
| ESO4-40 | Música + Segunda Lengua Extranjera | Canciones y cultura de otros países | MU 1.1 / SLE 6.3 · MU 3.3 / SLE 2.1 |
| ESO4-41 | Digitalización + Lengua Extranjera | Comunicación digital en lengua extranjera | DIG 2.4 / LE 3.1 · DIG 2.2 / LE 1.1 |
| ESO4-42 | Lengua Extranjera + Biología y Geología | Divulgación científica en lengua extranjera | LE 1.2 / BG 2.2 · LE 2.2 / BG 1.2 |
| ESO4-43 | Biología y Geología + Matemáticas B | Genética, probabilidad y modelos de poblaciones | BG 1.1, 4.1 / MB 4.2 · BG 3.4 / MB 7.1 |
| ESO4-44 | Matemáticas B + Economía y Emprendimiento | Funciones, interés y viabilidad de un proyecto | MB 6.2 / ECO 4.3 · MB 4.2 / ECO 6.4 |
| ESO4-45 | Economía y Emprendimiento + Tecnología | Prototipos con valor para la comunidad | ECO 4.1 / TEC 1.1 · ECO 5.2 / TEC 3.2 |
| ESO4-46 | Tecnología + Educación Física | Sensores y tecnología al servicio de la actividad física | TEC 4.1 / EF 1.6 · TEC 2.1 / EF 1.3 |
| ESO4-47 | Educación Física + Lengua Catalana | Juegos tradicionales y cultura popular | EF 4.1 / LCT 1.1 · EF 3.3 / LCT 3.2 |
| ESO4-48 | Matemáticas A + FOPP | Presupuesto personal e itinerarios profesionales | MA 6.1 / FOPP 5.1 · MA 7.1 / FOPP 5.2 |
| ESO4-49 | Matemáticas A + Expresión Artística | Geometría, proporción y composición artística | MA 6.2 / EA 2.2 · MA 3.1 / EA 1.1 |
| ESO4-50 | Expresión Artística + Lengua Castellana | Narración gráfica: cómic y álbum ilustrado | EA 4.1 / LCS 8.3 · EA 3.2 / LCS 5.1 |
| ESO4-51 | Lengua Castellana + Geografía e Historia | Literatura y contexto histórico contemporáneo | LCS 8.1 / GH 3.3 · LCS 6.2 / GH 1.2 |
| ESO4-52 | Segunda Lengua Extranjera + FOPP | Movilidad europea y orientación académica | SLE 2.2 / FOPP 5.2 · SLE 6.1 / FOPP 4.1 |
| ESO4-53 | Latín + Física y Química | Etimología del vocabulario científico | LAT 2.4 / FQ 3.2 · LAT 3.1 / FQ 6.1 |
| ESO4-54 | Latín + Valores Cívicos y Éticos | Ciudadanía y derecho: de Roma a hoy | LAT 1.2 / VCE 2.2 · LAT 3.3 / VCE 2.1 |

**Las más justas:**
- **ESO4-47 (Educación Física + Lengua Catalana):** se apoya en los juegos tradicionales, las variedades dialectales y la interacción oral.
- **ESO4-46 (Tecnología + Educación Física).**

Las demás parejas posibles de Latín, Educación Física y Lengua Catalana ya estaban usadas o tenían menos fundamento.

Las 16 fichas cubren exactamente lo que falta: 2 apariciones para cada una de las 14 materias con 4 fichas y 1 para las 4 con 5.

## 4. Alternativas

- **Repetir el procedimiento de la 251 (recomendada).** Copia de las herramientas por curso en `scripts/afinidades-eso/actividades_4/`, tramos en un worktree aparte y **todos los tramos lanzados a la vez**.
- Usar tríos para cubrir con menos fichas. 4.º no tiene ningún trío y las parejas libres bastan, así que se mantiene el estilo actual del curso.

**Coste previsto de DeepSeek:** unos 0,3 $ por 162 actividades y 16 fichas, por proporción con la 247 y la 251.

## 5. Cambios por archivo

| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/data/afinidades-eso/afinidades_eso_4.json` | Fichas `ESO4-39`…`ESO4-54` y `actividades` en todas | domain (datos) |
| `backend/src/migrations/54_reload_afinidades_eso_4.ts` (nueva) | Reutiliza el `up` de la 25, como la 51 y la 53 | infrastructure |
| `backend/src/tests/afinidades-datos.test.ts` | Mínimo de 6 fichas en todos los cursos; actividades obligatorias en 1.º-4.º; se quita el test «4.º no tiene actividades» | tests |
| `backend/src/tests/afinidades.test.ts` | La API devuelve las actividades de los cuatro cursos; tests de las migraciones 51 y 53 ajustados; test de la migración 54 | tests |
| `documentation/mapa_afinidades_eso.md` | Cobertura y actividades de 4.º | docs |
| `scripts/afinidades-eso/actividades_4/` (ignorado en git) | Herramientas de la 251 adaptadas a 4.º (alumnado de 15-16 años) | herramientas temporales |
| `planes/README.md`, `tareas/253_*.md` | Índice y registro | docs |

## 6. Tareas

1. [ ] Rama `feature/253_mapa_eso_4_fichas_y_actividades` desde `main`.
2. [ ] Herramientas de 4.º y tramos: 8 de fichas nuevas (2 por tramo) y 8 de actividades de fichas existentes (unas 5 por tramo).
3. [ ] Lanzar los 16 tramos a la vez en un worktree aparte y corregir los que no validen.
4. [ ] Revisión de muestra: fichas nuevas, las dos más justas y unas 15 actividades.
5. [ ] `incorporar.py`, comprobación de que las 38 fichas originales solo ganan actividades, migración 54 y tests.
6. [ ] Typecheck y suites completas de backend y frontend.
7. [ ] Documentación, registro de la tarea, commit, push, CI en verde, integración en `main`, seguimiento del despliegue y comprobación de la API en `https://plappin.org`.

## 7. Riesgos y verificación prevista

- **Criterios con el mismo id en 1.º-3.º y en 4.º:** `comprobar.py` y los tests validan por id y curso.
- **Optativas de 4.º** (Latín, Expresión Artística, FOPP, Digitalización, Economía y Emprendimiento, Segunda Lengua Extranjera): cada una queda con 6 fichas, todas sobre criterios de su materia, y la revisión de muestra se centra en ellas.
- **Paridad ES/CA:** comprobaciones de idioma de los tests y de `comprobar.py`, y apóstrofo tipográfico.
- **Migración:** solo sustituye `afinidadesos` con los JSON del repositorio y no toca datos de usuarios. No es delicada.
- **Verificación:** tests de afinidades, suites completas, typecheck y la API en producción tras el despliegue.
