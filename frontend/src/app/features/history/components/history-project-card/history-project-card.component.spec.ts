import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryProjectCardComponent } from './history-project-card.component';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('HistoryProjectCardComponent', () => {
  let component: HistoryProjectCardComponent;
  let fixture: ComponentFixture<HistoryProjectCardComponent>;
  let mockProjectsFacade: any;
  let mockAuthFacade: any;

  const translations = {
    historyMyProjectBadge: 'Mío',
    historySharedBadge: 'Compartido',
    historySharedWith: 'Con',
    retryBtn: 'Reintentar',
    viewError: 'Ver Error',
    openEditor: 'Abrir Editor',
    deleteFile: 'Borrar archivo',
    aiGemini: 'Primario',
    aiOpenRouter: 'Secundario',
    untitledProject: 'Proyecto sin título',
    generatorCollaboratorsLabel: 'Compartir con (opcional)',
    generatorCollaboratorsEmpty: 'No hay otros usuarios disponibles.',
  };

  const baseProject = {
    _id: 'p1',
    title: 'Proyecto',
    status: 'borrador',
    createdAt: new Date().toISOString(),
    modules: ['Mod1'],
    tipoNivel: 'FP_BASICA',
    userId: { _id: 'user1', name: 'Eva' },
  };

  beforeEach(async () => {
    mockProjectsFacade = {
      directory: signal([{ _id: 'u2', name: 'Compañero', email: 'c@test.com', role: 'teacher' }]),
      getCollaboratorNames: vi.fn().mockReturnValue(['Compañero']),
      getCollaboratorIds: vi.fn().mockReturnValue(['u2']),
      isShared: vi.fn().mockReturnValue(true),
      addCollaborator: vi.fn().mockReturnValue(of({})),
      removeCollaborator: vi.fn().mockReturnValue(of({})),
    };

    mockAuthFacade = {
      currentUser: signal({ _id: 'user1', name: 'Eva', role: 'teacher' })
    };

    await TestBed.configureTestingModule({
      imports: [HistoryProjectCardComponent],
      providers: [
        { provide: AppFacade, useValue: { viewPastProject: vi.fn(), deleteProject: vi.fn(), retryProject: vi.fn() } },
        { provide: ProjectsFacade, useValue: mockProjectsFacade },
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: TranslationService, useValue: { t: signal(translations) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryProjectCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', baseProject);
    fixture.detectChanges();
  });

  it('should render title, shared badge and participants', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Proyecto');
    expect(text).toContain('Compartido');
    expect(text).toContain('Compañero');
  });

  it('should detect ownership and manage permissions', () => {
    expect(component.isMyProject()).toBe(true);
    expect(component.canManage()).toBe(true);
  });

  it('should toggle collaborator using add or remove', () => {
    component.toggle('u2');
    expect(mockProjectsFacade.removeCollaborator).toHaveBeenCalledWith('p1', 'u2');
  });

  it('should add collaborator when not present', () => {
    mockProjectsFacade.getCollaboratorIds.mockReturnValue([]);
    component.toggle('u3');
    expect(mockProjectsFacade.addCollaborator).toHaveBeenCalledWith('p1', 'u3');
  });

  it('should resolve display title and ai label', () => {
    fixture.componentRef.setInput('project', { ...baseProject, title: 'Proyecto Generado', modules: ['ModA', 'ModB'] });
    expect(component.getDisplayTitle()).toBe('ModA + ModB');

    fixture.componentRef.setInput('project', { ...baseProject, usedAiProvider: 'gemini' });
    expect(component.getAiProviderLabel()).toBe('Primario');
    fixture.componentRef.setInput('project', { ...baseProject, usedAiProvider: 'openrouter' });
    expect(component.getAiProviderLabel()).toBe('Secundario');
    fixture.componentRef.setInput('project', { ...baseProject, usedModel: 'gemini-3.6-flash' });
    expect(component.getAiProviderLabel()).toBe('Primario');
    fixture.componentRef.setInput('project', { ...baseProject });
    expect(component.getAiProviderLabel()).toBeNull();
  });

  it('should open the share panel and list the directory', () => {
    component.shareOpen.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Compartir con (opcional)');
    expect(fixture.nativeElement.textContent).toContain('Compañero');
  });

  it('should handle null user and admin ownership', () => {
    mockAuthFacade.currentUser.set(null);
    expect(component.canManage()).toBe(false);
    expect(component.isMyProject()).toBe(false);

    mockAuthFacade.currentUser.set({ _id: 'x', role: 'admin' });
    expect(component.canManage()).toBe(true);
  });

  it('should handle string userId and user.id fallback', () => {
    fixture.componentRef.setInput('project', { ...baseProject, userId: 'user1' });
    expect(component.canManage()).toBe(true);
    expect(component.isMyProject()).toBe(true);

    mockAuthFacade.currentUser.set({ id: 'user1', role: 'teacher' });
    expect(component.canManage()).toBe(true);
    expect(component.isMyProject()).toBe(true);
  });

  it('should resolve display title, modules and provider fallbacks', () => {
    fixture.componentRef.setInput('project', { ...baseProject, title: '', modules: [] });
    expect(component.getDisplayTitle()).toBe('Proyecto sin título');

    fixture.componentRef.setInput('project', { ...baseProject, title: 'X', modules: [], generatedContent: { modules: ['G1'] } });
    expect(component.modulesLabel()).toBe('G1');

    fixture.componentRef.setInput('project', { ...baseProject, title: 'X', modules: [] });
    expect(component.modulesLabel()).toBe('Varios');

    fixture.componentRef.setInput('project', { ...baseProject, title: 'X', usedModel: 'deepseek/xx' });
    expect(component.getAiProviderLabel()).toBe('Secundario');
  });

  it('should log error when collaborator action fails', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockProjectsFacade.removeCollaborator.mockReturnValue(throwError(() => new Error('fail')));
    component.toggle('u2');
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('should render card actions, error state and share panel events', () => {
    mockAuthFacade.currentUser.set({ _id: 'user1', role: 'admin' });
    fixture.componentRef.setInput('project', {
      ...baseProject,
      status: 'error',
      errorDetail: 'Fallo',
      generationTimeMs: 1500,
      courseLevel: '1º',
      usedAiProvider: 'gemini'
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('⏱️');
    expect(text).toContain('1º');

    (fixture.nativeElement.querySelector('.history-project-card__retry') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('.history-project-card__view-error') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('.history-project-card__delete') as HTMLButtonElement).click();

    (fixture.nativeElement.querySelector('.history-project-card__share-toggle') as HTMLButtonElement).click();
    fixture.detectChanges();

    const cb = fixture.nativeElement.querySelector('.history-project-card__share-option input') as HTMLInputElement;
    cb.dispatchEvent(new Event('change'));
    expect(mockProjectsFacade.removeCollaborator).toHaveBeenCalled();
  });

  it('should render openEditor for published and error without errorDetail', () => {
    fixture.componentRef.setInput('project', { ...baseProject, status: 'publicado' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.btn-primary')).toBeTruthy();

    fixture.componentRef.setInput('project', { ...baseProject, status: 'error', error: 'Solo error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Solo error');
  });
});
