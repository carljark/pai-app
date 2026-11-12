import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { computed, signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReviewApplyFacade } from './review-apply.facade';
import { ProjectsFacade } from './projects.facade';
import { ProjectsService } from './projects.service';
import { EditLockFacade } from './edit-lock.facade';
import { Project } from '../models/project.model';

const asProject = (p: object) => p as Project;

describe('ReviewApplyFacade', () => {
  let facade: ReviewApplyFacade;
  let projects: any;
  let service: { applyReviewSuggestion: ReturnType<typeof vi.fn> };
  let editLock: { handleConflict: ReturnType<typeof vi.fn> };
  let save: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    const projectsHistory = signal<Project[]>([
      asProject({
        _id: 'p1',
        title: 'P',
        review: { status: 'completada', applied: ['assessment:0'] },
      }),
      asProject({ _id: 'p2', title: 'Otro' }),
    ]);
    const currentProjectId = signal<string | null>('p1');
    save = vi.fn();
    projects = {
      projectsHistory,
      currentProjectId,
      currentProject: computed(() => projectsHistory().find((p) => p._id === currentProjectId())),
      generatedProject: signal('# Texto'),
      isThinking: signal(false),
      selectedAi: signal('gemini'),
      selectedModel: signal('gemini-3.6-flash'),
      pushUndo: vi.fn(),
      popUndo: vi.fn(),
      updateProjectStatus: vi.fn(() => ({ subscribe: save })),
    };
    service = {
      applyReviewSuggestion: vi.fn(() =>
        of({ newText: '# Nuevo', section: 'Evaluación', applied: ['assessment:1'] }),
      ),
    };
    editLock = { handleConflict: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: ProjectsFacade, useValue: projects },
        { provide: ProjectsService, useValue: service },
        { provide: EditLockFacade, useValue: editLock },
      ],
    });
    facade = TestBed.inject(ReviewApplyFacade);
  });

  it('aplica una sugerencia: deshacer, texto nuevo, guardado como borrador y marca', () => {
    facade.apply('assessment', 1);
    expect(service.applyReviewSuggestion).toHaveBeenCalledWith('p1', {
      context: '# Texto',
      dimension: 'assessment',
      index: 1,
      aiProvider: 'gemini',
      aiModel: 'gemini-3.6-flash',
    });
    expect(projects.pushUndo).toHaveBeenCalled();
    expect(projects.generatedProject()).toBe('# Nuevo');
    expect(projects.updateProjectStatus).toHaveBeenCalledWith('borrador');
    expect(save).toHaveBeenCalled();
    expect(projects.projectsHistory()[0].review.applied).toEqual(['assessment:0', 'assessment:1']);
    expect(facade.applying()).toBeNull();
    expect(projects.isThinking()).toBe(false);
  });

  it('«Aplicar todas» no envía índice', () => {
    facade.apply('assessment');
    expect(service.applyReviewSuggestion.mock.calls[0]![1]).not.toHaveProperty('index');
  });

  it('si falla, deshace el guardado de estado y avisa (también del turno ocupado)', () => {
    const err = new HttpErrorResponse({ status: 409 });
    service.applyReviewSuggestion.mockReturnValue(throwError(() => err));
    facade.apply('assessment', 0);
    expect(projects.popUndo).toHaveBeenCalled();
    expect(facade.failed()).toBe('assessment:0');
    expect(editLock.handleConflict).toHaveBeenCalledWith(err);
    expect(projects.generatedProject()).toBe('# Texto');
    expect(facade.applying()).toBeNull();
  });

  it('no hace nada sin proyecto, sin texto o con la IA ocupada', () => {
    projects.isThinking.set(true);
    facade.apply('assessment', 0);
    projects.isThinking.set(false);
    projects.generatedProject.set('');
    facade.apply('assessment', 0);
    projects.currentProjectId.set(null);
    facade.apply('assessment', 0);
    expect(service.applyReviewSuggestion).not.toHaveBeenCalled();
  });

  it('marca sugerencias aunque el proyecto no tuviera ninguna aplicada', () => {
    projects.projectsHistory.update((list: Project[]) =>
      list.map((p) => (p._id === 'p1' ? { ...p, review: { status: 'completada' } } : p)),
    );
    projects.updateProjectStatus.mockReturnValue(undefined);
    facade.apply('assessment', 1);
    expect(projects.projectsHistory()[0].review.applied).toEqual(['assessment:1']);
    expect(projects.projectsHistory()[1].review).toBeUndefined();
  });
});
