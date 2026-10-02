import { IntermodularActivity, IntermodularConnection } from '../models/mapa-intermodular.model';

function formatRelatedCriteria(c: IntermodularConnection, isCa: boolean): string {
  if (!c.relatedCriteria || c.relatedCriteria.length === 0) return '';
  const relStr = c.relatedCriteria
    .map(
      (r) => `${r.moduleCode}: ${isCa ? r.criteria_ca || r.criteria : r.criteria_es || r.criteria}`,
    )
    .join(' | ');
  return `    ${isCa ? 'Criteris relacionats:' : 'Criterios relacionados:'} ${relStr}\n`;
}

function formatActivity(act: IntermodularActivity, isCa: boolean): string {
  const aTitle = isCa ? act.title_ca : act.title_es;
  const aDesc = isCa ? act.description_ca : act.description_es;
  const aDiv = isCa ? act.diversitySupport_ca : act.diversitySupport_es;
  return `    * ${isCa ? 'Activitat:' : 'Actividad:'} ${aTitle}\n      ${isCa ? 'Desenvolupament:' : 'Desarrollo:'} ${aDesc}\n      ${isCa ? 'Atenció Diversitat:' : 'Atención Diversidad:'} ${aDiv}\n`;
}

/** Bloque de texto de una conexión (con sus actividades) para el resumen exportable. */
export function formatConnection(c: IntermodularConnection, idx: number, isCa: boolean): string {
  const targetName = isCa ? c.targetModuleName_ca : c.targetModuleName_es;
  const just = isCa ? c.justification_ca : c.justification_es;
  const title = isCa ? c.title_ca || c.title_es : c.title_es;

  let text = `\n[${idx + 1}] ${title || c.targetModuleCode + ' - ' + targetName}\n`;
  if (c.sourceCriteria) {
    text += `    ${isCa ? 'Criteris propis:' : 'Criterios propios:'} ${c.sourceCriteria}\n`;
  }
  text += formatRelatedCriteria(c, isCa);
  text += `    ${isCa ? 'Justificació:' : 'Justificación:'} ${just}\n`;
  return text + c.activities.map((act) => formatActivity(act, isCa)).join('');
}
