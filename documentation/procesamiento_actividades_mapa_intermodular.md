# Procesamiento y Arquitectura de Actividades en el Mapa Intermodular

Este documento describe el ciclo de vida completo, la arquitectura de datos, el algoritmo de bidireccionalidad y las optimizaciones de memoria empleadas en el **Mapa Intermodular** de la plataforma Plappin, aplicable tanto a ciclos de **Formación Profesional Grado Básico (FPB)** como de **Grado Medio (CFGM)**.

---

## 1. Visión General del Sistema

El Mapa Intermodular es la herramienta central de Plappin para la articulación curricular intermodular. Permite a los equipos docentes visualizar cómo los **Resultados de Aprendizaje (RA)** y **Criterios de Evaluación (CE)** de un módulo se relacionan directamente con los de otros módulos del mismo ciclo y curso, ofreciendo propuestas de **actividades de aprendizaje integradas** diseñadas bajo el marco del **Diseño Universal para el Aprendizaje (DUA)**.

```mermaid
flowchart LR
    A["Documentos Curriculares\nMarkdown (ES / CA)"] --> B["Parser & Pipeline\nPython / Ingesta"]
    B --> C["Diccionario Único\nde Actividades (A)"]
    B --> D["Grafo Bidireccional de\nConexiones Curriculares"]
    C & D --> E["Seed TypeScript\nCompacto (~10 MB)"]
    E --> F["Expansión Reactiva\nen Tiempo de Carga"]
    F --> G["UI Acordeón 3 Pasos\n(Módulos -> RA/CE -> Actividades)"]
```

---

## 2. Estructura de Entrada en los Documentos Curriculares

Para cada módulo formativo existen dos documentos Markdown sincronizados (uno en castellano `*_ES_*.md` y otro en catalán `*_CA_*.md`), estructurados en dos bloques fundamentales:

### 2.1. Matriz Resumen de Combinaciones
Tabla markdown criterio a criterio que especifica para cada CE propio las combinaciones externas propuestas (típicamente 9 combinaciones por criterio) vinculándolo con hasta 3 CE de otros módulos del curso:

```markdown
| CE del módulo 0845 | Combinaciones externas propuestas | Justificación general |
|---|---|---|
| **0845-1a (RA1. ...)**. Caracteriza útiles... | 1) **0842-2g** (0842-RA2) + **0844-4c** (0844-RA4) + **1664-4b** (1664-RA4)<br>2) ... | Las combinaciones conectan... |
```

### 2.2. Bloques de Actividades Innovadoras DUA
Por cada combinación de la matriz se define una actividad didáctica completa y no redundante:

```markdown
#### Actividad 1.1. Microdemostración contrastada: 0845-1a

**Combinación de CE trabajada:** 0845-1a (RA1. ...) + 0842-2g (0842-RA2) + 0844-4c (0844-RA4) + 1664-4b (1664-RA4).

**CE externos relacionados:**
- **0842-2g · RA2...**: Caracteriza los útiles y herramientas empleados...
- **0844-4c · RA4...**: Selecciona cosméticos para cambios de coloración...
- **1664-4b · RA4...**: Elabora imágenes digitales utilizando herramientas...

**Justificación específica:** esta combinación vincula el criterio 0845-1a con 0842 (RA2)...
**Metodología activa:** Clase invertida y demostración práctica.
**Reto profesional:** aplicar el criterio 0845-1a en una situación realista...
**Desarrollo:** 1. Presentación del caso... 2. Identificación del CE... 3. Lectura... 4. Demostración... 5. Cierre.
**Producto final / evidencia:** Microdemostración contrastada vinculada al CE 0845-1a...
**Medidas DUA específicas:** La demostración se puede consultar en vídeo con pausas y subtítulos...
```

---

## 3. Algoritmo de Bidireccionalidad Curricular

