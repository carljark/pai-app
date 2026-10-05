import { describe, it, expect } from 'vitest';
import { CourseLevelKeyPipe } from './course-level-key.pipe';

describe('CourseLevelKeyPipe', () => {
  const pipe = new CourseLevelKeyPipe();

  it('returns the translation key of each level', () => {
    expect(pipe.transform('ESO_ORDINARIA')).toBe('courseLevelESO');
    expect(pipe.transform('DIVERSIFICACION_CURRICULAR')).toBe('courseLevelPDC');
    expect(pipe.transform('CFGS_EDUCACION_INFANTIL')).toBe('courseLevelCFGSEducacionInfantil');
    expect(pipe.transform(undefined)).toBe('courseLevelFP');
  });
});
