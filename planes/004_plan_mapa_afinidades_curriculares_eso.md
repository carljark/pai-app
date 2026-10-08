# Plan 004: Mapa de afinidades curriculares de la ESO (1.º-4.º)

> **Fecha:** 8 de octubre de 2026
> **Estado:** Implementado (tarea 202)
> **Partes afectadas:** backend / frontend / migraciones / despliegue

---

## 1. Objetivo

Crear el mapa intermodular de la ESO a partir del documento del IES Cap de Llevant *Afinitats curriculars · ESO 2027-2028* (`add_maps/Afinitats_curriculars_ESO_2027_28.PDF`), **con el mismo formato que el PDF y sin actividades** (a diferencia de los mapas de FP). Cada ficha (afinidad) indica un curso, dos o tres materias, el ámbito propuesto, los pares de criterios de evaluación relacionados con su «relación que fundamenta el ámbito», los saberes básicos movilizados por cada materia y los conceptos comunes.

Además hay que **revisar** el documento contra el currículo oficial (Decreto 42/2025), **ampliar** los cursos con pocas fichas y **añadir 4.º de ESO**, incluidas sus materias de opción: Digitalización, Economía y Emprendimiento, Educación en Valores Cívicos y Éticos, Expresión Artística, Formación y Orientación Personal y Profesional, Latín y Tecnología.

## 2. Situación de partida (análisis del PDF)

- 43 páginas, 20 materias × 4 opciones = **80 fichas** de 1.º-3.º (1.º: 19, 2.º: 26, 3.º: 35). Solo en catalán.
- 13 parejas aparecen dos veces porque son la misma afinidad vista desde cada materia (p. ej. Biología 3.º op. 4 = Educación Física op. 3), así que quedan **~67 afinidades únicas**. 3 fichas son tríos de materias.
- Los criterios se citan por número («CA 6.2») y con un resumen. Los textos oficiales ES/CA ya están en `backend/src/data/curriculo-eso/*.json` (31 materias, incluidas todas las de 4.º), así que cada referencia se puede validar y enlazar con su texto literal.
- **Huecos detectados** (menos de 3 fichas por materia y curso): Cultura Clásica I en 2.º (0), Cultura Clásica II en 2.º y 3.º (1 cada una), Lengua Castellana en 2.º (1), Lengua Extranjera en 1.º (2) y 2.º (1), Segunda Lengua Extranjera en 1.º y 3.º (1) y 2.º (2), Igualdad de Género en 1.º y 2.º (2), Recursos Digitales I y II (2).
- **4.º de ESO** (no está en el PDF): 18 materias. Comunes: Educación Física, Geografía e Historia, Lengua Castellana, Lengua Catalana, Lengua Extranjera, Valores Cívicos y Éticos. De opción: Biología y Geología, Física y Química, Matemáticas A y B, Música, Expresión Artística, Digitalización, Economía y Emprendimiento, FOPP, Latín, Tecnología y Segunda Lengua Extranjera.
- Los JSON del currículo **no incluyen saberes básicos**. Para 1.º-3.º se usan los del PDF. Para 4.º hay que sacarlos del currículo oficial de la CAIB (web curricular o anexo del Decreto 42/2025), sin inventarlos.

## 3. Escenarios

- **Escenario: la ESO muestra el mapa por cursos**
  - **Dado** el nivel ESO en el catálogo, **cuando** abro el mapa intermodular, **entonces** veo las pestañas «ESO 1.º», «2.º», «3.º» y «4.º».
- **Escenario: fichas de una materia**
  - **Dado** la pestaña de 3.º, **cuando** selecciono Biología y Geología, **entonces** veo sus fichas con el ámbito, la tabla de criterios de cada materia con la relación que los fundamenta, los saberes movilizados y los conceptos comunes. No aparece ninguna actividad.
- **Escenario: afinidad recíproca**
  - **Dada** la afinidad Biología + Educación Física de 3.º, **cuando** consulto Educación Física, **entonces** aparece la misma ficha (un único dato, visible desde cada materia implicada).
- **Escenario: criterio con su texto oficial**
  - **Cuando** despliego «CE 5.3» en una ficha, **entonces** veo el texto literal del criterio en el idioma activo.
- **Escenario: paridad ES/CA**
  - **Cuando** cambio el idioma, **entonces** todos los campos de la ficha cambian, y ningún campo `_es` contiene catalán ni ningún `_ca` castellano.
