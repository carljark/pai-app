# Prompt para Antigravity

Quiero que incorpores al proyecto los nuevos documentos del **Grado Medio de Peluquería y Cosmética Capilar** dentro de la funcionalidad existente de **“mapa intermodular”**, siguiendo exactamente el modelo anterior que ya se usó para incorporar este ciclo.

## Objetivo

Añadir al apartado **mapa intermodular** los documentos correspondientes al **primer curso** y al **segundo curso** del Grado Medio de Peluquería, en versiones **castellano** y **catalán**, sin modificar otras funcionalidades de la aplicación.

## Restricción principal

No hagas cambios en otras funciones, pantallas, rutas, componentes o lógicas que no estén relacionadas directamente con la incorporación de estos documentos al **mapa intermodular**.

No refactorices código general.  
No cambies estilos globales.  
No cambies navegación general.  
No cambies comportamiento de otros ciclos o documentos ya existentes.  
No alteres funciones que ya están funcionando.

Solo debes añadir estos nuevos recursos siguiendo el patrón ya existente.

---

## Material que se debe incorporar

Se deben incorporar los documentos `.md` generados para el **Grado Medio de Peluquería**, separados por:

- Curso: **primer curso** y **segundo curso**.
- Idioma: **castellano** y **catalán**.
- Módulo: documento individual por módulo.

Los documentos están organizados en dos paquetes ZIP:

### Primer curso

Archivo ZIP:

`mapas_intermodulares_primer_curso_individuales_actividades_desarrolladas_CA_ES.zip`

Contiene 16 documentos:

#### Castellano

1. `mapa_intermodular_0842_peinados_recogidos_actividades_desarrolladas_ES.md`
2. `mapa_intermodular_0845_tecnicas_corte_cabello_actividades_desarrolladas_ES.md`
3. `mapa_intermodular_0844_cosmetica_peluqueria_actividades_desarrolladas_ES.md`
4. `mapa_intermodular_0846_cambios_forma_permanente_actividades_desarrolladas_ES.md`
5. `mapa_intermodular_0849_analisis_capilar_actividades_desarrolladas_ES.md`
6. `mapa_intermodular_1664_digitalizacion_sectores_productivos_actividades_desarrolladas_ES.md`
7. `mapa_intermodular_1709_itinerario_empleabilidad_I_actividades_desarrolladas_ES.md`
8. `mapa_intermodular_0156_ingles_profesional_actividades_desarrolladas_ES.md`

#### Catalán

1. `mapa_intermodular_0842_pentinats_recollits_activitats_desenvolupades_CA.md`
2. `mapa_intermodular_0845_tecniques_tall_cabells_activitats_desenvolupades_CA.md`
3. `mapa_intermodular_0844_cosmetica_perruqueria_activitats_desenvolupades_CA.md`
4. `mapa_intermodular_0846_canvis_forma_permanent_activitats_desenvolupades_CA.md`
5. `mapa_intermodular_0849_analisi_capillar_activitats_desenvolupades_CA.md`
6. `mapa_intermodular_1664_digitalitzacio_sectors_productius_activitats_desenvolupades_CA.md`
7. `mapa_intermodular_1709_itinerari_ocupabilitat_I_activitats_desenvolupades_CA.md`
8. `mapa_intermodular_0156_angles_professional_activitats_desenvolupades_CA.md`

---

### Segundo curso

Archivo ZIP:

`mapas_intermodulares_segundo_curso_individuales_actividades_desarrolladas_CA_ES.zip`

Contiene 16 documentos:

#### Castellano

1. `mapa_intermodular_0640_imagen_corporal_habitos_saludables_actividades_desarrolladas_ES.md`
2. `mapa_intermodular_0643_marketing_venta_imagen_personal_actividades_desarrolladas_ES.md`
3. `mapa_intermodular_0843_coloracion_capilar_actividades_desarrolladas_ES.md`
4. `mapa_intermodular_0848_peluqueria_estilismo_masculino_actividades_desarrolladas_ES.md`
5. `mapa_intermodular_0636_estetica_manos_pies_actividades_desarrolladas_ES.md`
6. `mapa_intermodular_1708_sostenibilidad_sistema_productivo_actividades_desarrolladas_ES.md`
7. `mapa_intermodular_1710_itinerario_empleabilidad_II_actividades_desarrolladas_ES.md`
8. `mapa_intermodular_1713_proyecto_intermodular_actividades_desarrolladas_ES.md`

#### Catalán

1. `mapa_intermodular_0640_imatge_corporal_habits_saludables_activitats_desenvolupades_CA.md`
2. `mapa_intermodular_0643_marqueting_venda_imatge_personal_activitats_desenvolupades_CA.md`
3. `mapa_intermodular_0843_coloracio_capillar_activitats_desenvolupades_CA.md`
4. `mapa_intermodular_0848_perruqueria_estilisme_masculi_activitats_desenvolupades_CA.md`
5. `mapa_intermodular_0636_estetica_mans_peus_activitats_desenvolupades_CA.md`
6. `mapa_intermodular_1708_sostenibilitat_sistema_productiu_activitats_desenvolupades_CA.md`
7. `mapa_intermodular_1710_itinerari_ocupabilitat_II_activitats_desenvolupades_CA.md`
8. `mapa_intermodular_1713_projecte_intermodular_activitats_desenvolupades_CA.md`

