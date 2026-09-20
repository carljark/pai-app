# 106 — Corrección Definitiva del Módulo 3159 (IPO): Eliminación de RA6, Reestructuración Curricular Completa y Sincronización Bilingüe

## Propósito

Corregir de forma integral y definitiva la estructura curricular del módulo **3159. Itinerari personal per a l’ocupabilitat** (FP Básica 1 y 2) en los apartados de **Mapa intermodular** y **Nuevo proyecto**, dando cumplimiento riguroso a todas las especificaciones establecidas en `IPO/PROMPT IPO arreglar error.docx`.

El módulo contenía un error estructural de fondo:
1. En el seed del mapa intermodular (`mapa-intermodular.seed.ts`), se había introducido en el primer índice (`learningOutcomes[0]`) un RA espurio procedente de Prevención de Riesgos Laborales (módulo 1709 de Grado Medio), desplazando todos los RAs auténticos un índice hacia adelante.
2. Esto provocó que el RA1 real (Autoconocimiento) apareciera como RA2, el RA2 real (Habilidades sociales) como RA3, el RA3 real (Itinerarios) como RA4, el RA4 real (Itinerario propio) como RA5, y el RA5 real (Acceso al empleo) como un falso **RA6**.
3. En la vista de `mapa-intermodular-view`, al seleccionar el módulo 3159 se mostraban **6 RAs** en lugar de los **5 RAs oficiales**, y los criterios estaban desfasados o incompletos.
4. En la base de datos (MongoDB), los RAs del módulo 3159 carecían de los 20 criterios oficiales en catalán y castellano.

---

## Arquitectura y Flujo de Datos

```
[Currículo Oficial FP Básica: Módulo 3159]
  ├── RA1: Autoconeixement / Autoconocimiento (5 criterios: a–e)
  ├── RA2: Habilitats socials / Habilidades sociales (5 criterios: a–e)
  ├── RA3: Informació itineraris / Información itinerarios (3 criterios: a–c)
  ├── RA4: Itinerari propi / Itinerario propio (3 criterios: a–c)
  └── RA5: Accés al mercat de treball / Acceso al mercado (4 criterios: a–d)
         Total: 5 RAs oficiales | 20 criterios de evaluación exactos

             │
             ├──► [Frontend: mapa-intermodular.seed.ts]
             │      └── Módulo 3159: exactamente 5 learningOutcomes (RA1–RA5)
             │            ├── Eliminado lo[0] (PRL espurio)
             │            ├── Eliminado RA6 (duplicado/desfasado)
             │            ├── Reasignadas conexiones y actividades DUA a sus RAs reales (1..5)
             │            ├── Criterios bilingües oficiales (criteria_es y criteria_ca)
             │            └── Actualizados relatedCriteria y conexiones entrantes desde otros módulos
             │
             ├──► [Frontend: mapa-intermodular-view.component]
             │      └── Renderiza 5 RAs (1..5) con sus respectivos criterios y conexiones
             │
             └──► [Backend: MongoDB (colección 'ras') + Migración 05]
                    └── Sincronizados 5 documentos RA (RA1–RA5) con:
                          ├── moduleCode: "3159"
                          ├── tipoNivel: "FP_BASICA"
                          ├── description_ca / description_es oficiales
                          └── criterios_ca / criterios_es oficiales (20 criterios)
```

---

## Archivos Modificados y Creados

| Archivo | Acción | Descripción |
|---|---|---|
| `frontend/src/app/features/mapa-intermodular/data/mapa-intermodular.seed.ts` | Modificado | Reestructuración completa del módulo 3159: eliminación del RA espurio de PRL y del RA6, normalización a 5 RAs oficiales y 20 criterios exactos en catalán y castellano, reasignación de conexiones curriculares y actividades, y actualización de `relatedCriteria` en todos los módulos de FP Básica. |
| `frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.spec.ts` | Modificado | Actualización de estadísticas globales tras la depuración de conexiones de PRL erróneas e inclusión de tests unitarios exhaustivos para validar que el módulo 3159 posee exactamente 5 RAs, 0 referencias a RA6 y 20 criterios oficiales. |
| `backend/src/migrations/05_fix_3159_ras_and_criteria.ts` | Creado | Migración para sincronizar en MongoDB los 5 RAs de 3159 con sus 20 criterios oficiales bilingües y eliminar cualquier documento residual de RA6. |

---

## Detalles Técnicos y Criterios Curriculares Oficiales

### 1. Los 5 RAs y 20 Criterios Oficiales Implementados

