import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryProjectCardComponent } from './history-project-card.component';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('HistoryProjectCardComponent', () => {
  let component: HistoryProjectCardComponent;
  let fixture: ComponentFixture<HistoryProjectCardComponent>;
  let mockProjectsFacade: any;

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

    await TestBed.configureTestingModule({
      imports: [HistoryProjectCardComponent],
      providers: [
        { provide: AppFacade, useValue: { viewPastProject: vi.fn(), deleteProject: vi.fn(), retryProject: vi.fn() } },
        { provide: ProjectsFacade, useValue: mockProjectsFacade },
        { provide: AuthFacade, useValue: { currentUser: signal({ _id: 'user1', name: 'Eva', role: 'teacher' }) } },
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
});
