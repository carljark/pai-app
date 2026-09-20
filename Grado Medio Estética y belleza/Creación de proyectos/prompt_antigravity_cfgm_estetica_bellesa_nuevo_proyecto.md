# Prompt para Antigravity — Añadir nueva sección “CFGM Estètica i Bellesa” en “Nuevo proyecto”

Necesito añadir a la plataforma **Plappin** una nueva titulación en el apartado **“Nuevo proyecto”**, manteniendo exactamente el funcionamiento actual de creación de proyectos que ya existe para **FP Básica**.

## Objetivo

Crear una nueva sección/titulación llamada:

**CFGM Estètica i Bellesa**

Esta nueva sección debe aparecer **después de “FP básica”** en el flujo o listado del apartado **“Nuevo proyecto”**.

De momento, **no hay que hacer cambios en ningún otro sitio de la plataforma**.

---

## 1. Ubicación en la interfaz

En el apartado **“Nuevo proyecto”**, donde actualmente aparece la opción **FP básica**, añadir justo después una nueva opción:

- **FP básica**
- **CFGM Estètica i Bellesa**

La nueva sección debe integrarse respetando el diseño, estructura visual, componentes, estilos, comportamiento y lógica de navegación existentes.

No crear una interfaz nueva si no es necesario. Reutilizar los mismos componentes que se usan actualmente para FP Básica.

---

## 2. Funcionamiento esperado

La sección **CFGM Estètica i Bellesa** debe permitir crear proyectos **exactamente igual que hasta ahora en FP Básica**.

Esto significa que los proyectos creados dentro de esta nueva sección deben conservar las mismas características funcionales que los proyectos actuales:

- selección de titulación o familia;
- selección de módulos;
- selección de RA;
- selección de criterios de evaluación;
- creación de proyecto;
- edición del proyecto;
- guardado;
- visualización;
- estructura de datos equivalente;
- mismas validaciones;
- mismo flujo de usuario;
- misma lógica de formularios;
- misma experiencia de creación que en FPB.

No modificar el comportamiento actual de FP Básica.

La nueva sección debe ser una ampliación, no una sustitución.

---

## 3. Alcance limitado

En esta intervención **solo** hay que añadir la nueva titulación en **“Nuevo proyecto”**.

No hacer cambios todavía en:

- Mapa intermodular.
- Banco de actividades.
- Vista de edición avanzada.
- Estadísticas.
- Paneles de administración.
- Exportaciones.
- Otras titulaciones.
- FP Básica ya existente.
- Traducciones no relacionadas.
- Lógica global de proyectos que no sea necesaria para añadir esta nueva sección.

Si para que funcione “Nuevo proyecto” es necesario añadir datos curriculares o seeds, hacerlo únicamente para esta titulación y sus módulos, sin alterar el resto.

---

## 4. Nombre exacto de la nueva sección

Usar exactamente este nombre en catalán:

**CFGM Estètica i Bellesa**

No usar:

- “Estética y Belleza”
- “Estètica i bellesa” con minúscula en “Bellesa”
- “Grau mitjà Estètica i Bellesa”
- “CFGM Estética y Belleza”
- “Ciclo Formativo de Grado Medio Estética y Belleza”

El nombre visible en la interfaz debe ser:

**CFGM Estètica i Bellesa**

---

## 5. Idioma y traducción

La plataforma debe mantener la **versión en catalán correcta y completa**.

En esta nueva sección, los textos visibles deben estar en catalán.

Usar la denominación catalana de los módulos:

1. **0633. Tècniques d’higiene facial i corporal**
2. **0635. Depilació mecànica i decoloració del borrissol**
3. **0636. Estètica de mans i peus**
4. **0638. Anàlisi estètica**
5. **0640. Imatge corporal i hàbits saludables**
6. **0641. Cosmetologia per a estètica i bellesa**
7. **1664. Digitalització aplicada als sectors productius**
8. **1709. Itinerari personal per a l’ocupabilitat I**
9. **0156. Anglès professional**

Si la plataforma tiene sistema i18n, añadir las claves necesarias en catalán. No romper la versión castellana existente. Si no existe traducción castellana para esta nueva titulación, dejar preparada la estructura pero priorizar que la versión catalana sea completa y correcta.

---

## 6. Contexto del alumnado

Tener en cuenta que esta titulación corresponde a alumnado de **CFGM**, no de FP Básica.

Perfil orientativo:

- alumnado de unos **17 años**;
- primer curso de Grado Medio;
- ciclo de la familia profesional de **Imagen Personal**;
- intereses vinculados a estética, belleza, imagen corporal, cosmética, higiene facial y corporal, manos y pies, depilación, hábitos saludables, atención al cliente y comunicación profesional;
- nivel de autonomía superior al de FPB, pero manteniendo una interfaz clara, guiada y usable.

