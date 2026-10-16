# 238 · Mapa intermodular de 2.º del CFGS Laboratorio Clínico y Biomédico

## Propósito

Esta tarea hace el mapa intermodular de **2.º del CFGS Laboratorio Clínico y Biomédico**: 7 módulos, 44 RA y 335 criterios. Con él el ciclo tiene mapa en los dos cursos (el 1.º se hizo en la tarea 239) y ya están hechas las 13 pestañas de la lista de [mapas pendientes](../documentation/mapas_intermodulares_pendientes.md).

## Historia de la tarea

1. **Borrador de Gemini.** Gemini trabajó en la rama con el prompt `scripts/mapa-intermodular/prompt_cfgs_laboratorio_clinico_2.md`. Entregó 176 relaciones con exactamente 8 conexiones por RA y la integración completa: migración 45, catálogo, tests y documentación.
2. **Revisión.** El borrador pasaba el validador actual sin errores, y al regenerarlo desde sus fuentes salía idéntico. Sin embargo, la mayoría de las actividades no eran una tarea compartida entre los dos módulos: unían dos tareas sin relación, con una frase para cada módulo.
   - Ejemplos: «Monitorización farmacocinética de tacrolimus y procesado aséptico de bolsas de sangre total» o «Puesta a punto de autoanalizadores de urea y cribado de anticuerpos antitiroideos».
   - 162 de 176 títulos tenían la forma «X y Y». En los mapas de las tareas 239-241 eran unos 25.
   - Esto incumple la regla 5 del prompt: los criterios de los dos lados deben trabajarse juntos en una misma tarea profesional.
3. **Rehecho.** Por decisión del usuario, Claude rehízo el plan y todos los textos y conservó la integración de Gemini: migración 45, `config.json` y el test de la migración, ajustado.

## Flujo

1. **Fusión con la cadena.** Antes de rehacer el mapa se fusionó en la rama la cadena desplegada, hasta la tarea 242. La entrada `mapas` de `CFGS_LABORATORIO_CLINICO` en `niveles.ts` tiene ahora los dos cursos, con el 1.º (`1367_RA1`) primero. Se resolvieron los conflictos de los tests del catálogo y de mapas, y la documentación tomó la versión de la cadena.
2. **Plan.** Cada relación parte de una situación profesional en la que los dos lados se trabajan a la vez. Ejemplos:
   - celiaquía: malabsorción y antitransglutaminasa;
   - leishmaniasis visceral: pancitopenia y amastigotes en la médula;
   - Anisakis en boquerones en vinagre: identificación de la larva e IgE específica;
   - pseudohiperpotasemia por trombocitosis;
   - contaminación con EDTA por el orden de extracción;
   - reacción febril transfusional: Coombs y cultivo de la bolsa.

   Un script temporal comprobó grados, pares repetidos y cobertura. El primer borrador tenía 16 pares repetidos, 50 criterios sin cubrir y 10 RA con menos de 6 conexiones. Se fusionaron, reorientaron y añadieron relaciones hasta cumplir todas las reglas.
3. **Redacción y montaje.** Los textos se redactaron a mano por línea del plan. Un script temporal los montó en `relaciones_01.json` a `relaciones_06.json` con los RA y criterios exactos del plan, y comprobó que cada criterio se cita en el desarrollo con el mismo orden en los dos idiomas.
4. **Validación.**
   - El generador detectó una vez un nombre catalán con apóstrofo en un campo castellano: «Institut d'Investigació Sanitària». Se cambió por «Instituto de Investigación Sanitaria Illes Balears (IdISBa)».
   - El resultado final no tiene errores ni avisos.
   - La búsqueda de palabras de un idioma en los campos del otro solo dio falsos positivos: enclíticos como «repartir-los» y el nombre oficial del Banc de Sang i Teixits.

## Ambientación

- **Lugares:** Son Espases, Son Llàtzer, Inca, Manacor, Mateu Orfila, Can Misses y Formentera; el Banc de Sang i Teixits; consultorios rurales como Escorca; residencias, escoletas, hoteles de Calvià y de Alcúdia, y granjas del Pla de Mallorca.
- **Módulos comunes:**
  - 1708: resistencias antimicrobianas, agua en sequía, residuos biosanitarios y químicos, ciclo de vida de analizadores y hemoderivados, cromatografía verde y planes de sostenibilidad;
  - 1710: bolsa del IB-Salut, oposiciones, empresas emergentes, entrevistas de problema con clínicas veterinarias y comunicación de valores críticos;
  - 1375: proyectos de citometría, validación automática, química seca en primaria y logística de hemoderivados entre islas.

## Archivos

- `scripts/mapa-intermodular/fuentes/CFGS_LABORATORIO_CLINICO_2/`: `config.json` (de Gemini) y `relaciones_01.json` a `relaciones_06.json` (rehechos).
- `backend/src/data/mapa-intermodular/mapa_cfgs_laboratorio_clinico_2.json`: 7 módulos, 44 RA y 348 conexiones.
- `backend/src/migrations/45_ingest_mapa_cfgs_laboratorio_clinico_2.ts` (de Gemini): sustituye solo su pestaña.
- `backend/src/data/niveles.ts`: `mapas` con el 1.º y el 2.º.
- **Tests:**
  - `mapa.test.ts`: test de la migración 45 con 348 conexiones y 6-15 por RA, que no toca el 1.º;
  - `niveles-catalogo.test.ts` y `ras-laboratorio-clinico.test.ts`: los dos cursos.
- **Documentación:**
  - `mapas_intermodulares_pendientes.md`: lista completada y lecciones de los mapas encargados a otros modelos;
  - `niveles_educativos_y_catalogo.md`;
  - `procesamiento_actividades_mapa_intermodular.md`.

## Resultado

| Curso | Relaciones | Conexiones | Conexiones por RA | Criterios cubiertos |
|---|---|---|---|---|
| 2.º | 174 | 348 | 6-12 | 335 de 335 |

## Decisiones

- **El validador no basta.** Comprueba la forma (citas, idiomas, títulos, repeticiones), pero no si los dos lados de una relación forman una misma tarea. Antes de fusionar un mapa ajeno hay que leer una muestra de actividades. Una señal de alarma es una proporción alta de títulos «X y Y».
- **Se reaprovecha la integración.** La migración, la configuración y el test de Gemini eran correctos, así que solo se rehicieron el plan y los textos.
