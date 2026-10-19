# Plan 245: Tres actividades por conexión en todos los mapas intermodulares de FP

> **Fecha:** 16 de octubre de 2026
> **Estado:** Implementado (tarea 245)
> **Partes afectadas:** datos de los mapas / scripts / migraciones / tests backend / documentación y reglas / despliegue

---

## 1. Objetivo

El usuario pide que **todas las conexiones de todos los mapas intermodulares tengan al menos 3 actividades**. Hoy solo lo cumplen FPB, CFGM Estética y los dos cursos de Educación Infantil. Desde el 9 de octubre la regla era «al menos una» para abaratar los mapas; vuelve a ser **tres**, también para los mapas que se hagan en adelante.

Situación actual (conexiones por número de actividades):

| Mapa | Conexiones | Relaciones | Actividades | Nuevas necesarias |
|---|---|---|---|---|
| CFGM Atención a Personas en Situación de Dependencia 1.º / 2.º | 322 / 306 | 161 / 153 | 1 | 322 / 306 |
| CFGM Cuidados Auxiliares de Enfermería | 272 | 136 | 1 | 272 |
| CFGM Guía en el Medio Natural 1.º / 2.º | 410 / 368 | 205 / 184 | 1 | 410 / 368 |
| CFGS Acondicionamiento Físico 1.º / 2.º | 314 / 280 | 157 / 140 | 1 | 314 / 280 |
| CFGS Animación Sociodeportiva 1.º / 2.º | 384 / 336 | 192 / 168 | 1 | 384 / 336 |
| CFGS Integración Social 1.º / 2.º | 290 / 330 | 145 / 165 | 1 | 290 / 330 |
| CFGS Laboratorio Clínico 1.º / 2.º | 374 / 348 | 187 / 174 | 1 | 374 / 348 |
| CFGM Peluquería 1.º | 375 | — | 55 con 1, 197 con 2 | ≈ 307 (por conexión) |
| CFGM Peluquería 2.º | 367 | — | 44 con 1, 145 con 2 | ≈ 233 (por conexión) |
| FPB, Estética, Infantil 1.º y 2.º | — | — | ya 3 | 0 |

En total, **≈ 4.330 actividades bilingües nuevas** en los 13 mapas con fuentes, más **≈ 540** en Peluquería. Es, con diferencia, la tarea de contenido más grande del proyecto.

El **mapa de afinidades de la ESO no entra**: por diseño no tiene actividades (AGENTS.md §8).

## 2. Escenarios

- **Escenario: cada conexión de cada mapa de FP tiene al menos tres actividades**
  - **Dado** los 19 JSON de `backend/src/data/mapa-intermodular/`
  - **Cuando** se recorren todas las conexiones
  - **Entonces** `activities.length >= 3` en todas.
- **Escenario: las migraciones nuevas recargan cada pestaña con tres actividades**
  - **Dado** una base con los mapas anteriores
  - **Cuando** se ejecuta la migración de recarga
  - **Entonces** solo cambia su pestaña, cada conexión tiene ≥ 3 actividades y los títulos no se repiten dentro de un RA.
- **Escenario: el generador rechaza relaciones con menos de tres actividades**
  - **Dado** un `relaciones_NN.json` con una relación de 1 o 2 actividades
  - **Cuando** se ejecuta `scripts/mapa-intermodular/mapa-intermodular.mts`
  - **Entonces** falla con «la relación necesita al menos 3 actividades» y no escribe el mapa.
- **Escenario: se conservan las actividades existentes**
  - **Dado** la actividad original de cada relación
  - **Cuando** se regenera el mapa
  - **Entonces** sigue siendo la primera de la conexión con el mismo id y texto.

## 3. Alternativas

1. **Redactar dos actividades nuevas por relación en las fuentes y regenerar** (*recomendada*). Igual que en la tarea 193: se añaden al array `actividades` de cada relación en `scripts/mapa-intermodular/fuentes/<CICLO>/relaciones_NN.json`, con otro enfoque, contexto y metodología que la original, citando los mismos criterios en ES y CA. El generador valida citas, paridad, títulos repetidos y mezcla de idiomas. Como cada relación sirve a las dos conexiones, 2 actividades por relación dan 3 por conexión en ambos sentidos.
2. **Generar las actividades con la IA del producto (Gemini/OpenRouter) por script.** Más rápido, pero calidad desigual, riesgo de catalán con castellanismos y de citas mal formadas; habría que revisarlo todo igualmente. Descartada como vía principal.
3. **Duplicar o variar automáticamente la actividad existente.** Barato pero no aporta valor didáctico y rompe la regla de títulos únicos. Descartada.

