import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentActivityModalComponent } from './recent-activity-modal.component';
import { ComponentRef } from '@angular/core';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('RecentActivityModalComponent', () => {
  let component: RecentActivityModalComponent;
  let fixture: ComponentFixture<RecentActivityModalComponent>;
  let componentRef: ComponentRef<RecentActivityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentActivityModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RecentActivityModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('isOpen', true);
    componentRef.setInput('recentProjects', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render anything when isOpen is false', () => {
    componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.modal')).toBeNull();
    expect(compiled.textContent?.trim()).toBe('');
  });

  it('should emit closeModal when backdrop or close button is clicked', () => {
    const emitSpy = vi.spyOn(component.closeModal, 'emit');
    const compiled = fixture.nativeElement as HTMLElement;

    const backdrop = compiled.querySelector('div[style*="rgba(0,0,0,0.5)"]') as HTMLElement;
    backdrop.click();
    expect(emitSpy).toHaveBeenCalledTimes(1);

    const closeBtn = compiled.querySelector('button') as HTMLElement;
    closeBtn.click();
    expect(emitSpy).toHaveBeenCalledTimes(2);
  });

  it('should display phases: analizando and reintentando with time warnings', () => {
    const projects = [
      { _id: '1', status: 'generando', phase: 'analizando', modules: ['Ciencias'], rasCount: 1 },
      { _id: '2', status: 'generando', phase: 'reintentando', modules: ['TIC'], rasCount: 4 },
      { _id: '3', status: 'borrador', modules: ['Matemáticas'], generationTimeMs: 25000 }
    ];
    componentRef.setInput('recentProjects', projects);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Analizando...');
    expect(compiled.textContent).toContain('Reintentando...');
    expect(compiled.textContent).toContain('Tardará entre 2 y 20 minutos');
    expect(compiled.textContent).toContain('Completado');
    expect(compiled.textContent).toContain('25.0s');
  });

  it('should format duration and elapsed time correctly', () => {
    expect(component.formatElapsed(0)).toBe('00:00');
    expect(component.formatElapsed(75)).toBe('01:15');
    expect(component.formatDurationMs(12000)).toBe('12.0s');
    expect(component.formatDurationMs(undefined)).toBe('');
    expect(component.getElapsedTime(null)).toBe('00:00');
  });

  it('should display author using userEmail when available, falling back to userName', () => {
    const projects = [
      { _id: '1', status: 'borrador', userEmail: 'profesor@test.com', userName: 'Profesor' },
      { _id: '2', status: 'borrador', userName: 'SoloNombre' }
    ];
    componentRef.setInput('recentProjects', projects);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('profesor@test.com');
    expect(compiled.textContent).toContain('SoloNombre');
  });

  it('should check isToday accurately for today, yesterday, older and invalid dates', () => {
    const fixedNow = new Date(2026, 8, 24, 12, 0, 0).getTime();
    componentRef.setInput('now', fixedNow);
    fixture.detectChanges();

    const todayDate = new Date(2026, 8, 24, 8, 30, 0);
    const yesterdayDate = new Date(2026, 8, 23, 23, 59, 0);
    const olderDate = new Date(2026, 7, 10, 10, 0, 0);

    expect(component.isToday(todayDate)).toBe(true);
    expect(component.isToday(yesterdayDate)).toBe(false);
    expect(component.isToday(olderDate)).toBe(false);
    expect(component.isToday(null)).toBe(false);
    expect(component.isToday(undefined)).toBe(false);
    expect(component.isToday('invalid-date')).toBe(false);
  });

  it('should render shortTime for today and full date (dd/MM/yyyy) for yesterday or earlier in template', () => {
    const fixedNow = new Date(2026, 8, 24, 12, 0, 0).getTime();
    componentRef.setInput('now', fixedNow);

    const todayDate = new Date(2026, 8, 24, 9, 15, 0);
    const yesterdayDate = new Date(2026, 8, 23, 16, 45, 0);

    const projects = [
      { _id: 'p-today', status: 'borrador', title: 'Proyecto Hoy', createdAt: todayDate.toISOString() },
      { _id: 'p-yesterday', status: 'borrador', title: 'Proyecto Ayer', createdAt: yesterdayDate.toISOString() }
    ];
    componentRef.setInput('recentProjects', projects);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Proyecto Hoy');
    expect(compiled.textContent).toContain('Proyecto Ayer');
    // For yesterday, the full date 23/09/2026 must be present
    expect(compiled.textContent).toContain('23/09/2026');
  });

  it('should getErrorMessage correctly for various project structures', () => {
    expect(component.getErrorMessage(null)).toBeNull();
    expect(component.getErrorMessage({ status: 'borrador' })).toBeNull();
    expect(component.getErrorMessage({ status: 'error', errorDetail: 'Error detallado' })).toBe('Error detallado');
    expect(component.getErrorMessage({ status: 'error', error: 'Error simple' })).toBe('Error simple');
    expect(component.getErrorMessage({ status: 'error', message: 'Mensaje de error custom', title: 'Otro' })).toBe('Mensaje de error custom');
    expect(component.getErrorMessage({ status: 'error', message: 'Proyecto Educativo', title: 'Proyecto Educativo' })).toBeNull();
  });

  it('should render error banner in template when project has status error', () => {
    const projects = [
      { _id: 'p-err', status: 'error', title: 'Proyecto Fallido', errorDetail: 'El modelo IA ha agotado el tiempo de espera' }
    ];
    componentRef.setInput('recentProjects', projects);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Error');
    expect(compiled.textContent).toContain('El modelo IA ha agotado el tiempo de espera');
  });
});