### 3.1. El Principio de Simetría Curricular
En una actividad intermodular que integra aprendizajes de múltiples módulos, el vínculo pedagógico no es unidireccional. Si la actividad $A$ conecta:
$$\text{Origen: } (M_0, CE_0, RA_0) \longleftrightarrow \text{Destinos: } (M_1, CE_1, RA_1), (M_2, CE_2, RA_2), (M_3, CE_3, RA_3)$$

Para que la experiencia docente sea coherente, dicha actividad $A$ debe poder consultarse y planificarse desde **cualquiera** de los 4 módulos involucrados:

1. **Perspectiva $M_0$ (Nativa):**
   - Módulo activo: $M_0$ bajo $RA_0$, filtrado por $CE_0$.
   - Conexión principal: hacia $M_1$ ($RA_1$).
   - Criterios implicados: propios $CE_0$, externos $[CE_1, CE_2, CE_3]$.
   - Actividad: $A$.

2. **Perspectiva $M_1$ (Recíproca 1):**
   - Módulo activo: $M_1$ bajo $RA_1$, filtrado por $CE_1$.
   - Conexión principal: hacia $M_0$ ($RA_0$).
   - Criterios implicados: propios $CE_1$, externos $[CE_0, CE_2, CE_3]$.
   - Actividad: $A$.

3. **Perspectiva $M_2$ (Recíproca 2):**
   - Módulo activo: $M_2$ bajo $RA_2$, filtrado por $CE_2$.
   - Conexión principal: hacia $M_0$ ($RA_0$).
   - Criterios implicados: propios $CE_2$, externos $[CE_0, CE_1, CE_3]$.
   - Actividad: $A$.

4. **Perspectiva $M_3$ (Recíproca 3):**
   - Módulo activo: $M_3$ bajo $RA_3$, filtrado por $CE_3$.
   - Conexión principal: hacia $M_0$ ($RA_0$).
   - Criterios implicados: propios $CE_3$, externos $[CE_0, CE_1, CE_2]$.
   - Actividad: $A$.

---

## 4. Arquitectura de Optimización de Memoria (Zero Heap Crash)

### 4.1. El Reto de Escalabilidad
En un ciclo de Grado Medio (ej. Peluquería):
- **1.er Curso:** 8 módulos $\times$ 40-57 CEs $\times$ 9 actividades = **3.303 actividades únicas**.
- Al aplicar bidireccionalidad cuádruple: $3.303 \times 4 =$ **13.212 referencias de actividad** y **8.429 conexiones**.
- Si se almacena cada objeto completo de actividad (con textos de desarrollo, evidencia, DUA y justificación en ES y CA) de forma duplicada en el archivo `.ts`, el tamaño supera los **75 MB** por archivo.
- Durante la ejecución de tests (Vitest / Karma) con múltiples hilos de trabajo paralelos, Node.js excede el límite de heap V8 (4 GB) lanzando `JavaScript heap out of memory` o superando el límite de strings N-API de Rust.

### 4.2. Solución Arquitectural: Persistencia en MongoDB, Deduplicación y Cero Conexiones Vacías
La solución definitiva consta de tres capas clave:

1. **Persistencia en MongoDB y Servicio REST (Cero Heap Crash en Frontend):**
   En lugar de incrustar semillas gigantes de decenas de megabytes en archivos `.ts` de Angular (que agotaban el heap de Node.js en Vitest y en el build de producción en EC2), los datasets se almacenan como JSON limpios en `backend/src/data/mapa-intermodular/` y se persisten en MongoDB en la colección `mapamodules`. El frontend los recupera bajo demanda vía `MapaIntermodularService.getModules(tab)` con un tiempo de carga instantáneo.

