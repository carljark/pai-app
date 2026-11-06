# Plan 250: FP Básica al plan 2026/27 en el mapa y en el generador

> **Fecha:** 6 de noviembre de 2026
> **Estado:** Implementado (tarea 250)
> **Partes afectadas:** backend (catálogo, datos, migraciones) / frontend (solo tests y, si hace falta, mapeos) / despliegue

---

## 1. Objetivo

La project manager ha detectado que el mapa del CFGB Peluquería y Estética (IMP11) no cuadra con el plan de estudios de los matriculados desde 2026/27 (FP Illes Balears). **No es una regresión**: `mapa_fpb.json` no cambia desde la tarea 211. Se corrigen cuatro cosas:

1. **Faltan dos módulos de 2.º en el mapa:** 3160 Proyecto intermodular de aprendizaje colaborativo (lo prioritario) y Comunicación y Ciencias Sociales II. El generador sí los tiene.
2. **El mapa es una sola pestaña `FPB`** con los dos cursos mezclados, cuando el resto de ciclos de dos cursos tienen una pestaña por curso (AGENTS.md §8).
3. **Los módulos comunes llevan los códigos y nombres del plan anterior:** 3011 «Comunicación y sociedad I», 3009 «Ciencias aplicadas I» y 3042 «Ciencias aplicadas II». En 2026/27 son 3161, 3163 y 3164, «Comunicació i Ciències Socials» y «Ciències Aplicades», y Comunicación y Ciencias Sociales II es el 3162.
4. **El generador no tiene el 3159**, Itinerario personal para la empleabilidad, aunque el mapa sí lo tiene. Además, sus RA de FP Básica no llevan `moduleCode` ni `tipoNivel`, así que no se pueden filtrar por curso.

### Plan oficial 2026/27 (IMP11, captura de FP Illes Balears)

| Curso | Módulos |
|---|---|
| 1.º | 3060 Preparación del entorno profesional · 3062 Depilación mecánica y decoloración del vello · 3064 Lavado y cambios de forma del cabello · 3061 Cuidados estéticos básicos de uñas · 3159 Itinerario personal para la empleabilidad · 3161 Comunicación y Ciencias Sociales I · 3163 Ciencias Aplicadas I |
| 2.º | 3005 Atención al cliente · 3065 Cambio de color del cabello · 3063 Maquillaje · 3160 Proyecto intermodular de aprendizaje colaborativo · 3162 Comunicación y Ciencias Sociales II · 3164 Ciencias Aplicadas II |

### Fuentes oficiales (verificadas al empezar; resuelve la alternativa B1)

El usuario fijó la prioridad de las fuentes: **CAIB, después BOE y después TodoFP**.

