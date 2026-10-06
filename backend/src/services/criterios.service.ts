import { ESO_ORDINARIA, criteriosDelCurso, findEsoCe } from './eso-curriculum.service';

type Lang = 'es' | 'ca';

/** Criterio de evaluación de una CE, con su numeración oficial («1.1») y el texto en un idioma. */
export interface CriterioDetalle {
  id: string;
  text: string;
}

/** Criterios elegidos para una CE; `ce` es el valor con el que el frontend selecciona la CE. */
export interface CriterioSeleccionado {
  ce: string;
  ids: string[];
}

export class CriteriosError extends Error {}

const COURSE_IN_TEXT = /([1-4])\s*[º°o]?\s*ESO/i;

/** Número oficial («1.1») de un criterio heredado: «3º ESO - 1.1», «1.1 (4º ESO)», «CA 1.1» o «1.1». */
const legacyId = (raw: string, index: number): string => {
  const match = /\d+\.\d+/.exec(raw.replace(COURSE_IN_TEXT, ''));
  return match ? match[0] : String(index + 1);
};

const legacyText = (c: any): string => (typeof c === 'string' ? c : c?.description || c?.desc || '').trim();

/** Curso al que se refiere un criterio heredado, o `undefined` si vale para cualquiera. */
const legacyCourse = (c: any): string | undefined => {
  const label = typeof c === 'string' ? c : String(c?.criterio_id || '');
  const digit = COURSE_IN_TEXT.exec(label)?.[1];
  return digit ? `${digit}º` : undefined;
};

const legacyList = (doc: any, lang: Lang): any[] => {
  const preferred = lang === 'ca' ? doc.criterios_ca : doc.criterios_es;
  const fallback = doc.criterios_es?.length ? doc.criterios_es : (doc.criterios || []);
  return preferred?.length ? preferred : fallback;
};

/** Criterios del PDC (formato heredado, con el curso dentro del identificador). */
const legacyCriterios = (doc: any, curso: string, lang: Lang): CriterioDetalle[] =>
  legacyList(doc, lang)
    .map((c, index) => ({ c, id: legacyId(typeof c === 'string' ? '' : String(c?.criterio_id || ''), index) }))
    .filter(({ c }) => !legacyCourse(c) || legacyCourse(c) === curso)
    .map(({ c, id }) => ({ id, text: legacyText(c) }));

/** Criterios de una CE (ESO ordinaria o PDC) aplicables al curso, en el idioma pedido. */
export const criteriosDeCe = (doc: any, curso: string, lang: Lang): CriterioDetalle[] =>
  doc?.criteriosPorCurso?.length
    ? criteriosDelCurso(doc, curso).map((c: any) => ({ id: c.id, text: lang === 'ca' ? c.text_ca : c.text_es }))
    : legacyCriterios(doc, curso, lang);

/** CE de un nivel de ESO (ordinaria o PDC) a partir del valor con el que se selecciona. */
export const findCeDoc = (allCes: any[], selected: string, tipoNivel?: string): any =>
  tipoNivel === ESO_ORDINARIA
    ? findEsoCe(allCes, selected)
    : allCes.find(c => c.tipoNivel !== ESO_ORDINARIA
      && (c.description_es === selected || c.description_ca === selected || c.ce_id === selected));

/** Fuerza el formato `{ ce, ids[] }` de la petición; cualquier otra forma es un error. */
export const parseSeleccion = (raw: unknown): CriterioSeleccionado[] => {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) throw new CriteriosError('criteriosSeleccionados debe ser una lista');
  return raw.map(item => {
    const ids = item?.ids;
    if (typeof item?.ce !== 'string' || !Array.isArray(ids) || ids.some((id: unknown) => typeof id !== 'string')) {
      throw new CriteriosError('Cada elemento de criteriosSeleccionados necesita ce (texto) e ids (lista de textos)');
    }
    return { ce: item.ce, ids: [...new Set<string>(ids)] };
  });
};

/**
 * Valida la selección: cada entrada debe ser de una CE seleccionada, tener al menos un criterio
 * y solo ids que existan en esa CE para el curso. Devuelve los ids por CE.
 */
export const validarSeleccion = (
  seleccion: CriterioSeleccionado[], selectedCes: string[], allCes: any[], tipoNivel: string, curso: string,
): Map<string, string[]> => {
  const result = new Map<string, string[]>();
  for (const { ce, ids } of seleccion) {
    if (!selectedCes.includes(ce)) throw new CriteriosError(`La CE «${ce}» no está entre las seleccionadas`);
    if (ids.length === 0) throw new CriteriosError(`Selecciona al menos un criterio de la CE «${ce}»`);
    const valid = new Set(criteriosDeCe(findCeDoc(allCes, ce, tipoNivel), curso, 'es').map(c => c.id));
    const unknown = ids.filter(id => !valid.has(id));
    if (unknown.length > 0) throw new CriteriosError(`Criterios inexistentes en «${ce}» para ${curso}: ${unknown.join(', ')}`);
    result.set(ce, ids);
  }
  return result;
};

/** Criterios de la CE que entran en el prompt: los elegidos o, sin elección, todos los del curso. */
export const criteriosParaPrompt = (list: CriterioDetalle[], ids?: string[]): CriterioDetalle[] =>
  ids ? list.filter(c => ids.includes(c.id)) : list;

/** Regla global del prompt cuando el docente ha elegido criterios concretos. */
export const COBERTURA_CRITERIOS = `

CRITERIOS DE EVALUACIÓN SELECCIONADOS POR EL DOCENTE (OBLIGATORIO):
Para las CE que indican "CRITERIOS DE EVALUACIÓN SELECCIONADOS", el proyecto se crea A PARTIR de esos criterios: cada actividad, producto y rúbrica debe contribuir a ellos y TODOS deben quedar cubiertos y evaluados, con su numeración oficial. No evalúes ni incluyas otros criterios de esas CE.`;

/** Bloque del prompt de una CE del PDC (formato heredado) con sus criterios del curso. */
export const describePdcCeForPrompt = (
  doc: any, selected: string, curso: string, language?: string, ids?: string[],
): string => {
  const ceCode = doc.ce_id ? ` ${doc.ce_id}` : '';
  let text = `- Asignatura: ${doc.subject || doc.area}\n  Competencia Específica${ceCode} (numeración oficial, no la cambies): ${selected}`;
  const criterios = criteriosParaPrompt(criteriosDeCe(doc, curso, language === 'catalan' ? 'ca' : 'es'), ids);
  if (criterios.length > 0) {
    const titulo = ids ? 'CRITERIOS DE EVALUACIÓN SELECCIONADOS' : 'CRITERIOS DE EVALUACIÓN OFICIALES';
    text += `\n  ${titulo}:\n${criterios.map(c => `    ${c.id}: ${c.text}`).join('\n')}`;
  }
  return text;
};
