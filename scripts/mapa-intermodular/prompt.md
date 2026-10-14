# Prompt para generar un mapa intermodular con otro modelo

Prompt listo para pegar en otro agente (por ejemplo, Gemini con antigravity-cli) para que haga el mapa intermodular de **un curso** de un ciclo de FP ya incorporado. Antes de pegarlo, sustituye los marcadores `<…>`; la tabla de [mapas pendientes](../../documentation/mapas_intermodulares_pendientes.md) da el nivel, el curso, la pestaña y el archivo de cada uno.

Es el mismo procedimiento con que se hizo el mapa del CFGM Cuidados Auxiliares de Enfermería (tarea 223). Si quieres comparar resultados, revisa la rama antes de desplegar.

---

```text
Vas a crear el mapa intermodular del <NOMBRE DEL CICLO>, curso <CURSO>, en el proyecto Plappin (repositorio actual).

Datos de la tarea:
- Nivel (tipoNivel): <NIVEL>                      p. ej. CFGS_INTEGRACION_SOCIAL
- Curso: <CURSO>                                  1º o 2º
- Pestaña del mapa (tab): <TAB>                   <NIVEL> para 1.º, <NIVEL>_2 para 2.º
- Archivo del mapa: backend/src/data/mapa-intermodular/<ARCHIVO>.json
- Carpeta de fuentes del mapa: scripts/mapa-intermodular/fuentes/<TAB>/ (config.json y relaciones*.json se versionan; ficha.md no)

Lee antes AGENTS.md (§1, §2 y §8), la sección 8 de documentation/procesamiento_actividades_mapa_intermodular.md y scripts/mapa-intermodular/mapa-intermodular.mts. Trabaja en una rama feature/NNN_mapa_<slug> con el número común de AGENTS.md §1.1, creada desde la rama que contenga scripts/mapa-intermodular (feature/223_mapa_cfgm_cuidados_auxiliares_enfermeria mientras no esté fusionada con main).

PASO 1. Ficha curricular. Ejecuta:
  cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts ficha --nivel <NIVEL> --curso <CURSO> --trabajo ../scripts/mapa-intermodular/fuentes/<TAB>
Se crean ficha.md (módulos, RA y criterios oficiales en castellano y catalán) y config.json. Lee ficha.md entera: es la única fuente de los textos curriculares. No inventes RA ni criterios y no los copies en tus archivos: el generador los toma de la aplicación.

PASO 2. config.json. Revisa para cada módulo:
- "tipo": especifico, comun o transversal;
- "relacion": la familia que se muestra en las conexiones que llegan a ese módulo (tecnica, ciencias, comunicacion, empleabilidad, cliente, sostenibilidad o digital);
- "color" e "icon".
Los módulos comunes (0156, 0179, 1664, 1665, 1708, 1709, 1710, 1713) ya vienen rellenos. En los específicos, elige la relación que mejor describa el módulo; no uses "tecnica" para todos si hay módulos de ciencias, de atención a la persona o de comunicación.

PASO 3. Plan de relaciones. Una relación une dos RA de módulos distintos del mismo curso y se publica en los dos RA, de modo que es bidireccional. Antes de redactar, haz el plan completo y cumple estas reglas:
1. Cada RA participa en 6-15 relaciones (objetivo: unas 8). Cuenta las de los dos lados.
2. No se repite ningún par de RA. Si dos ideas unen los mismos RA, fusiónalas.
3. Cada lado cita de 1 a 3 criterios de su RA, por letra ("a", "b"…). Como máximo hay tres criterios externos por conexión.
4. Entre todas las relaciones se cubren TODOS los criterios del curso.
5. La relación debe ser pedagógicamente real: los criterios de los dos lados se trabajan juntos en una misma tarea profesional. No conectes por palabras sueltas.
Reparte las relaciones entre todos los módulos. Los módulos comunes y transversales también necesitan 6 relaciones por RA: conéctalos con situaciones profesionales del ciclo.

PASO 4. Redacción. Escribe las relaciones en uno o varios archivos scripts/mapa-intermodular/fuentes/<TAB>/relaciones_NN.json (arrays JSON; el generador une todos los relaciones*.json). Cada relación tiene UNA actividad propia y bien desarrollada, con este formato:

[
  {
    "a": { "modulo": "0337", "ra": "RA2", "criterios": ["a", "d"] },
    "b": { "modulo": "0340", "ra": "RA1", "criterios": ["c"] },
    "justificacion_es": "Por qué se conectan estos criterios (1-2 frases).",
    "justificacion_ca": "…",
    "actividades": [
      {
        "titulo_es": "Título breve y único",            "titulo_ca": "…",
        "contexto_es": "Situación profesional realista que motiva la actividad (1 frase).", "contexto_ca": "…",
        "desarrollo_es": "Qué hace el alumnado (2-4 frases), citando cada criterio que se trabaja con su código completo: (0337-2a), (0340-1c).", "desarrollo_ca": "…",
        "evidencia_es": "Producto o evidencia evaluable.",  "evidencia_ca": "…",
        "dua_es": "Medidas DUA concretas para esta actividad.", "dua_ca": "…",
        "metodologia_es": "aprendizaje basado en retos.",  "metodologia_ca": "aprenentatge basat en reptes."
      }
    ]
  }
]

Reglas de redacción:
- La actividad trabaja los criterios citados de AMBOS lados, y el desarrollo los cita todos con su código completo (módulo-númeroRA+letra). Si el código del módulo lleva letras (CAE1…), usa CAE1-1a.
- Los títulos no se repiten dentro de un mismo RA, ni en castellano ni en catalán. Evita los títulos genéricos («Actividad integrada 3»).
- Usa metodologías activas variadas: proyectos, retos, casos, simulación, juego de rol, aprendizaje-servicio, aprendizaje cooperativo…
- Los campos _es van en castellano y los _ca en catalán balear de FP (l'alumnat, fer, emplenar, feina…), sin faltas y sin mezclar idiomas. El catalán debe ser una versión natural, no una traducción palabra por palabra.
- Las DUA y las evidencias deben ser propias de cada actividad, no una plantilla repetida.
- Escribe JSON válido: comillas dobles y el apóstrofo catalán (') tal cual.

PASO 5. Validación y generación. Ejecuta:
  cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts construir --nivel <NIVEL> --curso <CURSO> --trabajo ../scripts/mapa-intermodular/fuentes/<TAB> --salida src/data/mapa-intermodular/<ARCHIVO>.json
Si hay errores (❌), corrígelos en tus archivos y repite hasta que no quede ninguno. Si hay avisos de criterios sin cubrir (⚠️), añade o amplía relaciones hasta que desaparezcan. No edites a mano el JSON generado.

PASO 6. Integración en la aplicación (sigue el ejemplo de la tarea 223):
1. backend/src/data/niveles.ts: añade a la entrada <NIVEL> el array mapas (si ya existe, añade el elemento). Si el ciclo tiene un solo curso: { tab: '<TAB>', moduleCode: '<primer módulo>', raId: '<primer módulo>_RA1' }. Si tiene dos cursos, lleva también curso: '<CURSO>'.
2. Migración nueva backend/src/migrations/NN_ingest_mapa_<slug>.ts, con el siguiente número libre de dos dígitos y la forma de 36_ingest_mapa_cfgm_cuidados_auxiliares_enfermeria.ts. Sustituye solo su pestaña.
3. backend/src/tests/niveles-catalogo.test.ts: añade la pestaña a MAPA_TABS y su entrada al array de mapas, respetando el orden del catálogo.
4. backend/src/tests/mapa.test.ts: añade un test de la migración como el de la 36. Comprueba que la migración es idempotente, que no toca otras pestañas, que el mapa es bidireccional (expectBidirectionalMap con el número de módulos y de conexiones que imprime el generador), que hay 6-15 conexiones por RA y que el endpoint devuelve los módulos en orden.
5. Ejecuta cd backend && npm run typecheck && npm test, y cd frontend && npm test. Todo debe quedar en verde.

PASO 7. Documentación y entrega:
- Marca el mapa como hecho en documentation/mapas_intermodulares_pendientes.md (relaciones, conexiones y modelo que lo generó).
- Crea el registro tareas/NNN_mapa_<slug>.md (propósito, flujo, archivos, cifras y decisiones), como tareas/223_mapa_cfgm_cuidados_auxiliares_enfermeria.md.
- Haz commit en castellano y push de la rama. No despliegues ni fusiones con main: el usuario revisará el mapa antes.
- Incluye en el commit config.json y relaciones*.json de scripts/mapa-intermodular/fuentes/<TAB>/: son la fuente del mapa y permiten regenerarlo si cambian los textos de los RA.
```

---

## Notas para quien lanza el prompt

- **Un curso por ejecución.** En los ciclos de dos cursos, lanza el prompt dos veces (1.º y 2.º). Cada curso lleva su propia migración: la del primero puede estar ya aplicada en producción y no debe modificarse.
- **Ejecuciones en paralelo.** Si lanzas varios mapas a la vez en ramas distintas, chocarán en el número de migración, en `niveles.ts` y en las listas de `niveles-catalogo.test.ts`. Es preferible lanzarlos de uno en uno o renumerar al fusionar.
- **Coste.** El paso 4 es el caro: unas 120-180 actividades bilingües por curso. Si el modelo trunca la salida, pídele que escriba las relaciones por módulos en varios `relaciones_NN.json`.
