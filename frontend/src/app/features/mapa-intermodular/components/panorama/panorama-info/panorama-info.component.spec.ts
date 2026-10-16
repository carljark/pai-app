import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { mindmapModules } from '../../../../../testing/mindmap.mock';
import { layoutPanorama } from '../../../utils/panorama-layout';
import { PanoramaInfoComponent } from './panorama-info.component';

describe('PanoramaInfoComponent', () => {
  const layout = layoutPanorama(mindmapModules(), false);
  const target = layout.leaves.find((l) => l.id === '0002_RA1')!;

  function render(inputs: Record<string, unknown>, isCa = false) {
    const fixture = TestBed.createComponent(PanoramaInfoComponent);
    fixture.componentRef.setInput('totals', { ras: 4, connections: 2, outside: 2 });
    fixture.componentRef.setInput('isCa', isCa);
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).textContent!.replace(/\s+/g, ' ');
  }

  it('sin resaltado muestra los totales y las conexiones que quedan fuera', () => {
    const text = render({});
    expect(text).toContain('4 RA · 2 conexiones');
    expect(text).toContain('2 conexiones con destino fuera de este curso no se dibujan.');
    expect(text).toContain('Pasa el ratón');
  });

  it('con un RA resaltado muestra su texto y sus conexiones', () => {
    const text = render({ leaf: target });
    expect(text).toContain('0002 · Calidad en el laboratorio');
    expect(text).toContain('RA1. Resultado RA1 de 0002');
    expect(text).toContain('0 salientes');
    expect(text).toContain('2 entrantes');
    expect(text).toContain('Pulsa para abrirlo en el mapa mental.');
  });

  it('con un módulo resaltado muestra su nombre y sus conexiones', () => {
    const text = render({ arc: layout.arcs[0] });
    expect(text).toContain('Análisis clínico');
    expect(text).toContain('2 salientes');
  });

  it('se traduce al catalán', () => {
    expect(render({}, true)).toContain('connexions amb destinació fora d’aquest curs');
    expect(render({ leaf: target }, true)).toContain('2 entrants');
    expect(render({ arc: layout.arcs[0] }, true)).toContain('2 sortints');
  });

  it('no avisa de conexiones fuera si no las hay', () => {
    const fixture = TestBed.createComponent(PanoramaInfoComponent);
    fixture.componentRef.setInput('totals', { ras: 4, connections: 2, outside: 0 });
    fixture.componentRef.setInput('isCa', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('fuera de este curso');
  });
});
