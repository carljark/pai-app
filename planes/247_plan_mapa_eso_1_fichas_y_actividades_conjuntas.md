# Plan 247: Ampliación del mapa de afinidades de 1.º de ESO y actividades conjuntas

> **Fecha:** 5 de noviembre de 2026
> **Estado:** Implementado (tarea 247)
> **Partes afectadas:** backend (datos, modelo, tests) / frontend (ficha de afinidad) / migraciones / despliegue

---

## 1. Objetivo

Encargo (audio `add_maps/eva_add_eso_first_activities.ogg`): «Amplía el mapa intermodular de primero de la ESO y crea más ejemplos de actividades conjuntas entre las diferentes asignaturas de primero de la ESO».

El mapa de la ESO es el de afinidades (`documentation/mapa_afinidades_eso.md`). Hoy 1.º tiene **21 fichas** que cubren **19 de las 66 parejas** posibles entre sus 12 materias. Cada materia aparece en 3-5 fichas y **ninguna ficha de la ESO tiene actividades**: el formato del IES Cap de Llevant no las incluye. El plan tiene dos partes:

1. **Más conexiones:** unas 20-25 fichas nuevas en 1.º, para llegar a 40-45, hasta que cada materia aparezca en **al menos 6 fichas**. Solo se crean parejas o tríos con fundamento curricular real; no se trata de cubrir las 66 parejas.
2. **Actividades conjuntas:** un campo nuevo `actividades` en las fichas, con **al menos 3 actividades por ficha** en todas las de 1.º (las 21 actuales y las nuevas). En total, unas 130 actividades bilingües.

2.º, 3.º y 4.º no cambian. El campo es opcional, así que quedan preparados para recibir actividades más adelante.

La redacción masiva de fichas y actividades se hace con **opencode y DeepSeek V4.1 Flash (OpenRouter)**, como en la tarea 245. Claude Code prepara los datos de entrada, las instrucciones y el validador, revisa e incorpora el resultado, y se encarga del código, los tests y el despliegue.

## 2. Escenarios

- **Escenario: cada materia de 1.º aparece en al menos 6 fichas**
  - **Dado** los JSON de afinidades
  - **Cuando** se cuentan las fichas de 1.º por materia del currículo de 1.º
  - **Entonces** ninguna materia tiene menos de 6. En 2.º-4.º sigue valiendo el mínimo de 3.
- **Escenario: cada ficha de 1.º tiene al menos 3 actividades conjuntas**
  - **Dado** las fichas de 1.º
  - **Cuando** se leen sus `actividades`
  - **Entonces** hay 3 o más por ficha, con todos los campos `_es`/`_ca` rellenos.
- **Escenario: una actividad solo cita criterios válidos de las materias de su ficha**
  - **Dado** una actividad con `criterios: { materia: ['x.y'] }`
  - **Cuando** se validan contra `curriculo-eso`
  - **Entonces** cada materia citada pertenece a la ficha, el criterio existe y se imparte en 1.º, y la actividad cita al menos 2 materias.
- **Escenario: las actividades no repiten títulos dentro del curso**
  - **Dado** todas las actividades de 1.º
  - **Cuando** se comparan sus títulos ES y CA, ignorando mayúsculas y signos
  - **Entonces** no hay duplicados.
- **Escenario: paridad de idioma en las actividades**
  - **Dado** los textos `_es` y `_ca` de las actividades
  - **Cuando** se aplican las mismas comprobaciones de idioma que al resto de la ficha
  - **Entonces** no hay catalán en `_es` ni castellano en `_ca`.
- **Escenario: las fichas nuevas cumplen las reglas existentes**
  - **Dado** las fichas `ESO1-22` en adelante
  - **Cuando** se ejecuta `afinidades-datos.test.ts`
  - **Entonces** pasan las comprobaciones actuales: ids, 2-3 materias, criterios existentes del curso, saberes y conceptos ES/CA y fuentes.
- **Escenario: la API devuelve las actividades de la ficha**
  - **Dado** la migración 51 aplicada
  - **Cuando** se llama a `GET /api/afinidades-eso?tab=ESO_1`
  - **Entonces** cada ficha incluye `actividades` y las fichas de 2.º-4.º siguen sin ellas y sin errores.
