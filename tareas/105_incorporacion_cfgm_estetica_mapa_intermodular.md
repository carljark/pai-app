# Tarea 105: Incorporación de CFGM Estética y Belleza al Mapa Intermodular

## Propósito
El objetivo de esta tarea ha sido incorporar la pestaña correspondiente al Ciclo Formativo de Grado Medio (CFGM) en Estética y Belleza dentro de la sección de Mapa Intermodular de la plataforma, permitiendo visualizar sus relaciones y criterios de aprendizaje con la misma estructura ya existente para FPB.

## Arquitectura/Flujo
- **Generación de Datos (Seed):** Se ha creado un nuevo archivo `mapa-intermodular-cfgm.seed.ts` a partir de los 8 ficheros Markdown proporcionados. Un script de conversión extrajo las combinaciones intermodulares, las actividades, los criterios vinculados y las justificaciones, adaptándolos a la interfaz `FPBModule` para mantener coherencia en el modelo de datos sin requerir nuevas estructuras.
- **Gestión del Estado (Facade):** Se ha modificado `mapa-intermodular.facade.ts` añadiendo la señal `activeTab` para controlar si se visualiza FPB o CFGM. La señal `modules` se ha convertido en una variable computada (`computed`) que alterna entre el seed de FPB (`FPB_MODULES_SEED`) y el nuevo seed del CFGM (`CFGM_MODULES_SEED`) en función de la pestaña activa.
- **Interfaz (Componente View):** En el componente `mapa-intermodular-view.component.ts/.html` se ha añadido una barra de navegación tipo "tabs" justo al inicio del contenedor principal que permite alternar entre "FPB" y "CFGM Estética y Belleza". Los textos de la cabecera (título y subtítulo) se han adaptado de forma dinámica utilizando la lógica existente basada en `isCa()` para soportar ambos idiomas (castellano y catalán).

## Archivos Modificados
- `frontend/src/app/features/mapa-intermodular/data/mapa-intermodular-cfgm.seed.ts` (CREADO)
- `frontend/src/app/features/mapa-intermodular/services/mapa-intermodular.facade.ts` (MODIFICADO)
- `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.ts` (MODIFICADO)
- `frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.html` (MODIFICADO)
- `frontend/src/app/services/translations.es.ts` (MODIFICADO)
- `frontend/src/app/services/translations.ca.ts` (MODIFICADO)

## Detalles Técnicos
- Se implementó un conversor local en Python para leer y analizar los ficheros Markdown y convertirlos en objetos JSON compatibles con Angular.
- El diseño de la vista se ha respetado estrictamente para no afectar la experiencia previa del mapa FPB.
- Se emplean variables de estado computadas de Angular signals (`computed`) en la Facade para un refresco reactivo automático en cascada cuando el usuario cambia de pestaña, lo que evita redundancia y fugas de memoria, optimizando la visualización de una gran cantidad de datos y actividades en pantalla.
