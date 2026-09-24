# Diseño Técnico: Corrección Integral del Mapa Intermodular para CFGM Estética y Belleza basado en Documentos Definitivos

## Propósito
En el Mapa Intermodular, en la sección de **CFGM Estética y Belleza**, se detectaron deficiencias funcionales y de contenido:
1. **Falta de Criterios de Evaluación en los Resultados de Aprendizaje:** Los 52 RAs de los 9 módulos tenían sus arrays de criterios (`criteria_es` y `criteria_ca`) vacíos (`[]`), provocando que en el Paso 2 no se mostraran los criterios ni las píldoras de filtrado por letra ni el recuento de conexiones.
2. **Criterios no Implicados en las Actividades:** Las descripciones de las actividades en las conexiones no reflejaban los criterios de evaluación implicados, a diferencia de la pestaña de FP Básica que añade explícitamente `(Aprendizajes: ...)` en castellano y `(Aprenentatges: ...)` en catalán.
3. **Mezcla Lingüística de Castellano y Catalán:**
   - En las descripciones de las actividades en castellano (`description_es`), se colaban términos en catalán (e.g. `repartint els roles`, `resposta profesional`, `deixant constància`, etc.).
   - En los criterios en catalán (`criterios_ca` y `criteria_ca`), existían frases residuales en castellano (e.g. `cuestionario`, `hábitos de vida`, `de los`, `para`, etc.).
   - En la interfaz de usuario, las etiquetas de títulos (`Propostes d'Activitats i Reptes FPB`, `Aprenentatges i Diversitat FPB:`, `Mòduls FPB`) y el chip de criterios relacionados estaban fijos o sin considerar el nivel/idioma.
4. **Desconexión con Creación de Proyectos:** Al pulsar el botón "Crear Proyecto con estas conexiones" desde la pestaña CFGM, se fijaba erróneamente `setTipoNivel('FP_BASICA')`.

La solución consistió en procesar e incorporar de manera canónica los 18 documentos de referencia de la carpeta `Grado Medio Estética y belleza/Nuevos documentos mapa intermodular belleza/`, segregando de forma estricta los textos en castellano y catalán, completando los 410 criterios limpios y generando el seed definitivo idéntico en estructura, interacción y calidad al de Formación Profesional Básica.

---

## Arquitectura y Flujo

```
Grado Medio Estética y belleza/Nuevos documentos mapa intermodular belleza/
 ├── mapa_intermodular_0633_ES...md      (9 módulos en castellano: matriz directa + 81 actividades)
 └── mapa_intermodular_0633_CA...md      (9 módulos en catalán: matriz directa + 81 actividades)
                     │
                     ▼
          generate_cfgm_mapa.py (scratch)
                     │
         ┌───────────┴────────────────────────┐
         ▼                                    ▼
mapa-intermodular-cfgm.seed.ts      ras_cfgm_estetica.data.ts (FE & BE)
- 9 módulos                          - 52 RAs curriculares
- 52 RAs oficiales (ES & CA)         - 410 criterios limpios ES
- 410 criterios en criteria_es/ca    - 410 criterios normativos CA
- 410 conexiones con sourceCriteria  - Sin texto residual de temario (horas/contenidos)
- 1.230 actividades bilingües con:
    (Aprendizajes: ...) / (Aprenentatges: ...)
                     │
                     ▼
       Angular Mapa Intermodular
 ├── mapa-intermodular.facade.ts (selección automática de 0633 / 0633_RA1 en tab CFGM)
 ├── mapa-intermodular-view.component.ts (setTipoNivel dinámico en creación de proyecto)
 └── mapa-intermodular-view.component.html (chips, cabeceras, títulos e i18n reactivos)
```

1. **Paso 1 (Selección de Módulo):** El usuario explora los 9 módulos de primer curso ofertados para CFGM Estètica i Bellesa (`0633`, `0635`, `0636`, `0638`, `0640`, `0641`, `1664`, `1709`, `0156`).
2. **Paso 2 (Resultados de Aprendizaje y Criterios):** Cada RA expone su texto completo y la totalidad de sus criterios de evaluación (`criteria_es` en castellano o `criteria_ca` en catalán). El usuario puede filtrar las coincidencias seleccionando cualquier criterio o ver todas las del RA.
3. **Paso 3 (Conexiones y Actividades DUA):** Muestra el criterio fuente (`sourceCriteria`), los criterios relacionados de otros módulos con su nombre de módulo y texto en el idioma seleccionado (`criteria_es` o `criteria_ca`), la justificación curricular y 3 actividades pedagógicas con desarrollo y metadatos DUA.
4. **Acción de Generación de Proyecto:** Al hacer clic en "Crear Proyecto con estas conexiones", el componente detecta `facade.activeTab() === 'CFGM'` e invoca `curriculum.setTipoNivel('CFGM_ESTETICA')`, transfiriendo los RAs seleccionados al generador curricular sin romper el flujo de FP Básica.

