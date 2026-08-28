# Tarea 42: Actualización de textos de la página de inicio (Home)

## Propósito
El usuario solicitó actualizar el texto de introducción de la plataforma visible en el dashboard de inicio (`home-dashboard.component`), utilizando el contenido proporcionado en el documento `Introduccion plataforma .docx`.
Adicionalmente, se pidió modificar el saludo inicial (de "Bienvenido" a "Hola") y asegurarse de que los nuevos textos cuenten con su respectiva traducción al catalán.

## Arquitectura/Flujo
- **Traducciones (TranslationService):** Las cadenas de texto del home se gestionan dinámicamente según el idioma seleccionado. Se han sobrescrito las claves `homeGreeting` y `homeDescription` para los idiomas castellano y catalán.
- **Renderizado de HTML seguro (home-dashboard):** Dado que el nuevo texto de descripción contiene formato enriquecido (párrafos, viñetas, negritas), la forma de renderizarlo en el template cambió de interpolación simple (`{{ t().homeDescription }}`) a binding de HTML directo mediante la directiva `[innerHTML]`.
- **Estilos (CSS):** Para que el texto sea legible (dado que ahora es mucho más extenso), se incrementó ligeramente el `max-width` en `.home-hero__description` de 580px a 760px, y se aplicaron estilos en línea mínimos dentro de las traducciones para que las listas aparezcan alineadas a la izquierda.

## Archivos Modificados
- `frontend/src/app/services/translation.service.ts`: Actualizadas las traducciones de `homeGreeting` ("Hola") y `homeDescription` (texto HTML rico en ES y CA).
- `frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts`: 
  - Actualizado el tag `<p>` a `<div>` usando `[innerHTML]`.
  - Ampliado el ancho máximo (`max-width`) en el bloque SCSS del componente para acomodar mejor los textos largos con viñetas.

## Detalles Técnicos
- Se utilizó la herramienta CLI de macOS `textutil` para extraer el contenido en texto plano directamente desde el archivo binario `.docx` subido.
- La inserción de marcado HTML estructurado directamente en el diccionario de traducción permite mantener el componente de interfaz completamente agnóstico del contenido, simplificando la presentación de listas (`<ul>/<li>`) sin añadir complejidad en el template.
- La ejecución de tests confirmó que la conversión al uso de `[innerHTML]` no impacta la cobertura del componente ni rompe tests existentes.