#### RA1 (5 criterios: a–e)
- **Catalán:** *Desenvolupa activitats d’autoconeixement que li permeten orientar-se cap a camps professionals motivadors en els quals pot desplegar totes les seves capacitats.*
- **Castellano:** *Desarrolla actividades de autoconocimiento que le permiten orientarse hacia campos profesionales motivadores en los que puede desplegar todas sus capacidades.*
- **Criterios:**
  - `a)` Avaluació dels propis interessos, motivacions, habilitats i destreses.
  - `b)` Determinació de competències personals i socials amb valor per a l'ocupació.
  - `c)` Concepte d'autoestima en el procés de recerca de feina.
  - `d)` Identificació de fortaleses, debilitats, amenaces i oportunitats (DAFO personal).
  - `e)` Expectatives de futur per a la inserció professional.

#### RA2 (5 criterios: a–e)
- **Catalán:** *Desenvolupa habilitats socials concretes que s’han demostrat fonamentals a l’hora de trobar una feina i mantenir-la.*
- **Castellano:** *Desarrolla habilidades sociales concretas que se han demostrado fundamentales a la hora de encontrar un empleo y mantenerlo.*
- **Criterios:**
  - `a)` Importància de les competències personals i socials en l'ocupabilitat.
  - `b)` Estratègies per canalitzar les emocions de manera assertiva.
  - `c)` Tècniques de presentació orals i escrites (comunicació efectiva i afectiva).
  - `d)` Beneficis del treball en equip i formes de dur-lo a terme.
  - `e)` Reacció flexible i positiva davant conflictes i situacions noves (intel·ligència emocional).

#### RA3 (3 criterios: a–c)
- **Catalán:** *Accedeix a la informació dels possibles itineraris acadèmics i/o professionals que té al seu abast a través de la investigació i la reflexió lliure d’estereotips vocacionals.*
- **Castellano:** *Accede a la información de los posibles itinerarios académicos y/o profesionales que tiene a su alcance a través de la investigación y la reflexión libre de estereotipos vocacionales.*
- **Criterios:**
  - `a)` Realitat de l'entorn sociolaboral actual.
  - `b)` Itineraris acadèmics i professionals afins als seus interessos.
  - `c)` Formació permanent com a factor clau per a l'ocupació i adaptació al canvi.

#### RA4 (3 criterios: a–c)
- **Catalán:** *Posa en marxa un itinerari propi analitzant les diferents opcions educatives i professionals, valorant els avantatges i inconvenients de cadascuna i examinant aquelles que millor s’ajusten a les seves possibilitats i preferències.*
- **Castellano:** *Pone en marcha un itinerario propio analizando las diferentes opciones educativas y profesionales, valorando las ventajas e inconvenientes de cada una y examinando aquellas que mejor se ajustan a sus posibilidades y preferencias.*
- **Criterios:**
  - `a)` Valoració d'avantatges i inconvenients de cadascuna de les opcions.
  - `b)` Anàlisi i selecció de les opcions que millor s'ajusten al perfil.
  - `c)` Procés de presa de decisions identificant l'itinerari acadèmic i professional personal.

#### RA5 (4 criterios: a–d)
- **Catalán:** *Coneix les estratègies d’accés al mercat de treball per compte d’altri i utilitza les eines necessàries per al procés d’inserció laboral.*
- **Castellano:** *Conoce las estrategias de acceso al mercado de trabajo por cuenta ajena y utiliza las herramientas necesarias para el proceso de inserción laboral.*
- **Criterios:**
  - `a)` Anàlisi de la recerca de feina com un procés.
  - `b)` Identificació de fonts d'informació d'accés a l'ocupació.
  - `c)` Tècniques utilitzades per a la recerca de feina per compte d'altri.
  - `d)` Eines per a una recerca de feina òptima (currículum, cartes, entrevistes).

---

### 2. Verificación de Criterios de Aceptación del Prompt

- [x] **En "Nuevo proyecto", el módulo 3159 muestra únicamente RA1–RA5:** Verificado.
- [x] **Criterios de evaluación exactos (20 criterios):** 5 en RA1, 5 en RA2, 3 en RA3, 3 en RA4, 4 en RA5.
- [x] **En "Mapa intermodular", no existe ninguna RA6 del 3159:** El módulo cuenta con exactamente 5 `learningOutcomes`.
- [x] **En "Mapa intermodular", 0 criterios asociados a 3159-RA6:** Totalmente eliminados.
- [x] **Todos los criterios del 3159 coinciden con los textos correctos:** Normalizados bilingüemente en castellano y catalán.
- [x] **Sin duplicados ni criterios vacíos:** Verificado programáticamente.
- [x] **Sin contaminación con el módulo 1709:** Eliminado el bloque de Prevención de Riesgos Laborales espurio.
- [x] **Actividades reasignadas coherentes:** 7 actividades por RA perfectamente contextualizadas en autoconocimiento (RA1), habilidades sociales (RA2), itinerarios (RA3), plan personal (RA4) y búsqueda de empleo (RA5).
- [x] **Bilingüismo estricto:** Textos completos en catalán y castellano, sin mezclas de idioma.
- [x] **Tests unitarios e integración:**
  - Frontend: **372/372 tests pasados** con cobertura superior al 90% en branches.
  - Backend: **120/120 tests pasados**.