2. **Deduplicación Rigurosa de Actividades y Cero Conexiones Vacías:**
   - **Prohibición de conexiones vacías:** Queda terminantemente prohibido generar conexiones con `activities: []`. Toda conexión del grafo debe ofrecer obligatoriamente al menos una actividad formativa (`activities.length >= 1`). Si un cruce curricular no tiene actividad propuesta, no se instancia en el grafo.
   - **Volumen equilibrado:** Cada Resultado de Aprendizaje (RA) dispone de entre **6 y 15 conexiones intermodulares** (media de ~8 a 12 por RA), evitando la saturación con cientos de tarjetas vacías o redundantes.
   - **Deduplicación por RA:** Cada actividad formativa es única dentro de su RA y módulo por título y desarrollo.

3. **Caché en Cliente y Sanitización Defensiva:**
   La fachada `MapaIntermodularFacade` en el frontend almacena en caché reactiva (`seedCache`) las pestañas consultadas y aplica `sanitizeModules` para garantizar que ninguna conexión huérfana sea procesada en la UI.

### 4.3. Resultado de la Optimización y Deduplicación
| Métrica | Antes (Combinatoria inflada) | Tras Deduplicación y Purga | Mejora |
| :--- | :---: | :---: | :---: |
| **Conexiones Totales (1.er curso)** | 12.514 conexiones | **532 conexiones** | **-95.7%** (Cero vacías) |
| **Conexiones Totales (2.º curso)** | 10.671 conexiones | **412 conexiones** | **-96.1%** (Cero vacías) |
| **Media de Conexiones por RA** | ~266 por RA (250+ vacías) | **11.3 (1º) / 8.8 (2º)** | **Equilibrado y legible** |
| **Tamaño en Disco / Payload JSON** | 37 MB / 30 MB | **4.2 MB / 3.0 MB** | **-89% reducción** |
| **Consumo de RAM en Vitest** | > 4.096 MB (Crash) | < 250 MB | **100% estable** |
| **Tiempo de Carga de Pestaña** | Lento / bloqueante | Instantáneo (< 100 ms) | **Fluido** |

---

## 5. Integración con la Interfaz de Usuario (UI de 3 Pasos)

El componente `mapa-intermodular-view` organiza la navegación en 3 pasos verticales con encabezados sticky:

1. **Paso 1: Módulos y Resultados de Aprendizaje**
   - El docente selecciona el módulo y el RA a trabajar.
   - Filtros rápidos por tipo: *Específicos*, *Comunes*, *Transversales*.
2. **Paso 2: Criterios de Evaluación del RA Activo**
   - Muestra el texto completo del RA y la botonera con los criterios del RA (`a)`, `b)`, `c)`...).
   - Cada botón de criterio muestra una insignia numérica con el conteo exacto de conexiones coincidentes (`facade.getConnectionsCountForCriterion(crit)`).
   - Botón *✕ Ver todos* para restaurar la vista completa.
3. **Paso 3: Conexiones Intermodulares Coincidentes**
   - Renderiza las tarjetas de conexión coincidentes con el criterio seleccionado.
   - Cada tarjeta muestra el módulo y RA destino, los criterios propios y externos implicados, la justificación curricular y las actividades disponibles.
   - **Acción "Crear Proyecto":** El botón en cada tarjeta abre el generador de proyectos preseleccionando automáticamente los RAs del módulo origen y destino.

---

## 6. Alta de una pestaña de mapa (ciclo y curso)

Las pestañas del mapa se declaran en el catálogo de niveles, `backend/src/data/niveles.ts`, en el array `mapas` de cada nivel. Cada entrada fija:
- la pestaña (`tab`), que es el `MapaModule.tab` de MongoDB;
- el curso que cubre, opcional: sin curso, el mapa abarca todo el ciclo, como en Estética o Cuidados Auxiliares;
- el módulo y el RA seleccionados al abrir la pestaña.

De ahí salen `MAPA_TABS` (el enum de `MapaModule` y las pestañas que admite `GET /api/mapa-intermodular`), el selector de ciclo y curso, el título de la cabecera y el nivel y curso con que «Crear proyecto» abre el generador. El frontend no se toca.