Esto no implica cambiar el funcionamiento técnico de los proyectos, pero sí debe tenerse en cuenta en textos descriptivos, ejemplos, placeholders o etiquetas si aparecen en esta nueva sección.

---

## 7. Curso que se ofrece actualmente

Este curso 2026-2027 solo se ofrece **primer curso** de la titulación.

Por tanto, dentro de **CFGM Estètica i Bellesa**, cargar únicamente los módulos de **1r curso**:

| Código | Módulo |
|---|---|
| 0633 | Tècniques d’higiene facial i corporal |
| 0635 | Depilació mecànica i decoloració del borrissol |
| 0636 | Estètica de mans i peus |
| 0638 | Anàlisi estètica |
| 0640 | Imatge corporal i hàbits saludables |
| 0641 | Cosmetologia per a estètica i bellesa |
| 1664 | Digitalització aplicada als sectors productius |
| 1709 | Itinerari personal per a l’ocupabilitat I |
| 0156 | Anglès professional |

No añadir módulos de segundo curso todavía.

---

## 8. Datos curriculares

Para esta primera intervención, la nueva sección debe permitir seleccionar los módulos anteriores con sus correspondientes:

- Resultats d’aprenentatge / RA.
- Criteris d’avaluació.

Los RA y criterios deben cargarse con la **versión catalana correcta y completa**.

Importante:

- Mantener la numeración oficial de los RA.
- Mantener la estructura de criterios por letras: a), b), c), etc.
- No inventar RA.
- No inventar criterios.
- No mezclar módulos del CFGM con módulos de FP Básica.
- No reutilizar criterios del módulo 3159 de FP Básica en el módulo 1709.
- No confundir **1664 Digitalització aplicada als sectors productius** con otros módulos digitales.
- No confundir **0156 Anglès professional** con módulos antiguos de inglés si la plataforma conserva datos previos.

---

## 9. Comportamiento de creación de proyectos

Al crear un proyecto dentro de **CFGM Estètica i Bellesa**, debe comportarse igual que FPB:

1. El usuario entra en **Nuevo proyecto**.
2. Selecciona **CFGM Estètica i Bellesa**.
3. Ve los módulos disponibles de primer curso.
4. Selecciona uno o varios módulos.
5. Ve los RA correspondientes a esos módulos.
6. Selecciona los RA.
7. Ve los criterios de evaluación correspondientes.
8. Selecciona criterios.
9. Crea el proyecto.
10. El proyecto queda guardado con la misma estructura y funcionalidades que los proyectos de FPB.

El resultado debe ser compatible con el modelo de datos existente para proyectos.

---

## 10. Estructura de datos recomendada

Si existe una estructura similar para FP Básica, reutilizarla.

Crear una nueva entrada de titulación, por ejemplo:

```ts
{
  id: "cfgm-estetica-bellesa",
  name: "CFGM Estètica i Bellesa",
  level: "CFGM",
  family: "Imatge Personal",
  course: "1r",
  academicYear: "2026-2027",
  studentAgeApprox: 17,
  modules: [
    {
      code: "0633",
      name: "Tècniques d’higiene facial i corporal",
      course: 1,
      ra: [...]
    },
    {
      code: "0635",
      name: "Depilació mecànica i decoloració del borrissol",
      course: 1,
      ra: [...]
    },
    {
      code: "0636",
      name: "Estètica de mans i peus",
      course: 1,
      ra: [...]
    },
    {
      code: "0638",
      name: "Anàlisi estètica",
      course: 1,
      ra: [...]
    },
    {
      code: "0640",
      name: "Imatge corporal i hàbits saludables",
      course: 1,
      ra: [...]
    },
    {
      code: "0641",
      name: "Cosmetologia per a estètica i bellesa",
      course: 1,
      ra: [...]
    },
    {
      code: "1664",
      name: "Digitalització aplicada als sectors productius",
      course: 1,
      ra: [...]
    },
    {
      code: "1709",
      name: "Itinerari personal per a l’ocupabilitat I",
      course: 1,
      ra: [...]
    },
    {
      code: "0156",
      name: "Anglès professional",
      course: 1,
      ra: [...]
    }
  ]
}
```

Adaptar los nombres de campos al modelo real del proyecto.

---

## 11. Orden de visualización de los módulos

Mostrar los módulos en este orden:

