import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TallerViewComponent } from './taller-view.component';
import { AppFacade } from '../../../../app.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { PaiService } from '../../../../services/pai.service';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MarkdownComponent } from 'ngx-markdown';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock html2pdf.js since it's used in the component
vi.mock('html2pdf.js', () => {
  return {
    default: vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      save: vi.fn(),
    }))
  };
});

describe('TallerViewComponent', () => {
  let component: TallerViewComponent;
  let fixture: ComponentFixture<TallerViewComponent>;
  
  let mockAppFacade: any;
  let mockLayoutService: any;
  let mockTranslationService: any;
  let mockProjectsFacade: any;
  let mockAuthFacade: any;
  let mockPaiService: any;

  beforeEach(async () => {
    mockAppFacade = {
      infoTitle: signal(''),
      infoMessage: signal(''),
      infoType: signal(''),
      showInfoModal: signal(false),
      errorMessage: signal(''),
      showErrorModal: signal(false),
      confirmTitle: signal(''),
      confirmMessage: signal(''),
      confirmAction: signal(() => {}),
      showConfirmModal: signal(false),
    };

    mockLayoutService = {
      language: signal('castellano'),
    };

    mockTranslationService = {
      t: signal({ deleteFile: 'Delete file' }),
    };

    mockProjectsFacade = {
      exportDocx: vi.fn().mockReturnValue(of(new Blob(['test'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }))),
      currentProjectId: signal('proj-123'),
      currentProject: signal({ id: 'proj-123', status: 'borrador', createdAt: new Date() }),
      projectsHistory: signal([]),
      generatedProject: signal(''),
      updateProjectStatus: vi.fn().mockReturnValue(of({})),
      loadHistory: vi.fn(),
      aiPrompt: signal(''),
      isThinking: signal(false),
      rewriteSection: vi.fn().mockReturnValue(of({ newText: 'Rewritten text' })),
      isUploading: signal(false),
      uploadFile: vi.fn().mockReturnValue(of({})),
      loadProjectFiles: vi.fn(),
      deleteFile: vi.fn().mockReturnValue(of({})),
      getDownloadUrl: vi.fn().mockReturnValue('http://download.url/file.txt'),
    };

    mockAuthFacade = {};

    mockPaiService = {
      importDocx: vi.fn().mockReturnValue(of({ project: { generatedContent: { rawText: 'Extracted text' } } })),
    };

    await TestBed.configureTestingModule({
      imports: [TallerViewComponent],
      providers: [
        { provide: AppFacade, useValue: mockAppFacade },
        { provide: LayoutService, useValue: mockLayoutService },
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: ProjectsFacade, useValue: mockProjectsFacade },
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: PaiService, useValue: mockPaiService },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TallerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort by date', () => {
    const a = { createdAt: '2023-01-01' };
    const b = { createdAt: '2023-01-02' };
    expect(component.sortByDate(a, b)).toBeGreaterThan(0);
    expect(component.sortByDate(b, a)).toBeLessThan(0);
  });

  it('should download word', () => {
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:url');
    window.URL.revokeObjectURL = vi.fn();
    const mockA = { href: '', download: '', click: vi.fn() };
    vi.spyOn(document, 'createElement').mockReturnValue(mockA as any);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);

    component.downloadWord();

    expect(mockProjectsFacade.exportDocx).toHaveBeenCalled();
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(mockA.download).toBe('Proyecto_Generado.docx');
    expect(mockA.click).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('should trigger upload', () => {
    const mockInput = { click: vi.fn() };
    vi.spyOn(document, 'getElementById').mockReturnValue(mockInput as any);
    component.triggerUpload();
    expect(mockInput.click).toHaveBeenCalled();
  });

  it('should handle upload word success', () => {
    const event = { target: { files: [new File([''], 'test.docx')], value: 'test.docx' } };
    component.uploadWord(event);
    expect(mockPaiService.importDocx).toHaveBeenCalledWith('proj-123', event.target.files[0]);
    expect(mockProjectsFacade.generatedProject()).toBe('Extracted text');
    expect(mockAppFacade.showInfoModal()).toBe(true);
  });

  it('should handle upload word failure', () => {
    mockPaiService.importDocx.mockReturnValueOnce(throwError(() => new Error('error')));
    const event = { target: { files: [new File([''], 'test.docx')], value: 'test.docx' } };
    component.uploadWord(event);
    expect(mockAppFacade.showErrorModal()).toBe(true);
  });

  it('should abort upload word if no file', () => {
    const event = { target: { files: [], value: '' } };
    component.uploadWord(event);
    expect(mockPaiService.importDocx).not.toHaveBeenCalled();
  });

  it('should handle upload word failure when no project id', () => {
    mockProjectsFacade.currentProjectId.set(null);
    const event = { target: { files: [new File([''], 'test.docx')], value: 'test.docx' } };
    component.uploadWord(event);
    expect(mockPaiService.importDocx).not.toHaveBeenCalled();
  });

  it('should save draft success', () => {
    component.saveDraft();
    expect(mockProjectsFacade.updateProjectStatus).toHaveBeenCalledWith('borrador');
    expect(mockProjectsFacade.loadHistory).toHaveBeenCalled();
    expect(mockAppFacade.showInfoModal()).toBe(true);
  });

  it('should save draft success - catala', () => {
    mockLayoutService.language.set('catala');
    component.saveDraft();
    expect(mockAppFacade.infoMessage()).toBe('Esborrany guardat correctament.');
  });

  it('should save draft error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockProjectsFacade.updateProjectStatus.mockReturnValueOnce(throwError(() => new Error('err')));
    component.saveDraft();
    expect(consoleSpy).toHaveBeenCalledWith('Error saving draft:', expect.any(Error));
  });

  it('should publish project success', () => {
    component.publishProject();
    expect(mockProjectsFacade.updateProjectStatus).toHaveBeenCalledWith('publicado');
    expect(mockProjectsFacade.loadHistory).toHaveBeenCalled();
    expect(mockAppFacade.showInfoModal()).toBe(true);
  });
  
  it('should publish project success - catala', () => {
    mockLayoutService.language.set('catala');
    component.publishProject();
    expect(mockAppFacade.infoMessage()).toBe('Projecte publicat i validat correctament.');
  });

  it('should publish project error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockProjectsFacade.updateProjectStatus.mockReturnValueOnce(throwError(() => new Error('err')));
    component.publishProject();
    expect(consoleSpy).toHaveBeenCalledWith('Error publishing project:', expect.any(Error));
  });

  it('should export PDF', async () => {
    const mockElement = document.createElement('markdown');
    document.body.appendChild(mockElement);
    const html2pdf = await import('html2pdf.js');
    component.exportPDF();
    expect(html2pdf.default).toHaveBeenCalled();
    document.body.removeChild(mockElement);
  });
  
  it('should do nothing on export PDF if markdown element not found', () => {
    vi.spyOn(document, 'querySelector').mockReturnValue(null);
    component.exportPDF();
    // Doesn't crash
  });

  it('should alert if rewriteWithAI called without selectedText or instruction', () => {
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => '' } as any);
    component.rewriteWithAI();
    expect(mockAppFacade.showInfoModal()).toBe(true);
    expect(mockAppFacade.infoTitle()).toBe('Atención');
  });

  it('should rewriteWithAI successfully', () => {
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => 'some text' } as any);
    mockProjectsFacade.aiPrompt.set('fix grammar');
    component.rewriteWithAI();
    expect(mockProjectsFacade.rewriteSection).toHaveBeenCalledWith('some text', 'fix grammar');
    expect(mockProjectsFacade.generatedProject()).toBe('Rewritten text');
    expect(mockProjectsFacade.isThinking()).toBe(false);
  });

  it('should handle rewriteWithAI error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => 'some text' } as any);
    mockProjectsFacade.aiPrompt.set('fix grammar');
    mockProjectsFacade.rewriteSection.mockReturnValueOnce(throwError(() => new Error('err')));
    
    component.rewriteWithAI();
    expect(consoleSpy).toHaveBeenCalledWith('Error en IA', expect.any(Error));
    expect(mockProjectsFacade.isThinking()).toBe(false);
  });

  it('should handle onFileSelected', () => {
    const event = { target: { files: [new File([''], 'file.txt')] } };
    vi.spyOn(component, 'uploadFile').mockImplementation(() => {});
    component.onFileSelected(event);
    expect(component.uploadFile).toHaveBeenCalledWith(event.target.files[0]);
  });

  it('should ignore onFileSelected without project id', () => {
    mockProjectsFacade.currentProjectId.set(null);
    const event = { target: { files: [new File([''], 'file.txt')] } };
    vi.spyOn(component, 'uploadFile').mockImplementation(() => {});
    component.onFileSelected(event);
    expect(component.uploadFile).not.toHaveBeenCalled();
  });

  it('should prevent default on drag events', () => {
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as any;
    component.onDragOver(event);
    expect(event.preventDefault).toHaveBeenCalled();
    component.onDragLeave(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should handle onDrop', () => {
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn(), dataTransfer: { files: [new File([''], 'f.txt')] } } as any;
    vi.spyOn(component, 'uploadFile').mockImplementation(() => {});
    component.onDrop(event);
    expect(component.uploadFile).toHaveBeenCalledWith(event.dataTransfer.files[0]);
  });

  it('should uploadFile success', () => {
    component.uploadFile(new File([''], 'f.txt'));
    expect(mockProjectsFacade.uploadFile).toHaveBeenCalled();
    expect(mockProjectsFacade.loadProjectFiles).toHaveBeenCalled();
    expect(mockProjectsFacade.isUploading()).toBe(false);
  });

  it('should uploadFile error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockProjectsFacade.uploadFile.mockReturnValueOnce(throwError(() => new Error('err')));
    component.uploadFile(new File([''], 'f.txt'));
    expect(consoleSpy).toHaveBeenCalledWith('Error al subir archivo', expect.any(Error));
    expect(mockProjectsFacade.isUploading()).toBe(false);
  });

  it('should ask for confirmation on deleteFile', () => {
    component.deleteFile('f.txt');
    expect(mockAppFacade.showConfirmModal()).toBe(true);
    
    // Call the action
    mockAppFacade.confirmAction()();
    expect(mockProjectsFacade.deleteFile).toHaveBeenCalledWith('f.txt');
    expect(mockProjectsFacade.loadProjectFiles).toHaveBeenCalled();
    expect(mockAppFacade.showConfirmModal()).toBe(false);
  });
  
  it('should handle deleteFile error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    component.deleteFile('f.txt');
    mockProjectsFacade.deleteFile.mockReturnValueOnce(throwError(() => new Error('err')));
    mockAppFacade.confirmAction()();
    expect(consoleSpy).toHaveBeenCalledWith('Error al borrar archivo', expect.any(Error));
    expect(mockAppFacade.showConfirmModal()).toBe(false);
  });

  it('should getDownloadUrl', () => {
    const url = component.getDownloadUrl('f.txt');
    expect(url).toBe('http://download.url/file.txt');
  });

});
