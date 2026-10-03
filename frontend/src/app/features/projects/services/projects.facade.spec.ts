import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { ProjectsFacade } from './projects.facade';
import { CurriculumFacade } from '../../curriculum/services/curriculum.facade';
import { AuthFacade } from '../../auth/services/auth.facade';
import { signal } from '@angular/core';
import { Project, ProjectStatus, ProjectType } from '../models/project.model';
import { fromProjectDtoArray } from '../mappers/projects.mapper';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function createMockProject(overrides: Partial<Project> = {}): Project {
  return {
    _id: '1',
    title: 'Test Project',
    status: 'borrador' as ProjectStatus,
    tipoNivel: 'FP_BASICA' as ProjectType,
    courseLevel: '1º',
    modules: [],
    generatedContent: { rawText: '' },
    userId: 'u1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Flushes a successful /api/projects/generate response and the follow-up
 * GET /api/projects that the facade triggers via loadHistory().
 */
function flushGenerateSuccess(httpMock: HttpTestingController, req: TestRequest): void {
  req.flush({ project: createMockProject({ _id: 'gen-1' }), message: 'ok' });
  httpMock.expectOne('/api/projects').flush([]);
}

describe('ProjectsFacade', () => {
  let facade: ProjectsFacade;
  let httpMock: HttpTestingController;
  let mockCurriculumFacade: any;
  let mockAuthFacade: any;

  beforeEach(() => {
    mockCurriculumFacade = {
      selectedRas: vi.fn(),
      tipoNivel: vi.fn(),
      curso: vi.fn(),
      ras: vi.fn(),
      ces: vi.fn(),
      clearSelection: vi.fn(),
    };

    mockAuthFacade = {
      currentUser: signal({ _id: 'u1', name: 'User 1' }),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProjectsFacade,
        { provide: CurriculumFacade, useValue: mockCurriculumFacade },
        { provide: AuthFacade, useValue: mockAuthFacade },
      ],
    });

    facade = TestBed.inject(ProjectsFacade);
    httpMock = TestBed.inject(HttpTestingController);

    // Catálogo de modelos (fuente única en el backend)
    httpMock.expectOne('/api/ai/models').flush({
      providers: [
        { value: 'gemini', label: 'Gemini', defaultModel: 'gemini-3.6-flash' },
        { value: 'openrouter', label: 'OpenRouter', defaultModel: 'deepseek/deepseek-v4.1-flash' },
      ],
      models: [
        { value: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash', provider: 'gemini' },
        {
          value: 'deepseek/deepseek-v4.1-flash',
          label: 'DeepSeek V4.1 Flash',
          provider: 'openrouter',
        },
      ],
    });

    // Flush initial loadHistory from constructor effect
    TestBed.flushEffects();
    httpMock.expectOne('/api/projects').flush([]);
    httpMock.expectOne('/api/users/directory').flush([]);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('pai_lang');
  });

  it('should have initial methodology set to ABP (Aprendizaje Basado en Problemas / Proyectos)', () => {
    expect(facade.methodology()).toBe('ABP (Aprendizaje Basado en Problemas / Proyectos)');
  });

  it('should load history and update projectsHistory signal', () => {
    const mockProjects = [createMockProject({ _id: '1', title: 'Test Project' })];
    facade.loadHistory();

    const req = httpMock.expectOne('/api/projects');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);

    expect(facade.projectsHistory()).toEqual(fromProjectDtoArray(mockProjects as any));
  });

  it('should compute myProjects correctly based on currentUser id', () => {
    facade.projectsHistory.set([
      createMockProject({ _id: '1', title: 'P1', userId: 'u1' }),
      createMockProject({ _id: '2', title: 'P2', userId: { _id: 'u1', name: 'User 1' } }),
      createMockProject({ _id: '3', title: 'P3', userId: 'u2' }),
    ]);
    expect(facade.myProjects().length).toBe(2);

    mockAuthFacade.currentUser.set(null);
    expect(facade.myProjects().length).toBe(0);
  });

  it('should use the id fallback when currentUser has no _id', () => {
    mockAuthFacade.currentUser.set({ id: 'u2', name: 'User 2' });
    facade.projectsHistory.set([
      createMockProject({ _id: '1', title: 'P1', userId: 'u2' }),
      createMockProject({ _id: '2', title: 'P2', userId: 'u3' }),
    ]);

    expect(facade.myProjects().length).toBe(1);
    expect(facade.myProjects()[0]._id).toBe('1');
  });

  it('should handle error when loading history', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    facade.loadHistory();

    const req = httpMock.expectOne('/api/projects');
    req.flush(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    expect(errorSpy).toHaveBeenCalled();
  });

  it('should compute currentProject correctly', () => {
    facade.projectsHistory.set([
      createMockProject({ _id: '1', title: 'P1' }),
      createMockProject({ _id: '2', title: 'P2' }),
    ]);
    facade.currentProjectId.set('2');

    expect(facade.currentProject()?.title).toBe('P2');
  });

  it('should compute fpProjects and esoProjects based on search and level', () => {
    facade.projectsHistory.set([
      createMockProject({
        _id: '1',
        title: 'FP Proy',
        tipoNivel: 'FP_BASICA',
        generatedContent: { rawText: 'text1' },
      }),
      createMockProject({
        _id: '2',
        title: 'ESO Proy',
        tipoNivel: 'DIVERSIFICACION_CURRICULAR',
        generatedContent: { rawText: 'text2' },
      }),
      createMockProject({
        _id: '3',
        title: 'Otro FP',
        tipoNivel: 'FP_BASICA',
        generatedContent: { rawText: 'text3' },
      }),
    ]);

    expect(facade.fpProjects().length).toBe(2);
    expect(facade.esoProjects().length).toBe(1);

    facade.searchQuery.set('otro');
    expect(facade.fpProjects().length).toBe(1);
    expect(facade.esoProjects().length).toBe(0);
  });

  it('should delete project via HTTP', () => {
    facade.deleteProject('123').subscribe();

    const req = httpMock.expectOne('/api/projects/123');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('should retry project via HTTP', () => {
    facade.retryProject('123').subscribe();
    const req = httpMock.expectOne('/api/projects/123/retry');
    expect(req.request.method).toBe('POST');
    req.flush({
      project: createMockProject({ _id: '123', title: 'Retried Project' }),
      message: 'ok',
    });
  });

  it('should generate project (FP_BASICA)', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('FP_BASICA');
    mockCurriculumFacade.curso.mockReturnValue('2º');
    mockCurriculumFacade.selectedRas.mockReturnValue(['RA1']);
    mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA1', module: 'ModA' }]);

    facade.methodology.set('ABP');
    facade.generateProject('castellano', 'Custom Title').subscribe();
    expect(facade.historyTab()).toBe('FPB');

    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      selectedRas: ['RA1'],
      methodology: 'ABP',
      modules: ['ModA'],
      tipoNivel: 'FP_BASICA',
      language: 'castellano',
      aiProvider: 'gemini',
      aiModel: 'gemini-3.6-flash',
      courseLevel: '2º',
      title: 'Custom Title',
    });
    flushGenerateSuccess(httpMock, req);
  });

  it('should generate project (DIVERSIFICACION_CURRICULAR)', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('DIVERSIFICACION_CURRICULAR');
    mockCurriculumFacade.curso.mockReturnValue('4º');
    mockCurriculumFacade.selectedRas.mockReturnValue(['CE1']);
    mockCurriculumFacade.ces.mockReturnValue([{ description: 'CE1', subject: 'Math' }]);

    facade.selectedAi.set('openrouter');
    facade.generateProject('catalan').subscribe();
    expect(facade.historyTab()).toBe('ESO');

    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.body.modules).toEqual(['Math']);
    expect(req.request.body.aiProvider).toBe('openrouter');
    expect(req.request.body.title).toBe('Math');
    flushGenerateSuccess(httpMock, req);
  });

  it('should generate project (CFGM_ESTETICA) and set historyTab to CFGM', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_ESTETICA');
    mockCurriculumFacade.curso.mockReturnValue('1r');
    mockCurriculumFacade.selectedRas.mockReturnValue(['RA_CFGM_1']);
    mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_CFGM_1', module: 'Estètica' }]);

    facade.generateProject('castellano').subscribe();
    expect(facade.historyTab()).toBe('CFGM');

    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.body.tipoNivel).toBe('CFGM_ESTETICA');
    expect(req.request.body.modules).toEqual(['Estètica']);
    flushGenerateSuccess(httpMock, req);
  });

  it('should include extraInstructions in generateProject payload when present', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('FP_BASICA');
    mockCurriculumFacade.curso.mockReturnValue('1º');
    mockCurriculumFacade.selectedRas.mockReturnValue(['RA1']);
    mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA1', module: 'ModA' }]);

    facade.extraInstructions.set('Instrucciones personalizadas para la IA');
    facade.generateProject('castellano').subscribe();

    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.body.extraInstructions).toBe('Instrucciones personalizadas para la IA');
    flushGenerateSuccess(httpMock, req);
  });

  it('should use fallback title when no modules match', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('FP_BASICA');
    mockCurriculumFacade.selectedRas.mockReturnValue(['RA_UNKNOWN']);
    mockCurriculumFacade.ras.mockReturnValue([]);

    facade.generateProject('castellano').subscribe();
    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.body.title).toBe('Proyecto Integrador');
    flushGenerateSuccess(httpMock, req);
  });

  it('should handle ce without subject in getInvolvedModules', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('DIVERSIFICACION_CURRICULAR');
    mockCurriculumFacade.curso.mockReturnValue('3º');
    mockCurriculumFacade.selectedRas.mockReturnValue(['CE_NO_SUBJ']);
    mockCurriculumFacade.ces.mockReturnValue([{ description: 'CE_NO_SUBJ' }]);

    facade.generateProject('castellano').subscribe();
    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.body.modules).toEqual(['']);
    flushGenerateSuccess(httpMock, req);
  });

  it('should resolve CFGM_PELUQUERIA modules for 2º in castellano using subject_es, subject and module fallbacks', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_PELUQUERIA');
    mockCurriculumFacade.curso.mockReturnValue('2º');
    mockCurriculumFacade.selectedRas.mockReturnValue(['RA_A', 'RA_B', 'RA_C']);
    mockCurriculumFacade.ras.mockReturnValue([
      { description: 'RA_A', moduleCode: '0640', subject_es: '0640. Módulo ES' },
      { description: 'RA_B', moduleCode: '0643', subject: '0643. Subject' },
      { description: 'RA_C', moduleCode: '0843', module: '0843. Module' },
    ]);

    facade.generateProject('castellano').subscribe();
    expect(facade.historyTab()).toBe('CFGM_PELUQUERIA');

    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.body.modules).toEqual(['0640. Módulo ES', '0643. Subject', '0843. Module']);
    flushGenerateSuccess(httpMock, req);
  });

  it('should resolve CFGM_PELUQUERIA modules for 1r in catalan using subject_ca, subject and module fallbacks', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_PELUQUERIA');
    mockCurriculumFacade.curso.mockReturnValue('1r');
    mockCurriculumFacade.selectedRas.mockReturnValue(['RA_A', 'RA_B', 'RA_C']);
    mockCurriculumFacade.ras.mockReturnValue([
      { description: 'RA_A', moduleCode: '0845', subject_ca: '0845. Mòdul CA' },
      { description: 'RA_B', moduleCode: '0842', subject: '0842. Subject' },
      { description: 'RA_C', moduleCode: '0844', module: '0844. Module' },
    ]);

    localStorage.setItem('pai_lang', 'catalan');
    facade.generateProject('catalan').subscribe();

    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.body.modules).toEqual(['0845. Mòdul CA', '0842. Subject', '0844. Module']);
    flushGenerateSuccess(httpMock, req);
  });

  it('should use an empty name for a CFGM_PELUQUERIA module without any name field', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_PELUQUERIA');
    mockCurriculumFacade.curso.mockReturnValue('1r');
    mockCurriculumFacade.selectedRas.mockReturnValue(['RA_A']);
    mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_A', moduleCode: '0845' }]);

    facade.generateProject('castellano', 'Título').subscribe();

    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.body.modules).toEqual(['']);
    flushGenerateSuccess(httpMock, req);
  });

  it('should fall back to the generic CFGM_PELUQUERIA name in castellano when no module matches', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_PELUQUERIA');
    mockCurriculumFacade.curso.mockReturnValue('1r');
    mockCurriculumFacade.selectedRas.mockReturnValue(['RA_X']);
    mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_X', moduleCode: '9999' }]);

    facade.generateProject('castellano').subscribe();

    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.body.modules).toEqual(['CFGM Peluquería y Cosmética Capilar']);
    flushGenerateSuccess(httpMock, req);
  });

  it('should fall back to the generic CFGM_PELUQUERIA name in catalan when no module matches', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_PELUQUERIA');
    mockCurriculumFacade.curso.mockReturnValue('2º');
    mockCurriculumFacade.selectedRas.mockReturnValue(['RA_X']);
    mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_X', moduleCode: '9999' }]);

    localStorage.setItem('pai_lang', 'catalan');
    facade.generateProject('catalan').subscribe();

    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.body.modules).toEqual(['CFGM Peluqueria i Cosmètica Capilar']);
    flushGenerateSuccess(httpMock, req);
  });

  it('should use an empty string when a CFGM module has neither subject nor module', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_ESTETICA');
    mockCurriculumFacade.curso.mockReturnValue('1r');
    mockCurriculumFacade.selectedRas.mockReturnValue(['RA_NO_NAME']);
    mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_NO_NAME' }]);

    facade.generateProject('castellano').subscribe();

    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.body.modules).toEqual(['']);
    flushGenerateSuccess(httpMock, req);
  });

  it('should update project status', () => {
    facade.currentProjectId.set('123');
    facade.generatedProject.set('some content');

    facade.updateProjectStatus('publicado')?.subscribe();

    const req = httpMock.expectOne('/api/projects/123');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      rawText: 'some content',
      status: 'publicado',
      language: 'castellano',
    });
    req.flush({});
  });

  it('should save a translated version and keep showing it', () => {
    facade.currentProjectId.set('123');
    facade.contentLanguage.set('catalan');
    facade.generatedProject.set('Text editat');

    facade.updateProjectStatus('borrador')?.subscribe();

    const req = httpMock.expectOne('/api/projects/123');
    expect(req.request.body.language).toBe('catalan');
    req.flush({
      _id: '123',
      language: 'castellano',
      generatedContent: { rawText: 'Original' },
      translations: { catalan: { rawText: 'Text editat', sourceVersion: 0 } },
    });
    expect(facade.generatedProject()).toBe('Text editat');
  });

  it('should export the DOCX in the language being viewed', () => {
    facade.currentProjectId.set('123');
    facade.contentLanguage.set('catalan');
    facade.exportDocx()?.subscribe();
    httpMock.expectOne('/api/projects/123/export-docx?lang=catalan').flush(new Blob());
  });

  it('should not update project status if no currentProjectId', () => {
    facade.currentProjectId.set(null);
    expect(facade.updateProjectStatus('publicado')).toBeUndefined();
  });

  it('should rewrite section with default and explicit aiProvider and aiModel', () => {
    facade.generatedProject.set('full text');
    facade.rewriteSection('rewrite this').subscribe();

    const req1 = httpMock.expectOne('/api/projects/rewrite');
    expect(req1.request.method).toBe('POST');
    expect(req1.request.body).toEqual({
      context: 'full text',
      instruction: 'rewrite this',
      aiProvider: 'gemini',
      aiModel: 'gemini-3.6-flash',
    });
    req1.flush({});

    facade
      .rewriteSection('rewrite this', 'openrouter', 'mistralai/mistral-7b-instruct:free')
      .subscribe();
    const req2 = httpMock.expectOne('/api/projects/rewrite');
    expect(req2.request.body.aiProvider).toBe('openrouter');
    expect(req2.request.body.aiModel).toBe('mistralai/mistral-7b-instruct:free');
    req2.flush({});
  });

  it('should load project files', () => {
    facade.currentProjectId.set('123');
    facade.loadProjectFiles();

    const req = httpMock.expectOne('/api/projects/123/files');
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        _id: 'f1',
        filename: 'test.pdf',
        originalName: 'test.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        uploadedAt: new Date().toISOString(),
        projectId: '123',
      },
    ]);

    expect(facade.projectFiles().length).toBe(1);
    expect(facade.projectFiles()[0].originalName).toBe('test.pdf');
  });

  it('should handle error when loading files', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    facade.currentProjectId.set('123');
    facade.loadProjectFiles();

    const req = httpMock.expectOne('/api/projects/123/files');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorSpy).toHaveBeenCalled();
  });

  it('should not load files if no currentProjectId', () => {
    facade.currentProjectId.set(null);
    facade.loadProjectFiles();
    httpMock.expectNone('/api/projects/null/files');
  });

  it('should upload file', () => {
    facade.currentProjectId.set('123');
    const file = new File([''], 'test.txt');
    facade.uploadFile(file)?.subscribe();

    const req = httpMock.expectOne('/api/projects/123/files');
    expect(req.request.method).toBe('POST');
    req.flush({
      file: {
        _id: 'f1',
        filename: 'test.txt',
        originalName: 'test.txt',
        mimeType: 'text/plain',
        size: 100,
        uploadedAt: new Date().toISOString(),
        projectId: '123',
      },
      message: 'ok',
    });
  });

  it('should delete file', () => {
    facade.currentProjectId.set('123');
    facade.deleteFile('test.txt')?.subscribe();

    const req = httpMock.expectOne('/api/projects/123/files/test.txt');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get download URL', () => {
    facade.currentProjectId.set('123');
    expect(facade.getDownloadUrl('test.txt')).toBe('/api/projects/123/files/test.txt');

    facade.currentProjectId.set(null);
    expect(facade.getDownloadUrl('test.txt')).toBe('');
  });

  it('should export docx', () => {
    facade.currentProjectId.set('123');
    facade.exportDocx()?.subscribe();

    const req = httpMock.expectOne('/api/projects/123/export-docx?lang=castellano');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob());
  });

  it('should import docx', () => {
    facade.currentProjectId.set('123');
    const file = new File([''], 'test.docx');
    facade.importDocx(file)?.subscribe();

    const req = httpMock.expectOne('/api/projects/123/import-docx');
    expect(req.request.method).toBe('POST');
    req.flush({
      project: {
        _id: '123',
        title: 'Imported Project',
        status: 'borrador',
        tipoNivel: 'FP_BASICA',
        courseLevel: '1º',
        modules: [],
        generatedContent: { rawText: 'Imported content' },
        userId: 'u1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      message: 'Imported successfully',
    });
  });

  it('should return undefined for file operations if no currentProjectId', () => {
    facade.currentProjectId.set(null);
    expect(facade.uploadFile(new File([''], 'test.txt'))).toBeUndefined();
    expect(facade.deleteFile('test.txt')).toBeNull();
    expect(facade.exportDocx()).toBeUndefined();
    expect(facade.importDocx(new File([''], 'test.docx'))).toBeUndefined();
  });

  describe('formattedGeneratedProject', () => {
    it('should return empty string when generatedProject is empty', () => {
      facade.generatedProject.set('');
      expect(facade.formattedGeneratedProject()).toBe('');
    });

    it('should pass through content unchanged', () => {
      const input = 'Masa ($\\text{kg}, \\text{g}, \\text{mg}$) y volumen ($\\text{L}$).';
      facade.generatedProject.set(input);
      expect(facade.formattedGeneratedProject()).toBe(input);
    });

    it('should handle multiline content', () => {
      const input = 'Primera línea\nSegunda línea';
      facade.generatedProject.set(input);
      expect(facade.formattedGeneratedProject()).toBe(input);
    });
  });

  describe('Undo Stack', () => {
    it('should push current state and pop on undo for active project', () => {
      facade.currentProjectId.set('123');
      facade.generatedProject.set('version1');
      facade.pushUndo();
      expect(facade.undoStack().length).toBe(1);
      expect(facade.canUndo()).toBe(true);

      facade.generatedProject.set('version2');
      facade.pushUndo();
      expect(facade.undoStack().length).toBe(2);

      facade.undoLastChange();
      expect(facade.generatedProject()).toBe('version2');
      expect(facade.undoStack().length).toBe(1);

      // Flush the PUT request from undoLastChange
      const req = httpMock.expectOne('/api/projects/123');
      req.flush({});

      facade.undoLastChange();
      expect(facade.generatedProject()).toBe('version1');
      expect(facade.undoStack().length).toBe(0);
      expect(facade.canUndo()).toBe(false);

      const req2 = httpMock.expectOne('/api/projects/123');
      req2.flush({});
    });

    it('should maintain independent undo stacks per project', () => {
      // Project A
      facade.currentProjectId.set('proj-A');
      facade.generatedProject.set('A-v1');
      facade.pushUndo();
      expect(facade.undoStack().length).toBe(1);
      expect(facade.canUndo()).toBe(true);

      // Switch to Project B
      facade.currentProjectId.set('proj-B');
      facade.generatedProject.set('B-v1');
      // Stack for B is empty initially
      expect(facade.undoStack().length).toBe(0);
      expect(facade.canUndo()).toBe(false);

      // Modify Project B
      facade.pushUndo();
      expect(facade.undoStack().length).toBe(1);
      expect(facade.canUndo()).toBe(true);

      // Switch back to Project A
      facade.currentProjectId.set('proj-A');
      expect(facade.undoStack().length).toBe(1);
      expect(facade.canUndo()).toBe(true);

      // Undo Project A
      facade.undoLastChange();
      expect(facade.generatedProject()).toBe('A-v1');
      expect(facade.undoStack().length).toBe(0);

      const reqA = httpMock.expectOne('/api/projects/proj-A');
      reqA.flush({});

      // Project B still has its own stack intact
      facade.currentProjectId.set('proj-B');
      expect(facade.undoStack().length).toBe(1);
    });

    it('should popUndo correctly on error', () => {
      facade.currentProjectId.set('proj-1');
      facade.generatedProject.set('v1');
      facade.pushUndo();
      expect(facade.undoStack().length).toBe(1);

      facade.popUndo();
      expect(facade.undoStack().length).toBe(0);

      // popUndo on empty stack does not crash
      facade.popUndo();
      expect(facade.undoStack().length).toBe(0);
    });

    it('should clean up undo stack when project is deleted', () => {
      facade.currentProjectId.set('proj-to-delete');
      facade.generatedProject.set('v1');
      facade.pushUndo();
      expect(facade.undoStacksByProject()['proj-to-delete']?.length).toBe(1);

      facade.deleteProject('proj-to-delete').subscribe();
      const req = httpMock.expectOne('/api/projects/proj-to-delete');
      req.flush({});

      expect(facade.undoStacksByProject()['proj-to-delete']).toBeUndefined();
    });

    it('should not push empty content', () => {
      facade.generatedProject.set('');
      facade.pushUndo();
      expect(facade.undoStack().length).toBe(0);
    });

    it('should not undo when stack is empty', () => {
      facade.generatedProject.set('current');
      facade.undoLastChange();
      expect(facade.generatedProject()).toBe('current');
    });

    it('should handle popUndo when there is no active project or stack', () => {
      facade.currentProjectId.set(null);
      facade.popUndo();
      expect(facade.undoStacksByProject()['__temp__']).toBeUndefined();

      facade.currentProjectId.set('proj-empty');
      facade.popUndo();
      expect(facade.undoStacksByProject()['proj-empty']).toBeUndefined();
    });
  });

  describe('Rewrite Section', () => {
    it('should rewrite section successfully', () => {
      facade.generatedProject.set('original content');
      facade.rewriteSection('make it better').subscribe();

      const req = httpMock.expectOne('/api/projects/rewrite');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        context: 'original content',
        instruction: 'make it better',
        aiProvider: 'gemini',
        aiModel: 'gemini-3.6-flash',
      });
      req.flush('rewritten content');

      expect(facade.generatedProject()).toBe('rewritten content');
      expect(facade.isThinking()).toBe(false);
    });

    it('should rewrite section with explicit aiProvider and aiModel', () => {
      facade.generatedProject.set('original content');
      facade
        .rewriteSection('make it better', 'openrouter', 'mistralai/mistral-7b-instruct:free')
        .subscribe();

      const req = httpMock.expectOne('/api/projects/rewrite');
      expect(req.request.body.aiProvider).toBe('openrouter');
      expect(req.request.body.aiModel).toBe('mistralai/mistral-7b-instruct:free');
      req.flush('rewritten content');
    });
  });

  describe('File Operations', () => {
    it('should load project files successfully', () => {
      facade.currentProjectId.set('123');
      facade.loadProjectFiles();

      const req = httpMock.expectOne('/api/projects/123/files');
      expect(req.request.method).toBe('GET');
      req.flush([
        {
          _id: 'f1',
          filename: 'test.pdf',
          originalName: 'test.pdf',
          mimeType: 'application/pdf',
          size: 1024,
          uploadedAt: new Date().toISOString(),
          projectId: '123',
        },
      ]);

      expect(facade.projectFiles().length).toBe(1);
      expect(facade.projectFiles()[0].originalName).toBe('test.pdf');
    });

    it('should handle load project files error', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      facade.currentProjectId.set('123');
      facade.loadProjectFiles();

      const req = httpMock.expectOne('/api/projects/123/files');
      req.flush(
        { message: 'Internal Server Error' },
        { status: 500, statusText: 'Internal Server Error' },
      );

      expect(errorSpy).toHaveBeenCalled();
    });

    it('should not load files if no currentProjectId', () => {
      facade.currentProjectId.set(null);
      facade.loadProjectFiles();
      httpMock.expectNone('/api/projects/null/files');
    });

    it('should upload file successfully', () => {
      facade.currentProjectId.set('123');
      const file = new File([''], 'test.txt');
      facade.uploadFile(file)?.subscribe();

      const req = httpMock.expectOne('/api/projects/123/files');
      expect(req.request.method).toBe('POST');
      req.flush({
        file: {
          _id: 'f1',
          filename: 'test.txt',
          originalName: 'test.txt',
          mimeType: 'text/plain',
          size: 100,
          uploadedAt: new Date().toISOString(),
          projectId: '123',
        },
        message: 'ok',
      });

      expect(facade.projectFiles().length).toBe(1);
      expect(facade.projectFiles()[0].filename).toBe('test.txt');
    });

    it('should handle upload file error', () => {
      facade.currentProjectId.set('123');
      const file = new File([''], 'test.txt');
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      facade.uploadFile(file)?.subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/projects/123/files');
      req.flush(
        { message: 'Internal Server Error' },
        { status: 500, statusText: 'Internal Server Error' },
      );

      expect(facade.isUploading()).toBe(false);
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should not upload file if no currentProjectId', () => {
      facade.currentProjectId.set(null);
      const file = new File([''], 'test.txt');
      expect(facade.uploadFile(file)).toBeUndefined();
    });

    it('should delete file successfully', () => {
      facade.currentProjectId.set('123');
      facade.projectFiles.set([
        {
          _id: 'f1',
          filename: 'test.txt',
          originalName: 'test.txt',
          mimeType: 'text/plain',
          size: 100,
          uploadedAt: new Date().toISOString(),
          projectId: '123',
        },
      ]);
      facade.deleteFile('test.txt')?.subscribe();

      const req = httpMock.expectOne('/api/projects/123/files/test.txt');
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(facade.projectFiles().length).toBe(0);
    });

    it('should handle delete file error', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      facade.currentProjectId.set('123');
      facade.deleteFile('test.txt')?.subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/projects/123/files/test.txt');
      req.flush(
        { message: 'Internal Server Error' },
        { status: 500, statusText: 'Internal Server Error' },
      );

      expect(errorSpy).toHaveBeenCalled();
    });

    it('should return null for delete file if no currentProjectId', () => {
      facade.currentProjectId.set(null);
      expect(facade.deleteFile('test.txt')).toBeNull();
    });

    it('should get download URL with project ID', () => {
      facade.currentProjectId.set('123');
      expect(facade.getDownloadUrl('test.txt')).toBe('/api/projects/123/files/test.txt');
    });

    it('should return empty string for download URL without project ID', () => {
      facade.currentProjectId.set(null);
      expect(facade.getDownloadUrl('test.txt')).toBe('');
    });

    it('should export docx with project ID', () => {
      facade.currentProjectId.set('123');
      facade.exportDocx()?.subscribe();

      const req = httpMock.expectOne('/api/projects/123/export-docx?lang=castellano');
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(new Blob());
    });

    it('should return undefined for export docx without project ID', () => {
      facade.currentProjectId.set(null);
      expect(facade.exportDocx()).toBeUndefined();
    });

    it('should import docx successfully', () => {
      facade.currentProjectId.set('123');
      const file = new File([''], 'test.docx');
      facade.importDocx(file)?.subscribe();

      const req = httpMock.expectOne('/api/projects/123/import-docx');
      expect(req.request.method).toBe('POST');
      req.flush({
        project: {
          _id: '123',
          title: 'Imported Project',
          status: 'borrador',
          tipoNivel: 'FP_BASICA',
          courseLevel: '1º',
          modules: [],
          generatedContent: { rawText: 'Imported content' },
          userId: 'u1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        message: 'Imported successfully',
      });

      expect(facade.generatedProject()).toBe('Imported content');
      expect(facade.projectFiles()).toEqual([]);
    });

    it('should handle import docx error', () => {
      facade.currentProjectId.set('123');
      const file = new File([''], 'test.docx');
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      facade.importDocx(file)?.subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/projects/123/import-docx');
      req.flush(
        { message: 'Internal Server Error' },
        { status: 500, statusText: 'Internal Server Error' },
      );

      expect(facade.isUploading()).toBe(false);
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should return undefined for import docx without project ID', () => {
      facade.currentProjectId.set(null);
      const file = new File([''], 'test.docx');
      expect(facade.importDocx(file)).toBeUndefined();
    });

    it('should return undefined for all file operations without currentProjectId', () => {
      facade.currentProjectId.set(null);
      expect(facade.uploadFile(new File([''], 'test.txt'))).toBeUndefined();
      expect(facade.deleteFile('test.txt')).toBeNull();
      expect(facade.exportDocx()).toBeUndefined();
      expect(facade.importDocx(new File([''], 'test.docx'))).toBeUndefined();
    });
  });

  describe('Helper Methods', () => {
    it('should clear selection in curriculum facade', () => {
      facade.clearSelection();
      expect(mockCurriculumFacade.clearSelection).toHaveBeenCalled();
    });

    it('should set current project for editing', () => {
      const project = {
        _id: 'proj-1',
        title: 'Test',
        status: 'borrador' as const,
        tipoNivel: 'FP_BASICA' as const,
        courseLevel: '1º',
        modules: [],
        generatedContent: { rawText: 'content' },
        userId: 'u1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      facade.setCurrentProject(project);

      expect(facade.currentProjectId()).toBe('proj-1');
      expect(facade.generatedProject()).toBe('content');
      expect(facade.projectFiles()).toEqual([]);
      expect(facade.undoStacksByProject()['proj-1']).toEqual([]);
    });

    it('should clear current project', () => {
      facade.currentProjectId.set('proj-1');
      facade.generatedProject.set('content');
      facade.projectFiles.set([
        {
          _id: 'f1',
          filename: 'test.txt',
          originalName: 'test.txt',
          mimeType: 'text/plain',
          size: 100,
          uploadedAt: new Date().toISOString(),
          projectId: 'proj-1',
        },
      ]);
      facade.isEditMode.set(true);

      facade.clearCurrentProject();

      expect(facade.currentProjectId()).toBeNull();
      expect(facade.generatedProject()).toBe('');
      expect(facade.projectFiles()).toEqual([]);
      expect(facade.isEditMode()).toBe(false);
    });
  });

  describe('getInvolvedModules', () => {
    it('should resolve modules for DIVERSIFICACION_CURRICULAR from CES', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('DIVERSIFICACION_CURRICULAR');
      mockCurriculumFacade.selectedRas.mockReturnValue(['CE1']);
      mockCurriculumFacade.ces.mockReturnValue([{ description: 'CE1', subject: 'Math' }]);

      facade.generateProject('castellano').subscribe();
      expect(facade.historyTab()).toBe('ESO');

      const req = httpMock.expectOne('/api/projects/generate');
      expect(req.request.body.modules).toEqual(['Math']);
      flushGenerateSuccess(httpMock, req);
    });

    it('should resolve modules for FP_BASICA from RAS', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('FP_BASICA');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA1']);
      mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA1', module: 'ModA' }]);

      facade.generateProject('castellano').subscribe();
      expect(facade.historyTab()).toBe('FPB');

      const req = httpMock.expectOne('/api/projects/generate');
      expect(req.request.body.modules).toEqual(['ModA']);
      flushGenerateSuccess(httpMock, req);
    });

    it('should resolve modules for CFGM_ESTETICA from RAS', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_ESTETICA');
      mockCurriculumFacade.curso.mockReturnValue('1r');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA_CFGM_1']);
      mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_CFGM_1', module: 'Estètica' }]);

      facade.generateProject('castellano').subscribe();
      expect(facade.historyTab()).toBe('CFGM');

      const req = httpMock.expectOne('/api/projects/generate');
      expect(req.request.body.modules).toEqual(['Estètica']);
      flushGenerateSuccess(httpMock, req);
    });

    it('should resolve CFGM_PELUQUERIA modules for 2º in castellano using subject_es, subject and module fallbacks', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_PELUQUERIA');
      mockCurriculumFacade.curso.mockReturnValue('2º');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA_A', 'RA_B', 'RA_C']);
      mockCurriculumFacade.ras.mockReturnValue([
        { description: 'RA_A', moduleCode: '0640', subject_es: '0640. Módulo ES' },
        { description: 'RA_B', moduleCode: '0643', subject: '0643. Subject' },
        { description: 'RA_C', moduleCode: '0843', module: '0843. Module' },
      ]);

      facade.generateProject('castellano').subscribe();
      expect(facade.historyTab()).toBe('CFGM_PELUQUERIA');

      const req = httpMock.expectOne('/api/projects/generate');
      expect(req.request.body.modules).toEqual([
        '0640. Módulo ES',
        '0643. Subject',
        '0843. Module',
      ]);
      flushGenerateSuccess(httpMock, req);
    });

    it('should resolve CFGM_PELUQUERIA modules for 1r in catalan using subject_ca, subject and module fallbacks', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_PELUQUERIA');
      mockCurriculumFacade.curso.mockReturnValue('1r');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA_A', 'RA_B', 'RA_C']);
      mockCurriculumFacade.ras.mockReturnValue([
        { description: 'RA_A', moduleCode: '0845', subject_ca: '0845. Mòdul CA' },
        { description: 'RA_B', moduleCode: '0842', subject: '0842. Subject' },
        { description: 'RA_C', moduleCode: '0844', module: '0844. Module' },
      ]);

      localStorage.setItem('pai_lang', 'catalan');
      facade.generateProject('catalan').subscribe();

      const req = httpMock.expectOne('/api/projects/generate');
      expect(req.request.body.modules).toEqual(['0845. Mòdul CA', '0842. Subject', '0844. Module']);
      flushGenerateSuccess(httpMock, req);
    });

    it('should fall back to the generic CFGM_PELUQUERIA name in castellano when no module matches', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_PELUQUERIA');
      mockCurriculumFacade.curso.mockReturnValue('1r');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA_X']);
      mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_X', moduleCode: '9999' }]);

      facade.generateProject('castellano').subscribe();

      const req = httpMock.expectOne('/api/projects/generate');
      expect(req.request.body.modules).toEqual(['CFGM Peluquería y Cosmética Capilar']);
      flushGenerateSuccess(httpMock, req);
    });

    it('should fall back to the generic CFGM_PELUQUERIA name in catalan when no module matches', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_PELUQUERIA');
      mockCurriculumFacade.curso.mockReturnValue('2º');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA_X']);
      mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_X', moduleCode: '9999' }]);

      localStorage.setItem('pai_lang', 'catalan');
      facade.generateProject('catalan').subscribe();

      const req = httpMock.expectOne('/api/projects/generate');
      expect(req.request.body.modules).toEqual(['CFGM Peluqueria i Cosmètica Capilar']);
      flushGenerateSuccess(httpMock, req);
    });

    it('should use an empty string when a CFGM module has neither subject nor module', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_ESTETICA');
      mockCurriculumFacade.curso.mockReturnValue('1r');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA_NO_NAME']);
      mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_NO_NAME' }]);

      facade.generateProject('castellano').subscribe();

      const req = httpMock.expectOne('/api/projects/generate');
      expect(req.request.body.modules).toEqual(['']);
      flushGenerateSuccess(httpMock, req);
    });

    it('should resolve CFGM_ESTETICA modules using subject in catalan', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_ESTETICA');
      mockCurriculumFacade.curso.mockReturnValue('1r');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA_A']);
      mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_A', subject: 'Mòdul CA' }]);

      localStorage.setItem('pai_lang', 'catalan');
      facade.generateProject('catalan').subscribe();

      const req = httpMock.expectOne('/api/projects/generate');
      expect(req.request.body.modules).toEqual(['Mòdul CA']);
      flushGenerateSuccess(httpMock, req);
    });

    it('should resolve CFGM_ESTETICA modules using subject in castellano', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_ESTETICA');
      mockCurriculumFacade.curso.mockReturnValue('1r');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA_A']);
      mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_A', subject: 'Módulo ES' }]);

      facade.generateProject('castellano').subscribe();

      const req = httpMock.expectOne('/api/projects/generate');
      expect(req.request.body.modules).toEqual(['Módulo ES']);
      flushGenerateSuccess(httpMock, req);
    });

    it('should resolve CFGM_ESTETICA modules using module fallback', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_ESTETICA');
      mockCurriculumFacade.curso.mockReturnValue('1r');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA_A']);
      mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_A', module: 'Módulo Module' }]);

      facade.generateProject('castellano').subscribe();

      const req = httpMock.expectOne('/api/projects/generate');
      expect(req.request.body.modules).toEqual(['Módulo Module']);
      flushGenerateSuccess(httpMock, req);
    });

    it('should use empty string when CFGM_ESTETICA module has neither subject nor module', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('CFGM_ESTETICA');
      mockCurriculumFacade.curso.mockReturnValue('1r');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA_A']);
      mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA_A' }]);

      facade.generateProject('castellano').subscribe();

      const req = httpMock.expectOne('/api/projects/generate');
      expect(req.request.body.modules).toEqual(['']);
      flushGenerateSuccess(httpMock, req);
    });
  });

  describe('Effects and Constructor', () => {
    it('should have loadHistory method that can be called', () => {
      expect(typeof facade.loadHistory).toBe('function');
    });

    it('should expose availableModels from the backend catalog', () => {
      expect(typeof facade.availableModels).toBe('function');
      expect(facade.availableModels()[0].value).toBe('gemini-3.6-flash');
      expect(facade.selectedModel()).toBe('gemini-3.6-flash');
    });

    it('should switch to the first available provider when Gemini is disabled', () => {
      expect(facade.availableProviders()).toEqual(['gemini', 'openrouter']);

      (facade as any).loadAiModels();
      httpMock.expectOne('/api/ai/models').flush({
        providers: [
          {
            value: 'openrouter',
            label: 'OpenRouter',
            defaultModel: 'deepseek/deepseek-v4.1-flash',
          },
        ],
        models: [
          { value: 'deepseek/deepseek-v4.1-flash', label: 'DeepSeek', provider: 'openrouter' },
        ],
      });
      TestBed.flushEffects();

      expect(facade.availableProviders()).toEqual(['openrouter']);
      expect(facade.selectedAi()).toBe('openrouter');
      expect(facade.selectedModel()).toBe('deepseek/deepseek-v4.1-flash');
    });

    it('should keep the selected provider when the catalog has no providers', () => {
      (facade as any).loadAiModels();
      httpMock.expectOne('/api/ai/models').flush({});
      expect(facade.availableProviders()).toEqual([]);
      expect(facade.selectedAi()).toBe('gemini');
    });

    it('should compute matchingProjects for the current selection', () => {
      facade.projectsHistory.set([
        { _id: 'p1', status: 'borrador', ras: ['ra1'] },
        { _id: 'p2', status: 'borrador', ras: ['ra2'] },
      ] as any);
      mockCurriculumFacade.selectedRas.mockReturnValue(['ra1']);

      expect(facade.matchingProjects().map((p: any) => p._id)).toEqual(['p1']);
    });
  });

  describe('Retry Project', () => {
    it('should call projectsService.retryProject', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('FP_BASICA');
      mockCurriculumFacade.curso.mockReturnValue('1º');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA1']);
      mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA1', module: 'ModA' }]);

      facade.generateProject('castellano').subscribe();
      const genReq = httpMock.expectOne('/api/projects/generate');
      genReq.flush({ project: createMockProject({ _id: '123' }) });
      // Flush the loadHistory call from generateProject
      const loadReq = httpMock.expectOne('/api/projects');
      loadReq.flush([]);
      httpMock.verify();

      facade.retryProject('123').subscribe();
      const retryReq = httpMock.expectOne('/api/projects/123/retry');
      retryReq.flush({ project: createMockProject({ _id: '123', title: 'Updated' }) });
      httpMock.verify();
    });
  });

  describe('Generate Project', () => {
    it('should handle generate project error', () => {
      mockCurriculumFacade.tipoNivel.mockReturnValue('FP_BASICA');
      mockCurriculumFacade.curso.mockReturnValue('1º');
      mockCurriculumFacade.selectedRas.mockReturnValue(['RA1']);
      mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA1', module: 'ModA' }]);

      facade.methodology.set('ABP');
      facade.generateProject('castellano', 'Custom Title').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/projects/generate');
      req.flush('error', { status: 500, statusText: 'Internal Server Error' });
      // No loadHistory call on error
      httpMock.verify();

      expect(facade.isGenerating()).toBe(false);
    });
  });

  describe('Update Project Status', () => {
    it('should handle update project status error', () => {
      facade.currentProjectId.set('123');
      facade.generatedProject.set('some content');
      facade.projectsHistory.set([createMockProject({ _id: '123' })]);

      facade.updateProjectStatus('publicado')?.subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/projects/123');
      req.flush('error', { status: 500, statusText: 'Internal Server Error' });
      httpMock.verify();
    });

    it('should update history and generatedProject on success', () => {
      facade.currentProjectId.set('123');
      facade.generatedProject.set('original content');
      facade.projectsHistory.set([createMockProject({ _id: '123', title: 'Test' })]);

      facade.updateProjectStatus('publicado')?.subscribe();

      const req = httpMock.expectOne('/api/projects/123');
      req.flush(createMockProject({ _id: '123', title: 'Updated', status: 'publicado' }));
      httpMock.verify();

      expect(facade.projectsHistory()[0].title).toBe('Updated');
      expect(facade.generatedProject()).toBe('');
    });
  });

  describe('Rewrite Section', () => {
    it('should handle rewrite section error', () => {
      facade.generatedProject.set('original content');
      facade.rewriteSection('make it better').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/projects/rewrite');
      req.flush('error', { status: 500, statusText: 'Internal Server Error' });
      httpMock.verify();

      expect(facade.isThinking()).toBe(false);
    });

    it('should update generatedProject on success', () => {
      facade.generatedProject.set('original content');
      facade.rewriteSection('make it better').subscribe();

      const req = httpMock.expectOne('/api/projects/rewrite');
      req.flush('rewritten content');
      httpMock.verify();

      expect(facade.isThinking()).toBe(false);
      expect(facade.generatedProject()).toBe('rewritten content');
    });
  });
});
