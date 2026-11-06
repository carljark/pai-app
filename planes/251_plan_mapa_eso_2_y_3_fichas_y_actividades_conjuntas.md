# Plan 251: Ampliación de los mapas de afinidades de 2.º y 3.º de ESO y actividades conjuntas

> **Fecha:** 6 de noviembre de 2026
> **Estado:** Aprobado
> **Partes afectadas:** backend (datos, tests) / migraciones / despliegue. El frontend ya muestra actividades desde la tarea 247.

---

## 1. Objetivo

El usuario pide: «Haz también segundo y tercero de la ESO tal y como hicimos ayer», es decir, repetir la tarea 247 en 2.º y 3.º. Hoy los dos cursos están muy por detrás de 1.º y ninguna de sus fichas tiene actividades:

| Curso | Materias | Fichas | Parejas cubiertas (de las posibles) | Materias con menos de 6 fichas |
|---|---|---|---|---|
| 1.º (tarea 247) | 12 | 43 | 42 de 66 | 0 |
| 2.º | 15 | 29 | 28 de 105 | 13 |
| 3.º | 17 | 37 | 37 de 136 | 13 |

Igual que en la 247, hay dos partes:
1. **Más conexiones:** fichas nuevas hasta que cada materia aparezca en **al menos 6 fichas** de su curso. Solo se crean parejas o tríos con fundamento curricular real. Estimación: unas 18 fichas en 2.º (47 en total) y unas 16 en 3.º (53).
2. **Actividades conjuntas:** **3 por ficha** en todas las fichas de los dos cursos, unas 140 en 2.º y unas 160 en 3.º.

4.º no cambia.

## 2. Escenarios

- **Escenario: cada materia de 2.º y 3.º aparece en al menos 6 fichas**
  - **Dado** los JSON de afinidades
  - **Cuando** se cuentan las fichas de 2.º y de 3.º por materia del currículo de cada curso
  - **Entonces** ninguna tiene menos de 6. En 4.º sigue valiendo el mínimo de 3.
- **Escenario: cada ficha de 1.º a 3.º tiene al menos 3 actividades con ids consecutivos**
  - **Dado** las fichas de 1.º, 2.º y 3.º
  - **Cuando** se leen sus `actividades`
  - **Entonces** hay 3 o más por ficha (`ESO2-1-A1`…), con todos los campos `_es`/`_ca` rellenos y distintos.
- **Escenario: las actividades solo citan criterios del curso y de las materias de su ficha**
  - **Dado** una actividad de 2.º o de 3.º
  - **Cuando** se validan sus `criterios` contra `curriculo-eso`
  - **Entonces** cada criterio existe y se imparte en ese curso, y la actividad cita al menos 2 materias.
- **Escenario: títulos únicos y paridad de idioma por curso**
  - **Dado** las actividades de cada curso
  - **Cuando** se comparan sus títulos y se aplican las comprobaciones de idioma
  - **Entonces** no hay títulos repetidos dentro del curso, ni catalán en `_es` ni castellano en `_ca`.
- **Escenario: 4.º sigue sin actividades**
  - **Dado** las fichas de 4.º
  - **Cuando** se leen
  - **Entonces** no tienen el campo `actividades`.
- **Escenario: la API y la migración 53**
  - **Dado** la migración 53 aplicada
  - **Cuando** se llama a `GET /api/afinidades-eso?tab=ESO_2` y `tab=ESO_3`
  - **Entonces** cada ficha incluye sus actividades y `tab=ESO_4` no las tiene. La migración sustituye la colección sin duplicar y se puede reejecutar.

## 3. Alternativas

- **Una tarea para los dos cursos (recomendada).** Comparten herramientas, tests, migración y despliegue, así que hay una sola migración y un solo despliegue. Los tramos de cada curso pueden ir en paralelo, como en la tarea 250.
- Dos tareas, una por curso, como se hizo con los mapas de FP. Duplica la migración, los tests y el despliegue sin ventaja, porque el frontend ya está hecho.

**Quién decide y quién redacta** (igual que en la 247):
- **Claude Code** fija el catálogo de fichas nuevas: materias, ámbito ES/CA y vínculos de criterios validados contra `curriculo-eso`. **Lo enseño antes de lanzar DeepSeek.**
- **DeepSeek V4.1 Flash con opencode** redacta las fichas y las actividades en tramos pequeños validados. Lanzaré los tramos en paralelo desde el principio.
- **Coste previsto:** unos 0,6 $. La 247 costó 0,253 $ por 129 actividades y 22 fichas, y aquí hay unas 300 actividades y 34 fichas.

