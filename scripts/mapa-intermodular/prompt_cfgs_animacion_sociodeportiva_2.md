# Prompt: mapa intermodular de CFGS Enseñanza y Animación Sociodeportiva, 2.º

Versión de [`prompt.md`](prompt.md) con los datos ya rellenos para el siguiente mapa de la [lista de pendientes](../../documentation/mapas_intermodulares_pendientes.md). Se reservaron la tarea 235 y la migración 43 el 15 de octubre de 2026, mientras la tarea 234 (CFGM Atención a la Dependencia 1.º, migración 42) se hacía en paralelo.

---

```text
Vas a crear el mapa intermodular del CFGS Enseñanza y Animación Sociodeportiva, curso 2º, en el proyecto Plappin (repositorio actual).

Datos de la tarea:
- Nivel (tipoNivel): CFGS_ANIMACION_SOCIODEPORTIVA
- Curso: 2º (el 1º aún no tiene mapa; esta tarea solo hace el 2º)
- Pestaña del mapa (tab): CFGS_ANIMACION_SOCIODEPORTIVA_2
- Archivo del mapa: backend/src/data/mapa-intermodular/mapa_cfgs_animacion_sociodeportiva_2.json
- Carpeta de fuentes del mapa: scripts/mapa-intermodular/fuentes/CFGS_ANIMACION_SOCIODEPORTIVA_2/ (config.json y relaciones*.json se versionan; ficha.md no)
- Módulos de 2º (8 módulos, 42 RA, 295 criterios):
  1123 Actividades de ocio y tiempo libre (5 RA)
  1137 Planificación de la animación sociodeportiva (5 RA)
  1140 Actividades físico-deportivas de equipo (5 RA)
  1142 Actividades físico-deportivas para la inclusión social (7 RA)
  1144 Proyecto intermodular de enseñanza y animación sociodeportiva (4 RA)
  0179 Inglés profesional (5 RA)
  1708 Sostenibilidad aplicada al sistema productivo (6 RA)
  1710 Itinerario personal para la empleabilidad II (5 RA)
- Tamaño orientativo: unas 168 relaciones (≈ 336 conexiones), una actividad por relación.
- Número común de la tarea: 235 (reservado) → rama feature/235_mapa_cfgs_animacion_sociodeportiva_2 y registro tareas/235_mapa_cfgs_animacion_sociodeportiva_2.md. No lo recalcules: la 235 está reservada para este mapa aunque haya números mayores ocupados.
- Migración: backend/src/migrations/43_ingest_mapa_cfgs_animacion_sociodeportiva_2.ts (la 43 está reservada; la 42 la usa otra tarea en paralelo).

Rama de partida: crea la tuya desde origin/feature/233_fusion_mapas_y_tareas_229_231, que es la que está desplegada y tiene la herramienta con el validador:
  git fetch && git switch -c feature/235_mapa_cfgs_animacion_sociodeportiva_2 origin/feature/233_fusion_mapas_y_tareas_229_231
Si el directorio no tiene node_modules, instala: cd backend && npm ci; cd frontend && npm ci --legacy-peer-deps.

Lee antes AGENTS.md (§1, §2 y §8), la sección 8 de documentation/procesamiento_actividades_mapa_intermodular.md y scripts/mapa-intermodular/mapa-intermodular.mts. Toma como ejemplo de calidad las tareas 228 y 232 (tareas/228_mapa_cfgs_acondicionamiento_fisico_1.md, tareas/232_mapa_cfgm_atencion_dependencia_2.md y los relaciones*.json de scripts/mapa-intermodular/fuentes/CFGS_ACONDICIONAMIENTO_FISICO/ y CFGM_ATENCION_DEPENDENCIA_2/). Lee al menos 15 actividades de cada uno antes de redactar. El 2º de Acondicionamiento Físico (CFGS_ACONDICIONAMIENTO_FISICO_2) es de la misma familia profesional y tiene los mismos tres módulos comunes: úsalo para ver cómo se conectaron, pero NO reutilices sus actividades: las de este ciclo tratan de animación, ocio, deporte de equipo e inclusión, no de acondicionamiento físico.

PASO 1. Ficha curricular. Ejecuta:
  cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts ficha --nivel CFGS_ANIMACION_SOCIODEPORTIVA --curso 2º --trabajo ../scripts/mapa-intermodular/fuentes/CFGS_ANIMACION_SOCIODEPORTIVA_2
Lee ficha.md entera: es la única fuente de los textos curriculares. No inventes RA ni criterios y no los copies en tus archivos: el generador los toma de la aplicación.

PASO 2. config.json. Los comunes 0179 (comunicacion), 1708 (sostenibilidad) y 1710 (empleabilidad) ya vienen rellenos. Para el resto usa esta propuesta salvo que la ficha justifique otra:
  1123 Actividades de ocio y tiempo libre → tipo especifico, relacion cliente, icono tent
  1137 Planificación de la animación sociodeportiva → tipo especifico, relacion tecnica, icono clipboard-list
  1140 Actividades físico-deportivas de equipo → tipo especifico, relacion tecnica, icono trophy
  1142 Actividades físico-deportivas para la inclusión social → tipo especifico, relacion cliente, icono accessibility
  1144 Proyecto intermodular → tipo transversal, relacion tecnica, icono folder-kanban
Cada módulo del curso debe tener un color distinto.

PASO 3. Plan de relaciones. Una relación une dos RA de módulos distintos del 2º y se publica en los dos RA (es bidireccional). Haz el plan completo antes de redactar y cumple estas reglas:
1. Cada RA participa en 6-15 relaciones (objetivo: unas 8). Cuenta las de los dos lados.
2. No se repite ningún par de RA. Si dos ideas unen los mismos RA, fusiónalas.
3. Cada lado cita de 1 a 3 criterios de su RA, por letra ("a", "b"…).
4. Entre todas las relaciones se cubren TODOS los criterios del curso.
5. La relación debe ser pedagógicamente real: los criterios de los dos lados se trabajan juntos en una misma tarea profesional del técnico superior en enseñanza y animación sociodeportiva (campamentos y colonias, ludotecas y casales de verano, animación turística en hoteles, escuelas deportivas municipales, ligas escolares, deporte adaptado y programas con personas mayores, con discapacidad o en riesgo de exclusión, eventos y competiciones…). No conectes por palabras sueltas.
Este curso tiene tres módulos comunes (0179, 1708, 1710) con 16 de los 42 RA: necesitan 6 relaciones por RA cada uno. Busca situaciones reales: inglés en la animación turística y con familias extranjeras, reglamentos y materiales en inglés, sostenibilidad de eventos y campamentos (residuos, transporte, agua, material deportivo), emprendimiento de empresas de ocio, marca personal del animador, procesos selectivos de ayuntamientos y cadenas hoteleras…
1142 tiene 7 RA: reparte bien sus relaciones con los demás módulos para que todos sus RA lleguen a 6.
Puedes usar un script temporal (fuera de backend/ y frontend/, y bórralo después) solo para contar grados, pares y cobertura del plan.

PASO 4. Redacción. Escribe las relaciones en uno o varios archivos scripts/mapa-intermodular/fuentes/CFGS_ANIMACION_SOCIODEPORTIVA_2/relaciones_NN.json (arrays JSON; el generador une todos los relaciones*.json). Escribe un archivo por módulo o por bloques de 20-30 relaciones para no truncar la salida. Cada relación tiene UNA actividad propia y bien desarrollada, con este formato:

[
  {
    "a": { "modulo": "1142", "ra": "RA3", "criterios": ["a", "d"] },
    "b": { "modulo": "1140", "ra": "RA2", "criterios": ["c"] },
    "justificacion_es": "Por qué se conectan estos criterios (1-2 frases).",
    "justificacion_ca": "…",
    "actividades": [
      {
        "titulo_es": "Título breve, único y con sentido completo", "titulo_ca": "…",
        "contexto_es": "Situación profesional realista y concreta que motiva la actividad (1 frase).", "contexto_ca": "…",
        "desarrollo_es": "Qué hace el alumnado (2-4 frases), citando cada criterio que se trabaja con su código completo: (1142-3a), (1140-2c).", "desarrollo_ca": "…",
        "evidencia_es": "Producto o evidencia evaluable de esta actividad.", "evidencia_ca": "…",
        "dua_es": "Medidas DUA concretas para esta actividad.", "dua_ca": "…",
        "metodologia_es": "aprendizaje basado en retos.", "metodologia_ca": "aprenentatge basat en reptes."
      }
    ]
  }
]

Reglas de redacción (el validador rechaza lo que las incumple):
- PROHIBIDO generar los textos con scripts, plantillas o combinando fragmentos de los criterios. Cada actividad se redacta a mano para su relación, como haría un docente. Un borrador anterior de otro modelo (tarea 224) se descartó entero por esto.
- No copies el texto de los criterios («Se ha…», «S'ha…») ni en títulos ni en desarrollos: explica con tus palabras qué hace el alumnado. El título es una frase completa («Torneo de baloncesto inclusivo en el casal de verano»), nunca un recorte de criterios ni acabado en «del», «y», «la»…
- Cada contexto, evidencia y DUA es propio de su actividad, y los desarrollos no pueden empezar todos igual.
- El desarrollo cita todos los criterios de ambos lados con su código completo (módulo-númeroRA+letra, p. ej. 1137-3b), y las mismas citas en el mismo orden en _es y en _ca.
- Los títulos no se repiten dentro de un mismo RA, ni en castellano ni en catalán.
- Usa metodologías activas variadas: proyectos, retos, casos, simulación, juego de rol, aprendizaje-servicio, aprendizaje cooperativo… La metodología en catalán no puede ser idéntica a la castellana (escribe «aula invertida» / «aula inversa», no la misma palabra en los dos).
- Los campos _es van en castellano y los _ca en catalán balear de FP (l'alumnat, fer, emplenar, feina, persones usuàries…), sin faltas y sin mezclar idiomas. El catalán debe ser una versión natural, no una traducción palabra por palabra.
- Escribe JSON válido: comillas dobles y el apóstrofo catalán (') tal cual.

PASO 5. Validación y generación. Ejecuta:
  cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts construir --nivel CFGS_ANIMACION_SOCIODEPORTIVA --curso 2º --trabajo ../scripts/mapa-intermodular/fuentes/CFGS_ANIMACION_SOCIODEPORTIVA_2 --salida src/data/mapa-intermodular/mapa_cfgs_animacion_sociodeportiva_2.json
Si hay errores (❌), corrígelos REDACTANDO de nuevo los textos afectados (no con un script) y repite hasta que no quede ninguno. Si hay avisos (⚠️), añade o amplía relaciones hasta que desaparezcan. No edites a mano el JSON generado. Anota las cifras finales que imprime.

PASO 6. Integración en la aplicación (sigue el ejemplo de la tarea 232, que también hizo solo el 2º de un ciclo sin mapa):
1. backend/src/data/niveles.ts: la entrada CFGS_ANIMACION_SOCIODEPORTIVA no tiene mapas. Añade, después de cursos:
     mapas: [{ tab: 'CFGS_ANIMACION_SOCIODEPORTIVA_2', curso: '2º', moduleCode: '1123', raId: '1123_RA1' }],
2. Crea backend/src/migrations/43_ingest_mapa_cfgs_animacion_sociodeportiva_2.ts copiando la forma de 41_ingest_mapa_cfgm_atencion_dependencia_2.ts (TAB 'CFGS_ANIMACION_SOCIODEPORTIVA_2', archivo mapa_cfgs_animacion_sociodeportiva_2.json). Sustituye solo su pestaña.
3. backend/src/tests/niveles-catalogo.test.ts: añade 'CFGS_ANIMACION_SOCIODEPORTIVA_2' a MAPA_TABS justo después de 'CFGS_ACONDICIONAMIENTO_FISICO_2', y { nivel: 'CFGS_ANIMACION_SOCIODEPORTIVA', tab: 'CFGS_ANIMACION_SOCIODEPORTIVA_2', curso: '2º', moduleCode: '1123', raId: '1123_RA1' } a la lista de mapas justo después de la entrada de CFGS_ACONDICIONAMIENTO_FISICO_2. Si el test falla por el orden, sigue el orden de NIVELES.
4. backend/src/tests/ras-animacion-sociodeportiva.test.ts: hoy espera expect(nivel?.mapas).toBeUndefined(); cámbialo para que espere la entrada del 2º (mira cómo lo hace ras-atencion-dependencia.test.ts).
5. backend/src/tests/mapa.test.ts: añade un test de la migración 43 como el de la 41. Comprueba que es idempotente, que no toca otras pestañas, la bidireccionalidad (expectBidirectionalMap('CFGS_ANIMACION_SOCIODEPORTIVA_2', 8, <conexiones>, 1)), las 6-15 conexiones por RA, como máximo 3 criterios en relatedCriteria, que los textos de RA coinciden con CFGS_ANIMACION_SOCIODEPORTIVA_RAS_DATA (de ../data/ras_cfgs_animacion_sociodeportiva.data) y el orden de módulos que devuelve el endpoint (compruébalo con el JSON generado).
6. Ejecuta cd backend && npm run typecheck && npm test, y cd frontend && npm test. Todo debe quedar en verde.

PASO 7. Documentación y entrega:
- En documentation/mapas_intermodulares_pendientes.md marca la fila de CFGS Enseñanza y Animación Sociodeportiva 2.º como hecha (tarea 235, Gemini, relaciones y conexiones) y actualiza el recuento de pestañas pendientes.
- En documentation/niveles_educativos_y_catalogo.md, en la sección de CFGS Enseñanza y Animación Sociodeportiva, indica que el 2.º tiene mapa (tarea 235).
- En la sección 6 de documentation/procesamiento_actividades_mapa_intermodular.md, añade CFGS Enseñanza y Animación Sociodeportiva (2.º) a la lista de ciclos con mapa.
- Crea tareas/235_mapa_cfgs_animacion_sociodeportiva_2.md (propósito, flujo, archivos, cifras y decisiones), como tareas/232_mapa_cfgm_atencion_dependencia_2.md.
- Incluye en el commit config.json y relaciones*.json de la carpeta de fuentes.
- Haz commit en castellano y push de la rama. No despliegues ni fusiones con main ni con otras ramas: el usuario revisará el mapa antes.
```