- **Escenario: la ficha muestra las actividades conjuntas en el idioma activo**
  - **Dado** una ficha con actividades
  - **Cuando** se renderiza en castellano y en catalán
  - **Entonces** aparece el bloque «Actividades conjuntas» / «Activitats conjuntes» con título, contexto, desarrollo, producto o evidencia, atención a la diversidad y los criterios por materia («CE x.y» / «CA x.y»).
- **Escenario: una ficha sin actividades no muestra el bloque**
  - **Dado** una ficha de 2.º-4.º
  - **Cuando** se renderiza
  - **Entonces** no aparece el bloque de actividades.
- **Escenario: el mapa mental de la ESO muestra las actividades en el panel**
  - **Dado** la vista de mapa mental de 1.º
  - **Cuando** se abre una ficha
  - **Entonces** el panel lateral (`app-afinidad-card`) incluye sus actividades.

## 3. Alternativas

**Dónde guardar las actividades**
- **A. Campo `actividades` en la ficha (recomendada).** Cada actividad es conjunta de las materias de esa ficha, así que es su sitio natural. Encaja con la API, el mapa mental y «Crear Proyecto» sin tocar la estructura del mapa.
- B. Actividades por vínculo, como en la FP, donde van por conexión de RA. Es más granular, pero los vínculos de la ESO son pares de criterios con resúmenes de una línea: multiplicaría las actividades sin aportar más.
- C. Colección aparte de actividades de la ESO. Es más flexible, pero obliga a un endpoint y una carga nuevos sin necesidad.

**Formato de cada actividad**
- **Se usan los mismos campos que en la FP** (`title`, `motivatingFactor`, `description`, `evidence`, `diversitySupport`, cada uno en `_es`/`_ca`), más `id` y `criterios: Record<materia, string[]>`. El formato es homogéneo y los prompts de la 245 sirven de base.

**Cómo mostrarlas**
- **Componente nuevo `afinidad-actividades` (recomendado).** `activities-grid` está atado a `MapaTab` de la FP (sigla del ciclo) y no muestra criterios por materia. Se crea un componente pequeño que reutiliza su estructura visual y su SCSS como referencia. `afinidad-card` (151 líneas entre TS y HTML) solo gana una línea de plantilla.

**Quién redacta**
- **DeepSeek V4.1 Flash con opencode, en tramos pequeños validados (recomendado).** En la 245 salió a unos 0,0014 $ por actividad y casi todos los tramos validaron a la primera.
  - El coste previsto aquí es de **menos de 1 $**: unas 130 actividades y unas 25 fichas, más el coste fijo de alrededor de 1 céntimo por sesión.
  - Subagentes de Claude: mejor calidad, mucho más caro.
  - Escribirlo todo a mano en la sesión principal: no compensa con ese volumen.
- **El catálogo de fichas nuevas lo decide Claude Code**, no DeepSeek. Es decir, qué parejas o tríos crear y con qué ámbito y vínculos de criterios: es la parte que exige criterio curricular. DeepSeek solo redacta el contenido de cada ficha a partir de ese esqueleto.

## 4. Cambios por archivo

| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/data/afinidades-eso/afinidades_eso_1.json` | Fichas `ESO1-22`… y `actividades` en todas las de 1.º | domain (datos) |
| `backend/src/models/AfinidadEso.ts` | Interfaz `ActividadAfinidad` y campo `actividades?` en `AfinidadEsoData`; en el esquema, `actividades: { type: [Schema.Types.Mixed], default: undefined }` | infrastructure |
| `backend/src/migrations/51_reload_afinidades_eso.ts` (nuevo) | Vuelve a ejecutar la ingesta (`up` de la 25), tal como indica `documentation/mapa_afinidades_eso.md` §Mantenimiento. Solo toca `afinidadesos` y se puede reejecutar | infrastructure |
| `backend/src/tests/afinidades-datos.test.ts` | Mínimo de 6 fichas por materia en 1.º y tests de actividades: al menos 3 por ficha, campos completos, criterios válidos de las materias de la ficha y del curso, al menos 2 materias citadas, títulos únicos e idioma ES/CA | tests |
| `backend/src/tests/afinidades-eso*.test.ts` (API y migración) | La API devuelve `actividades` en 1.º y no las exige en 2.º-4.º; test de la migración 51 | tests |
| `frontend/src/app/features/mapa-intermodular/models/afinidad-eso.model.ts` | `ActividadAfinidad` y `actividades?: ActividadAfinidad[]` | domain |
| `frontend/src/app/features/mapa-intermodular/components/ui/afinidad-actividades/` (nuevo: ts, html, scss, spec) | Bloque de actividades con BEM `.afinidad-actividades__…`, textos ES/CA reactivos al idioma y criterios con siglas «CE»/«CA» y nombre de la materia | presentation |
| `frontend/src/app/features/mapa-intermodular/components/ui/afinidad-card/afinidad-card.component.{ts,html,spec.ts}` | Importa e incluye `<app-afinidad-actividades>` antes de los conceptos, solo si hay actividades | presentation |
| `documentation/mapa_afinidades_eso.md` | Las fichas pueden llevar actividades: formato, fuente (DeepSeek, revisado) y cobertura de 1.º | docs |
| `scripts/afinidades-eso/actividades/` (**ignorado en git**, en `.gitignore`) | Herramientas de la redacción con opencode, adaptadas de `scripts/mapa-intermodular/tres-actividades/` | herramientas temporales |
| `.gitignore` | Añade `scripts/afinidades-eso/actividades/` | config |
| `planes/README.md`, `tareas/247_*.md` | Índice y registro de la tarea | docs |

### Herramientas para opencode y DeepSeek (`scripts/afinidades-eso/actividades/`)

Se adaptan las de la 245, con las mismas protecciones:

- `INSTRUCCIONES.md`: normas de redacción.
  - Bilingüe ES/catalán balear y sin mezclar idiomas.
  - Actividades realistas para 12-13 años, que cada materia aporte algo evaluable, contexto balear cuando venga a cuento, sin repetir planteamientos y con siglas «CE x.y» en castellano y «CA x.y» en catalán.
  - Ejemplo completo de ficha y de actividad.
- `preparar_tramos.py`: genera `tramos/NNN.input.json` y `prompts/NNN.md` con todo lo que necesita el modelo para no tener que leer el repositorio:
  - las fichas del tramo;
  - los textos ES/CA de los criterios de 1.º de sus materias (sacados de `curriculo-eso`);
  - los saberes y los títulos ya usados.

  Hay dos tipos de tramo:
  - **Fichas:** 2-3 fichas nuevas por tramo, a partir del esqueleto que fija Claude (materias, ámbito y criterios). El modelo redacta resúmenes, relaciones, saberes, conceptos y 3 actividades.
  - **Actividades:** unas 5 fichas existentes por tramo, 3 actividades cada una.
- `comprobar.py NNN`: replica las comprobaciones de `afinidades-datos.test.ts` sobre la salida del tramo y añade otras más estrictas:
  - campos vacíos y textos idénticos ES/CA;
  - criterios citados en ES y CA iguales;
  - títulos repetidos con tramos anteriores.
- `lanzar.sh NNN [MMM]`: `opencode run --standalone --auto` con `MODELO=openrouter/deepseek/deepseek-v4.1-flash` y permisos restringidos con `OPENCODE_CONFIG_CONTENT`.
  - Sin shell salvo `comprobar.py` y sin web.
  - Solo puede leer `INSTRUCCIONES.md`, su tramo y las salidas.
  - Hasta dos correcciones por tramo; si sigue fallando, se detiene.
  - Avisa si el modelo toca archivos versionados.
- `incorporar.py`: comprueba que todos los tramos validan, fusiona fichas y actividades en `afinidades_eso_1.json` con orden e ids estables (`ESO1-22-A1`…) y deja el JSON formateado.

## 5. Tareas

1. [ ] Crear la rama `feature/247_mapa_eso_1_fichas_y_actividades` desde la rama actual.
2. [ ] **Catálogo de conexiones nuevas (Claude Code).**
   - Proponer 20-25 parejas o tríos de 1.º con ámbito y vínculos de criterios, dando prioridad a las parejas de materias comunes que faltan (p. ej. Matemáticas–Educación Física, Matemáticas–Música, Biología–Educación Física, Castellano–Geografía) y a varios tríos claros.
   - Validar cada criterio contra `curriculo-eso` y comprobar que cada materia llega a 6 fichas.
   - Enseñar el catálogo al usuario antes de lanzar DeepSeek.
3. [ ] **Backend:** interfaz y esquema `actividades` en `AfinidadEso.ts`, tests nuevos en `afinidades-datos.test.ts` (fallarán hasta tener los datos) y migración `51_reload_afinidades_eso.ts` con su test.
4. [ ] **Herramientas de opencode:** copiar y adaptar las de la 245 en `scripts/afinidades-eso/actividades/` (ignorado en git), generar los tramos y probar `lanzar.sh` con **un solo tramo de cada tipo**. Revisar a mano la calidad y el idioma antes de seguir.
5. [ ] **Redacción con DeepSeek:** lanzar los tramos restantes (unos 13 de fichas y 5 de actividades). Revisar con `estado` los que no validen y corregirlos a mano o relanzarlos.
6. [ ] **Revisión de muestra (Claude Code):** leer al menos una ficha nueva por materia y unas 15 actividades. Si hace falta, pasar el agente `traductor-es-ca` sobre los textos catalanes dudosos.
7. [ ] **Incorporar** con `incorporar.py` y pasar `afinidades-datos.test.ts`.
8. [ ] **Frontend:** modelo, componente `afinidad-actividades` con su spec (ES/CA, sin actividades, criterios con siglas) e inclusión en `afinidad-card`. Pasar ESLint y typecheck.
9. [ ] Comprobar en local, con Docker, la vista de fichas y el mapa mental de 1.º en ambos idiomas.
10. [ ] Actualizar `documentation/mapa_afinidades_eso.md`.
11. [ ] Suites completas: `cd backend && npm test`, `npm run typecheck` y `cd frontend && npm test`.
12. [ ] Registrar la tarea en `tareas/247_*.md` (skill `registrar-tarea`), incluido el coste real de DeepSeek. Después, commit, push y despliegue con `./scripts/deploy-prod.sh`, comprobando que la migración 51 se aplica y que `GET /api/afinidades-eso?tab=ESO_1` devuelve las actividades.
13. [ ] Borrar los temporales que no se queden en la carpeta ignorada y comprobar que `git status` está limpio.

## 6. Riesgos y verificación prevista

- **Calidad curricular de DeepSeek.** Puede citar criterios que no encajan o actividades poco realistas.
  - El esqueleto de las fichas (materias y criterios) lo fija Claude; DeepSeek solo redacta.
  - `comprobar.py` rechaza los criterios no válidos.
  - Revisión de muestra en el paso 6 y prueba con un tramo de cada tipo antes del lote completo.
- **Paridad ES/CA y catalán balear.** Se comprueba con las expresiones regulares de idioma de los tests, que también se aplican a las actividades, y con la revisión de muestra. Si hay dudas, se pasa `traductor-es-ca`.
- **Repeticiones.** DeepSeek tiende a repetir planteamientos («infografía», «presentación oral»). Las instrucciones lo prohíben, cada tramo recibe los títulos ya usados y `comprobar.py` detecta duplicados.
- **Migración.** La 51 sustituye la colección `afinidadesos` entera con los JSON del repositorio, igual que la 25. No toca otras colecciones ni datos de usuarios y se puede reejecutar. Copia de seguridad previa con el despliegue estándar. No es una migración delicada.
- **Compatibilidad.** El campo es opcional: 2.º-4.º y cualquier cliente antiguo siguen funcionando. Los proyectos creados desde una ficha no dependen de las actividades.
- **Frontend.**
  - Cobertura del 90 % por archivo y del 80 % de funciones en `.html`: el spec del componente nuevo pulsa y renderiza en ambos idiomas.
  - Zoneless: el idioma se lee con un `computed` de `LayoutService`, como en `activities-grid`.
  - Límites de 200 líneas por componente y 25 por función: `afinidad-card` apenas crece porque las actividades van en su propio componente.
- **Tamaño del JSON.** `afinidades_eso_1.json` pasará de unos 75 KB a unos 250-300 KB. Se carga en el backend y se sirve por pestaña, nunca en el bundle del frontend, así que no hay riesgo de OOM.
- **opencode.** Los permisos de `OPENCODE_CONFIG_CONTENT` solo se aplican con `--standalone`: hay que comprobar que no hay un servicio de opencode en segundo plano. `lanzar.sh` aborta si el modelo toca archivos versionados.
- **Verificación:** `afinidades-datos.test.ts`, las suites completas de backend y frontend, el typecheck del backend, ESLint y el typecheck del frontend, la revisión visual en local y, tras desplegar, una comprobación de la API en producción.
