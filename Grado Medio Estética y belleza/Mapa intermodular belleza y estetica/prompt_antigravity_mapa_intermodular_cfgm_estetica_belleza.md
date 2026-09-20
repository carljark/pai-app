# Prompt para Antigravity

Necesito modificar la aplicación **sin cambiar nada más de lo que se indica**.

## Objetivo

En la sección **“Mapa intermodular”**, incorpora las coincidencias/interrelaciones del **CFGM de Estética y Belleza** añadiendo una nueva pestaña a continuación de la pestaña existente de **FPB**.

La nueva pestaña debe permitir consultar el mapa intermodular del **Grado Medio en Estética y Belleza** con el mismo funcionamiento, diseño y lógica que ya tiene la pestaña de FPB.

---

## Instrucción principal

Añade una nueva pestaña dentro de la sección **“Mapa intermodular”**:

- En castellano: **“CFGM Estética y Belleza”**
- En catalán: **“CFGM Estètica i Bellesa”**

Debe aparecer **justo a continuación de la pestaña de FPB**.

No elimines, sustituyas ni modifiques la pestaña de FPB. Solo añade esta nueva pestaña.

---

## Funcionalidad esperada

La nueva pestaña debe tener **exactamente las mismas funciones que la pestaña de FPB** dentro del mapa intermodular.

Debe mantener el diseño ya existente basado en:

- bloques o tarjetas colapsables/desplegables;
- organización por módulos;
- visualización de resultados de aprendizaje;
- visualización de criterios de evaluación;
- relaciones o coincidencias intermodulares;
- posibilidad de consultar la información de manera clara y ordenada;
- mismo comportamiento visual, responsive y de interacción que la pestaña ya existente.

No crees un diseño nuevo. Reutiliza el patrón visual, los componentes y la lógica que ya usa la pestaña de FPB.

---

## Contenido que debe incorporarse

La nueva pestaña debe incorporar el mapa intermodular correspondiente al **CFGM Estética y Belleza, 1.er curso**.

Los módulos que deben aparecer son:

1. **0633. Técnicas de higiene facial y corporal**  
   Catalán: **0633. Tècniques d’higiene facial i corporal**

2. **0635. Depilación mecánica y decoloración del vello**  
   Catalán: **0635. Depilació mecànica i decoloració del borrissol**

3. **0636. Estética de manos y pies**  
   Catalán: **0636. Estètica de mans i peus**

4. **0638. Análisis estético**  
   Catalán: **0638. Anàlisi estètica**

5. **0640. Imagen corporal y hábitos saludables**  
   Catalán: **0640. Imatge corporal i hàbits saludables**

6. **0641. Cosmetología para estética y belleza**  
   Catalán: **0641. Cosmetologia per a estètica i bellesa**

7. **1664. Digitalización aplicada a los sectores productivos**  
   Catalán: **1664. Digitalització aplicada als sectors productius**

8. **1709. Itinerario personal para la empleabilidad I**  
   Catalán: **1709. Itinerari personal per a l’ocupabilitat I**

9. **0156. Inglés profesional**  
   Catalán: **0156. Anglès professional**

---

## Estructura de la información

Para cada módulo debe poder consultarse:

1. Código del módulo.
2. Nombre del módulo.
3. Resultados de aprendizaje.
4. Criterios de evaluación.
5. Coincidencias o relaciones intermodulares con otros módulos.
6. Actividades o propuestas intermodulares asociadas, si la estructura actual de la aplicación ya las contempla.

La información debe organizarse con el mismo modelo de bloques colapsables que ya existe en la sección de FPB.

Ejemplo de estructura deseada:

- Bloque colapsable del módulo.
  - Resultados de aprendizaje.
    - Criterios de evaluación.
  - Coincidencias intermodulares.
    - Módulos relacionados.
    - Criterios relacionados.
    - Justificación de la relación.
    - Actividades asociadas, si procede.

No mezcles todos los módulos en un único bloque plano. Debe conservarse una navegación clara por módulos, RA y criterios.

---

## Datos de origen

Usa como base los documentos Markdown ya preparados para el CFGM de Estética y Belleza. Son los mapas intermodulares revisados, con combinaciones focalizadas y medidas DUA específicas.

Archivos de referencia:

- `mapa_intermodular_0633_estetica_bellesa_revisat_dua_especific.md`
- `mapa_intermodular_0635_estetica_bellesa_revisat_dua_especific.md`
- `mapa_intermodular_0636_estetica_bellesa_revisat_dua_especific.md`
- `mapa_intermodular_0638_estetica_bellesa_revisat_dua_especific.md`
- `mapa_intermodular_0640_estetica_bellesa_revisat_dua_especific.md`
- `mapa_intermodular_0641_estetica_bellesa_revisat_dua_especific.md`
- `mapa_intermodular_1664_estetica_bellesa_revisat_dua_especific.md`
- `mapa_intermodular_1709_estetica_bellesa_revisat_dua_especific.md`
- `mapa_intermodular_0156_estetica_bellesa_revisat_dua_especific.md`

Si la aplicación no puede leer directamente archivos Markdown en tiempo de ejecución, transforma su contenido a la estructura de datos que ya use la aplicación para FPB.