1. **0633. Tècniques d’higiene facial i corporal**
2. **0635. Depilació mecànica i decoloració del borrissol**
3. **0636. Estètica de mans i peus**
4. **0638. Anàlisi estètica**
5. **0640. Imatge corporal i hàbits saludables**
6. **0641. Cosmetologia per a estètica i bellesa**
7. **1664. Digitalització aplicada als sectors productius**
8. **1709. Itinerari personal per a l’ocupabilitat I**
9. **0156. Anglès professional**

No ordenar alfabéticamente si eso altera este orden inicial.

---

## 12. Validaciones

Añadir validaciones para garantizar que:

- La opción **CFGM Estètica i Bellesa** aparece después de **FP básica**.
- La opción abre correctamente el flujo de creación de proyecto.
- Se muestran solo los módulos de primer curso indicados.
- Cada módulo muestra sus RA.
- Cada RA muestra sus criterios de evaluación correspondientes.
- Se puede crear un proyecto seleccionando criterios de uno o varios módulos.
- El proyecto se guarda con la misma estructura que los proyectos FPB.
- El proyecto se puede volver a abrir y editar.
- No se rompe la creación de proyectos de FP Básica.
- No se modifica el mapa intermodular.
- No se modifica ninguna otra titulación o módulo.
- La versión catalana queda completa.
- No aparecen textos en castellano dentro de esta nueva sección si la interfaz está en catalán.

---

## 13. Tests o comprobaciones recomendadas

Realizar, como mínimo, estas comprobaciones:

### Test 1 — Aparición de la nueva titulación

- Ir a **Nuevo proyecto**.
- Comprobar que aparece:
  - FP básica
  - CFGM Estètica i Bellesa
- Confirmar que **CFGM Estètica i Bellesa** aparece después de **FP básica**.

### Test 2 — Carga de módulos

- Seleccionar **CFGM Estètica i Bellesa**.
- Confirmar que aparecen exactamente los 9 módulos de primer curso.
- Confirmar que no aparecen módulos de segundo curso.

### Test 3 — Carga de RA y criterios

- Seleccionar cada módulo.
- Confirmar que se muestran sus RA.
- Confirmar que cada RA despliega sus criterios de evaluación.
- Confirmar que los textos están en catalán.

### Test 4 — Creación de proyecto

- Crear un proyecto de prueba con:
  - un módulo profesional específico, por ejemplo **0633**;
  - un módulo transversal, por ejemplo **1709**;
  - varios RA y criterios.
- Guardar el proyecto.
- Volver a abrirlo.
- Confirmar que los datos se mantienen correctamente.

### Test 5 — No regresión FPB

- Crear un proyecto en **FP básica** como antes.
- Confirmar que no se ha roto nada del flujo anterior.

---

## 14. Criterios de aceptación

La tarea estará completada cuando:

1. Exista una nueva sección visible llamada exactamente **CFGM Estètica i Bellesa**.
2. Aparezca en **Nuevo proyecto** después de **FP básica**.
3. Permita crear proyectos con el mismo flujo y características que FPB.
4. Incluya únicamente los 9 módulos de primer curso indicados.
5. Cada módulo tenga sus RA y criterios de evaluación correctos.
6. Los textos de la nueva sección estén en catalán correcto y completo.
7. Se mantenga la estructura actual de proyectos.
8. No se modifique ningún otro apartado de la plataforma.
9. No se toque todavía el mapa intermodular.
10. No se rompa FP Básica.
11. Se tenga en cuenta que el alumnado destinatario tiene aproximadamente **17 años**.
12. Se hayan actualizado, si procede, seeds, fixtures, constantes, tipos o archivos de traducción necesarios.
13. Se hayan ejecutado las comprobaciones básicas sin errores.

---

## 15. No hacer

- No modificar el apartado **Mapa intermodular** todavía.
- No añadir relaciones intermodulares para CFGM en esta tarea.
- No cambiar la lógica de FP Básica.
- No sustituir FP Básica por CFGM.
- No añadir módulos de segundo curso.
- No inventar RA ni criterios.
- No dejar textos curriculares en castellano en la interfaz catalana.
- No crear una experiencia distinta de creación de proyectos.
- No cambiar estilos globales si no es imprescindible.
- No hacer refactors grandes no relacionados.
- No mezclar datos de FPB con datos de CFGM.

---

## 16. Resultado esperado

Al finalizar, Plappin debe permitir que, desde **Nuevo proyecto**, el usuario pueda elegir:

**CFGM Estètica i Bellesa**

y crear proyectos para los módulos de primer curso del ciclo, con RA y criterios de evaluación en catalán, manteniendo exactamente el mismo funcionamiento que ya existe para **FP Básica**.