---

## Archivos Modificados

1. **`frontend/src/app/features/mapa-intermodular/data/mapa-intermodular-cfgm.seed.ts`**:
   - Reemplazado por el seed definitivo (4,8 MB): 9 módulos, 52 RAs con todos los criterios de evaluación (`criteria_es` y `criteria_ca`), 410 conexiones completas y 1.230 actividades pedagógicas DUA que incluyen al final de su desarrollo `(Aprendizajes: ...)` en castellano y `(Aprenentatges: ...)` en catalán.
2. **`frontend/src/app/features/curriculum/data/ras_cfgm_estetica.data.ts`**:
   - Limpieza de los 410 criterios en castellano (eliminación del texto de horas y temario "Duración: XX horas. Contenidos básicos..." que había quedado adherido al último criterio de cada módulo).
   - Sustitución de los 410 criterios en catalán por traducciones normativas impecables sin ningún residuo en castellano.
3. **`backend/src/data/ras_cfgm_estetica.data.ts`**:
   - Sincronización idéntica con el archivo curricular del frontend.
4. **`frontend/src/app/features/mapa-intermodular/models/mapa-intermodular.model.ts`**:
   - Extensión de la interfaz `RelatedCriteriaItem` para incluir opcionalmente `criteria_es?: string; criteria_ca?: string;`, permitiendo renderizar chips de criterios relacionados bilingües.
5. **`frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.html`**:
   - Actualización de la tarjeta estadística: `isCa() ? (facade.activeTab() === 'CFGM' ? 'Mòduls CFGM' : 'Mòduls FPB') : (facade.activeTab() === 'CFGM' ? 'Módulos CFGM' : 'Módulos FPB')`.
   - Chip de criterios relacionados reactivo a idioma: `isCa() ? (rel.criteria_ca || rel.criteria) : (rel.criteria_es || rel.criteria)`.
   - Título de actividades reactivo a pestaña y lengua: `Propostes d'Activitats i Reptes CFGM/FPB` / `Propuestas de Actividades y Retos CFGM/FPB`.
   - Cabecera de diversidad adaptada: `Aprenentatges i Diversitat CFGM/FPB:` / `Aprendizajes y Diversidad CFGM/FPB:`.
6. **`frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.ts`**:
   - En `createProjectFromConnection`, llamada dinámica a `this.curriculum.setTipoNivel(this.facade.activeTab() === 'CFGM' ? 'CFGM_ESTETICA' : 'FP_BASICA')`.
7. **`frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.ts`**:
   - En `setTab`, preselección inmediata del módulo `0633` y RA `0633_RA1` al cambiar a la pestaña `CFGM`, proporcionando la misma experiencia inicial de descubrimiento que en `FPB` (`3060` / `3060_RA1`).

---

## Detalles Técnicos y Verificación

### Fuentes Canónicas y Segregación Lingüística
Los 18 documentos situados en `Grado Medio Estética y belleza/Nuevos documentos mapa intermodular belleza/` fueron la fuente exclusiva de verdad:
- Documentos `*_ES_criterio_a_criterio_con_actividades.md`: matrices y actividades 100% en castellano redactadas por el autor curricular.
- Documentos `*_CA_criteri_a_criteri_amb_activitats.md`: matrices y actividades 100% en catalán adaptadas al ámbito estético.
- Los 410 criterios de evaluación se normalizaron y tradujeron según los estándares lingüísticos de la Formación Profesional de las Illes Balears y la Generalitat Valenciana (e.g. *dels*, *de les*, *per a*, *amb*, *segons*, *com*, *s'ha*, *s'han*, *estris*, *aparells*, *pell*, *ungles*, *làmina unguial*, *desmaquillatge*).

### Verificación de Calidad Lingüística y Datos
- **Comprobación de Residuos:** Scripts de escaneo verificaron 0 palabras de marcado catalán en campos castellanos y 0 palabras de marcado castellano en campos catalanes.
- **Formato de Criterios Implicados:** Las 1.230 instancias de actividades contienen el bloque de aprendizajes exacto (ej. `(Aprendizajes: 0633-1a + 0638-1h + 0641-5d + 0635-5c)` en ES y `(Aprenentatges: 0633-1a + 0638-1h + 0641-5d + 0635-5c)` en CA).
- **Branch Coverage y Tests:**
  - Frontend: 31 archivos de prueba superados al 100% (376 tests pasados). Cobertura global de ramas: **95,23%** (umbral requerido: ≥ 90%).
  - Backend: 15 suites superadas al 100% (120 tests pasados).
- **Higiene del Repositorio:** Ningún archivo auxiliar o de script temporal (`.py`, `.json`, `.docx`) se dejó en el repositorio de trabajo; todos los generadores se ejecutaron desde el directorio scratch del artefacto.