Mantén la misma arquitectura de datos que ya exista. No inventes una arquitectura nueva si ya hay una estructura para FPB.

---

## Criterio pedagógico de las relaciones

Las relaciones del CFGM deben respetar estas condiciones:

- Cada combinación intermodular debe estar centrada en un módulo principal.
- Cada actividad o combinación debe relacionar el módulo principal con **solo dos o, como máximo, tres criterios de evaluación de otros módulos**.
- No deben generarse combinaciones excesivamente amplias que mezclen muchos módulos a la vez.
- Deben conservarse las justificaciones pedagógicas y profesionales.
- Las actividades deben tener un enfoque práctico, motivador y profesionalizador para alumnado de unos 16-17 años.
- Las medidas DUA e inclusión deben ser específicas de cada actividad, no genéricas ni repetidas.

---

## Idiomas e internacionalización

La aplicación tiene dos versiones lingüísticas:

- castellano;
- catalán.

El usuario elige el idioma de la aplicación.

Es imprescindible que:

1. Si el usuario está en castellano, toda la nueva pestaña aparezca en castellano.
2. Si el usuario está en catalán, toda la nueva pestaña aparezca en catalán.
3. No se mezclen idiomas dentro de la interfaz.
4. No aparezcan textos en catalán dentro de la versión castellana.
5. No aparezcan textos en castellano dentro de la versión catalana.
6. La redacción debe ser gramaticalmente correcta en ambas lenguas.
7. Los nombres de módulos, botones, encabezados, mensajes vacíos, etiquetas y textos de ayuda deben estar traducidos correctamente.

Usa el mismo sistema de traducciones/i18n que ya tenga la aplicación. No crees un sistema paralelo.

---

## Textos sugeridos para la interfaz

### Castellano

- Pestaña: **CFGM Estética y Belleza**
- Título: **Mapa intermodular del CFGM Estética y Belleza**
- Subtítulo: **Relaciones entre módulos, resultados de aprendizaje y criterios de evaluación de 1.er curso.**
- Módulo: **Módulo**
- Resultado de aprendizaje: **Resultado de aprendizaje**
- Criterios de evaluación: **Criterios de evaluación**
- Coincidencias intermodulares: **Coincidencias intermodulares**
- Módulos relacionados: **Módulos relacionados**
- Justificación: **Justificación**
- Actividades: **Actividades**
- DUA e inclusión: **DUA e inclusión**
- Ver más: **Ver más**
- Ocultar: **Ocultar**
- Sin datos: **No hay datos disponibles para este apartado.**

### Catalán

- Pestanya: **CFGM Estètica i Bellesa**
- Títol: **Mapa intermodular del CFGM Estètica i Bellesa**
- Subtítol: **Relacions entre mòduls, resultats d’aprenentatge i criteris d’avaluació de 1r curs.**
- Mòdul: **Mòdul**
- Resultat d’aprenentatge: **Resultat d’aprenentatge**
- Criteris d’avaluació: **Criteris d’avaluació**
- Coincidències intermodulars: **Coincidències intermodulars**
- Mòduls relacionats: **Mòduls relacionats**
- Justificació: **Justificació**
- Activitats: **Activitats**
- DUA i inclusió: **DUA i inclusió**
- Veure més: **Veure més**
- Amagar: **Amagar**
- Sense dades: **No hi ha dades disponibles per a aquest apartat.**

---

## Restricciones técnicas

1. No cambies nada fuera de la sección **Mapa intermodular**, salvo lo imprescindible para registrar la nueva pestaña y sus traducciones.
2. No modifiques la funcionalidad ya existente de FPB.
3. No cambies rutas, navegación general, estilos globales ni comportamiento de otras páginas.
4. No elimines datos existentes.
5. No cambies el diseño general de la aplicación.
6. No mezcles idiomas.
7. Reutiliza componentes existentes siempre que sea posible.
8. Si hay tests o validaciones, actualízalos solo para cubrir la nueva pestaña sin romper los anteriores.
9. Mantén compatibilidad responsive.
10. Evita duplicar lógica si ya hay componentes reutilizables para bloques colapsables.

---

## Comprobaciones finales obligatorias

Antes de terminar, verifica lo siguiente:

- La pestaña **CFGM Estética y Belleza / CFGM Estètica i Bellesa** aparece justo después de la pestaña de FPB.
- La pestaña de FPB sigue funcionando igual que antes.
- Los bloques colapsables funcionan correctamente.
- Los módulos se muestran de forma ordenada.
- Los RA y criterios de evaluación se pueden consultar correctamente.
- Las coincidencias intermodulares aparecen asociadas al módulo correspondiente.
- La versión castellana no contiene textos en catalán.
- La versión catalana no contiene textos en castellano.
- No se ha modificado ninguna otra sección de la aplicación.
- No hay errores de consola ni errores de compilación.

---

## Resultado esperado

Al finalizar, la aplicación debe mantener su funcionamiento actual y añadir únicamente una nueva pestaña en **Mapa intermodular** para consultar las relaciones intermodulares del **CFGM Estética y Belleza / CFGM Estètica i Bellesa**, con el mismo diseño y funcionalidad que la pestaña de FPB, correctamente traducida al castellano y al catalán.