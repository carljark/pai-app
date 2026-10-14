# Prompt: mapa intermodular de CFGS Acondicionamiento Físico, 2.º

Versión de [`prompt.md`](prompt.md) con los datos ya rellenos para el siguiente mapa de la [lista de pendientes](../../documentation/mapas_intermodulares_pendientes.md). Se reservaron la tarea 227 y la migración 39 el 14 de octubre de 2026. El prompt se actualizó ese mismo día, cuando la tarea 228 ya había añadido el mapa de 1.º del ciclo y la 232 (CFGM Atención a la Dependencia 2.º, migración 41) estaba en marcha en paralelo.

---

```text
Vas a crear el mapa intermodular del CFGS Acondicionamiento Físico, curso 2º, en el proyecto Plappin (repositorio actual).

Datos de la tarea:
- Nivel (tipoNivel): CFGS_ACONDICIONAMIENTO_FISICO
- Curso: 2º (el 1º ya tiene mapa, hecho en la tarea 228; esta tarea solo hace el 2º)
- Pestaña del mapa (tab): CFGS_ACONDICIONAMIENTO_FISICO_2
- Archivo del mapa: backend/src/data/mapa-intermodular/mapa_cfgs_acondicionamiento_fisico_2.json
- Carpeta de fuentes del mapa: scripts/mapa-intermodular/fuentes/CFGS_ACONDICIONAMIENTO_FISICO_2/ (config.json y relaciones*.json se versionan; ficha.md no)
- Módulos de 2º (7 módulos, 35 RA, 248 criterios):
  1150 Actividades especializadas de acondicionamiento físico con soporte musical (5 RA)
  1152 Técnicas de hidrocinesia (5 RA)
  1153 Control postural, bienestar y mantenimiento funcional (5 RA)
  1154 Proyecto intermodular de acondicionamiento físico (4 RA)
  0179 Inglés profesional (5 RA)
  1708 Sostenibilidad aplicada al sistema productivo (6 RA)
  1710 Itinerario personal para la empleabilidad II (5 RA)
- Tamaño orientativo: unas 140 relaciones (≈ 280 conexiones), una actividad por relación.
- Número común de la tarea: 227 (reservado) → rama feature/227_mapa_cfgs_acondicionamiento_fisico_2 y registro tareas/227_mapa_cfgs_acondicionamiento_fisico_2.md. No lo recalcules: la 227 está reservada para este mapa aunque haya números mayores ocupados.
- Migración: backend/src/migrations/39_ingest_mapa_cfgs_acondicionamiento_fisico_2.ts (la 39 está reservada; la 40 es del 1º de este ciclo y la 41 la usa otra tarea en paralelo).

Rama de partida: crea la tuya desde origin/feature/228_mapa_cfgs_acondicionamiento_fisico_1, que tiene la herramienta con el validador y el mapa de 1º:
  git fetch && git switch -c feature/227_mapa_cfgs_acondicionamiento_fisico_2 origin/feature/228_mapa_cfgs_acondicionamiento_fisico_1
Si el directorio no tiene node_modules, instala: cd backend && npm ci; cd frontend && npm ci --legacy-peer-deps.

Lee antes AGENTS.md (§1, §2 y §8), la sección 8 de documentation/procesamiento_actividades_mapa_intermodular.md y scripts/mapa-intermodular/mapa-intermodular.mts. Toma como ejemplo de calidad las tareas 225 y 228 (tareas/225_mapa_cfgs_integracion_social_2.md, tareas/228_mapa_cfgs_acondicionamiento_fisico_1.md y los relaciones.json de scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL_2/ y CFGS_ACONDICIONAMIENTO_FISICO/). Lee al menos 15 actividades de cada uno antes de redactar. El de 1º de este mismo ciclo te sirve además para mantener el tono, los colores y los iconos.

PASO 1. Ficha curricular. Ejecuta:
  cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts ficha --nivel CFGS_ACONDICIONAMIENTO_FISICO --curso 2º --trabajo ../scripts/mapa-intermodular/fuentes/CFGS_ACONDICIONAMIENTO_FISICO_2
Lee ficha.md entera: es la única fuente de los textos curriculares. No inventes RA ni criterios y no los copies en tus archivos: el generador los toma de la aplicación.

PASO 2. config.json. Los comunes 0179 (comunicacion), 1708 (sostenibilidad) y 1710 (empleabilidad) ya vienen rellenos. Para el resto usa esta propuesta salvo que la ficha justifique otra:
  1150 Actividades con soporte musical → tipo especifico, relacion tecnica (mismo color e icono que 1149 en el config de 1º)
  1152 Técnicas de hidrocinesia → tipo especifico, relacion cliente (mismo color e icono que 1151 en el config de 1º)
  1153 Control postural, bienestar y mantenimiento funcional → tipo especifico, relacion ciencias
  1154 Proyecto intermodular → tipo transversal, relacion tecnica
Cada módulo del curso debe tener un color distinto.

PASO 3. Plan de relaciones. Una relación une dos RA de módulos distintos del 2º y se publica en los dos RA (es bidireccional). Haz el plan completo antes de redactar y cumple estas reglas:
1. Cada RA participa en 6-15 relaciones (objetivo: unas 8). Cuenta las de los dos lados.
2. No se repite ningún par de RA. Si dos ideas unen los mismos RA, fusiónalas.
3. Cada lado cita de 1 a 3 criterios de su RA, por letra ("a", "b"…).
4. Entre todas las relaciones se cubren TODOS los criterios del curso.
5. La relación debe ser pedagógicamente real: los criterios de los dos lados se trabajan juntos en una misma tarea profesional del técnico superior en acondicionamiento físico (sesiones coreografiadas en sala, programas acuáticos, readaptación postural, gimnasios y centros deportivos, clientes con necesidades especiales, turismo activo con clientela extranjera…). No conectes por palabras sueltas.
Este curso tiene tres módulos comunes (0179, 1708, 1710) con 16 de los 35 RA: necesitan 6 relaciones por RA cada uno. Busca situaciones reales: inglés con clientes y monitores extranjeros, fichas técnicas y estudios en inglés, sostenibilidad de instalaciones acuáticas y gimnasios (agua, energía, residuos, material), emprendimiento de estudios de entrenamiento, marca personal del entrenador, procesos selectivos en cadenas de gimnasios…
Puedes usar un script temporal (fuera de backend/ y frontend/, y bórralo después) solo para contar grados, pares y cobertura del plan.

PASO 4. Redacción. Escribe las relaciones en uno o varios archivos scripts/mapa-intermodular/fuentes/CFGS_ACONDICIONAMIENTO_FISICO_2/relaciones_NN.json (arrays JSON; el generador une todos los relaciones*.json). Escribe un archivo por módulo o por bloques de 20-30 relaciones para no truncar la salida. Cada relación tiene UNA actividad propia y bien desarrollada, con este formato:

[
  {
    "a": { "modulo": "1152", "ra": "RA2", "criterios": ["a", "d"] },
    "b": { "modulo": "1153", "ra": "RA1", "criterios": ["c"] },
    "justificacion_es": "Por qué se conectan estos criterios (1-2 frases).",
    "justificacion_ca": "…",
    "actividades": [
      {
        "titulo_es": "Título breve, único y con sentido completo", "titulo_ca": "…",
        "contexto_es": "Situación profesional realista y concreta que motiva la actividad (1 frase).", "contexto_ca": "…",
        "desarrollo_es": "Qué hace el alumnado (2-4 frases), citando cada criterio que se trabaja con su código completo: (1152-2a), (1153-1c).", "desarrollo_ca": "…",
        "evidencia_es": "Producto o evidencia evaluable de esta actividad.", "evidencia_ca": "…",
        "dua_es": "Medidas DUA concretas para esta actividad.", "dua_ca": "…",
        "metodologia_es": "aprendizaje basado en retos.", "metodologia_ca": "aprenentatge basat en reptes."
      }
    ]
  }
]

Reglas de redacción (el validador rechaza lo que las incumple):
- PROHIBIDO generar los textos con scripts, plantillas o combinando fragmentos de los criterios. Cada actividad se redacta a mano para su relación, como haría un docente. Un borrador anterior de otro modelo (tarea 224) se descartó entero por esto.
- No copies el texto de los criterios («Se ha…», «S'ha…») ni en títulos ni en desarrollos: explica con tus palabras qué hace el alumnado. El título es una frase completa («Sesión de aquagym para embarazadas»), nunca un recorte de criterios ni acabado en «del», «y», «la»…
- Cada contexto, evidencia y DUA es propio de su actividad, y los desarrollos no pueden empezar todos igual.
- El desarrollo cita todos los criterios de ambos lados con su código completo (módulo-númeroRA+letra, p. ej. 1153-3b), y las mismas citas en el mismo orden en _es y en _ca.
- Los títulos no se repiten dentro de un mismo RA, ni en castellano ni en catalán.
- Usa metodologías activas variadas: proyectos, retos, casos, simulación, juego de rol, aprendizaje-servicio, aprendizaje cooperativo…
- Los campos _es van en castellano y los _ca en catalán balear de FP (l'alumnat, fer, emplenar, feina, persones usuàries…), sin faltas y sin mezclar idiomas. El catalán debe ser una versión natural, no una traducción palabra por palabra.
- Escribe JSON válido: comillas dobles y el apóstrofo catalán (') tal cual.

PASO 5. Validación y generación. Ejecuta:
  cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts construir --nivel CFGS_ACONDICIONAMIENTO_FISICO --curso 2º --trabajo ../scripts/mapa-intermodular/fuentes/CFGS_ACONDICIONAMIENTO_FISICO_2 --salida src/data/mapa-intermodular/mapa_cfgs_acondicionamiento_fisico_2.json
Si hay errores (❌), corrígelos REDACTANDO de nuevo los textos afectados (no con un script) y repite hasta que no quede ninguno. Si hay avisos (⚠️), añade o amplía relaciones hasta que desaparezcan. No edites a mano el JSON generado. Anota las cifras finales que imprime.

PASO 6. Integración en la aplicación (sigue el ejemplo de la tarea 228):
1. backend/src/data/niveles.ts: la entrada CFGS_ACONDICIONAMIENTO_FISICO ya tiene mapas con el 1º. Añade el 2º como segundo elemento:
     mapas: [
       { tab: 'CFGS_ACONDICIONAMIENTO_FISICO', curso: '1º', moduleCode: '1136', raId: '1136_RA1' },
       { tab: 'CFGS_ACONDICIONAMIENTO_FISICO_2', curso: '2º', moduleCode: '1150', raId: '1150_RA1' },
     ],
2. Crea backend/src/migrations/39_ingest_mapa_cfgs_acondicionamiento_fisico_2.ts copiando la forma de 40_ingest_mapa_cfgs_acondicionamiento_fisico.ts (TAB 'CFGS_ACONDICIONAMIENTO_FISICO_2', archivo mapa_cfgs_acondicionamiento_fisico_2.json). Sustituye solo su pestaña.
3. backend/src/tests/niveles-catalogo.test.ts: añade 'CFGS_ACONDICIONAMIENTO_FISICO_2' a MAPA_TABS justo después de 'CFGS_ACONDICIONAMIENTO_FISICO', y { nivel: 'CFGS_ACONDICIONAMIENTO_FISICO', tab: 'CFGS_ACONDICIONAMIENTO_FISICO_2', curso: '2º', moduleCode: '1150', raId: '1150_RA1' } a la lista de mapas justo después de la entrada del 1º.
4. backend/src/tests/ras-acondicionamiento-fisico.test.ts: el test de mapas espera solo el 1º; añade la entrada del 2º.
5. backend/src/tests/mapa.test.ts: añade un test de la migración 39 como el de la 40. Comprueba que es idempotente, que no toca otras pestañas (incluida CFGS_ACONDICIONAMIENTO_FISICO), la bidireccionalidad (expectBidirectionalMap('CFGS_ACONDICIONAMIENTO_FISICO_2', 7, <conexiones>, 1)), las 6-15 conexiones por RA, como máximo 3 criterios en relatedCriteria, que los textos de RA coinciden con CFGS_ACONDICIONAMIENTO_FISICO_RAS_DATA y el orden de módulos que devuelve el endpoint (compruébalo con el JSON generado).
6. Ejecuta cd backend && npm run typecheck && npm test, y cd frontend && npm test. Todo debe quedar en verde.

PASO 7. Documentación y entrega:
- En documentation/mapas_intermodulares_pendientes.md marca la fila de CFGS Acondicionamiento Físico 2.º como hecha (tarea 227, Gemini, relaciones y conexiones) y actualiza el recuento de pestañas pendientes.
- En documentation/niveles_educativos_y_catalogo.md, en la sección de CFGS Acondicionamiento Físico, indica que el 2.º tiene mapa (tarea 227).
- En la sección 6 de documentation/procesamiento_actividades_mapa_intermodular.md, añade CFGS Acondicionamiento Físico (2.º) a la lista de ciclos con mapa.
- Crea tareas/227_mapa_cfgs_acondicionamiento_fisico_2.md (propósito, flujo, archivos, cifras y decisiones), como tareas/228_mapa_cfgs_acondicionamiento_fisico_1.md.
- Incluye en el commit config.json y relaciones*.json de la carpeta de fuentes.
- Haz commit en castellano y push de la rama. No despliegues ni fusiones con main ni con otras ramas: el usuario revisará el mapa antes.
```
