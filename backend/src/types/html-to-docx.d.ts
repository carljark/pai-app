// html-to-docx no publica tipos: declaración mínima de la función por defecto que usamos.
declare module 'html-to-docx' {
  export default function HTMLtoDOCX(
    htmlString: string,
    headerHTMLString?: string | null,
    documentOptions?: Record<string, unknown>,
    footerHTMLString?: string | null
  ): Promise<Buffer | ArrayBuffer | Blob>;
}
