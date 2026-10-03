import { describe, it, expect } from 'vitest';
import { buildViewUrl, parseViewRoute } from './view-route';

describe('view-route', () => {
  it('lee la vista y el proyecto del taller', () => {
    expect(parseViewRoute('?view=history')).toEqual({ view: 'history' });
    expect(parseViewRoute('?view=taller&project=p1')).toEqual({ view: 'taller', project: 'p1' });
  });

  it('ignora el proyecto fuera del taller y las vistas desconocidas', () => {
    expect(parseViewRoute('?view=history&project=p1')).toEqual({ view: 'history' });
    expect(parseViewRoute('?view=inventada')).toBeNull();
    expect(parseViewRoute('')).toBeNull();
  });

  it('convierte los enlaces antiguos ?project=<id> en el taller', () => {
    expect(parseViewRoute('?project=p1')).toEqual({ view: 'taller', project: 'p1' });
    expect(parseViewRoute('?view=inventada&project=p1')).toEqual({ view: 'taller', project: 'p1' });
  });

  it('construye la URL de una pantalla', () => {
    expect(buildViewUrl({ view: 'home' }, '/')).toBe('/?view=home');
    expect(buildViewUrl({ view: 'taller', project: 'p 1' }, '/app')).toBe(
      '/app?view=taller&project=p+1',
    );
  });
});
