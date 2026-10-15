# Prompt: mapa intermodular de CFGS Laboratorio Clínico y Biomédico, 2.º

Versión de [`prompt.md`](prompt.md) con los datos de este mapa de la [lista de pendientes](../../documentation/mapas_intermodulares_pendientes.md) ya rellenos.

- **Reserva:** el 15 de octubre de 2026 se reservaron la tarea 238 y la migración 45. Al mismo tiempo, la tarea 237 hacía el 1.º de Animación Sociodeportiva, con la migración 44.
- **Rama:** `feature/238_mapa_cfgs_laboratorio_clinico_2` se creó desde la 235 con este prompt dentro, para que Gemini pueda leerlo directamente.

---

```text
Vas a crear el mapa intermodular del CFGS Laboratorio Clínico y Biomédico, curso 2º, en el proyecto Plappin (repositorio actual).

Datos de la tarea:
- Nivel (tipoNivel): CFGS_LABORATORIO_CLINICO
- Curso: 2º (el 1º aún no tiene mapa; esta tarea solo hace el 2º)
- Pestaña del mapa (tab): CFGS_LABORATORIO_CLINICO_2
- Archivo del mapa: backend/src/data/mapa-intermodular/mapa_cfgs_laboratorio_clinico_2.json
- Carpeta de fuentes del mapa: scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2/ (config.json y relaciones*.json se versionan; ficha.md no)
- Módulos de 2º (7 módulos, 44 RA, 335 criterios):
  1371 Análisis bioquímico (8 RA)
  1372 Técnicas de inmunodiagnóstico (7 RA)
  1373 Microbiología clínica (7 RA)
  1374 Técnicas de análisis hematológico (7 RA)
  1375 Proyecto intermodular de laboratorio clínico y biomédico (4 RA)
  1708 Sostenibilidad aplicada al sistema productivo (6 RA)
  1710 Itinerario personal para la empleabilidad II (5 RA)
- Tamaño orientativo: unas 176 relaciones (≈ 352 conexiones), una actividad por relación.
- Número común de la tarea: 238 (reservado) → rama feature/238_mapa_cfgs_laboratorio_clinico_2 y registro tareas/238_mapa_cfgs_laboratorio_clinico_2.md. No lo recalcules: la 238 está reservada para este mapa aunque haya números mayores ocupados.
- Migración: backend/src/migrations/45_ingest_mapa_cfgs_laboratorio_clinico_2.ts (la 45 está reservada; la 44 la usa otra tarea en paralelo).

Rama de trabajo: feature/238_mapa_cfgs_laboratorio_clinico_2 ya existe (sale de la 235, que es la desplegada y tiene la herramienta con el validador) y contiene este prompt. Trabaja en ella; no crees otra:
  git fetch && git switch feature/238_mapa_cfgs_laboratorio_clinico_2 && git pull
Si el directorio no tiene node_modules, instala: cd backend && npm ci; cd frontend && npm ci --legacy-peer-deps.

Lee antes AGENTS.md (§1, §2 y §8), la sección 8 de documentation/procesamiento_actividades_mapa_intermodular.md y scripts/mapa-intermodular/mapa-intermodular.mts. Toma como ejemplo de calidad las tareas 232 y 234 (tareas/232_mapa_cfgm_atencion_dependencia_2.md, tareas/234_mapa_cfgm_atencion_dependencia_1.md y los relaciones*.json de scripts/mapa-intermodular/fuentes/CFGM_ATENCION_DEPENDENCIA_2/ y CFGM_ATENCION_DEPENDENCIA/). Lee al menos 15 actividades de cada uno antes de redactar. Cada actividad parte de una situación concreta con nombre (un paciente, un servicio, un laboratorio de las Illes Balears) y describe con verbos de acción qué hace el alumnado.

PASO 1. Ficha curricular. Ejecuta:
  cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts ficha --nivel CFGS_LABORATORIO_CLINICO --curso 2º --trabajo ../scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2
Lee ficha.md entera: es la única fuente de los textos curriculares. No inventes RA ni criterios y no los copies en tus archivos: el generador los toma de la aplicación.

PASO 2. config.json. Los comunes 1708 (sostenibilidad) y 1710 (empleabilidad) ya vienen rellenos. Para el resto usa esta propuesta salvo que la ficha justifique otra:
  1371 Análisis bioquímico → tipo especifico, relacion ciencias, icono flask-conical
  1372 Técnicas de inmunodiagnóstico → tipo especifico, relacion tecnica, icono shield-check
  1373 Microbiología clínica → tipo especifico, relacion ciencias, icono microscope
  1374 Técnicas de análisis hematológico → tipo especifico, relacion cliente, icono droplet
  1375 Proyecto intermodular → tipo transversal, relacion tecnica, icono folder-kanban
Cada módulo del curso debe tener un color distinto.

PASO 3. Plan de relaciones. Una relación une dos RA de módulos distintos del 2º y se publica en los dos RA (es bidireccional). Haz el plan completo ANTES de redactar, en un formato compacto (una línea por relación: «1371-RA2:a,c 1373-RA4:b»), y compruébalo con un script temporal (fuera de backend/ y frontend/, y bórralo después) que cuente grados, pares repetidos y criterios sin cubrir. Corrige el plan hasta que cumpla estas reglas:
1. Cada RA participa en 6-15 relaciones (objetivo: unas 8). Cuenta las de los dos lados.
2. No se repite ningún par de RA. Si dos ideas unen los mismos RA, fusiónalas.
3. Cada lado cita de 1 a 3 criterios de su RA, por letra ("a", "b"…).
4. Entre todas las relaciones se cubren TODOS los criterios del curso.
5. La relación debe ser pedagógicamente real: los criterios de los dos lados se trabajan juntos en una misma tarea profesional del técnico superior en laboratorio clínico y biomédico (laboratorio de urgencias de Son Espases, banco de sangre, laboratorio de microbiología de un hospital comarcal, analizadores automatizados, control de calidad interno y externo, validación técnica de resultados, bioseguridad, gestión de muestras y residuos…). No conectes por palabras sueltas.
Los módulos comunes (1708 y 1710) tienen 11 de los 44 RA y necesitan 6 relaciones por RA cada uno. Busca situaciones reales: residuos biosanitarios y químicos, consumo de reactivos y energía de los analizadores, plásticos de un solo uso, huella de carbono del transporte de muestras, ODS en un hospital; bolsas de empleo del IB-Salut, laboratorios privados y de investigación, marca personal, entrevistas por competencias, emprendimiento en análisis veterinarios o de aguas…
1371 tiene 8 RA y 1372-1374 tienen 7 cada uno: reparte bien sus relaciones para que todos sus RA lleguen a 6.

PASO 4. Redacción. Escribe las relaciones en varios archivos scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2/relaciones_NN.json (arrays JSON; el generador une todos los relaciones*.json), de 25-30 relaciones cada uno para no truncar la salida. Cada relación tiene UNA actividad propia y bien desarrollada, con este formato:

[
  {
    "a": { "modulo": "1373", "ra": "RA3", "criterios": ["a", "d"] },
    "b": { "modulo": "1372", "ra": "RA2", "criterios": ["c"] },
    "justificacion_es": "Por qué se conectan estos criterios (1-2 frases).",
    "justificacion_ca": "…",
    "actividades": [
      {
        "titulo_es": "Título breve, único y con sentido completo", "titulo_ca": "…",
        "contexto_es": "Situación profesional realista y concreta que motiva la actividad (1 frase).", "contexto_ca": "…",
        "desarrollo_es": "Qué hace el alumnado (2-4 frases), citando cada criterio que se trabaja con su código completo: (1373-3a), (1373-3d), (1372-2c).", "desarrollo_ca": "…",
        "evidencia_es": "Producto o evidencia evaluable de esta actividad.", "evidencia_ca": "…",
        "dua_es": "Medidas DUA concretas para esta actividad.", "dua_ca": "…",
        "metodologia_es": "aprendizaje basado en casos.", "metodologia_ca": "aprenentatge basat en casos."
      }
    ]
  }
]

Reglas de redacción (el validador rechaza lo que las incumple):
- PROHIBIDO generar los textos con scripts, plantillas o combinando fragmentos de los criterios. Cada actividad se redacta a mano para su relación, como haría un docente. Un borrador anterior de otro modelo (tarea 224) se descartó entero por esto.
- No copies el texto de los criterios («Se ha…», «S'ha…») ni en títulos ni en desarrollos: explica con tus palabras qué hace el alumnado. El título es una frase completa («Hemocultivo positivo en la UCI de madrugada»), nunca un recorte de criterios ni acabado en «del», «y», «la»…
- Cada contexto, evidencia y DUA es propio de su actividad, y los desarrollos no pueden empezar todos igual.
- El desarrollo cita todos los criterios de ambos lados con su código completo (módulo-númeroRA+letra, p. ej. 1374-3b), y las mismas citas en el mismo orden en _es y en _ca.
- Los títulos no se repiten dentro de un mismo RA, ni en castellano ni en catalán.
- Usa metodologías activas variadas: casos clínicos, simulación de laboratorio, aprendizaje basado en problemas, retos, proyectos, aprendizaje cooperativo… La metodología en catalán no puede ser idéntica a la castellana.
- Los campos _es van en castellano y los _ca en catalán balear de FP (l'alumnat, fer, emplenar, feina, mostra, analitzador, sang…), sin faltas y sin mezclar idiomas. El catalán debe ser una versión natural, no una traducción palabra por palabra.
- Escribe JSON válido: comillas dobles y el apóstrofo catalán (') tal cual.

PASO 5. Validación y generación. Ejecuta:
  cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts construir --nivel CFGS_LABORATORIO_CLINICO --curso 2º --trabajo ../scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2 --salida src/data/mapa-intermodular/mapa_cfgs_laboratorio_clinico_2.json
Si hay errores (❌), corrígelos REDACTANDO de nuevo los textos afectados (no con un script) y repite hasta que no quede ninguno. Si hay avisos (⚠️), añade o amplía relaciones hasta que desaparezcan. No edites a mano el JSON generado. Anota las cifras finales que imprime.

PASO 6. Integración en la aplicación (sigue el ejemplo de la tarea 235, que también hizo solo el 2º de un ciclo sin mapa):
1. backend/src/data/niveles.ts: la entrada CFGS_LABORATORIO_CLINICO no tiene mapas. Añade, después de cursos:
     mapas: [{ tab: 'CFGS_LABORATORIO_CLINICO_2', curso: '2º', moduleCode: '1371', raId: '1371_RA1' }],
2. Crea backend/src/migrations/45_ingest_mapa_cfgs_laboratorio_clinico_2.ts copiando la forma de 43_ingest_mapa_cfgs_animacion_sociodeportiva_2.ts (TAB 'CFGS_LABORATORIO_CLINICO_2', archivo mapa_cfgs_laboratorio_clinico_2.json). Sustituye solo su pestaña.
3. backend/src/tests/niveles-catalogo.test.ts: añade 'CFGS_LABORATORIO_CLINICO_2' a MAPA_TABS justo después de 'CFGS_INTEGRACION_SOCIAL_2', y { nivel: 'CFGS_LABORATORIO_CLINICO', tab: 'CFGS_LABORATORIO_CLINICO_2', curso: '2º', moduleCode: '1371', raId: '1371_RA1' } a la lista de mapas justo después de la entrada de CFGS_INTEGRACION_SOCIAL_2 (antes de las de ESO_ORDINARIA).
4. backend/src/tests/ras-laboratorio-clinico.test.ts: hoy espera expect(nivel?.mapas).toBeUndefined(); cámbialo para que espere la entrada del 2º (mira cómo lo hace ras-animacion-sociodeportiva.test.ts).
5. backend/src/tests/mapa.test.ts: añade un test de la migración 45 como el de la 43. Comprueba que es idempotente, que no toca otras pestañas, la bidireccionalidad (expectBidirectionalMap('CFGS_LABORATORIO_CLINICO_2', 7, <conexiones>, 1)), las 6-15 conexiones por RA, como máximo 3 criterios en relatedCriteria, que los textos de RA coinciden con CFGS_LABORATORIO_CLINICO_RAS_DATA (de ../data/ras_cfgs_laboratorio_clinico.data) y el orden de módulos que devuelve el endpoint (compruébalo con el JSON generado).
6. Ejecuta cd backend && npm run typecheck && npm test, y cd frontend && npm test. Todo debe quedar en verde.

PASO 7. Documentación y entrega:
- En documentation/mapas_intermodulares_pendientes.md marca la fila de CFGS Laboratorio Clínico y Biomédico 2.º como hecha (tarea 238, Gemini, relaciones y conexiones) y actualiza el recuento de pestañas pendientes.
- En documentation/niveles_educativos_y_catalogo.md, en la sección de CFGS Laboratorio Clínico y Biomédico, indica que el 2.º tiene mapa (tarea 238).
- En la sección 6 de documentation/procesamiento_actividades_mapa_intermodular.md, añade CFGS Laboratorio Clínico y Biomédico (2.º) a la lista de ciclos con mapa.
- Crea tareas/238_mapa_cfgs_laboratorio_clinico_2.md (propósito, flujo, archivos, cifras y decisiones), como tareas/234_mapa_cfgm_atencion_dependencia_1.md.
- Incluye en el commit config.json y relaciones*.json de la carpeta de fuentes.
- Haz commit en castellano y push de la rama. No despliegues ni fusiones con main ni con otras ramas: el usuario revisará el mapa antes.
```