- **Escenario: integridad curricular** (test de datos del backend)
  - Cada criterio citado existe en su materia y se imparte en el curso de la ficha; cada materia de la ficha se imparte en ese curso; ninguna ficha queda sin criterios ni saberes.
- **Escenario: cobertura mínima** (test de datos)
  - Cada materia de cada curso tiene al menos 3 fichas.
- **Escenario: los mapas de FP no cambian**
  - Las pestañas FPB, CFGM y CFGS siguen mostrando módulos, RA, conexiones y actividades como ahora.

## 4. Alternativas

1. **Reutilizar `MapaModule`** (materia como módulo, CE como RA, afinidad como conexión). Descartada: el modelo gira en torno a las actividades (el controlador descarta las conexiones sin actividades y la vista tiene un paso de actividades), y obligaría a duplicar cada afinidad en cada materia.
2. **Colección propia `AfinidadEso` y una vista de fichas dentro del mapa intermodular** (*recomendada*). Cada afinidad se guarda una sola vez y se muestra desde cada materia implicada. El catálogo de niveles marca el formato del mapa (`formato: 'afinidades'`), y la vista del mapa elige entre el acordeón FP actual y la nueva vista. Mantiene un único punto de entrada y no toca los datos de FP.
3. **Página aparte, fuera del mapa.** Descartada: dispersa la navegación y duplica pestañas y cabecera.

**Decisión pendiente (opcional, coste extra):** botón «Crear situación de aprendizaje» en cada ficha, que abra el generador con ESO, el curso, las materias, las CE y los criterios ya marcados (aprovecha la selección de criterios de la tarea 200). Lo propongo para una **fase posterior** y no lo incluyo en este plan.

## 5. Modelo de datos

`backend/src/data/afinidades-eso/afinidades_eso_<curso>.json` (un archivo por curso):

```jsonc
{
  "id": "ESO1-BG-GH-01",
  "curso": "1º",
  "materias": ["biologia_geologia", "geografia_historia"],   // códigos de curriculo-eso
  "ambito_es": "Paisaje, territorio y conservación",
  "ambito_ca": "Paisatge, territori i conservació",
  "vinculos": [
    {
      "criterios": { "biologia_geologia": ["6.2"], "geografia_historia": ["4.1"] },
      "resumen_es": { "biologia_geologia": "Interpretar el paisaje…", "geografia_historia": "…" },
      "resumen_ca": { "biologia_geologia": "Interpretar el paisatge…", "geografia_historia": "…" },
      "relacion_es": "Explicación integrada de relieve, clima, agua y seres vivos.",
      "relacion_ca": "Explicació integrada de relleu, clima, aigua i éssers vius."
    }
  ],
  "saberes": {
    "biologia_geologia": { "es": ["Ecosistemas", "…"], "ca": ["Ecosistemes", "…"] }
  },
  "conceptos_es": ["paisaje", "sistema", "…"],
  "conceptos_ca": ["paisatge", "sistema", "…"],
  "origen": "documento"   // «documento» (PDF) o «ampliacion» (nueva)
}
```

Los textos literales de los criterios no se copian: el frontend los resuelve desde el currículo ESO que ya carga el generador (o el backend los añade en la respuesta), así la fuente sigue siendo única.

## 6. Cambios por archivo

| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/data/afinidades-eso/afinidades_eso_{1,2,3,4}.json` | Datos nuevos ES/CA (~67 del PDF revisadas, ~20 de ampliación y ~45-50 de 4.º) | data |
| `backend/src/data/niveles.ts` | `MapaNivel.formato?: 'modulos' \| 'afinidades'`; `mapas` de `ESO_ORDINARIA` con las pestañas `ESO_1`-`ESO_4`; `AFINIDADES_TABS` | config |
| `backend/src/models/AfinidadEso.ts` | Modelo Mongoose nuevo (índices `tab`+`id` único y `tab`+`materias`) | infrastructure |
| `backend/src/controllers/afinidades.controller.ts` y `routes/afinidades.routes.ts` | `GET /api/afinidades-eso?tab=ESO_3`; añade a cada criterio su texto oficial ES/CA | presentation |
| `backend/src/server.ts` | Registrar la ruta | config |
| `backend/src/migrations/25_ingest_afinidades_eso.ts` | Ingesta idempotente (borra y reinserta solo esta colección) | migraciones |
| `backend/src/tests/afinidades*.test.ts` | Integridad curricular, cobertura mínima, paridad ES/CA, API y migración | tests |
| `frontend/src/app/features/mapa-intermodular/models/afinidad-eso.model.ts` | Tipos | domain |
| `…/services/afinidades-eso.service.ts` + facade/estado con signals | Carga por pestaña, materia seleccionada y fichas filtradas | application |
| `…/components/afinidades-eso-view/` | Lista de materias del curso + fichas | presentation |
| `…/components/ui/afinidad-card/` | Ficha (ámbito, tabla de criterios por materia, saberes, conceptos) con el aspecto del PDF y BEM | presentation |
| `…/mapa-intermodular-view.component.{ts,html}` | Si la pestaña es de formato `afinidades`, muestra la vista nueva | presentation |
| `…/components/ui/header` | Estadísticas de ESO: materias, fichas y criterios vinculados | presentation |
| Traducciones (`trans`) | Etiquetas ES/CA nuevas | presentation |
| Specs `*.spec.ts` de todo lo nuevo | Clics en el DOM real y ambos idiomas; cobertura ≥90 % por archivo | tests |
| `documentation/mapa_afinidades_eso.md` | Formato, fuentes, reglas de revisión y ampliación | docs |
| `tareas/202_mapa_afinidades_eso.md` | Registro de la tarea | docs |

## 7. Tareas

**Fase A — Datos 1.º-3.º (revisión del PDF)**
- [ ] Extraer las 80 fichas del PDF a JSON con un script temporal (en el scratchpad) y fusionar las parejas recíprocas.
- [ ] Validar cada «CA x.y» contra `curriculo-eso` (que exista y que se imparta en el curso de la ficha). Corregir los errores y anotarlos en la tarea.
- [ ] Comprobar que las fichas recíprocas citan los mismos criterios desde ambos lados.
- [ ] Traducir al castellano ámbito, resúmenes, relaciones, saberes y conceptos (traducción fiel; los criterios oficiales ya son bilingües).

**Fase B — Ampliación de 1.º-3.º**
- [ ] Añadir fichas hasta tener al menos 3 por materia y curso en los huecos de la §2, con el mismo criterio del PDF: criterios reales de cada materia y saberes del curso.

**Fase C — 4.º de ESO**
- [ ] Obtener los saberes básicos oficiales de 4.º de las 18 materias (CAIB, ES/CA).
- [ ] Redactar ~4 fichas por materia (~45-50 afinidades únicas una vez fusionadas las recíprocas), priorizando las 7 optativas pedidas y sus enlaces con las comunes.

**Fase D — Backend**
- [ ] Catálogo, modelo, controlador, ruta, migración 25 y tests.

**Fase E — Frontend**
- [ ] Modelo, servicio, estado, vista de fichas, tarjeta, cabecera, traducciones y specs.

**Fase F — Cierre**
- [ ] Lint, typecheck, `npm test` en backend y frontend, documentación, commit y push en `feature/009_mapa_afinidades_eso` (creada desde la rama actual), copia de seguridad y despliegue en el EC2 con comprobación de la migración y de `GET /api/afinidades-eso`.

## 8. Riesgos y verificación prevista

- **Fidelidad de los datos.** El PDF resume los criterios, y las fichas de ampliación y de 4.º son propuestas nuevas. Se marcarán con `origen: "ampliacion"` para que el profesorado sepa qué viene del documento del centro. Los tests de integridad impiden citar criterios inexistentes o de otro curso.
- **Saberes de 4.º.** Si la web de la CAIB falla (los 502 habituales), se reintenta. No se inventan saberes: si alguno no se puede obtener, la ficha se deja pendiente y se avisa.
- **Paridad ES/CA.** Test que detecta catalán en los campos `_es` y castellano en los `_ca` (heurística de palabras frecuentes), además del número de elementos por idioma.
- **Mapas de FP.** El formato por defecto sigue siendo `modulos`. Los specs actuales del mapa deben pasar sin cambios.
- **Límites de código.** La vista del mapa tiene 152 líneas, así que la lógica de ESO va en componentes y servicios propios (<200 líneas por componente y <25 por función).
- **Tamaño.** Se calculan ~1 MB de JSON en total. Se carga por pestaña desde la API y no entra en el bundle del frontend.
- **Despliegue.** La migración solo inserta en una colección nueva, sin datos delicados.
- **Verificación:** `cd backend && npm test`, `cd frontend && npx eslint … && npm test`, y una prueba manual en el navegador de las 4 pestañas en ambos idiomas.
