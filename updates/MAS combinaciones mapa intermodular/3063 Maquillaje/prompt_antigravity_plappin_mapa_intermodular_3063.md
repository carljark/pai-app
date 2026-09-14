# TAREA: completar las relaciones del módulo 3063 (ya existente) en el «Mapa intermodular» de Plappin, con relaciones bidireccionales (retroactivas)

## Contexto

Trabajas sobre el proyecto **plappin**, la plataforma de FP que ya dispone de una funcionalidad llamada **«Mapa intermodular»**, que relaciona criterios de evaluación de un módulo con los criterios de evaluación de los demás módulos/asignaturas del ciclo. Esa funcionalidad **ya existe** y **ya contiene el módulo «Maquillaje» (código 3063)**.

**El módulo 3063 NO hay que crearlo: ya está en la plataforma.** El problema es que su información está incompleta: en el mapa actual solo tiene coincidencias con un módulo («Preparación del entorno profesional» 3060), lo que deja sin explotar relaciones valiosas con los demás módulos prácticos, con «Atención al cliente» (3005), con la FCT (3067), con el «Itinerario personal para la empleabilidad» (3159) y, sobre todo, con las asignaturas de Ciencias Aplicadas I y II (3009 y 3042) y Comunicación y Sociedad I y II (3011 y 3012).

Tu trabajo es **incorporar esta nueva información (las coincidencias ampliadas a todos los módulos y las actividades) al módulo 3063 que ya existe**, completando lo que falta y sin alterar nada más de la plataforma.

La información nueva ya está preparada y normalizada en este archivo fuente:

- `Mapa_intermodular_Maquillaje.md` (existe también la versión `.docx` con el mismo contenido).

> Si no tienes acceso a ese archivo, DETENTE y pídemelo: te lo pegaré o adjuntaré antes de continuar. No inventes ni modifiques los datos.

## Qué tienes que hacer

1. **Explora el repositorio** y localiza la funcionalidad «Mapa intermodular» y, dentro de ella, **el módulo 3063 ya existente**: su representación en el modelo de datos (campos, enlaces entre criterios, actividades) y su presentación en la interfaz.
2. **Identifica qué relaciones tiene ya el 3063 y cuáles faltan.** El objetivo es ampliar las relaciones existentes (hoy limitadas a 3060) a todos los módulos del ciclo, **sin borrar ni alterar los datos ya existentes que sean correctos**.
3. **Incorpora los datos del archivo fuente** en el módulo 3063 existente, siguiendo el modelo de datos actual (base de datos, seed, JSON, etc.), no hardcodeados en la interfaz:
   - Completar/reemplazar la matriz de relaciones de 3063 por la versión ampliada del archivo fuente (47 criterios, de RA1 a RA4, con sus relaciones).
   - Añadir/actualizar las 28 actividades intermodulares (7 por RA).
4. **Garantiza la bidireccionalidad (retroactividad)** de las relaciones (ver el apartado específico más abajo).
5. **Verifica** que el módulo 3063 muestra ahora todas sus relaciones y que el resultado es visual y funcionalmente idéntico al del resto de módulos del mapa intermodular.

## Datos a incorporar (estructura del contenido)

El contenido ampliado del módulo 3063 tiene esta forma, que debes mapear al modelo de datos existente:

1. **Matriz criterio a criterio.** 47 criterios de evaluación (RA1 a–i, RA2 a–l, RA3 a–l, RA4 a–n). Cada criterio tiene:
   - Código y texto del criterio del módulo 3063 (p. ej. `3063-3d — Se ha realizado la depilación de cejas corrigiendo su forma, de acuerdo a la configuración del rostro, aplicando las medidas de higiene necesarias.`).
   - Lista de criterios relacionados de otros módulos, cada uno con: código (p. ej. `3062-3g`), nombre del módulo (p. ej. `Depilación mecánica y decoloración del vello superfluo`) y texto del criterio.
   - Justificación de la relación (un párrafo por criterio).

   > **Atención especial:** las relaciones nuevas con «Ciencias Aplicadas I/II» (3009, 3042), «Comunicación y Sociedad I/II» (3011, 3012), los módulos prácticos (3061, 3062, 3064, 3065), «Atención al cliente» (3005), la FCT (3067) y el «Itinerario personal para la empleabilidad» (3159) son las que ahora faltan y deben añadirse a las ya existentes con 3060.

