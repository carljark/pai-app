# 240 · Mapa intermodular de 2.º del CFGM Guía en el Medio Natural y de Tiempo Libre

## Propósito

Esta tarea hace el mapa intermodular de **2.º del CFGM Guía en el Medio Natural y de Tiempo Libre**: 8 módulos, 45 RA y 316 criterios. El 1.º se hará a continuación, en la tarea 241.

## Trabajo en paralelo

- **Rama:** `feature/240_mapa_cfgm_guia_medio_natural_2` sale de la 239, que está desplegada. Se trabajó en el worktree `../pai-app-mapa232`.
- **Migraciones:** esta tarea usa la **47**. La 45 sigue reservada para la 238 (Laboratorio Clínico 2.º, Gemini).
- **Catálogo:** la entrada `mapas` del ciclo tiene, por ahora, solo el 2.º. La 241 añadirá el 1.º delante.

## Flujo

1. **Ficha y configuración.** Familias e iconos de los módulos específicos:

   | Módulo | Familia | Icono |
   |---|---|---|
   | 1328 Atención a grupos | comunicación | `users` |
   | 1337 Socorrismo en el medio natural | ciencias | `life-buoy` |
   | 1338 Guía en el medio natural acuático | técnica | `sailboat` |
   | 1339 Maniobras con cuerdas | técnica | `mountain` |

   Los módulos comunes son 0156 (Inglés profesional), 1708 (Sostenibilidad), 1710 (IPE II) y 1713 (Proyecto intermodular), con los valores por defecto.

2. **Plan.** Un script temporal comprobó el plan compacto antes de redactar: pares repetidos, conexiones por RA y cobertura. Quedó en 184 relaciones, con 6 a 12 conexiones por RA y todos los criterios cubiertos.

3. **Redacción.** Hay siete archivos, de `relaciones_01.json` a `relaciones_07.json`. Cada relación tiene una actividad bilingüe situada en el medio natural de las Illes Balears: la serra de Tramuntana, el Camí de Cavalls, Cabrera, Mondragó, Es Trenc, barrancos, cuevas y parques de aventura.
   - **1328 Atención a grupos:** dinámicas de grupo, comunicación, conflictos, discapacidad y evaluación del proceso grupal.
   - **1337 Socorrismo:** valoración inicial, soporte vital, picaduras, hipotermia, apoyo psicológico, autoentrenamiento, vigilancia de playas y rescate desde embarcación.
   - **1338 Guía acuático:** preparación de rutas en kayak, piragua y vela, mantenimiento de embarcaciones, conducción del grupo, contingencias e informe.
   - **1339 Cuerdas:** escalada, barrancos, cuevas, vías ferratas y parques de aventura, con la seguridad, la señalización y los rescates.
   - **Módulos comunes:**
     - 0156: turistas, agencias, manuales, partes y entrevistas en inglés;
     - 1708: posidonia, ODS, economía circular del material y normativa de espacios protegidos;
     - 1710: selección de personal, gestión emocional, innovación y emprendimiento;
     - 1713: campamentos y travesías como proyecto, con riesgos, logística, presupuesto y seguimiento.

4. **Validación.**
   - En las pasadas intermedias, el generador detectó varios campos breves con el mismo texto en los dos idiomas y nueve desarrollos que empezaban igual («El alumnado sigue el protocolo de…»). Se reescribieron a mano.
   - El resultado final no tiene errores ni avisos.
   - La búsqueda de palabras de un idioma en los campos del otro solo dio falsos positivos en catalán, como «una» o los pronombres enclíticos («llençar-los»).

## Archivos

- `backend/src/data/mapa-intermodular/mapa_cfgm_guia_medio_natural_2.json`: 8 módulos, 45 RA y 368 conexiones (184 actividades distintas).
- `scripts/mapa-intermodular/fuentes/CFGM_GUIA_MEDIO_NATURAL_2/`: `config.json` y `relaciones_01.json` a `relaciones_07.json`.
- `backend/src/migrations/47_ingest_mapa_cfgm_guia_medio_natural_2.ts`: sustituye solo su pestaña y se puede volver a ejecutar.
- `backend/src/data/niveles.ts`: la entrada `mapas` del ciclo con el 2.º, que se abre en `1328_RA1`.
- **Tests:**
  - `mapa.test.ts`: test de la migración 47;
  - `niveles-catalogo.test.ts` y `ras-guia-medio-natural.test.ts`: la nueva pestaña.
- **Documentación:**
  - `mapas_intermodulares_pendientes.md`: ahora quedan 2 pestañas;
  - `niveles_educativos_y_catalogo.md`;
  - `procesamiento_actividades_mapa_intermodular.md`.

## Resultado

| Curso | Relaciones | Conexiones | Conexiones por RA | Criterios cubiertos |
|---|---|---|---|---|
| 2.º | 184 | 368 | 6-12 | 316 de 316 |

## Decisiones

- **Arranques variados.** El validador rechaza que muchos desarrollos empiecen igual. En módulos con criterios del tipo «Se ha seguido el protocolo de…» conviene abrir con el lugar o la situación («En la cueva, el alumnado…»).
- **Test inestable de `curriculum-index`.** Con la suite completa, el test que comprueba el orden de las CE de la ESO y del PDC falló una vez: `CE.create([...])` inserta en paralelo y `CE.find()` no ordenaba. `getFilterIndex` ordena ahora RA y CE por `_id`, es decir, por orden de creación.
