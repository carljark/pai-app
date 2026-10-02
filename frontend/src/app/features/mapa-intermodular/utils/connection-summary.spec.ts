import { describe, it, expect } from 'vitest';
import { formatConnection } from './connection-summary';
import { IntermodularActivity, IntermodularConnection } from '../models/mapa-intermodular.model';

const activity: IntermodularActivity = {
  id: 'a1',
  title_es: 'Actividad ES',
  title_ca: 'Activitat CA',
  description_es: 'Desc ES',
  description_ca: 'Desc CA',
  evidence_es: '',
  evidence_ca: '',
  diversitySupport_es: 'Div ES',
  diversitySupport_ca: 'Div CA',
};

function connection(overrides: Partial<IntermodularConnection> = {}): IntermodularConnection {
  return {
    targetModuleCode: '3061',
    targetModuleName_es: 'Módulo ES',
    targetModuleName_ca: 'Mòdul CA',
    targetRaCode: 'RA1',
    targetRaText_es: 'RA ES',
    targetRaText_ca: 'RA CA',
    relationType: 'tecnica',
    justification_es: 'Just ES',
    justification_ca: 'Just CA',
    activities: [activity],
    ...overrides,
  };
}

describe('formatConnection', () => {
  it('should format a full connection in castellano', () => {
    const text = formatConnection(
      connection({
        title_es: 'Título ES',
        sourceCriteria: 'a, b',
        relatedCriteria: [
          {
            moduleCode: '3061',
            moduleName_es: '',
            moduleName_ca: '',
            criteria: 'c',
            criteria_es: 'c ES',
          },
          { moduleCode: '3062', moduleName_es: '', moduleName_ca: '', criteria: 'd' },
        ],
      }),
      0,
      false,
    );
    expect(text).toContain('[1] Título ES');
    expect(text).toContain('Criterios propios: a, b');
    expect(text).toContain('Criterios relacionados: 3061: c ES | 3062: d');
    expect(text).toContain('Justificación: Just ES');
    expect(text).toContain('* Actividad: Actividad ES');
    expect(text).toContain('Desarrollo: Desc ES');
    expect(text).toContain('Atención Diversidad: Div ES');
  });

  it('should format a full connection in catalan with fallbacks', () => {
    const text = formatConnection(
      connection({
        title_es: 'Título ES',
        sourceCriteria: 'a',
        relatedCriteria: [
          {
            moduleCode: '3061',
            moduleName_es: '',
            moduleName_ca: '',
            criteria: 'c',
            criteria_ca: 'c CA',
          },
          { moduleCode: '3062', moduleName_es: '', moduleName_ca: '', criteria: 'd' },
        ],
      }),
      1,
      true,
    );
    expect(text).toContain('[2] Título ES');
    expect(text).toContain('Criteris propis: a');
    expect(text).toContain('Criteris relacionats: 3061: c CA | 3062: d');
    expect(text).toContain('Justificació: Just CA');
    expect(text).toContain('* Activitat: Activitat CA');
    expect(text).toContain('Desenvolupament: Desc CA');
    expect(text).toContain('Atenció Diversitat: Div CA');
  });

  it('should prefer the catalan title when present', () => {
    const text = formatConnection(connection({ title_ca: 'Títol CA' }), 0, true);
    expect(text).toContain('[1] Títol CA');
  });

  it('should fall back to module code and name without title, criteria or related items', () => {
    const es = formatConnection(connection({ relatedCriteria: [], activities: [] }), 0, false);
    expect(es).toContain('[1] 3061 - Módulo ES');
    expect(es).not.toContain('Criterios propios');
    expect(es).not.toContain('Criterios relacionados');

    const ca = formatConnection(connection(), 0, true);
    expect(ca).toContain('[1] 3061 - Mòdul CA');
    expect(ca).not.toContain('Criteris relacionats');
  });
});
