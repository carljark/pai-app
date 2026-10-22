/** Plantillas importadas como texto en los tests (`with { loader: 'text' }` de esbuild). */
declare module '*.html' {
  const content: string;
  export default content;
}