Para añadir un ciclo o curso al mapa:
1. Generar el JSON en `backend/src/data/mapa-intermodular/` con la herramienta de la sección 8.
2. Crear una migración que sustituya solo esa pestaña (ver `36_ingest_mapa_cfgm_cuidados_auxiliares_enfermeria.ts`).
3. Añadir la entrada en `mapas` del nivel y actualizar `niveles-catalogo.test.ts` y `mapa.test.ts`.

Ciclos con mapa: CFGB Peluquería y Estética, CFGM Estética y Belleza, CFGM Peluquería y Cosmética Capilar (1.º y 2.º), CFGM Atención a Personas en Situación de Dependencia (1.º y 2.º), CFGM Cuidados Auxiliares de Enfermería, CFGS Educación Infantil (1.º y 2.º), CFGS Acondicionamiento Físico (1.º y 2.º), CFGS Enseñanza y Animación Sociodeportiva (1.º y 2.º) CFGS Integración Social (1.º y 2.º) y CFGS Laboratorio Clínico y Biomédico (1.º). Los pendientes están en [mapas_intermodulares_pendientes.md](mapas_intermodulares_pendientes.md).

El 1.º de Educación Infantil se rehízo en la tarea 191 (migración 19). Se tomaron las relaciones RA↔RA de los documentos de Drive y se redactó una actividad propia por relación, publicada en los dos RA conectados.

## 7. Calidad lingüística y referencias de los mapas

Comprobaciones que debe pasar cualquier mapa antes de ingerirse (aprendidas en las tareas 182–184):
- **Paridad ES/CA de referencias:** los códigos de aprendizaje (`3159-1a`, `3064-4e`…) de un campo `_ca` deben coincidir, en el mismo orden, con los de su pareja `_es`. La traducción automática tiende a convertir la letra «e)» en «i)» y a desplazar numeraciones.
- **Sin texto ajeno:** los campos de actividad (sobre todo `diversitySupport`) no pueden arrastrar fragmentos de otros documentos (notas metodológicas, nombres de archivo `.md`, encabezados de RA).
- **Sin catalanismos en `_es` ni castellano en `_ca`,** incluido el campo heredado `criteria` de `relatedCriteria`, que repite el texto castellano.
- **Criterios oficiales:** el texto de los criterios del mapa debe ser el del currículo oficial (BOE); si el documento de origen lo abrevia, se sustituye por el oficial en ambos idiomas.
- **Coherencia con la colección `ras`:** los textos catalanes de RA y criterios del mapa de FPB salen del mismo fichero que los RA (`backend/src/data/ras_fpb_catalan.data.ts`), para que el mapa y el generador muestren la misma traducción.

## 8. Herramienta de generación: `scripts/mapa-intermodular/`

Desde la tarea 223, los mapas nuevos se generan con `scripts/mapa-intermodular/mapa-intermodular.mts` a partir de un archivo de **relaciones RA↔RA**. Este archivo lo redacta una persona o una IA y el generador lo valida y lo convierte en el JSON del mapa. El modelo que redacta solo escribe lo pedagógico (qué criterios se relacionan y con qué actividad). El generador pone los textos oficiales de RA y criterios, la bidireccionalidad, las claves de filtrado y el formato que espera el frontend.

### 8.1. Flujo

```bash
cd backend
# 1. Ficha curricular (ficha.md, fuera de git) y config.json de módulos
npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts ficha \
  --nivel <NIVEL> --curso <1º|2º> --trabajo ../scripts/mapa-intermodular/fuentes/<TAB>
# 2. Redactar relaciones*.json en esa carpeta
# 3. Validar y generar
npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts construir \
  --nivel <NIVEL> --curso <1º|2º> --trabajo ../scripts/mapa-intermodular/fuentes/<TAB> \
  --salida src/data/mapa-intermodular/<archivo>.json
```

Las fuentes (`config.json` y `relaciones*.json`) se versionan en `scripts/mapa-intermodular/fuentes/<TAB>/`. Así, si se corrige el texto de un RA o un criterio en `ras_*.data.ts`, basta con volver a ejecutar `construir` y crear una migración que recargue la pestaña. La generación es determinista: las mismas fuentes producen el mismo JSON.