- **Àmbits 3161–3164.** No tienen RA, sino competencias específicas y criterios de evaluación, igual que en la ESO.
  - **CAIB:** resolución DGFPIOE 03/2024 de instrucciones de FP (<https://www.caib.es/sites/fp/f/469565>), apéndice 4 (Ciències Aplicades) y apéndice 5 (Comunicació i Ciències Socials). Solo está en catalán.
  - **BOE:** anexo V del RD 217/2022, «Ámbitos de ciclos formativos de grado básico». Es el texto en castellano, con la misma estructura y la misma numeración.
  - **Ciencias Aplicadas:** 8 competencias, 18 criterios.
  - **Comunicación y Ciencias Sociales:** 8 competencias, 23 criterios.
  - **Ninguna de las dos fuentes divide en I y II:** I y II comparten competencias y criterios.
  - **Consecuencia:** los RA del RD 127/2014 que tenemos (3009, 3011, 3042 y Comunicación y sociedad II) dejan de usarse, y las conexiones de esos módulos se rehacen.
- **3159:** apéndice 6 de la misma resolución (CA) y anexo III del RD 659/2023 (ES). Tiene 5 RA, con 5, 5, 3, 3 y 4 criterios, y coincide con el mapa actual.
- **3160:** ninguna de las dos normas le da RA. Se conservan los 5 RA de Baleares que ya están en la base de datos.
- **Ficha IMP11 de la CAIB:** los códigos 3159–3164 ya existían en el plan 2024/25–2025/26. En 2026/27, el 3061 pasa a 1.º y el 3065 a 2.º. Se sigue el plan 2026/27.

### Estado actual en producción (consultado por SSH, solo lectura)

- **`mapamodules`, pestaña `FPB` (11 módulos):** 3060, 3061, 3005, 3065, 3042, 3009, 3011, 3062, 3159, 3064 y 3063.
  - Las conexiones tienen 5, 7 o 9 actividades (cumplen el mínimo de 3).
  - El 3009 tiene RA con solo 1 o 2 conexiones.
- **`ras` de FP Básica:** son los documentos sin `tipoNivel`, con `id` `RA1`… y sin `moduleCode`, salvo el 3160, que usa `3160_RA1`…
  - Hay 12 módulos con 73 RA, entre ellos Comunicación y sociedad II (8 RA) y el Proyecto intermodular (5 RA).
  - Falta el 3159.

## 2. Escenarios

- **Escenario: el mapa de FP Básica tiene una pestaña por curso**
  - **Dado** el catálogo de niveles
  - **Cuando** se pide `GET /api/niveles`
  - **Entonces** `FP_BASICA.mapas` tiene `FPB` (1.º, empieza en 3060) y `FPB_2` (2.º, empieza en 3005, el primer módulo del 2.º curso oficial), y cada curso tiene su lista `modulos` en el orden oficial.
- **Escenario: el 2.º curso del mapa incluye el Proyecto intermodular**
  - **Dado** la migración aplicada
  - **Cuando** se pide `GET /api/mapa-intermodular?tab=FPB_2`
  - **Entonces** aparecen 3005, 3065, 3063, 3160, 3162 y 3164, y el 3160 tiene conexiones en todos sus RA.
- **Escenario: cada pestaña solo contiene módulos de su curso**
  - **Dado** los JSON `mapa_fp_basica.json` y `mapa_fp_basica_2.json`
  - **Cuando** se validan
  - **Entonces** ninguna conexión apunta a un módulo de otro curso.
  - **Y** cada conexión tiene al menos 3 actividades.
  - **Y** cada RA tiene entre 6 y 15 conexiones.
  - **Y** las relaciones son bidireccionales y hay paridad ES/CA.
- **Escenario: códigos y nombres del plan 2026/27**
  - **Dado** los mapas y los RA de FP Básica
  - **Cuando** se consultan en castellano y en catalán
  - **Entonces** los módulos comunes son 3161/3162 «Comunicación y Ciencias Sociales I/II» («Comunicació i Ciències Socials I/II») y 3163/3164 «Ciencias Aplicadas I/II» («Ciències Aplicades I/II»).
  - **Y** no quedan 3009, 3011 ni 3042.
- **Escenario: el generador filtra los módulos por curso**
  - **Dado** FP Básica y el curso 1.º
  - **Cuando** el generador agrupa los RA
  - **Entonces** muestra los 7 módulos de 1.º en orden oficial, incluido el 3159 con sus RA.
  - **Y** en 2.º muestra los 6 módulos de 2.º, incluido el 3160.
- **Escenario: los proyectos antiguos de FP Básica se siguen abriendo**
  - **Dado** un proyecto guardado con RA de FP Básica del formato antiguo
  - **Cuando** se abre, se regenera o se traduce
  - **Entonces** sus RA seleccionados se siguen encontrando, porque no se cambian los `id` existentes de la colección `ras`.
- **Escenario: la cesta y «Crear proyecto» desde el mapa de 2.º**
  - **Dado** la pestaña `FPB_2`
  - **Cuando** se crea un proyecto desde una conexión del 3160
  - **Entonces** el generador recibe el nivel FP Básica, el curso 2.º y los RA del 3160 preseleccionados.
- **Escenario: la migración se puede reejecutar**
  - **Dado** la migración aplicada
  - **Cuando** se ejecuta otra vez
  - **Entonces** el resultado es el mismo y no toca otros niveles.

## 3. Alternativas

**Pestañas por curso**
- **A1 (recomendada):** `FPB` pasa a ser 1.º y se crea `FPB_2` para 2.º. Es la convención de los demás ciclos, y el id histórico `FPB` no se renombra (comentario en `MapaNivel.tab`).
- **A2:** mantener una sola pestaña y añadir los módulos. Es más barato, pero incumple §8 y deja el mapa con 13 módulos, poco legible en el mapa mental.

**Módulos comunes nuevos (3161–3164)**
- **B1 (recomendada):** verificar primero en CAIB/BOIB (o en el decreto o la orden que fija el plan 2026/27) si sus RA y criterios son los mismos que los de 3011/3012/3009/3042.
  - Si son los mismos, solo cambian código y nombre en el mapa y en `ras`; las conexiones se conservan.
  - Si cambian, se sustituyen los RA desde la fuente oficial ES/CA y se regeneran las conexiones de esos módulos.

  Esta decisión se confirmará con el usuario antes de redactar conexiones.
- **B2:** cambiar solo los códigos sin verificar. Se descarta, porque AGENTS.md §8 prohíbe datos no contrastados.

**Redacción de conexiones y actividades**
- **C1 (recomendada):** usar la herramienta existente `scripts/mapa-intermodular/mapa-intermodular.mts`.
  - `ficha` prepara el curso y `construir` valida las reglas de §8.
  - Las relaciones de los módulos nuevos se redactan en `relaciones*.json` dentro de `fuentes/FPB` y `fuentes/FPB_2`.
  - Las conexiones existentes del mismo curso se reaprovechan convertidas a ese formato, y las que cruzan de curso se descartan.
  - **Decidido al aprobar:** las actividades las redacta opencode con DeepSeek, como en las tareas 245 y 247. Claude Code prepara las fichas, los lotes y las instrucciones, y después valida e incorpora el resultado.
- **C2:** editar `mapa_fpb.json` a mano. Se descarta: no se validaría.

**RA del generador**
- **D1 (recomendada):** migración que añade `tipoNivel: 'FP_BASICA'` y `moduleCode` a los RA de FP Básica, inserta los del 3159 (desde los RA y criterios ES/CA del mapa, contrastados con la fuente oficial) y actualiza los nombres.
  - Los `id` existentes se conservan.
- **D2:** cambiar los `id` a `CODIGO_RAn`. Se descarta, porque podría dejar de encontrar los RA de proyectos antiguos (`findSelectedRa`).

## 4. Cambios por archivo

| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/data/niveles.ts` | `FP_BASICA.cursos` con `modulos` en orden oficial; `mapas` con `FPB` (1.º) y `FPB_2` (2.º) | config |
| `backend/src/data/mapa-intermodular/mapa_fp_basica.json` | **Nuevo** (al implementar se decidió no sobrescribir `mapa_fpb.json`, que leen las migraciones 08, 17, 18 y 29): 1.º rehecho con la herramienta, sin conexiones hacia 2.º | infrastructure (datos) |
| `backend/src/data/mapa-intermodular/mapa_fp_basica_2.json` | **Nuevo:** 3005, 3065, 3063, 3160, 3162 y 3164 (3042→3164), con conexiones nuevas para el 3160 y el 3162 | infrastructure (datos) |
| `backend/src/data/ras_fp_basica.data.ts` | **Nuevo:** `moduleCode` y nombres ES/CA de 2026/27 por módulo, RA del 3159 y, si cambian (B1), los RA nuevos de los módulos comunes | infrastructure (datos) |
| `backend/src/migrations/52_fp_basica_plan_2026_27.ts` | **Nueva:** recarga `FPB` y `FPB_2` en `mapamodules`, actualiza los RA de FP Básica en `ras` (`tipoNivel`, `moduleCode`, nombres) e inserta el 3159. Reejecutable y limitada a FP Básica | infrastructure |
| `backend/src/controllers/curriculum.controller.ts` | Mapeos `caToEsModules`/`esToCaModules` con los nombres nuevos (solo si siguen haciendo falta con `module_es`/`module_ca`) | presentation |
| `scripts/mapa-intermodular/mapa-intermodular.mts` | `COMUNES` con 3159 y 3161–3164 (tipo `comun`), y el 3160 como `transversal` | herramienta |
| `scripts/mapa-intermodular/fuentes/FPB`, `FPB_2` | **Nuevos:** `ficha.md`, `config.json` y `relaciones*.json` | herramienta |
| `backend/src/tests/*` | Tests de catálogo, migración, API del mapa (`FPB_2`) y reglas de los JSON (cursos, ≥3 actividades, 6–15 conexiones, paridad ES/CA) | tests |
| `frontend/src/app/testing/niveles.mock.ts` y specs afectados | Mock de FP Básica con dos mapas y `modulos`; specs del agrupado por curso | tests |
| `documentation/mapa_intermodular_fp_basica.md` (o la sección de FP Básica que ya exista) | Plan 2026/27, pestañas, códigos y decisión B1 | documentación |
| `documentation/mapas_intermodulares_pendientes.md` | Estado de FP Básica | documentación |
| `tareas/250_*.md` | Registro de la tarea | documentación |

## 5. Tareas

- [ ] Crear la rama `feature/250_fp_basica_plan_2026_27`.
- [ ] **Fuentes oficiales:** localizar en CAIB/BOIB y TodoFP/BOE el currículo 2026/27 del IMP11 y comparar los RA y criterios de 3161–3164 con los de 3011/3012/3009/3042, y los del 3159 con los del mapa. **Avisar al usuario del resultado (B1) antes de seguir.**
- [ ] Catálogo: `modulos` por curso y los dos mapas en `niveles.ts`.
- [ ] Datos del generador: `ras_fp_basica.data.ts` con códigos, nombres ES/CA, el 3159 y, si procede, los RA nuevos.
- [ ] Ajustar `COMUNES` de la herramienta y generar `ficha` de 1.º y 2.º, que necesitan el `moduleCode` de los RA (probar primero con la base local migrada).
- [ ] Convertir las conexiones existentes de cada curso a `relaciones*.json` y descartar las que cruzan de curso.
- [ ] Redactar las relaciones nuevas del 3160 y del 3162, y completar los RA que se queden por debajo de 6 conexiones al separar cursos (por ejemplo, los del 3009/3163), con ≥3 actividades bilingües por relación.
- [ ] `construir` los dos JSON sin errores de validación.
- [ ] Migración 52 y sus tests; comprobar que es reejecutable con la base local.
- [ ] Mapeos de nombres en `curriculum.controller.ts`, si procede, y tests.
- [ ] Frontend: mock de niveles y specs; comprobar que la cesta y «Crear proyecto» funcionan en `FPB_2`.
- [ ] Lint, typecheck y `npm test` completos en `backend/` y `frontend/`.
- [ ] Prueba en Docker local: pestañas 1.º y 2.º de FP Básica en la vista clásica y el mapa mental, y generador de FP Básica en los dos cursos.
- [ ] Documentación y `/registrar-tarea`.
- [ ] Commit, push, CI en verde, **aviso al usuario antes de integrar** (la migración reescribe RA de FP Básica en producción), integración en `main` y seguimiento del despliegue.

## 6. Riesgos y verificación prevista

- **Proyectos existentes de FP Básica:** guardan RA del formato antiguo. Se conservan los `id` y las descripciones, y solo se añaden campos. La verificación es un test de `findSelectedRa` con proyectos antiguos y una prueba con un proyecto real copiado de producción en local.
- **Tres usos de los nombres de módulo:** `module`, `module_es` y `module_ca` alimentan el agrupado del generador, las coincidencias de `fpbmatches` (por código de módulo) y `MapaProyectoService.matchRefs`. Si se renombran, hay que revisar que «Crear proyecto» desde el mapa encuentre los RA. La verificación son tests de `crearDesdeReferencias` con los datos nuevos.
- **`fpbmatches` usa los códigos antiguos** (3009, 3011, 3042) en `code`: hay que mirar si conviene añadir los nuevos o dejarlo como está. Se revisará en la base local antes de la migración.
- **Coste de redacción:** unos 13 RA nuevos × 6–15 conexiones × ≥3 actividades × 2 idiomas, más los RA que se queden cortos al separar cursos. Es la parte más larga. La paridad ES/CA se revisa con el agente `traductor-es-ca` o con la validación de `construir`.
- **Si los RA de 3161–3164 cambian** (rama B de B1), el alcance crece: hay que regenerar todas las conexiones de esos módulos. Por eso se para a consultar.
- **Despliegue:** la migración reescribe `ras` de FP Básica y dos pestañas de `mapamodules`. El despliegue hace una copia de seguridad previa, y la migración solo toca documentos de FP Básica.
- **Frontend:** no se esperan cambios de código; el mapa y el generador salen del catálogo. Hay que mantener la cobertura por archivo de los specs tocados y los límites de 200 líneas por componente y 25 por función.
