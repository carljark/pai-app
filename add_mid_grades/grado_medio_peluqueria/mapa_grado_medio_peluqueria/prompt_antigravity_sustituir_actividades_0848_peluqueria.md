# Prompt para Antigravity

Quiero que actualices la plataforma del **Grado Medio de Peluquería y Cosmética Capilar** sustituyendo las actividades anteriores por las actividades nuevas del documento corregido, **sin modificar ninguna otra prestación, funcionalidad, diseño ni comportamiento de la plataforma**.

## Objetivo principal

Sustituir las actividades antiguas del módulo:

**0848. Perruqueria i estilisme masculí**

por las actividades nuevas del documento en catalán correcto:

**`mapa_intermodular_0848_perruqueria_estilisme_masculi_TENDENCIES_CA_CORRECTE`**

Documento de referencia:

https://docs.google.com/document/d/12eutmzb4g2y8o6PZo0jP5_ZWkwkxLymke7l2lkMBX18/edit?usp=drivesdk

El contenido nuevo debe quedar integrado en la plataforma exactamente como las actividades actuales, pero sustituyendo el contenido anterior del módulo 0848.

---

## Instrucciones estrictas

1. **No modifiques otras prestaciones de la plataforma.**
   - No cambies navegación.
   - No cambies diseño general.
   - No cambies autenticación.
   - No cambies permisos.
   - No cambies estructura de cursos que no estén afectados.
   - No cambies lógica de evaluación, rúbricas, formularios, paneles o vistas si ya funcionan.
   - No refactorices componentes que no sean necesarios para esta sustitución.

2. **Limita el cambio al contenido de actividades del Grado Medio de Peluquería.**
   - En concreto, sustituye las actividades anteriores del módulo **0848** por las nuevas.
   - Mantén el resto de módulos intactos si no están directamente relacionados con esta actualización.

3. **No reescribas ni simplifiques las actividades.**
   - El contenido debe importarse fielmente.
   - Respeta títulos, apartados, RA/CE, justificaciones, metodologías, ideas, desarrollos, productos/evidencias y pautas DUA.
   - No traduzcas automáticamente.
   - No mezcles castellano y catalán.
   - El contenido final debe quedar en **catalán correcto**.

4. **Mantén la estructura actual de la plataforma.**
   - Si las actividades se almacenan en JSON, base de datos, seeds, Markdown, CMS o archivos estáticos, modifica únicamente la fuente de datos correspondiente.
   - Si existen IDs internos, conserva los IDs cuando sea posible para no romper relaciones.
   - Si es necesario crear nuevos IDs, hazlo de forma consistente y sin afectar a otros módulos.

---

## Estructura que debe conservarse

El documento nuevo contiene:

- 12 apartados principales: `C1` a `C12`.
- 108 actividades.
- Cada actividad incluye:
  - metodología activa;
  - idea;
  - desarrollo;
  - producto/evidencia;
  - pautas DUA e inclusión.

La plataforma debe reflejar esta misma estructura.

Cada actividad debe quedar vinculada al módulo:

```txt
0848. Perruqueria i estilisme masculí
```

Y debe conservar las relaciones con RA/CE del módulo eje y RA/CE externos de segundo curso que aparecen en el documento.

---

## Tareas concretas

1. Localiza dónde se almacenan actualmente las actividades del Grado Medio de Peluquería.
   - Puede ser en archivos de datos, seeds, base de datos, Markdown, JSON, TypeScript, JavaScript, YAML u otro formato.
   - Identifica específicamente el contenido correspondiente al módulo **0848**.

2. Haz una copia de seguridad o conserva el estado anterior mediante commit/diff antes de sustituir el contenido.

3. Sustituye las actividades antiguas del módulo **0848** por las actividades nuevas del documento corregido.

4. Comprueba que se han importado correctamente:
   - 12 apartados.
   - 108 actividades.
   - Títulos correctos.
   - Texto en catalán.
   - Sin mezcla visible castellano/catalán.
   - Sin pérdida de campos.
   - Sin romper relaciones RA/CE.
   - Sin modificar otros módulos.

5. Verifica en la interfaz que:
   - El módulo 0848 se muestra correctamente.
   - Las actividades aparecen en el orden correcto.
   - Cada actividad conserva sus apartados.
   - No se han producido errores visuales.
   - No se han alterado otras prestaciones de la plataforma.

6. Ejecuta los tests existentes si los hay.
   - Si no hay tests, realiza al menos una comprobación manual de carga de la página o vista donde aparecen las actividades.

---

## Restricciones importantes

No hagas lo siguiente:

- No cambies el diseño global.
- No cambies estilos generales.
- No modifiques otros ciclos formativos.
- No modifiques otros módulos si no es necesario.
- No cambies lógica de usuarios, permisos ni roles.
- No elimines prestaciones existentes.
- No añadas funcionalidades nuevas.
- No traduzcas el contenido con herramientas automáticas.
- No sustituyas el catalán por castellano.
- No generes actividades nuevas diferentes a las del documento.
- No cambies la estructura pedagógica validada.

---

## Resultado esperado

Al finalizar, la plataforma debe mostrar para el módulo **0848. Perruqueria i estilisme masculí** las actividades nuevas del documento corregido en catalán, manteniendo exactamente el funcionamiento previo de la plataforma.

Entrega un resumen final indicando:

1. Qué archivos o tablas se han modificado.
2. Qué contenido se ha sustituido.
3. Confirmación de que el módulo 0848 contiene 12 apartados y 108 actividades.
4. Confirmación de que no se han modificado otras prestaciones de la plataforma.
5. Cualquier comprobación o test realizado.
