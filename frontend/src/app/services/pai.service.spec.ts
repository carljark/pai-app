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

  it('should fetch getRas', () => {
    const mockRas = [{ _id: 'ra1', text: 'RA 1' }];
    service.getRas('catalan').subscribe(res => {
      expect(res).toEqual(mockRas);
    });

    const req = httpMock.expectOne('/api/ras?lang=catalan');
    expect(req.request.method).toBe('GET');
    req.flush(mockRas);
  });

  it('should generate project', () => {
    const mockProject = { _id: 'p1', title: 'Test Project' };
    
    service.generateProject(['ra1'], 'ABP', ['mod1'], 'FP', 'castellano', '2').subscribe((res) => {
      expect(res).toEqual(mockProject);
    });

    const req = httpMock.expectOne('/api/projects/generate');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      selectedRas: ['ra1'],
      methodology: 'ABP',
      modules: ['mod1'],
      tipoNivel: 'FP',
      language: 'castellano',
      courseLevel: '2'
    });
    req.flush(mockProject);
  });
});
