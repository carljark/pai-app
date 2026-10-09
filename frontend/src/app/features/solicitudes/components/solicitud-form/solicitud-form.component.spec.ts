import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SolicitudFormComponent } from './solicitud-form.component';
import { SolicitudesService } from '../../services/solicitudes.service';
import { LayoutService } from '../../../../services/layout.service';

const OFERTA = [
  {
    codigo: 'SAN36',
    etapa: 'CFGS',
    familia_es: 'Sanidad',
    familia_ca: 'Sanitat',
    nombre_es: 'Laboratorio Clínico y Biomédico',
    nombre_ca: 'Laboratori clínic i biomèdic',
    disponible: null,
  },
];

describe('SolicitudFormComponent', () => {
  afterEach(() => {
    TestBed.inject(LayoutService).language.set('castellano');
    localStorage.removeItem('pai_lang');
  });

  let fixture: ComponentFixture<SolicitudFormComponent>;
  let el: HTMLElement;
  let service: any;

  const escribir = (selector: string, valor: string) => {
    const campo = el.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const boton = () => el.querySelector('.solicitud-form__enviar') as HTMLButtonElement;

  const crear = async (loadOferta = vi.fn().mockReturnValue(of(OFERTA))) => {
    service = {
      oferta: signal(OFERTA),
      isSubmitting: signal(false),
      loadOferta,
      enviar: vi.fn().mockReturnValue(of({ _id: 's1' })),
    };
    await TestBed.configureTestingModule({
      imports: [SolicitudFormComponent],
      providers: [{ provide: SolicitudesService, useValue: service }],
    }).compileComponents();
    TestBed.inject(LayoutService).language.set('catalan');
    fixture = TestBed.createComponent(SolicitudFormComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  describe('con la oferta cargada', () => {
    beforeEach(async () => await crear());

    it('solo permite enviar con nombre de centro y algún ciclo', () => {
      expect(boton().disabled).toBe(true);
      escribir('.solicitud-form__nombre', 'IES Joan Ramis');
      expect(boton().disabled).toBe(true);
      escribir('.solicitud-form__otros', 'Ciclo A\n\n  Ciclo B ');
      expect(boton().disabled).toBe(false);
      fixture.componentInstance.campos.update((c) => ({ ...c, nombre: '' }));
      fixture.componentInstance.enviar();
      expect(service.enviar).not.toHaveBeenCalled();
    });

    it('envía la solicitud con los ciclos marcados y el idioma, y vacía el formulario', () => {
      escribir('.solicitud-form__nombre', ' IES Joan Ramis ');
      escribir('.solicitud-form__municipio', 'Maó');
      escribir('.solicitud-form__web', 'https://ies.example');
      escribir('.solicitud-form__comentario', 'Urgente');
      (el.querySelector('.oferta-selector__check') as HTMLInputElement).click();
      fixture.detectChanges();
      boton().click();
      fixture.detectChanges();

      expect(service.enviar).toHaveBeenCalledWith({
        centro: { nombre: 'IES Joan Ramis', municipio: 'Maó', web: 'https://ies.example' },
        ciclos: ['SAN36'],
        otros: [],
        comentario: 'Urgente',
        idioma: 'ca',
      });
      expect(el.querySelector('.solicitud-form__mensaje--ok')).toBeTruthy();
      expect((el.querySelector('.solicitud-form__nombre') as HTMLInputElement).value).toBe('');
      expect(fixture.componentInstance.seleccionados()).toEqual([]);
    });

    it('muestra el error del backend o uno genérico', () => {
      escribir('.solicitud-form__nombre', 'IES');
      escribir('.solicitud-form__otros', 'Ciclo');
      service.enviar.mockReturnValueOnce(throwError(() => ({ error: { error: 'Demasiadas' } })));
      boton().click();
      fixture.detectChanges();
      expect(el.querySelector('.solicitud-form__mensaje--error')?.textContent).toContain(
        'Demasiadas',
      );

      service.enviar.mockReturnValueOnce(throwError(() => ({})));
      boton().click();
      fixture.detectChanges();
      expect(el.querySelector('.solicitud-form__mensaje--error')?.textContent).toContain(
        "No s'ha pogut enviar",
      );
    });

    it('cambia el texto del botón mientras envía', () => {
      service.isSubmitting.set(true);
      fixture.detectChanges();
      expect(boton().textContent).toContain('Enviant');
    });
  });

  it('avisa si no se puede cargar la oferta', async () => {
    await crear(vi.fn().mockReturnValue(throwError(() => new Error('x'))));
    fixture.detectChanges();
    expect(el.querySelector('.solicitud-form__mensaje--error')?.textContent).toContain(
      'llista de cicles',
    );
  });
});
