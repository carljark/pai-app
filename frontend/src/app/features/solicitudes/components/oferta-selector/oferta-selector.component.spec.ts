import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OfertaSelectorComponent } from './oferta-selector.component';
import { LayoutService } from '../../../../services/layout.service';
import { CicloOferta } from '../../models/solicitud.model';

const OFERTA: CicloOferta[] = [
  {
    codigo: 'SSC33',
    etapa: 'CFGS',
    familia_es: 'Servicios Socioculturales y a la Comunidad',
    familia_ca: 'Serveis socioculturals i a la comunitat',
    nombre_es: 'Integración Social',
    nombre_ca: 'Integració social',
    disponible: 'CFGS_INTEGRACION_SOCIAL',
  },
  {
    codigo: 'SAN36',
    etapa: 'CFGS',
    familia_es: 'Sanidad',
    familia_ca: 'Sanitat',
    nombre_es: 'Laboratorio Clínico y Biomédico',
    nombre_ca: 'Laboratori clínic i biomèdic',
    disponible: null,
  },
  {
    codigo: 'IMP11',
    etapa: 'FPB',
    familia_es: 'Imagen Personal',
    familia_ca: 'Imatge personal',
    nombre_es: 'Peluquería y Estética',
    nombre_ca: 'Perruqueria i estètica',
    disponible: 'FP_BASICA',
  },
];

describe('OfertaSelectorComponent', () => {
  afterEach(() => {
    TestBed.inject(LayoutService).language.set('castellano');
    localStorage.removeItem('pai_lang');
  });

  let fixture: ComponentFixture<OfertaSelectorComponent>;
  let el: HTMLElement;
  let layout: LayoutService;

  const nombres = () =>
    Array.from(el.querySelectorAll('.oferta-selector__nombre')).map((n) => n.textContent?.trim());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertaSelectorComponent],
    }).compileComponents();
    layout = TestBed.inject(LayoutService);
    layout.language.set('castellano');
    fixture = TestBed.createComponent(OfertaSelectorComponent);
    fixture.componentRef.setInput('oferta', OFERTA);
    el = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('muestra la oferta y marca los ciclos disponibles', () => {
    expect(nombres()).toEqual([
      'CFGS Integración Social',
      'CFGS Laboratorio Clínico y Biomédico',
      'FPB Peluquería y Estética',
    ]);
    expect(el.querySelectorAll('.oferta-selector__disponible')).toHaveLength(2);
  });

  it('busca sin tener en cuenta tildes y filtra por grado', async () => {
    const buscador = el.querySelector('.oferta-selector__buscador') as HTMLInputElement;
    buscador.value = 'biomedico';
    buscador.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(nombres()).toEqual(['CFGS Laboratorio Clínico y Biomédico']);

    buscador.value = '';
    buscador.dispatchEvent(new Event('input'));
    const etapa = el.querySelector('.oferta-selector__etapa') as HTMLSelectElement;
    etapa.value = 'FPB';
    etapa.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(nombres()).toEqual(['FPB Peluquería y Estética']);

    buscador.value = 'nada';
    buscador.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(el.querySelector('.oferta-selector__vacio')).toBeTruthy();
  });

  it('selecciona y deselecciona ciclos', () => {
    const checks = () =>
      el.querySelectorAll('.oferta-selector__check') as NodeListOf<HTMLInputElement>;
    checks()[1]!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.seleccionados()).toEqual(['SAN36']);
    expect(checks()[1]!.checked).toBe(true);
    expect(el.querySelector('.oferta-selector__contador')?.textContent).toContain('1');
    checks()[1]!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.seleccionados()).toEqual([]);
  });

  it('usa los nombres y familias en catalán', () => {
    layout.language.set('catalan');
    fixture.detectChanges();
    expect(nombres()[0]).toBe('CFGS Integració social');
    expect(el.querySelector('.oferta-selector__familia')?.textContent).toContain(
      'Serveis socioculturals',
    );
  });
});