**Peluquería** no tiene fuentes en `scripts/mapa-intermodular/fuentes/` (es anterior al generador). Se completa directamente sobre sus JSON con un script temporal que añade las actividades que falten a cada conexión, manteniendo el formato de ids `act_<módulo>_<RA><criterio>_<n>`.

**Organización del trabajo:** un mapa (curso) por lote, en paralelo con subagentes por lotes de `relaciones_NN.json`, validando con el generador al cerrar cada mapa. Se hace un commit por mapa terminado para no perder trabajo y se despliega al final (o por bloques si el usuario lo prefiere).

## 4. Cambios por archivo

| Archivo | Cambio | Capa |
|---|---|---|
| `scripts/mapa-intermodular/fuentes/*/relaciones_NN.json` (13 ciclos/cursos) | +2 actividades bilingües por relación | datos fuente |
| `backend/src/data/mapa-intermodular/*.json` (15 archivos) | Regenerados (13) o completados (Peluquería 1.º y 2.º) | datos |
| `scripts/mapa-intermodular/mapa-intermodular.mts` | Mínimo de 3 actividades por relación (línea 170) | script |
| `backend/src/migrations/49_reload_mapas_tres_actividades.ts` | Recarga las 15 pestañas afectadas; reejecutable, solo toca esas pestañas | migración |
| `backend/src/tests/mapa.test.ts` | `minActivities = 3` en los tests de esos mapas; test de la migración 49; comprobación global sobre todos los JSON | tests |
| `AGENTS.md` §8, `.agents/rules/`, `.agents/skills/agregar-ciclo-educativo/` (SKILL.md, checklist, `verify_cfgm_integration.sh`) | Regla «al menos tres actividades por conexión» | reglas |
| `documentation/procesamiento_actividades_mapa_intermodular.md`, `scripts/mapa-intermodular/prompt*.md` | Ídem | documentación |
| Memoria `mapa-una-actividad-por-conexion` | Sustituida por la regla de tres | memoria |

## 5. Tareas

- [ ] Crear la rama `feature/245_tres_actividades_por_conexion_mapas_fp`.
- [ ] Subir el mínimo del generador a 3 y actualizar reglas, skill, documentación y memoria.
- [ ] Por cada uno de los 13 mapas con fuentes: redactar 2 actividades nuevas por relación (ES/CA, contexto balear, metodología distinta a la original), regenerar el JSON y validar sin errores ni avisos. Commit por mapa.
- [ ] Peluquería 1.º y 2.º: completar con script temporal hasta 3 actividades por conexión y validar títulos únicos por RA y paridad.
- [ ] Migración 49 de recarga y tests (`minActivities = 3` y test global).
- [ ] `cd backend && npm run typecheck && npm test`; `cd frontend && npm test`.
- [ ] Registrar la tarea 245, push y despliegue con `./scripts/deploy-prod.sh` (la migración solo sustituye pestañas del mapa; no toca datos de usuarios).

## 6. Riesgos y verificación prevista

- **Volumen y coste:** ≈ 4.870 actividades bilingües. Es muy costoso en tiempo y tokens; por eso se trabaja por mapa con commits intermedios.
- **Paridad ES/CA y catalán balear:** el generador ya detecta mezclas de idioma y campos iguales en ambos idiomas; revisión adicional por muestreo con el agente `traductor-es-ca`.
- **Repeticiones:** títulos únicos dentro de cada RA (generador y test) y límite de títulos repetidos globales del generador (5 %).
- **Tamaño del JSON:** los mapas pasan de ~1,5 MB a ~4 MB, como Estética; la ingesta en Mongo ya maneja ese tamaño (Estética 4,2 MB, FPB 5,6 MB). Vigilar memoria en el EC2 durante la migración.
- **Migración:** reejecutable, borra e inserta solo las pestañas afectadas; copia de seguridad previa con el despliegue.
- **Validación:** generador sin errores ni avisos para cada mapa; `npm test` en backend y frontend en verde; tras el despliegue, comprobar con la API que una conexión de cada mapa devuelve 3 actividades.