---

## Estructura que debe quedar en la aplicación

Dentro de **mapa intermodular**, debe aparecer el ciclo:

### Grado Medio de Peluquería y Cosmética Capilar

Debe permitir seleccionar o visualizar:

1. **Primer curso**
2. **Segundo curso**

Y dentro de cada curso:

- Versión en **castellano**
- Versión en **catalán**
- Documentos individuales por módulo

La estructura debe seguir el patrón existente en la aplicación para otros ciclos o documentos ya incorporados.

---

## Módulos que deben aparecer

### Primer curso

#### Castellano

- 0842. Peinados y recogidos
- 0845. Técnicas de corte del cabello
- 0844. Cosmética para peluquería
- 0846. Cambios de forma permanente del cabello
- 0849. Análisis capilar
- 1664. Digitalización aplicada a los sectores productivos
- 1709. Itinerario personal para la empleabilidad I
- 0156. Inglés profesional

#### Catalán

- 0842. Pentinats i recollits
- 0845. Tècniques de tall de cabells
- 0844. Cosmètica per a perruqueria
- 0846. Canvis de forma permanent del cabell
- 0849. Anàlisi capil·lar
- 1664. Digitalització aplicada als sectors productius
- 1709. Itinerari personal per a l’ocupabilitat I
- 0156. Anglès professional

---

### Segundo curso

#### Castellano

- 0640. Imagen corporal y hábitos saludables
- 0643. Marketing y venta en imagen personal
- 0843. Coloración capilar
- 0848. Peluquería y estilismo masculino
- 0636. Estética de manos y pies
- 1708. Sostenibilidad aplicada al sistema productivo
- 1710. Itinerario personal para la empleabilidad II
- 1713. Proyecto intermodular

#### Catalán

- 0640. Imatge corporal i hàbits saludables
- 0643. Màrqueting i venda en imatge personal
- 0843. Coloració capil·lar
- 0848. Perruqueria i estilisme masculí
- 0636. Estètica de mans i peus
- 1708. Sostenibilitat aplicada al sistema productiu
- 1710. Itinerari personal per a l’ocupabilitat II
- 1713. Projecte intermodular

---

## Requisitos funcionales

1. Incorporar los documentos al sistema de recursos del **mapa intermodular**.
2. Mantener la misma lógica de lectura/renderizado de documentos Markdown que ya exista.
3. Mantener separación clara entre:
   - primer curso / segundo curso,
   - castellano / catalán,
   - módulo individual.
4. No mezclar documentos de primer curso con segundo curso.
5. No mezclar documentos en castellano con documentos en catalán.
6. No modificar el contenido interno de los documentos Markdown salvo que sea estrictamente necesario para que el sistema los pueda cargar.
7. Si el proyecto usa una estructura de datos, array, JSON, índice o configuración para declarar documentos, añadir estos nuevos documentos ahí siguiendo el patrón existente.
8. Si hay rutas o slugs, usar nombres claros y consistentes.
9. Si hay buscador, filtro o selector de ciclos, asegurarse de que este nuevo ciclo aparece correctamente.
10. Si hay selector de idioma, debe respetar las versiones ES y CA.

---

## Requisitos de seguridad de cambios

Antes de tocar nada:

1. Revisa cómo se incorporaron anteriormente los documentos del **Grado Medio de Peluquería** o de otros ciclos.
2. Identifica el patrón exacto.
3. Replica ese patrón con los nuevos documentos.
4. No cambies componentes compartidos salvo que sea imprescindible.
5. Si necesitas modificar un componente compartido, hazlo de forma mínima y sin alterar el comportamiento existente.

---

## Validación esperada

Al terminar, debe poder comprobarse que:

1. En **mapa intermodular** aparece el ciclo **Grado Medio de Peluquería y Cosmética Capilar**.
2. Se puede acceder a los documentos de **primer curso**.
3. Se puede acceder a los documentos de **segundo curso**.
4. Se puede elegir o visualizar la versión en **castellano**.
5. Se puede elegir o visualizar la versión en **catalán**.
6. Cada módulo abre su documento Markdown correspondiente.
7. No se han modificado otras funciones de la aplicación.
8. No se han roto documentos, ciclos o recursos ya existentes.

---

## Importante

No generes contenido nuevo.  
No resumas los documentos.  
No transformes las actividades.  
No mezcles cursos.  
No mezcles idiomas.  
No cambies otras funcionalidades.

La tarea es únicamente **incorporar estos documentos al mapa intermodular** siguiendo el modelo anterior ya usado en el proyecto.
