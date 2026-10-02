import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuplicateProjectsModalComponent } from './duplicate-projects-modal.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Project } from '../../features/projects/models/project.model';

const asProject = (p: object) => p as Project;

describe('DuplicateProjectsModalComponent', () => {
  let component: DuplicateProjectsModalComponent;
  let fixture: ComponentFixture<DuplicateProjectsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateProjectsModalComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DuplicateProjectsModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Ya existen proyectos');
    fixture.componentRef.setInput('message', 'Hay duplicados');
    fixture.componentRef.setInput('cancelLabel', 'Cancelar');
    fixture.componentRef.setInput('proceedLabel', 'Continuar');
    fixture.componentRef.setInput('projects', [
      {
        _id: 'p1',
        title: 'Duplicado',
        status: 'borrador',
        createdAt: new Date().toISOString(),
        modules: ['Mod A'],
      },
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
    component.cancelled.subscribe(cancelSpy);

    const buttons = fixture.nativeElement.querySelectorAll(
      '.duplicate-projects-modal__actions button',
    );
    (buttons[0] as HTMLButtonElement).click();
    (buttons[1] as HTMLButtonElement).click();

    expect(cancelSpy).toHaveBeenCalled();
    expect(proceedSpy).toHaveBeenCalled();
  });

  it('should fall back to modules when a project has no title', () => {
    fixture.componentRef.setInput('projects', [
      { _id: 'p2', status: 'borrador', modules: ['Mod B'] },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Mod B');
  });

  it('should emit cancel from the backdrop', () => {
    const cancelSpy = vi.fn();
    component.cancelled.subscribe(cancelSpy);
    (
      fixture.nativeElement.querySelector('.duplicate-projects-modal__backdrop') as HTMLElement
    ).click();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should resolve title and modules fallbacks', () => {
    expect(component.projectTitle(asProject({ _id: 'x', status: 'borrador' }))).toBe('Proyecto');
    expect(
      component.projectModules(asProject({ _id: 'x', generatedContent: { modules: ['G1'] } })),
    ).toBe('G1');
    expect(component.projectModules(asProject({ _id: 'x' }))).toBe('');
  });

  it('should render the modules condition for both true and false', () => {
    fixture.componentRef.setInput('projects', [
      { _id: 'a', status: 'borrador', modules: ['M1'] },
      { _id: 'b', status: 'borrador' },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('M1');
  });
});
