# Tarea 52: Desactivación de Katex (Renderizado de Markdown)

## Propósito
Tras depurar por qué el componente `ngx-markdown` colapsaba silenciosamente y dejaba la vista del Taller en blanco al cargar proyectos desde el historial, se identificó que la directiva `[katex]="true"` era la culpable directa. 

A pesar de tener configurado `throwOnError: false` en `app.config.ts`, la librería de renderizado matemático KaTeX (integrada en el Markdown) sufre fallos críticos al intentar procesar texto generado por la IA que contiene caracteres de dólar (`$`) desemparejados o con sintaxis LaTeX inválida. Este fallo no lanzaba errores explícitos en consola en todos los navegadores, sino que abortaba la renderización del componente en la vista actual.

## Arquitectura/Flujo
1. Se ha eliminado el atributo `[katex]="true"` de la etiqueta `<markdown>` en `taller-view.component.html`.
2. Al desactivar el procesado matemático agresivo, `ngx-markdown` recupera su robustez nativa y es capaz de renderizar cualquier salida defectuosa de Gemini como texto plano o markdown estándar sin colapsar el DOM.

## Archivos Modificados
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.html`
