# Lecciones Aprendidas: Cobertura y Gestión Bilingüe en CFGM

Este documento recoge las lecciones críticas identificadas durante la implementación de los ciclos de **CFGM Estética y Belleza** y **CFGM Peluquería y Cosmética Capilar**.

---

## 1. La Trampa del "Fallback Monolingüe" (Lección de la Tarea 121)

### El problema identificado
Al crear un archivo de datos curriculares (`ras_cfgm_<slug>.data.ts`), es común que el asistente extraiga los datos de una sola fuente (habitualmente en catalán) y copie temporalmente los mismos valores en `module_es`, `description_es` y `criterios_es`.

**Consecuencias observadas:**
1. Cuando el usuario cambia la aplicación al idioma **Castellano** ("ES"), la interfaz sigue mostrando los módulos, RAs y criterios en catalán.
2. Si el generador de proyectos (`project.controller.ts`) tiene `targetCourseDescription` con el nombre en catalán forzado, los prompts de IA reciben instrucciones inconsistentes cuando el usuario solicita proyectos en castellano.
3. Si el Mapa Intermodular solo se genera a partir de los archivos en catalán, la mitad de los usuarios experimenta una interfaz rota en el idioma seleccionado.

### Directriz obligatoria
1. **Doble extracción de fuentes:**
   - La rama `_es` debe extraerse **textualmente de los Reales Decretos del BOE** (`lista_RA_CE_..._ES_...md`).
   - La rama `_ca` debe extraerse de los currículos autonómicos de FP Illes Balears / CAIB o traducirse con rigor normativo balear.
2. **Mapeo reactivo en el Facade:**
   En `curriculum.facade.ts`, la señal computada `groupedItems` debe normalizar reactivamente los elementos según la señal `isCa`:
   ```typescript
   list = list.map(r => ({
     ...r,
     module: isCa ? ((r as any).module_ca || r.module) : ((r as any).module_es || r.module),
     subject: isCa ? ((r as any).module_ca || r.subject || r.module) : ((r as any).module_es || r.subject || r.module),
     description: isCa ? ((r as any).description_ca || r.description) : ((r as any).description_es || r.description),
     criterios: isCa ? ((r as any).criterios_ca || (r as any).criterios) : ((r as any).criterios_es || (r as any).criterios)
   } as any));
   ```
   Esto asegura que tanto si los RAs provienen de la API de base de datos como si provienen de la semilla estática, el idioma activo se respete siempre al 100%.

---

## 2. Cobertura de Funciones en Plantillas HTML (Angular v22)

En este proyecto, `check-coverage.js` impone un umbral mínimo estricto del **80% de cobertura de funciones** en todos los archivos `.component.html`.

### Causa raíz
En Angular v22 con la nueva sintaxis de control de flujo (`@if`, `@for`):
1. Cada enlace de evento `(click)="setTab('CFGM_<SLUG>')"` compila a una función JavaScript interna generada por el compilador de plantillas.
2. Cada directiva `@for (...; track ...)` compila a una función de seguimiento.
3. Si en un test unitario (`.spec.ts`) solo se invoca el método TypeScript directamente (ej. `component.setTab('CFGM_<SLUG>')`), **la función compilada de la plantilla NUNCA se ejecuta**.
4. Al añadir un nuevo botón tab sin hacer clic en él en el DOM, el total de funciones aumenta y el porcentaje cae por debajo del 80%, haciendo fallar `check-coverage.js`.

### Solución obligatoria
En `mapa-intermodular-view.component.spec.ts`, simular siempre eventos de clic sobre los botones del DOM real:
```typescript
const tabBtns = fixture.nativeElement.querySelectorAll('.mapa-tab-btn') as NodeListOf<HTMLButtonElement>;
// Simular el clic en el botón del nuevo ciclo formativo
tabBtns[indice].click();
fixture.detectChanges();
expect(component.facade.activeTab()).toBe('CFGM_<SLUG>');
```
Y verificar títulos en ambos idiomas con `headerExpanded.set(true)`:
```typescript
// Castellano
expect(fixture.nativeElement.textContent).toContain('CFGM <Nombre ES>');
// Catalán
component.layout.language.set('catalan');
fixture.detectChanges();
expect(fixture.nativeElement.textContent).toContain('CFGM <Nombre CA>');
```

---

## 3. Rigor Lingüístico Catalán Balear para FP

Todo contenido curricular debe respetar las siguientes normas lingüísticas:
1. **Terminología sectorial balear:**
   - Usar *cabell* (no *pelo* ni *cabello*), *tisores* (no *tijeras*), *eines* (no *herramientas*), *esbós* (no *boceto*), *tasca* (no *tarea*), *màrqueting* (no *marketing*), *desplaçament* (no *desplazament*), *enllaç* (no *enlace*).
2. **Estructura de criterios:**
   - En catalán deben comenzar con la fórmula normativa: `a) S'ha...`, `b) S'han...` (en lugar de `Se ha...`).
3. **Puntuación:**
   - En catalán NO existen los signos de interrogación o exclamación invertidos (`¿` o `¡`). Solo se usan `?` y `!`.

---

## 4. Emparejamiento de Archivos en el Mapa Intermodular

Para cada módulo de 1.er curso existen dos archivos complementarios:
- `mapa_intermodular_<cod>_<slug>_ES_mismo_curso_variedad.md`
- `mapa_intermodular_<cod>_<slug>_CA_mateix_curs_varietat.md`

Ambos archivos comparten exactamente la misma cantidad de filas en las tablas y los mismos bloques de actividades (`Actividad X.Y` en ES / `Activitat X.Y` en CA). Al construir la semilla, procesar ambos ficheros en paralelo asociando cada bloque por su índice `X.Y` para garantizar una simetría bilingüe perfecta en `activities` y `connections`.
