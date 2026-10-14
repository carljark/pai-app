# 225 · Mapa intermodular de 2.º del CFGS Integración Social

## Propósito

Esta tarea hace el segundo mapa de la [lista de pendientes](../documentation/mapas_intermodulares_pendientes.md), el de **2.º del CFGS Integración Social**: 9 módulos, 44 RA y 346 criterios. Se hizo a la vez que Gemini (antigravity-cli) preparaba el de 1.º del mismo ciclo en la tarea 224. Así el ciclo queda completo y se pueden comparar los dos resultados.

Se usó la herramienta `scripts/mapa-intermodular/` de la [tarea 223](223_mapa_cfgm_cuidados_auxiliares_enfermeria.md), con el mismo procedimiento.

## Trabajo en paralelo sin interferir

Gemini trabajaba en la carpeta principal del repositorio (rama `feature/224_mapa_cfgs_integracion_social`). Para no tocar sus archivos, esta tarea se hizo en un **git worktree** aparte, `../pai-app-mapa225`, con:
- la rama `feature/225_mapa_cfgs_integracion_social_2`, creada desde `feature/223_mapa_cfgm_cuidados_auxiliares_enfermeria`, la misma base que la 224;
- su propio `node_modules`.

Para evitar choques:
- la **migración es la 38**, porque la 37 la tiene reservada la tarea 224;
- la pestaña es `CFGS_INTEGRACION_SOCIAL_2` y la 224 usa `CFGS_INTEGRACION_SOCIAL`, así que los datos no se pisan y el orden de aplicación de las migraciones da igual;
- **no se despliega** hasta juntar las dos ramas: `deploy-prod.sh` despliega una sola rama y dejaría fuera el mapa de la otra.

Al fusionar con la 224 habrá conflictos pequeños y previsibles:
- la entrada `mapas` de `CFGS_INTEGRACION_SOCIAL` en `niveles.ts`: deben quedar los dos elementos, 1.º y 2.º;
- las listas de `niveles-catalogo.test.ts`;
- la expectativa de `mapas` en `ras-integracion-social.test.ts`;
- los tests nuevos de `mapa.test.ts`;
- la lista de pendientes;
- la lista de ciclos con mapa en `procesamiento_actividades_mapa_intermodular.md` y la sección del ciclo en `niveles_educativos_y_catalogo.md`.

## Flujo

1. **Ficha y configuración.**
   - `0017 Habilidades sociales` y `0020 Primeros auxilios` usan las mismas familias que en Educación Infantil 2.º: comunicación y ciencias.
   - `0339 Atención a las unidades de convivencia`: cliente.
   - `0341 Apoyo a la intervención educativa`: técnica.
   - `0343 Sistemas aumentativos y alternativos de comunicación`: comunicación.
   - `0345 Proyecto intermodular`: transversal, técnica.
   - Los comunes (`0179`, `1708` y `1710`) llevan la configuración por defecto.
2. **Plan.** Se diseñaron 165 relaciones RA↔RA con 1-3 criterios por lado. Un script temporal comprobó:
   - que hay entre 6 y 11 relaciones por RA;
   - que no se repite ningún par (se corrigió uno);
   - que se cubren los 346 criterios.

   Se buscaron situaciones profesionales reales para conectar los comunes:
   - inglés con residentes y turistas extranjeros, convocatorias europeas, protocolos ILCOR y lenguas de signos de otros países;
   - sostenibilidad con pobreza energética, consumo responsable en el hogar, empresas de inserción y planes de sostenibilidad de entidades;
   - empleabilidad con emprendimiento social, financiación ética y procesos selectivos del sector.
3. **Redacción.** Una actividad bilingüe por relación. El desarrollo cita todos los criterios de los dos lados con su código completo.
4. **Validación.** `construir` terminó sin errores ni avisos, y una búsqueda más amplia de palabras del otro idioma no encontró nada.

## Archivos

- `backend/src/data/mapa-intermodular/mapa_cfgs_integracion_social_2.json`: 9 módulos, 44 RA, 330 conexiones y 330 actividades (165 distintas).
- `scripts/mapa-intermodular/fuentes/CFGS_INTEGRACION_SOCIAL_2/`: `config.json` y `relaciones.json`.
- `backend/src/migrations/38_ingest_mapa_cfgs_integracion_social_2.ts`: sustituye solo su pestaña y es reejecutable.
- `backend/src/data/niveles.ts`: `mapas` de `CFGS_INTEGRACION_SOCIAL` con la pestaña de 2.º, que se abre en `0017_RA1`.
- **Tests:**
  - `mapa.test.ts`: test de la migración 38. Comprueba que es idempotente y no toca otras pestañas, la bidireccionalidad (330 conexiones), las 6-15 conexiones por RA, como máximo 3 criterios externos, los textos de RA iguales a los del archivo de datos y el endpoint.
  - `niveles-catalogo.test.ts` y `ras-integracion-social.test.ts`: la nueva pestaña.
- **Documentación:** `mapas_intermodulares_pendientes.md`, `procesamiento_actividades_mapa_intermodular.md` (ciclos con mapa) y `niveles_educativos_y_catalogo.md`.

## Resultado

| Curso | Relaciones | Conexiones | Conexiones por RA | Criterios cubiertos |
|---|---|---|---|---|
| 2.º | 165 | 330 | 6-11 | 346 de 346 |