### 8.2. Formato de entrada

- **`config.json`**: por módulo, `nombre_es/ca`, `tipo` (`especifico`, `comun` o `transversal`), `relacion` (el `relationType` de las conexiones que **llegan** a ese módulo), `color` e `icon`. `ficha` lo propone con los comunes ya resueltos (0156, 0179, 1664, 1665, 1708-1710 y 1713).
- **`relaciones*.json`**: arrays de relaciones. Cada una tiene `a` y `b` (`{ modulo, ra, criterios: ["a", "c"] }`), `justificacion_es/ca` y `actividades`, con un mínimo de una. Los campos de cada actividad son `titulo`, `contexto`, `desarrollo`, `evidencia`, `dua` y `metodologia`, todos con sufijo `_es` y `_ca`.

Correspondencia con el modelo del mapa: `contexto` → `motivatingFactor`, `desarrollo` → `description`, `evidencia` → `evidence`, `dua` → `diversitySupport` y `metodologia` → `justification` (con el prefijo «Metodología activa:»).

### 8.3. Validaciones (bloquean la escritura)

- Los RA y las letras de criterio existen en el curso; cada lado cita de 1 a 3 criterios y los dos lados son de módulos distintos.
- No hay pares de RA repetidos y cada RA tiene entre 6 y 15 conexiones.
- Hay al menos una actividad por relación, sin títulos repetidos dentro de un RA, ni en ES ni en CA.
- Todos los textos existen en ES y CA, son distintos y no tienen marcas evidentes del otro idioma. El detector usa límites de palabra Unicode, porque `\b` de JavaScript no reconoce letras acentuadas y daba falsos positivos como «con» en «conèixer».
- Las citas de criterios del desarrollo (`0011-1a`, `CAE2-3c`) coinciden en ES y CA y pertenecen a la relación.

- **Redacción propia, no de plantilla** (desde la tarea 225):
  - los títulos no acaban en una palabra funcional («del», «y», «la»…) ni copian criterios («Se ha…»);
  - los desarrollos no pegan el texto de los criterios;
  - como mucho el 5 % de los desarrollos (y nunca más de 4 si son pocos) empieza con las mismas seis palabras;
  - ningún contexto, DUA o evidencia se repite más de esa misma cota.

  Estas reglas se añadieron porque el primer mapa encargado a otro modelo (tarea 224) superaba las comprobaciones estructurales con textos generados por script. Tenía 148 desarrollos idénticos al inicio, 64 títulos cortados y solo 12 contextos y 6 DUA.

Son avisos, que no bloquean: criterios del curso sin ninguna conexión y criterios de la relación que el desarrollo no cita.

### 8.4. Detalles del JSON generado

- Cada relación se publica en los dos RA. Los criterios propios de cada conexión son los de su lado, y `relatedCriteria` contiene solo criterios del módulo destino, con texto oficial ES/CA.
- `sourceCriteria` usa la clave corta `0011-1a`. Si el código del módulo tiene letras (`CAE1`), se omite el prefijo y queda `1a`: el filtro por criterio del frontend (`MapaIntermodularFacade.filteredConnections`) busca la letra dentro de `sourceCriteria`, y la «a», la «c» y la «e» de «CAE» darían coincidencias falsas. `criteriaKeys` lleva siempre las tres formas (`a`, `1a`, `CAE1-1a`).
- Las conexiones de cada RA se ordenan por módulo y RA de destino, en el orden del catálogo.

### 8.5. Encargarlo a otro modelo

`scripts/mapa-intermodular/prompt.md` contiene el prompt completo (ficha, plan, redacción, validación, integración y entrega) para lanzarlo con otro agente, como Gemini con antigravity-cli. La lista de mapas pendientes con sus datos está en [mapas_intermodulares_pendientes.md](mapas_intermodulares_pendientes.md).
