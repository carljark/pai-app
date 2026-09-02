import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectsFacade } from './projects.facade';
import { CurriculumFacade } from '../../curriculum/services/curriculum.facade';
import { vi } from 'vitest';

describe('ProjectsFacade', () => {
  let facade: ProjectsFacade;
  let httpMock: HttpTestingController;
  let mockCurriculumFacade: any;

  beforeEach(() => {
    mockCurriculumFacade = {
      selectedRas: vi.fn(),
      tipoNivel: vi.fn(),
      curso: vi.fn(),
      ras: vi.fn(),
      ces: vi.fn()
    };
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProjectsFacade,
        { provide: CurriculumFacade, useValue: mockCurriculumFacade }
      ]
    });
    
    facade = TestBed.inject(ProjectsFacade);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load history and update projectsHistory signal', () => {
    const mockProjects = [{ _id: '1', title: 'Test Project' }];
    facade.loadHistory();
    
    const req = httpMock.expectOne('/api/projects');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
    
    expect(facade.projectsHistory()).toEqual(mockProjects);
  });

  it('should handle error when loading history', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    facade.loadHistory();
    
    const req = httpMock.expectOne('/api/projects');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    
    expect(errorSpy).toHaveBeenCalled();
  });

  it('should compute currentProject correctly', () => {
    facade.projectsHistory.set([{ _id: '1', title: 'P1' }, { _id: '2', title: 'P2' }]);
    facade.currentProjectId.set('2');
    
    expect(facade.currentProject()?.title).toBe('P2');
  });

  it('should compute fpProjects and esoProjects based on search and level', () => {
    facade.projectsHistory.set([
      { _id: '1', title: 'FP Proy', tipoNivel: 'FP_BASICA', generatedContent: { rawText: 'text1' } },
      { _id: '2', title: 'ESO Proy', tipoNivel: 'DIVERSIFICACION_CURRICULAR', generatedContent: { rawText: 'text2' } },
      { _id: '3', title: 'Otro FP', tipoNivel: 'FP_BASICA', generatedContent: { rawText: 'text3' } }
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
    req.flush({});
  });

  it('should generate project (FP_BASICA)', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('FP_BASICA');
    mockCurriculumFacade.curso.mockReturnValue('2º');
    mockCurriculumFacade.selectedRas.mockReturnValue(['RA1']);
    mockCurriculumFacade.ras.mockReturnValue([{ description: 'RA1', module: 'ModA' }]);
    
    facade.methodology.set('ABP');
    facade.generateProject('castellano', 'Custom Title').subscribe();
    
    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      selectedRas: ['RA1'],
      methodology: 'ABP',
      modules: ['ModA'],
      tipoNivel: 'FP_BASICA',
      language: 'castellano',
      courseLevel: '2º',
      title: 'Custom Title'
    });
    req.flush({});
  });

  it('should generate project (DIVERSIFICACION_CURRICULAR)', () => {
    mockCurriculumFacade.tipoNivel.mockReturnValue('DIVERSIFICACION_CURRICULAR');
    mockCurriculumFacade.curso.mockReturnValue('4º');
    mockCurriculumFacade.selectedRas.mockReturnValue(['CE1']);
    mockCurriculumFacade.ces.mockReturnValue([{ description: 'CE1', subject: 'Math' }]);
    
    facade.generateProject('catalan').subscribe();
    
    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.body.modules).toEqual(['Math']);
    expect(req.request.body.title).toBe('Proyecto de ESO');
    req.flush({});
  });

  it('should update project status', () => {
    facade.currentProjectId.set('123');
    facade.generatedProject.set('some content');
    
    facade.updateProjectStatus('publicado')?.subscribe();
    
    const req = httpMock.expectOne('/api/projects/123');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ rawText: 'some content', status: 'publicado' });
    req.flush({});
  });
  
  it('should not update project status if no currentProjectId', () => {
    facade.currentProjectId.set(null);
    expect(facade.updateProjectStatus('publicado')).toBeUndefined();
  });

  it('should rewrite section', () => {
    facade.generatedProject.set('full text');
    facade.rewriteSection('rewrite this').subscribe();
    
    const req = httpMock.expectOne('/api/projects/rewrite');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      context: 'full text',
      instruction: 'rewrite this'
    });
    req.flush({});
  });

  it('should load project files', () => {
    facade.currentProjectId.set('123');
    facade.loadProjectFiles();
    
    const req = httpMock.expectOne('/api/projects/123/files');
    expect(req.request.method).toBe('GET');
    req.flush([{ name: 'test.pdf' }]);
    
    expect(facade.projectFiles().length).toBe(1);
    expect(facade.projectFiles()[0].name).toBe('test.pdf');
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
    req.flush({});
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
    
    const req = httpMock.expectOne('/api/projects/123/export-docx');
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
    req.flush({});
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
    it('should push current state and pop on undo', () => {
      facade.generatedProject.set('version1');
      facade.pushUndo();
      expect(facade.undoStack().length).toBe(1);
      expect(facade.canUndo()).toBe(true);

      facade.generatedProject.set('version2');
      facade.pushUndo();
      expect(facade.undoStack().length).toBe(2);

      // Mock updateProjectStatus to avoid HTTP call
      facade.currentProjectId.set('123');

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
  });
});
