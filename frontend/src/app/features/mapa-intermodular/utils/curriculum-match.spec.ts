import { describe, it, expect } from 'vitest';
import { connectionTargetRef, findCurriculumMatch, RaReference } from './curriculum-match';
import { LearningOutcome as CurriculumRa } from '../../curriculum/models/curriculum.model';
import { IntermodularConnection } from '../models/mapa-intermodular.model';

const ref: RaReference = {
  moduleCode: '3060',
  moduleName: 'Preparación del entorno',
  raCode: 'RA2',
  textEs: 'Prepara el puesto de trabajo identificando las fases del proceso',
  textCa: 'Prepara el lloc de treball identificant les fases del procés',
};

describe('findCurriculumMatch', () => {
  it('should return an exact match in either language', () => {
    expect(findCurriculumMatch([{ description: ref.textEs }], false, ref)).toBe(ref.textEs);
    expect(findCurriculumMatch([{ description: ref.textCa }], true, ref)).toBe(ref.textCa);
  });

  it('should match by normalized text in castellano or catalan', () => {
    const es: CurriculumRa = { description: `1. ${ref.textEs}, con más detalle` };
    const ca: CurriculumRa = { description: `1. ${ref.textCa}, amb més detall` };
    expect(findCurriculumMatch([es], false, ref)).toBe(es.description);
    expect(findCurriculumMatch([ca], true, ref)).toBe(ca.description);
  });

  it('should match when the curriculum text is a prefix of the map text', () => {
    const short: CurriculumRa = { description: 'Prepara el puesto' };
    expect(findCurriculumMatch([short], false, ref)).toBe(short.description);
  });

  it('should match by module name/code and RA code or index', () => {
    const byCode: CurriculumRa = { description: 'Otro texto', module: '3060. Módulo', id: 'RA2' };
    const byIndex: CurriculumRa = {
      description: 'Texto distinto',
      subject: 'Preparación del entorno',
      id: 'ra-x2',
    };
    expect(findCurriculumMatch([byCode], false, ref)).toBe('Otro texto');
    expect(findCurriculumMatch([byIndex], false, ref)).toBe('Texto distinto');
  });

  it('should skip RAs without description, module or id', () => {
    const empty = { description: '' } as CurriculumRa;
    const otherModule: CurriculumRa = { description: 'Nada que ver', id: 'RA2' };
    expect(findCurriculumMatch([empty, otherModule], false, ref)).toBe(ref.textEs);
  });

  it('should fall back to the map text in the active language', () => {
    expect(findCurriculumMatch([], false, ref)).toBe(ref.textEs);
    expect(findCurriculumMatch([], true, ref)).toBe(ref.textCa);
    expect(findCurriculumMatch([], true, { ...ref, textCa: '' })).toBe(ref.textEs);
    expect(findCurriculumMatch([], false, { ...ref, textEs: '' })).toBe(ref.textCa);
  });
});

describe('connectionTargetRef', () => {
  it('should build a reference from the connection target', () => {
    const conn = {
      targetModuleCode: '3061',
      targetModuleName_es: 'Destino',
      targetRaCode: 'RA3',
      targetRaText_es: 'Texto ES',
      targetRaText_ca: 'Text CA',
    } as IntermodularConnection;
    expect(connectionTargetRef(conn)).toEqual({
      moduleCode: '3061',
      moduleName: 'Destino',
      raCode: 'RA3',
      textEs: 'Texto ES',
      textCa: 'Text CA',
    });
  });
});