## 4. Cambios por archivo

| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/data/afinidades-eso/afinidades_eso_2.json` | Fichas `ESO2-30`… y `actividades` en todas | domain (datos) |
| `backend/src/data/afinidades-eso/afinidades_eso_3.json` | Fichas `ESO3-38`… y `actividades` en todas | domain (datos) |
| `backend/src/migrations/53_reload_afinidades_eso_2_3.ts` (nueva) | Reutiliza el `up` de la 25, como la 51: solo toca `afinidadesos` y se puede reejecutar | infrastructure |
| `backend/src/tests/afinidades-datos.test.ts` | Mínimo de 6 fichas por materia en 1.º-3.º; las comprobaciones de actividades se aplican a 1.º-3.º con los criterios de cada curso; 4.º sin actividades | tests |
| `backend/src/tests/afinidades.test.ts` | La API devuelve las actividades de 2.º y 3.º y ninguna en 4.º; test de la migración 53 | tests |
| `frontend/src/app/testing/afinidades.mock.ts` y specs | Solo si algún spec da por hecho que 2.º no tiene actividades | tests |
| `documentation/mapa_afinidades_eso.md` | Cobertura y actividades de 2.º y 3.º | docs |
| `scripts/afinidades-eso/actividades/` (ignorado en git) | Herramientas de la 247 parametrizadas por curso (`CURSO=2`/`3`): rutas, ids, criterios del curso, tramos numerados por curso | herramientas temporales |
| `planes/README.md`, `tareas/251_*.md` | Índice y registro | docs |

## 5. Tareas

1. [ ] Crear la rama `feature/251_mapa_eso_2_y_3_fichas_y_actividades` desde `main`, cuando la tarea 250 esté integrada.
2. [ ] **Catálogo de fichas nuevas** de 2.º y 3.º (Claude Code), validado contra `curriculo-eso`, con cada materia en al menos 6 fichas. **Enseñarlo al usuario antes de redactar.**
3. [ ] Parametrizar por curso las herramientas de la 247, generar los tramos y probar un tramo de cada tipo y curso. Revisar la calidad.
4. [ ] Lanzar **a la vez todos los tramos restantes** de los dos cursos, cada uno en su propio proceso de opencode y sin tandas (petición del usuario), y corregir los que no validen. Solo se reduce la concurrencia si OpenRouter devuelve errores de límite de peticiones.
5. [ ] Revisión de muestra: una ficha nueva por materia y unas 15 actividades por curso.
6. [ ] Incorporar los datos con `incorporar.py`, la migración 53 y los tests.
7. [ ] Suites completas de backend y frontend, typecheck y prueba en Docker local (Rancher Desktop) de la API.
8. [ ] Documentación, `/registrar-tarea` con el coste de DeepSeek, commit, push, CI en verde, integración en `main` y seguimiento del despliegue.

## 6. Riesgos y verificación prevista

- **Calidad curricular.** El esqueleto lo fija Claude Code y `comprobar.py` rechaza los criterios que no son del curso. Además, se prueba un tramo de cada tipo y se revisa una muestra.
- **Materias optativas** (Cultura Clásica, Recursos Digitales, Taller de Finanzas, Técnicas Experimentales, Segunda Lengua Extranjera…). Tienen pocas afinidades naturales.
  - Para llegar a 6 fichas se usan tríos con materias comunes.
  - Si alguna no da para 6 con fundamento real, se avisa al usuario en vez de forzar fichas.
  - En 2.º aparecen a la vez `cultura_clasica_1` y `cultura_clasica_2`: se comprueba cuál corresponde a cada curso antes de crear fichas.
- **Paridad ES/CA:** comprobaciones de idioma de los tests y de `comprobar.py`, apóstrofo tipográfico en catalán y revisión de muestra.
- **Migración:** sustituye `afinidadesos` con los JSON del repositorio, igual que la 25 y la 51. No toca datos de usuarios y se hace copia de seguridad en el despliegue. No es delicada.
- **Tamaño:** los JSON de 2.º y 3.º crecerán hasta unos 300 KB cada uno. Se sirven por pestaña desde el backend y no van en el bundle del frontend.
- **Verificación:** `afinidades-datos.test.ts` y `afinidades.test.ts`, suites completas de backend y frontend, typecheck, API en Docker local y, tras desplegar, en producción.
