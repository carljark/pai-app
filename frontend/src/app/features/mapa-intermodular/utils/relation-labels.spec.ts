import { describe, expect, it } from 'vitest';
import { RELATION_COLORS, RELATION_TYPES, relationColor, relationLabel } from './relation-labels';

describe('relation-labels', () => {
  it('traduce cada tipo de competencia', () => {
    expect(relationLabel('tecnica', false)).toBe('Técnica Práctica');
    expect(relationLabel('tecnica', true)).toBe('Tècnica Pràctica');
    expect(relationLabel('otro', true)).toBe('otro');
  });

  it('da un color a cada tipo y gris a los desconocidos', () => {
    expect(RELATION_TYPES).toHaveLength(7);
    expect(relationColor('digital')).toBe(RELATION_COLORS.digital);
    expect(relationColor('otro')).toBe('#6b7280');
  });
});
