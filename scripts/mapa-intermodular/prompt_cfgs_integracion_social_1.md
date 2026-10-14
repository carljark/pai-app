# Prompt: mapa intermodular de CFGS Integración Social, 1.º

Versión de [`prompt.md`](prompt.md) con los datos ya rellenos para el siguiente mapa de la [lista de pendientes](../../documentation/mapas_intermodulares_pendientes.md). El número de tarea (224) y el de migración (37) se comprobaron el 14 de octubre de 2026. Si antes se crea otra tarea o migración, el agente debe recalcularlos (lo indica el propio prompt).

---

```text
Vas a crear el mapa intermodular del CFGS Integración Social, curso 1º, en el proyecto Plappin (repositorio actual).

Datos de la tarea:
- Nivel (tipoNivel): CFGS_INTEGRACION_SOCIAL
- Curso: 1º (el ciclo tiene dos cursos; esta tarea solo hace el 1º)
- Pestaña del mapa (tab): CFGS_INTEGRACION_SOCIAL
- Archivo del mapa: backend/src/data/mapa-intermodular/mapa_cfgs_integracion_social.json
- Carpeta de fuentes del mapa: scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL/ (config.json y relaciones*.json se versionan; ficha.md no)
- Módulos de 1º (7 módulos, 37 RA, 299 criterios):
  0337 Contexto de la intervención social (5 RA)
  0338 Inserción sociolaboral (5 RA)
  0340 Mediación comunitaria (4 RA)
  0342 Promoción de la autonomía personal (7 RA)
  0344 Metodología de la intervención social (5 RA)
  1665 Digitalización aplicada a los sectores productivos (6 RA)
  1709 Itinerario personal para la empleabilidad I (5 RA)
- Tamaño orientativo: unas 150 relaciones (≈ 300 conexiones), una actividad por relación.
- Número común de la tarea: 224 → rama feature/224_mapa_cfgs_integracion_social y registro tareas/224_mapa_cfgs_integracion_social.md. Compruébalo antes con el comando de AGENTS.md §1.1; si ya está ocupado, usa el que dé el comando.
- Migración: backend/src/migrations/37_ingest_mapa_cfgs_integracion_social.ts. Si el 37 ya existe, usa el siguiente número libre.

Lee antes AGENTS.md (§1, §2 y §8), la sección 8 de documentation/procesamiento_actividades_mapa_intermodular.md y scripts/mapa-intermodular/mapa-intermodular.mts. Toma como ejemplo completo la tarea 223 (tareas/223_mapa_cfgm_cuidados_auxiliares_enfermeria.md y scripts/mapa-intermodular/fuentes/CFGM_CUIDADOS_AUXILIARES_ENFERMERIA/). Crea la rama feature/224_mapa_cfgs_integracion_social desde feature/223_mapa_cfgm_cuidados_auxiliares_enfermeria (o desde main si esa rama ya está fusionada).

PASO 1. Ficha curricular. Ejecuta:
  cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts ficha --nivel CFGS_INTEGRACION_SOCIAL --curso 1º --trabajo ../scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL
Se crean ficha.md (módulos, RA y criterios oficiales en castellano y catalán) y config.json. Lee ficha.md entera: es la única fuente de los textos curriculares. No inventes RA ni criterios y no los copies en tus archivos: el generador los toma de la aplicación.

PASO 2. config.json. Los módulos 1665 (comun, digital) y 1709 (comun, empleabilidad) ya vienen rellenos. Para los específicos usa esta propuesta salvo que la ficha justifique otra:
  0337 Contexto de la intervención social → tipo especifico, relacion ciencias
  0338 Inserción sociolaboral → tipo especifico, relacion empleabilidad
  0340 Mediación comunitaria → tipo especifico, relacion comunicacion
  0342 Promoción de la autonomía personal → tipo especifico, relacion cliente
  0344 Metodología de la intervención social → tipo especifico, relacion tecnica
Revisa los colores e iconos propuestos (cada módulo, un color distinto).

PASO 3. Plan de relaciones. Una relación une dos RA de módulos distintos del 1º y se publica en los dos RA (es bidireccional). Haz el plan completo antes de redactar y cumple estas reglas:
1. Cada RA participa en 6-15 relaciones (objetivo: unas 8). Cuenta las de los dos lados.
2. No se repite ningún par de RA. Si dos ideas unen los mismos RA, fusiónalas.
3. Cada lado cita de 1 a 3 criterios de su RA, por letra ("a", "b"…). Como máximo hay tres criterios externos por conexión.
4. Entre todas las relaciones se cubren TODOS los criterios del curso.
5. La relación debe ser pedagógicamente real: los criterios de los dos lados se trabajan juntos en una misma tarea profesional de integración social (proyectos de intervención, mediación vecinal, itinerarios de inserción, apoyo a la autonomía en domicilio o centro, trabajo con colectivos en riesgo de exclusión…). No conectes por palabras sueltas.
Reparte las relaciones entre todos los módulos. 1665 y 1709 también necesitan 6 relaciones por RA: conéctalos con situaciones reales del ciclo (herramientas digitales para la intervención, gestión de datos de usuarios, empleabilidad propia y de las personas usuarias…).

PASO 4. Redacción. Escribe las relaciones en uno o varios archivos scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL/relaciones_NN.json (arrays JSON; el generador une todos los relaciones*.json). Puedes escribir un archivo por módulo para no truncar la salida. Cada relación tiene UNA actividad propia y bien desarrollada, con este formato:

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
- La actividad trabaja los criterios citados de AMBOS lados, y el desarrollo los cita todos con su código completo (módulo-númeroRA+letra, p. ej. 0342-3b). Las citas deben ser las mismas, en el mismo orden, en _es y en _ca.
- Los títulos no se repiten dentro de un mismo RA, ni en castellano ni en catalán. Evita los títulos genéricos («Actividad integrada 3»).
- Usa metodologías activas variadas: proyectos, retos, casos, simulación, juego de rol, aprendizaje-servicio, aprendizaje cooperativo…
- Los campos _es van en castellano y los _ca en catalán balear de FP (l'alumnat, fer, emplenar, feina, persones usuàries…), sin faltas y sin mezclar idiomas. El catalán debe ser una versión natural, no una traducción palabra por palabra.
- Las DUA y las evidencias deben ser propias de cada actividad, no una plantilla repetida.
- Escribe JSON válido: comillas dobles y el apóstrofo catalán (') tal cual.

PASO 5. Validación y generación. Ejecuta:
  cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts construir --nivel CFGS_INTEGRACION_SOCIAL --curso 1º --trabajo ../scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL --salida src/data/mapa-intermodular/mapa_cfgs_integracion_social.json
Si hay errores (❌), corrígelos en tus archivos y repite hasta que no quede ninguno. Si hay avisos de criterios sin cubrir o sin citar (⚠️), añade o amplía relaciones hasta que desaparezcan. No edites a mano el JSON generado. Anota las cifras finales que imprime (relaciones, conexiones, actividades).

PASO 6. Integración en la aplicación (sigue el ejemplo de la tarea 223):
1. backend/src/data/niveles.ts: en la entrada CFGS_INTEGRACION_SOCIAL añade
     mapas: [{ tab: 'CFGS_INTEGRACION_SOCIAL', curso: '1º', moduleCode: '0337', raId: '0337_RA1' }],
2. Crea backend/src/migrations/37_ingest_mapa_cfgs_integracion_social.ts copiando la forma de 36_ingest_mapa_cfgm_cuidados_auxiliares_enfermeria.ts (TAB 'CFGS_INTEGRACION_SOCIAL', archivo mapa_cfgs_integracion_social.json). Sustituye solo su pestaña.
3. backend/src/tests/niveles-catalogo.test.ts: añade 'CFGS_INTEGRACION_SOCIAL' a la lista de MAPA_TABS y su entrada { nivel: 'CFGS_INTEGRACION_SOCIAL', tab: 'CFGS_INTEGRACION_SOCIAL', curso: '1º', moduleCode: '0337', raId: '0337_RA1' } a la lista de mapas, ambas en el orden del catálogo: hoy van justo después de las de CFGS_EDUCACION_INFANTIL_2.
4. backend/src/tests/ras-integracion-social.test.ts afirma que el ciclo no tiene mapa (expect(nivel?.mapas).toBeUndefined()): cámbialo para que espere la entrada de mapas del paso 1.
5. backend/src/tests/mapa.test.ts: añade un test de la migración 37 como el de la 36. Comprueba que es idempotente, que no toca otras pestañas, que el mapa es bidireccional (expectBidirectionalMap('CFGS_INTEGRACION_SOCIAL', 7, <conexiones>, 1)), que hay 6-15 conexiones por RA y como máximo 3 criterios en relatedCriteria, que los textos de RA coinciden con CFGS_INTEGRACION_SOCIAL_RAS_DATA y que el endpoint devuelve los módulos en el orden 0337, 0338, 0340, 0342, 0344, 1665, 1709.
6. Ejecuta cd backend && npm run typecheck && npm test, y cd frontend && npm test. Todo debe quedar en verde.

PASO 7. Documentación y entrega:
- En documentation/mapas_intermodulares_pendientes.md marca la fila de CFGS Integración Social 1.º como hecha (tarea 224, modelo que la generó, relaciones y conexiones).
- En documentation/niveles_educativos_y_catalogo.md, en la sección de CFGS Integración Social, indica que el 1.º tiene mapa (tarea 224).
- En la sección 6 de documentation/procesamiento_actividades_mapa_intermodular.md, añade CFGS Integración Social (1.º) a la lista de ciclos con mapa.
- Crea tareas/224_mapa_cfgs_integracion_social.md (propósito, flujo, archivos, cifras y decisiones), como tareas/223_mapa_cfgm_cuidados_auxiliares_enfermeria.md.
- Incluye en el commit config.json y relaciones*.json de scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL/.
- Haz commit en castellano y push de la rama. No despliegues ni fusiones con main: el usuario revisará el mapa antes.
```
