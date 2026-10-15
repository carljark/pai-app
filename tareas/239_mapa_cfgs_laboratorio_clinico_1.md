# 239 · Mapa intermodular de 1.º del CFGS Laboratorio Clínico y Biomédico

## Propósito

Esta tarea hace el mapa intermodular de **1.º del CFGS Laboratorio Clínico y Biomédico**: 7 módulos, 45 RA y 360 criterios. El 2.º lo está haciendo Gemini en paralelo, en la tarea 238.

## Trabajo en paralelo

- **Rama:** `feature/239_mapa_cfgs_laboratorio_clinico_1` sale de la 237, que está desplegada. Se trabajó en el worktree `../pai-app-mapa232`.
- **Migraciones:** esta tarea usa la **46**. La 45 está reservada para la 238 (Gemini).
- **Catálogo:** la entrada `mapas` del ciclo tiene, por ahora, solo el 1.º. Al fusionar la 238 habrá que añadir el 2.º. También habrá conflictos menores en el catálogo, en los tests de mapas y en la documentación.

## Flujo

1. **Ficha y configuración.** Familias e iconos de los módulos específicos:

   | Módulo | Familia | Icono |
   |---|---|---|
   | 1367 Gestión de muestras biológicas | cliente | `test-tube` |
   | 1368 Técnicas generales de laboratorio | técnica | `flask-conical` |
   | 1369 Biología molecular y citogenética | ciencias | `dna` |
   | 1370 Fisiopatología general | ciencias | `heart-pulse` |

   Los módulos comunes son 0179 (comunicación), 1665 (digital) y 1709 (empleabilidad).

2. **Plan.** Un script temporal comprobó el plan compacto antes de redactar.
   - El primer borrador tenía 167 relaciones, 5 pares repetidos y 66 criterios sin cubrir. Además, algunos RA de 1665 y 1709 tenían solo 2 a 4 conexiones.
   - Tras corregirlo, el plan quedó en 187 relaciones, con 6 a 13 conexiones por RA y todos los criterios cubiertos.

3. **Redacción.** Hay siete archivos, de `relaciones_01.json` a `relaciones_07.json`. Cada relación tiene una actividad bilingüe situada en un laboratorio real de las Illes Balears: Son Espases, Hospital de Manacor, Mateu Orfila, Can Misses, IdISBa, centros de salud y laboratorios privados.
   - **1367 Gestión de muestras:** preanalítica (tubos, aditivos, errores, rechazos), biobancos, transporte y documentación.
   - **1368 Técnicas generales:** disoluciones, pH, separaciones, control de calidad estadístico, microscopía e imagen digital.
   - **1369 Biología molecular y citogenética:** cultivos, cariotipo, extracción, PCR, FISH, clonación y secuenciación, con casos clínicos como el factor V Leiden, HER2 o la hipercolesterolemia familiar.
   - **1370 Fisiopatología general:** enfermedades ligadas a las pruebas, como diabetes, lípidos, trombosis, embolia, cáncer, infecciones e inmunidad.
   - **Módulos comunes:**
     - 0179: pacientes y personal extranjeros, manuales, artículos, auditores y entrevistas en inglés;
     - 1665: sistema de información del laboratorio, nube, IA y autovalidación;
     - 1709: riesgos biológicos y químicos, convenio, nómina y autoconocimiento.

4. **Validación.**
   - En las pasadas intermedias, el generador detectó varios campos breves con el mismo texto en los dos idiomas y un título que acababa a medias. Se reescribieron a mano.
   - El resultado final no tiene errores ni avisos.
   - La búsqueda de palabras de un idioma en los campos del otro solo dio falsos positivos, como «peligro» o «ambiental».

## Archivos

- `backend/src/data/mapa-intermodular/mapa_cfgs_laboratorio_clinico.json`: 7 módulos, 45 RA y 374 conexiones (187 actividades distintas).
- `scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO/`: `config.json` y `relaciones_01.json` a `relaciones_07.json`.
- `backend/src/migrations/46_ingest_mapa_cfgs_laboratorio_clinico.ts`: sustituye solo su pestaña y se puede volver a ejecutar.
- `backend/src/data/niveles.ts`: la entrada `mapas` del ciclo con el 1.º, que se abre en `1367_RA1`.
- **Tests:**
  - `mapa.test.ts`: test de la migración 46;
  - `niveles-catalogo.test.ts` y `ras-laboratorio-clinico.test.ts`: la nueva pestaña.
- **Documentación:**
  - `mapas_intermodulares_pendientes.md`: ahora quedan 3 pestañas;
  - `niveles_educativos_y_catalogo.md`;
  - `procesamiento_actividades_mapa_intermodular.md`.

## Resultado

| Curso | Relaciones | Conexiones | Conexiones por RA | Criterios cubiertos |
|---|---|---|---|---|
| 1.º | 187 | 374 | 6-13 | 360 de 360 |

## Decisiones

- **Lección para los siguientes mapas.** El validador rechaza los campos breves que quedan iguales en castellano y en catalán, como «Tutorial de la plataforma». Conviene añadirles siempre un complemento que se traduzca.
