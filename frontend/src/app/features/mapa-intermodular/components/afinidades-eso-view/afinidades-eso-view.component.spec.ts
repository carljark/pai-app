import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AfinidadesEsoViewComponent } from './afinidades-eso-view.component';
import { LayoutService } from '../../../../services/layout.service';
import { loadNivelesMock } from '../../../../testing/niveles.mock';
import { AFINIDADES_1, AFINIDADES_2, NIVEL_AFINIDADES } from '../../../../testing/afinidades.mock';

describe('AfinidadesEsoViewComponent', () => {
  let fixture: ComponentFixture<AfinidadesEsoViewComponent>;
  let http: HttpTestingController;
  let language: ReturnType<typeof signal<'castellano' | 'catalan'>>;
  let el: HTMLElement;

  const flushTab = async (tab: string, body: any) => {
    await fixture.whenStable();
    http
      .expectOne((r) => r.url === '/api/afinidades-eso' && r.params.get('tab') === tab)
      .flush(body);
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const botones = () =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('.afinidades-eso__materia'));

  beforeEach(async () => {
    language = signal<'castellano' | 'catalan'>('castellano');
    TestBed.configureTestingModule({
      imports: [AfinidadesEsoViewComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LayoutService, useValue: { language } },
      ],
    });
    loadNivelesMock([NIVEL_AFINIDADES]);
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AfinidadesEsoViewComponent);
    el = fixture.nativeElement;
    fixture.componentRef.setInput('tab', 'ESO_1');
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('muestra el estado de carga y después las materias y fichas', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('app-skeleton-loader')).toBeTruthy();
    expect(el.textContent).toContain('Cargando afinidades');
    await flushTab('ESO_1', AFINIDADES_1);

    expect(el.querySelector('app-skeleton-loader')).toBeNull();
    expect(el.querySelector('.afinidades-eso__titulo')?.textContent).toContain(
      'Afinidades curriculares · ESO 1.er curso',
    );
    expect(botones().map((b) => b.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'Biología y Geología2',
      'Matemáticas2',
      'Tecnología1',
      'Educación Física0',
    ]);
    expect(botones()[1]!.getAttribute('aria-pressed')).toBe('true');
    expect(el.querySelectorAll('app-afinidad-card').length).toBe(2);
    expect(el.querySelector('.afinidades-eso__fichas h3')?.textContent).toContain(
      'Matemáticas · 2 fichas',
    );
  });

  it('cambia las fichas al hacer clic en una materia y muestra el estado vacío', async () => {
    await flushTab('ESO_1', AFINIDADES_1);
    botones()[2]!.click();
    fixture.detectChanges();
    expect(botones()[2]!.getAttribute('aria-pressed')).toBe('true');
    expect(el.querySelectorAll('app-afinidad-card').length).toBe(1);

    botones()[3]!.click();
    fixture.detectChanges();
    expect(el.querySelectorAll('app-afinidad-card').length).toBe(0);
    expect(el.querySelector('.afinidades-eso__fichas')?.textContent).toContain(
      'Esta materia aún no tiene fichas en este curso.',
    );
  });

  it('muestra el error si falla la petición', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await fixture.whenStable();
    http
      .expectOne((r) => r.url === '/api/afinidades-eso')
      .flush('x', { status: 500, statusText: 'Error' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('.afinidades-eso__estado--error')?.textContent).toContain(
      'No se han podido cargar las afinidades.',
    );
    expect(el.querySelector('.afinidades-eso__layout')).toBeNull();
    language.set('catalan');
    fixture.detectChanges();
    expect(el.querySelector('.afinidades-eso__estado--error')?.textContent).toContain(
      'No s’han pogut carregar les afinitats.',
    );
    spy.mockRestore();
  });

  it('vuelve a cargar al cambiar el input tab y usa la primera materia si la inicial no existe', async () => {
    await flushTab('ESO_1', AFINIDADES_1);
    fixture.componentRef.setInput('tab', 'ESO_2');
    fixture.detectChanges();
    await flushTab('ESO_2', AFINIDADES_2);

    expect(botones().length).toBe(1);
    expect(botones()[0]!.getAttribute('aria-pressed')).toBe('true');
    expect(el.querySelector('.afinidades-eso__titulo')?.textContent).toContain('ESO 2.º curso');
  });

  it('muestra todo en catalán', async () => {
    language.set('catalan');
    await flushTab('ESO_1', AFINIDADES_1);
    expect(el.querySelector('.afinidades-eso__titulo')?.textContent).toContain(
      'Afinitats curriculars · ESO 1r curs',
    );
    expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe('Matèries');
    expect(botones()[0]!.textContent).toContain('Biologia i Geologia');
    expect(el.querySelector('.afinidades-eso__fichas h3')?.textContent).toContain(
      'Matemàtiques · 2 fitxes',
    );
    botones()[3]!.click();
    fixture.detectChanges();
    expect(el.textContent).toContain('Aquesta matèria encara no té fitxes en aquest curs.');
  });

  it('con una pestaña fuera del catálogo carga sin materia inicial ni curso', async () => {
    await flushTab('ESO_1', AFINIDADES_1);
    fixture.componentRef.setInput('tab', 'DESCONOCIDA');
    fixture.detectChanges();
    await flushTab('DESCONOCIDA', AFINIDADES_2);
    expect(el.querySelector('.afinidades-eso__titulo')?.textContent).toContain('ESO');
    expect(botones()[0]!.getAttribute('aria-pressed')).toBe('true');
  });
});
