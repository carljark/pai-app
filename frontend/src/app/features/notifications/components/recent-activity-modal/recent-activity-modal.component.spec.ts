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
    expect(compiled.textContent).toContain('Tardará entre 2 y 10 minutos');
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
});
