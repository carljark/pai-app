# 228 · Mapa intermodular de 1.º del CFGS Acondicionamiento Físico

## Propósito

Esta tarea hace el mapa intermodular de **1.º del CFGS Acondicionamiento Físico**: 7 módulos, 43 RA y 321 criterios. Se trabajó a la vez que Gemini hacía el de 2.º en la tarea 227, como ya se hizo con Integración Social en las tareas 225 y 226.

## Trabajo en paralelo

- Se trabajó en el worktree `../pai-app-mapa225`, en la rama `feature/228_mapa_cfgs_acondicionamiento_fisico_1`, creada desde la 226, que es la desplegada.
- La **migración es la 40**, porque la 39 la tiene reservada la tarea 227. Las pestañas son distintas (`CFGS_ACONDICIONAMIENTO_FISICO` y `_2`), así que da igual el orden en que se apliquen las migraciones.
- Al fusionar con la 227 habrá conflictos en la entrada `mapas` del ciclo en `niveles.ts`, que debe quedar con los dos cursos, y también en estos archivos:
  - `niveles-catalogo.test.ts`;
  - `ras-acondicionamiento-fisico.test.ts`;
  - `mapa.test.ts`;
  - la documentación.

## Flujo

1. **Configuración.**

   | Módulos | Familia de relación |
   |---|---|
   | 1136 Valoración de la condición física e intervención en accidentes | ciencias |
   | 1148 Sala de entrenamiento polivalente | técnica |
   | 1149 Actividades con soporte musical | técnica |
   | 1151 Acondicionamiento físico en el agua | cliente |
   | 0017 Habilidades sociales | comunicación |
   | 1665 Digitalización y 1709 Empleabilidad | valores por defecto |

2. **Plan.** Se diseñaron 157 relaciones RA↔RA, con un script temporal que comprobó lo siguiente:
   - que cada RA tiene entre 6 y 15 relaciones;
   - que no hay pares repetidos (se fusionaron 13);
   - que se cubren los 321 criterios.

   Las relaciones parten de situaciones profesionales del sector:
   - valoración y programación en sala;
   - fatiga y coreografía;
   - flotación y técnica en el agua;
   - rescate acuático con RCP;
   - planes de emergencia de cada sala;
   - eventos y su seguridad.

   Para los módulos comunes:
   - **1665:** máquinas y pulsómetros conectados (edge, fog y mist), IA en planes de entrenamiento y en la vigilancia de piscinas, sensores de calidad del agua, datos de salud y transformación digital del centro;
   - **1709:** prevención de riesgos del monitor (voz, espalda, quemaduras), contratos de temporada, nómina por clases, socorrismo como salida profesional y plan de desarrollo individual.
3. **Redacción.** Una actividad bilingüe por relación. El desarrollo cita todos los criterios de los dos lados.
4. **Validación.** El generador, con las comprobaciones contra textos de plantilla, solo encontró tres títulos idénticos en los dos idiomas, que se corrigieron. Después terminó sin errores ni avisos, y una búsqueda más amplia de palabras del otro idioma no encontró nada.

## Archivos

- `backend/src/data/mapa-intermodular/mapa_cfgs_acondicionamiento_fisico.json`: 7 módulos, 43 RA, 314 conexiones y 314 actividades (157 distintas).
- `scripts/mapa-intermodular/fuentes/CFGS_ACONDICIONAMIENTO_FISICO/`: `config.json` y `relaciones.json`.
- `backend/src/migrations/40_ingest_mapa_cfgs_acondicionamiento_fisico.ts`: sustituye solo su pestaña y se puede volver a ejecutar sin problemas.
- `backend/src/data/niveles.ts`: `mapas` del ciclo con la pestaña de 1.º, que se abre en `1136_RA1`.
- Tests:
  - `mapa.test.ts`, migración 40: idempotencia, 314 conexiones bidireccionales, de 6 a 15 conexiones por RA, textos de RA iguales a los del archivo de datos y endpoint;
  - `niveles-catalogo.test.ts` y `ras-acondicionamiento-fisico.test.ts`: la nueva pestaña.
- Documentación: `mapas_intermodulares_pendientes.md`, `niveles_educativos_y_catalogo.md` y `procesamiento_actividades_mapa_intermodular.md`.

## Resultado

| Curso | Relaciones | Conexiones | Conexiones por RA | Criterios cubiertos |
|---|---|---|---|---|
| 1.º | 157 | 314 | 6-15 | 321 de 321 |
