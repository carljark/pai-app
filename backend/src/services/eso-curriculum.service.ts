import { edadDeCurso } from '../data/niveles';

/** Nivel de la ESO ordinaria en el catálogo (`data/niveles.ts`). */
export const ESO_ORDINARIA = 'ESO_ORDINARIA';

type Lang = 'es' | 'ca';
const TIPO_ORDER: Record<string, number> = { comun: 0, opcion: 1, optativa: 2 };

/**
 * Valor con el que se selecciona una CE de ESO: «Materia · CEn. Descripción».
 * Incluye la materia porque hay CE con el mismo texto en materias del mismo curso
 * (Matemáticas A y B, Cultura Clásica I y II).
 */
export const esoSelection = (subject: string, ceNum: number, description: string): string =>
  `${subject} · CE${ceNum}. ${description}`;

export const parseEsoSelection = (value: string): { subject: string; ceNum: number } | null => {
  const match = /^(.+?) · CE(\d+)\. /.exec(value || '');
  return match ? { subject: match[1]!, ceNum: Number(match[2]) } : null;
};

/** CE de ESO correspondiente a una selección, en cualquiera de los dos idiomas. */
export const findEsoCe = (ces: any[], value: string): any => {
  const parsed = parseEsoSelection(value);
  if (!parsed) return undefined;
  return ces.find(c => c.tipoNivel === ESO_ORDINARIA && c.ce_num === parsed.ceNum
    && (c.subject_es === parsed.subject || c.subject_ca === parsed.subject));
};

const tipoEnCurso = (doc: any, curso: string): string | undefined =>
  doc.subjectTipos?.get ? doc.subjectTipos.get(curso) : doc.subjectTipos?.[curso];

/** Criterios de evaluación de la CE que se aplican en el curso. */
export const criteriosDelCurso = (doc: any, curso: string): any[] =>
  (doc.criteriosPorCurso || []).filter((c: any) => (c.cursos || []).includes(curso));

/** CE de ESO para el selector del frontend, filtradas por curso y ordenadas por tipo de materia. */
export const mapEsoCes = (docs: any[], lang: Lang, curso: string) =>
  docs
    .filter(doc => tipoEnCurso(doc, curso) && criteriosDelCurso(doc, curso).length > 0)
    .map(doc => {
      const subject = lang === 'ca' ? doc.subject_ca : doc.subject_es;
      const description = lang === 'ca' ? doc.description_ca : doc.description_es;
      return {
        area: subject,
        subject,
        subjectCode: doc.subjectCode,
        tipo: tipoEnCurso(doc, curso),
        ce_id: doc.ce_id,
        ce_num: doc.ce_num,
        description,
        value: esoSelection(subject, doc.ce_num, description),
        criterios: criteriosDelCurso(doc, curso).map((c: any) => `${c.id}: ${lang === 'ca' ? c.text_ca : c.text_es}`),
      };
    })
    .sort((a, b) => (TIPO_ORDER[a.tipo!] ?? 9) - (TIPO_ORDER[b.tipo!] ?? 9)
      || a.subject.localeCompare(b.subject) || a.ce_num - b.ce_num);

/** Bloque del prompt con la CE, sus descriptores y los criterios del curso. */
export const describeEsoCeForPrompt = (doc: any, curso: string, language?: string): string => {
  const ca = language === 'catalan';
  const subject = ca ? doc.subject_ca : doc.subject_es;
  const description = ca ? doc.description_ca : doc.description_es;
  const lines = [
    `- Materia: ${subject}`,
    `  Competencia Específica CE${doc.ce_num} (numeración oficial, no la cambies): ${description}`,
  ];
  if (doc.descriptores?.length) lines.push(`  Descriptores del perfil de salida: ${doc.descriptores.join(', ')}`);
  const criterios = criteriosDelCurso(doc, curso);
  if (criterios.length > 0) {
    lines.push(`  CRITERIOS DE EVALUACIÓN OFICIALES DE ${curso} (numeración oficial):`);
    criterios.forEach(c => lines.push(`    ${c.id}: ${ca ? c.text_ca : c.text_es}`));
  }
  return lines.join('\n');
};

/** Reglas del prompt propias de la ESO ordinaria: terminología LOMLOE y edad del alumnado. */
export const buildEsoInstruction = (curso: string): string => {
  const edad = edadDeCurso(ESO_ORDINARIA, curso);
  return `

REGLAS OBLIGATORIAS PARA LA ESO (LOMLOE · Decreto 42/2025 de las Illes Balears):
1. TERMINOLOGÍA: el documento es una "Situación de aprendizaje", nunca un "Proyecto intermodular". Usa "Competencias específicas (CE)", "Criterios de evaluación" y "Saberes básicos"; NUNCA "Resultados de Aprendizaje (RA)" ni "módulo profesional". Cada materia se llama por su nombre oficial.
2. EDAD DEL ALUMNADO: la situación de aprendizaje es para alumnado de ${curso} de ESO${edad ? `, de ${edad}` : ''}. Adapta a esa edad el vocabulario, el grado de autonomía, la duración de cada tarea, el andamiaje y los ejemplos, de modo que sean comprensibles y motivadores para ese alumnado. Indica la edad en el apartado "Identidad del Proyecto".
3. PERFIL DE SALIDA: vincula la situación de aprendizaje con las competencias clave y con los descriptores del perfil de salida indicados en cada CE.
4. EVALUACIÓN FORMATIVA Y FORMADORA: incluye instrumentos de autoevaluación y coevaluación (dianas, listas de cotejo, rutinas de pensamiento, tiques de salida) adecuados a esa edad, además de las rúbricas.
5. INCLUSIÓN: aplica los principios del Diseño Universal para el Aprendizaje (DUA), con medidas para atender la diversidad del grupo.
6. PRODUCTO FINAL: el reto o producto final debe partir de un contexto significativo y cercano al alumnado; no tiene que estar vinculado al mundo profesional.`;
};
