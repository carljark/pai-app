# Tarea 40: Renderizado de Matemáticas (LaTeX) en el Taller de Proyectos con KaTeX

## Propósito
Los proyectos generados por la IA incluyen expresiones matemáticas en formato LaTeX estándar (p.ej. `$1\text{ dm}^3 = 1\text{ L}$`). Sin un motor de renderizado matemático, estas expresiones se mostraban como texto plano con los delimitadores `$` visibles, lo que era ilegible e inútil para los docentes. Se integró **KaTeX** (la librería de renderizado matemático más rápida del ecosistema web) vía el plugin oficial de `ngx-markdown` para que todas las expresiones LaTeX se rendericen correctamente.

## Arquitectura/Flujo

1. **KaTeX instalado como dependencia** (`katex ^0.18.4` en `package.json`).
2. **Configuración en `app.config.ts`:** Se amplió `provideMarkdown()` pasándole:
   - `markedOptions`: activa GFM (_GitHub Flavored Markdown_) y saltos de línea (`breaks: true`).
   - `katexOptions`: activa el plugin `markedKatex` internamente con `throwOnError: false` (las fórmulas mal formadas no bloquean el renderizado) y `output: 'html'` (renderiza HTML puro, no SVG).
3. **Template `taller-view.component.html`:** Se añadió el atributo `[katex]="true"` al componente `<markdown>`, activando el procesado por el plugin.
4. **CSS de KaTeX en `index.html`:** Se enlaza la hoja de estilos de KaTeX vía CDN (`jsDelivr`) para que los glifos matemáticos aparezcan correctamente dibujados.

## Archivos Modificados

- `frontend/package.json`: Añadida dependencia `"katex": "^0.18.4"`.
- `frontend/src/app/app.config.ts`: `provideMarkdown` configurado con `markedOptions` y `katexOptions`.
- `frontend/src/app/features/taller/components/taller-view/taller-view.component.html`: Atributo `[katex]="true"` en `<markdown>`.
- `frontend/src/index.html`: `<link>` con la hoja de estilos de KaTeX.

## Detalles Técnicos

- **ngx-markdown + marked-katex:** `ngx-markdown` usa internamente el paquete `marked-katex-extension` cuando se activa la opción KaTeX. Este extensión pre-procesa el texto buscando expresiones delimitadas por `$...$` (inline) y `$$...$$` (bloque) antes de que `marked` convierta el resto del Markdown a HTML.
- **`throwOnError: false`:** Imprescindible en producción. Si la IA genera un fragmento LaTeX malformado, no lanza ningún error en consola ni rompe el renderizado del proyecto; simplemente lo muestra como texto.
- **Compatibilidad con Docker:** `katex` ya está en `dependencies` (no `devDependencies`), por lo que `npm install --legacy-peer-deps` en ambos Dockerfiles lo instalará correctamente en el build de producción.