2. **Actividades intermodulares.** 7 actividades por cada RA (28 en total). Cada actividad tiene 6 campos:
   - Título.
   - Contexto / idea motivadora.
   - Desarrollo.
   - Producto / evidencia.
   - Aprendizajes y criterios evaluables (lista de códigos, p. ej. `3063-3d + 3062-3g/3h + 3042-3a/3b + 3061-3f`).
   - Ayudas / pautas DUA.

3. **Módulos del ciclo** que intervienen como origen/destino de las relaciones (usa los nombres exactos):

| Código | Módulo / asignatura |
| --- | --- |
| 3063 | Maquillaje |
| 3060 | Preparación del entorno profesional |
| 3061 | Cuidados estéticos básicos de uñas (manicura/pedicura) |
| 3062 | Depilación mecánica y decoloración del vello superfluo |
| 3064 | Lavado y cambios de forma del cabello |
| 3065 | Cambio de color del cabello |
| 3005 | Atención al cliente |
| 3009 | Ciencias Aplicadas I |
| 3042 | Ciencias Aplicadas II |
| 3011 | Comunicación y Sociedad I |
| 3012 | Comunicación y Sociedad II |
| 3067 | Formación en Centros de Trabajo (FCT) |
| 3159 | Itinerario personal para la empleabilidad |

## Requisito clave: relaciones RETROACTIVAS (bidireccionales)

Las relaciones del mapa intermodular **no tienen una dirección única**. Una relación entre el módulo 3063 y otro módulo (p. ej. `3063-3d ↔ 3062-3g`) debe poder verse **desde cualquiera de los dos lados**:

- Si el usuario navega el mapa desde **«Maquillaje» (3063)**, ve sus relaciones con «Depilación mecánica», «Ciencias Aplicadas I/II», «Comunicación y Sociedad I/II», «Cambio de color», «Cuidados estéticos de uñas», etc.
- Si el usuario navega desde **«Depilación mecánica» (3062)** —o desde cualquier otro módulo—, debe aparecer **la misma relación con el 3063**, sin que el usuario tenga que buscarla a mano ni duplicarla.

Para conseguirlo:

1. **Analiza si el modelo de datos actual es unidireccional o bidireccional.** Si ya es bidireccional (relación simétrica entre dos criterios), limítate a insertar/completar los datos del 3063 y verifica que se ven desde ambos lados.
2. **Si el modelo actual es unidireccional**, implementa la bidireccionalidad de la forma menos invasiva posible y sin cambiar el diseño:
   - Opción A (preferida si no cambia el esquema): al cargar/importar las nuevas relaciones del 3063, genera también las aristas inversas (cada relación `3063-X ↔ MOD-Y` se almacena o se resuelve en ambos sentidos).
   - Opción B: resuelve la simetría en la capa de consulta/servicio (la búsqueda de relaciones de un criterio incluye tanto las relaciones salientes como las entrantes).
   - Elige la opción que respete el esquema existente y las convenciones del proyecto. No introduzcas un sistema paralelo.
3. **Aplica la retroactividad a los módulos ya existentes**: al completar las relaciones del 3063, los módulos de destino (3060, 3061, 3062, 3064, 3065, 3005, 3009, 3042, 3011, 3012, 3067, 3159) deben pasar a mostrar el 3063 entre sus relaciones **sin modificar sus textos, sus criterios ni su apariencia actuales**.
4. **Verifica explícitamente** los dos sentidos (ver «Verificación»).

## Restricciones (obligatorias)

