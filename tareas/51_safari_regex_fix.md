# Tarea 51: Corrección de Regex para Compatibilidad en Safari / macOS

## Propósito
El usuario notificó que, a pesar del parche CSS aplicado en la Tarea 50, seguía sin ver el contenido del proyecto (el markdown seguía sin renderizarse). 
Tras analizar profundamente la procedencia de los datos, se ha determinado que el fallo provenía de la función `sanitizeMath` en `projects.facade.ts`.

Esta función empleaba una expresión regular avanzada (Regex) con "Negative Lookbehind" `(?<!\$)` para normalizar los delimitadores matemáticos. Los motores WebKit de versiones anteriores a Safari 16.4 (muy comunes en macOS) **no soportan** Lookbehinds negativos, lanzando un `SyntaxError: Invalid regular expression`. Este error fatal interceptaba silenciosamente el ciclo de renderizado (Change Detection) de Angular, provocando que la variable vinculada al `<markdown>` se corrompiera y el visor quedara totalmente en blanco.

## Arquitectura/Flujo
1. **Sustitución de Regex:** Se ha modificado el motor de `sanitizeMath` para reemplazar el *negative lookbehind* por un grupo de captura estándar `(^|[^$])` con retroreferencia `$1`.
2. **Impacto:** Esta forma garantiza un 100% de compatibilidad con versiones antiguas de Safari, WebKit, iOS y otras plataformas antiguas, sin perder la funcionalidad original de sanear los delimitadores matemáticos rotos.
3. El componente `<markdown>` ya recibe correctamente los datos parseados y el texto del proyecto vuelve a aparecer.

## Archivos Modificados
- `frontend/src/app/features/projects/services/projects.facade.ts` (línea 173)
