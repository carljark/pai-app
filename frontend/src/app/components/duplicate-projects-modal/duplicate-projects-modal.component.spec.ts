import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuplicateProjectsModalComponent } from './duplicate-projects-modal.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DuplicateProjectsModalComponent', () => {
  let component: DuplicateProjectsModalComponent;
  let fixture: ComponentFixture<DuplicateProjectsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DuplicateProjectsModalComponent] }).compileComponents();
    fixture = TestBed.createComponent(DuplicateProjectsModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Ya existen proyectos');
    fixture.componentRef.setInput('message', 'Hay duplicados');
    fixture.componentRef.setInput('cancelLabel', 'Cancelar');
    fixture.componentRef.setInput('proceedLabel', 'Continuar');
    fixture.componentRef.setInput('projects', [
      { _id: 'p1', title: 'Duplicado', status: 'borrador', createdAt: new Date().toISOString(), modules: ['Mod A'] },
    ]);
    fixture.detectChanges();
  });

  it('should render title, message and projects', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Ya existen proyectos');
    expect(text).toContain('Hay duplicados');
    expect(text).toContain('Duplicado');
    expect(text).toContain('Cancelar');
    expect(text).toContain('Continuar');
  });

  it('should emit openProject when a project link is clicked', () => {
    const spy = vi.fn();
    component.openProject.subscribe(spy);
    fixture.nativeElement.querySelector('.duplicate-projects-modal__link').click();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ _id: 'p1' }));
  });

  it('should emit proceed and cancel', () => {
    const proceedSpy = vi.fn();
    const cancelSpy = vi.fn();
    component.proceed.subscribe(proceedSpy);
    component.cancel.subscribe(cancelSpy);

    const buttons = fixture.nativeElement.querySelectorAll('.duplicate-projects-modal__actions button');
    (buttons[0] as HTMLButtonElement).click();
    (buttons[1] as HTMLButtonElement).click();

    expect(cancelSpy).toHaveBeenCalled();
    expect(proceedSpy).toHaveBeenCalled();
  });

  it('should fall back to modules when a project has no title', () => {
    fixture.componentRef.setInput('projects', [{ _id: 'p2', status: 'borrador', modules: ['Mod B'] }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Mod B');
  });
});