- **No crees un módulo nuevo**: el 3063 ya existe; solo se completan y amplían sus datos.
- **No borres ni alteres** los datos ya existentes del 3063 que sean correctos (sus relaciones actuales con 3060 se conservan y se amplían); solo complétalos con la información nueva del archivo fuente.
- **No cambies el estilo visual** de la plataforma: mismas fuentes, colores, tamaños, espaciados, iconos y componentes.
- **No cambies el formato** de la funcionalidad «Mapa intermodular»: misma maquetación, misma navegación, mismo comportamiento.
- **No alteres ninguna otra característica** de plappin: rutas, menús, diseño de otras secciones, textos existentes, datos ya cargados de otros módulos.
- **Reutiliza** los componentes y el modelo de datos ya existentes; no crees estructuras paralelas.
- **No añadas dependencias nuevas** ni migraciones innecesarias.
- Los textos deben insertarse **literalmente** tal y como están en el archivo fuente (no los parafrasees ni los traduzcas).

## Criterios de aceptación

- El módulo **3063 Maquillaje** que ya existía muestra ahora **sus 47 criterios con todas sus relaciones** (ya no limitadas a 3060, sino ampliadas a Depilación mecánica, Cuidados estéticos de uñas, Lavado y cambios de forma, Cambio de color, Ciencias Aplicadas I/II, Comunicación y Sociedad I/II, Atención al cliente, la FCT y el Itinerario para la empleabilidad) y sus **28 actividades** (7 por RA).
- **Retroactividad**: al abrir cualquier módulo relacionado (p. ej. «Depilación mecánica» 3062, «Ciencias Aplicadas II» 3042, «Ciencias Aplicadas I» 3009, «Comunicación y Sociedad I» 3011, «Cuidados estéticos básicos de uñas» 3061, «Cambio de color del cabello» 3065, «Preparación del entorno profesional» 3060, «Atención al cliente» 3005, la FCT 3067 o «Itinerario personal para la empleabilidad» 3159), aparece su relación con el 3063 en el mismo formato que el resto de sus relaciones.
- El módulo 3063 se ve y se comporta **igual** que los módulos ya existentes en esa sección (solo cambia su contenido, que ahora está completo).
- El resto de la plataforma queda **intacto** (ningún cambio de formato, estilo o funcionalidad).
- Los datos se sirven desde el mismo mecanismo de datos que los demás módulos (no hardcodeados en la UI).

## Verificación (antes de dar por terminada la tarea)

- Levanta la aplicación y navega hasta el «Mapa intermodular» → módulo 3063: confirma que se renderiza correctamente (escritorio y móvil) y que **ya muestra relaciones con más módulos que 3060**.
- **Prueba la bidireccionalidad con casos concretos del archivo fuente**:
  - Desde **3063**, comprueba que aparecen, p. ej., `3063-3d ↔ 3062-3g/3h` (Depilación mecánica), `3063-1b ↔ 3009-7c` (Ciencias Aplicadas I), `3063-3f ↔ 3042-3a` (Ciencias Aplicadas II) y `3063-2k ↔ 3011-4f` (Comunicación y Sociedad I).
  - Desde **Depilación mecánica (3062)**, comprueba que `3062-3g/3h` muestra su relación con `3063-3d`.
  - Desde **Ciencias Aplicadas I (3009)**, comprueba que `3009-7c` muestra su relación con `3063-1b`.
  - Desde **Ciencias Aplicadas II (3042)**, comprueba que `3042-3a` muestra su relación con `3063-3f`.
  - Desde **Comunicación y Sociedad I (3011)**, comprueba que `3011-4f` muestra su relación con `3063-2k`.
  - Repite la comprobación en «Cuidados estéticos básicos de uñas» (3061), en «Cambio de color del cabello» (3065) y en «Preparación del entorno profesional» (3060).
- Compara visualmente el módulo 3063 con otro módulo existente: las únicas diferencias deben ser el contenido completado, no el diseño.
- Confirma que **no se ha duplicado** el módulo 3063 ni se han perdido las relaciones que ya tenía con 3060.
- Ejecuta la suite de tests existente y confirma que todo sigue en verde. Añade tests solo si la plataforma ya los usa y siguiendo su misma convención.
- Haz una revisión de diff: no debe haber cambios en archivos ajenos a la actualización del módulo 3063 y a la habilitación de las relaciones bidireccionales.
- Si algo del archivo fuente no encaja en el modelo de datos actual, repórtalo con una propuesta de mapeo en lugar de improvisar.
