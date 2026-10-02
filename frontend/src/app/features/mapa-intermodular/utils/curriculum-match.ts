import { LearningOutcome as CurriculumRa } from '../../curriculum/models/curriculum.model';
import { IntermodularConnection } from '../models/mapa-intermodular.model';

/** RA del mapa que se quiere localizar en el currículum del generador. */
export interface RaReference {
  moduleCode: string;
  moduleName: string;
  raCode: string;
  textEs: string;
  textCa: string;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findExact(allRas: CurriculumRa[], ref: RaReference): CurriculumRa | undefined {
  return allRas.find((r) => r.description === ref.textEs || r.description === ref.textCa);
}

function findByText(allRas: CurriculumRa[], ref: RaReference): CurriculumRa | undefined {
  const normEs = normalize(ref.textEs).substring(0, 30);
  const normCa = normalize(ref.textCa).substring(0, 30);
  return allRas.find((r) => {
    const normDesc = normalize(r.description || '');
    return (
      (normEs && normDesc.includes(normEs)) ||
      (normCa && normDesc.includes(normCa)) ||
      (normDesc && normEs.includes(normDesc.substring(0, 25)))
    );
  });
}

function findByModuleAndCode(allRas: CurriculumRa[], ref: RaReference): CurriculumRa | undefined {
  const raIdx = ref.raCode.replace(/\D/g, '');
  const moduleCode = ref.moduleCode.toLowerCase();
  const modulePrefix = ref.moduleName.toLowerCase().substring(0, 8);
  const raCode = ref.raCode.toLowerCase();
  return allRas.find((r) => {
    const modStr = ((r.module || r.subject || '') + ' ' + (r.id || '')).toLowerCase();
    const sameModule = modStr.includes(moduleCode) || modStr.includes(modulePrefix);
    const sameRa =
      (r.id && r.id.toLowerCase().includes(raCode)) || (r.id && r.id.replace(/\D/g, '') === raIdx);
    return sameModule && sameRa;
  });
}

/**
 * Descripción del RA del currículum que corresponde a un RA del mapa: primero coincidencia
 * exacta, luego por texto normalizado y por último por módulo + código. Si no hay ninguna,
 * devuelve el texto del mapa en el idioma activo.
 */
export function findCurriculumMatch(
  allRas: CurriculumRa[],
  isCa: boolean,
  ref: RaReference,
): string | null {
  const match =
    findExact(allRas, ref) || findByText(allRas, ref) || findByModuleAndCode(allRas, ref);
  if (match) return match.description;
  return isCa ? ref.textCa || ref.textEs : ref.textEs || ref.textCa;
}

export function connectionTargetRef(c: IntermodularConnection): RaReference {
  return {
    moduleCode: c.targetModuleCode,
    moduleName: c.targetModuleName_es,
    raCode: c.targetRaCode,
    textEs: c.targetRaText_es,
    textCa: c.targetRaText_ca,
  };
}
