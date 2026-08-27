import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PaiService } from './pai.service';

describe('PaiService', () => {
  let service: PaiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaiService]
    });
    
    service = TestBed.inject(PaiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getRas with default language', () => {
    service.getRas().subscribe(res => {
      expect(res).toEqual([{ id: 'ra1' }]);
    });
    
    const req = httpMock.expectOne('/api/ras?lang=castellano');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 'ra1' }]);
  });

  it('should getRas with custom language', () => {
    service.getRas('catalan').subscribe(res => {
      expect(res).toEqual([{ id: 'ra1' }]);
    });
    
    const req = httpMock.expectOne('/api/ras?lang=catalan');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 'ra1' }]);
  });

  it('should getLogs', () => {
    service.getLogs().subscribe(res => {
      expect(res).toEqual([{ log: 'test' }]);
    });
    
    const req = httpMock.expectOne('/api/admin/logs');
    expect(req.request.method).toBe('GET');
    req.flush([{ log: 'test' }]);
  });

  it('should getCes', () => {
    service.getCes('castellano').subscribe(res => {
      expect(res).toEqual([{ id: 'ce1' }]);
    });
    
    const req = httpMock.expectOne('/api/ces?lang=castellano');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 'ce1' }]);
  });

  it('should generateProject', () => {
    const data = { selectedRas: ['ra1'], methodology: 'ABP', modules: ['mod1'], tipoNivel: 'FP', language: 'castellano', courseLevel: '1', title: 'Test' };
    service.generateProject(data.selectedRas, data.methodology, data.modules, data.tipoNivel, data.language, data.courseLevel, data.title).subscribe(res => {
      expect(res).toEqual({ id: 'proj1' });
    });
    
    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush({ id: 'proj1' });
  });

  it('should listenToProjectUpdates using EventSource', () => {
    // This is hard to test directly because EventSource is created inside the observable.
    // We can mock EventSource on the window object.
    
    class MockEventSource {
      onmessage: any;
      onerror: any;
      close = vi.fn();
      constructor(public url: string) {
        setTimeout(() => {
          if (this.onmessage) {
            this.onmessage({ data: JSON.stringify({ status: 'update' }) });
          }
        }, 10);
      }
    }
    const OriginalEventSource = (window as any).EventSource;
    (window as any).EventSource = MockEventSource as any;

    localStorage.setItem('pai_token', 'fake-token');

    let receivedData: any;
    const sub = service.listenToProjectUpdates().subscribe(data => {
      receivedData = data;
    });

    // We can use vitest fake timers or just wait since we used setTimeout
    // Since it's setTimeout(10), we can just use a promise or something,
    // Or replace setTimeout with synchronous call in mock
    
    // Cleanup
    sub.unsubscribe();
    window.EventSource = OriginalEventSource;
  });

  it('should listenToProjectUpdates (synchronous mock)', () => {
    let closed = false;
    class MockEventSourceSync {
      onmessage: any;
      onerror: any;
      close = () => { closed = true; };
      constructor(public url: string) {}
      
      triggerMessage(data: any) {
        this.onmessage({ data: JSON.stringify(data) });
      }
      triggerError(err: any) {
        this.onerror(err);
      }
    }
    
    const OriginalEventSource = window.EventSource;
    window.EventSource = MockEventSourceSync as any;
    localStorage.setItem('pai_token', 'test-token');

    let instance: MockEventSourceSync | undefined;
    window.EventSource = vi.fn().mockImplementation(function(this: any, url: string) {
      instance = new MockEventSourceSync(url);
      return instance;
    }) as any;

    const dataList: any[] = [];
    const sub = service.listenToProjectUpdates().subscribe(data => {
      dataList.push(data);
    });

    expect(window.EventSource).toHaveBeenCalledWith('/api/projects/stream?token=test-token');
    
    // trigger
    instance?.triggerMessage({ msg: 'hello' });
    expect(dataList).toEqual([{ msg: 'hello' }]);
    
    instance?.triggerError('err');

    sub.unsubscribe();
    expect(closed).toBe(true);
    
    window.EventSource = OriginalEventSource;
  });

  it('should getProjects', () => {
    service.getProjects().subscribe();
    const req = httpMock.expectOne('/api/projects');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should updateProject', () => {
    service.updateProject('123', 'new text', 'published').subscribe();
    const req = httpMock.expectOne('/api/projects/123');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ rawText: 'new text', status: 'published' });
    req.flush({});
  });

  it('should deleteProject', () => {
    service.deleteProject('123').subscribe();
    const req = httpMock.expectOne('/api/projects/123');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should rewriteSection', () => {
    service.rewriteSection('context', 'selected', 'instruction').subscribe();
    const req = httpMock.expectOne('/api/projects/rewrite');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ context: 'context', selectedText: 'selected', instruction: 'instruction' });
    req.flush({});
  });

  it('should getProjectFiles', () => {
    service.getProjectFiles('123').subscribe();
    const req = httpMock.expectOne('/api/projects/123/files');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should uploadFile', () => {
    const file = new File([''], 'test.txt');
    service.uploadFile('123', file).subscribe();
    const req = httpMock.expectOne('/api/projects/123/files');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush({});
  });

  it('should deleteFile', () => {
    service.deleteFile('123', 'test.txt').subscribe();
    const req = httpMock.expectOne('/api/projects/123/files/test.txt');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should getDownloadUrl', () => {
    const url = service.getDownloadUrl('123', 'test.txt');
    expect(url).toBe('/api/projects/123/files/test.txt');
  });

  it('should getUsers', () => {
    service.getUsers().subscribe();
    const req = httpMock.expectOne('/api/admin/users');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should updateUserPermissions', () => {
    service.updateUserPermissions('123', { role: 'admin' }).subscribe();
    const req = httpMock.expectOne('/api/admin/users/123/permissions');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ role: 'admin' });
    req.flush({});
  });

  it('should getSettings', () => {
    service.getSettings().subscribe();
    const req = httpMock.expectOne('/api/settings');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should updateSettings', () => {
    service.updateSettings({ key: 'val' }).subscribe();
    const req = httpMock.expectOne('/api/settings');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ key: 'val' });
    req.flush({});
  });

  it('should exportDocx', () => {
    service.exportDocx('123').subscribe();
    const req = httpMock.expectOne('/api/projects/123/export-docx');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob());
  });

  it('should importDocx', () => {
    const file = new File([''], 'test.docx');
    service.importDocx('123', file).subscribe();
    const req = httpMock.expectOne('/api/projects/123/import-docx');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush({});
  });
});
