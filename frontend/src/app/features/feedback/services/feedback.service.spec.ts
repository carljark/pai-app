import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FeedbackService } from './feedback.service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FeedbackService]
    });
    service = TestBed.inject(FeedbackService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería enviar feedback y actualizar la señal', () => {
    const mockItem = {
      _id: 'fb1',
      userId: 'u1',
      userName: 'Carlos',
      userEmail: 'carlos@test.com',
      type: 'sugerencia' as const,
      title: 'Mejora',
      description: 'Detalle',
      status: 'pendiente' as const
    };

    service.sendFeedback({ type: 'sugerencia', title: 'Mejora', description: 'Detalle' }).subscribe(res => {
      expect(res._id).toBe('fb1');
    });

    const req = httpMock.expectOne('/api/feedback');
    expect(req.request.method).toBe('POST');
    req.flush(mockItem);

    expect(service.feedbacks().length).toBe(1);
    expect(service.isSubmitting()).toBe(false);
  });

  it('debería cargar lista de feedbacks con y sin query params', () => {
    service.loadFeedbacks({ status: 'pendiente', type: 'error' }).subscribe(res => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/feedback?status=pendiente&type=error');
    expect(req.request.method).toBe('GET');
    req.flush([{ _id: 'fb1', title: 'Bug', status: 'pendiente', type: 'error' }]);

    expect(service.feedbacks().length).toBe(1);
    expect(service.isLoading()).toBe(false);

    // Sin params
    service.loadFeedbacks().subscribe();
    const req2 = httpMock.expectOne('/api/feedback');
    req2.flush([]);
  });

  it('debería actualizar estado de un feedback', () => {
    service.feedbacks.set([{ _id: 'fb1', title: 'Bug', status: 'pendiente', type: 'error', userId: '1', userName: 'A', userEmail: 'B', description: 'C' }]);
    
    service.updateFeedbackStatus('fb1', 'resuelto', 'Listo').subscribe(res => {
      expect(res.status).toBe('resuelto');
    });

    const req = httpMock.expectOne('/api/feedback/fb1');
    expect(req.request.method).toBe('PATCH');
    req.flush({ _id: 'fb1', title: 'Bug', status: 'resuelto', type: 'error', adminNotes: 'Listo', userId: '1', userName: 'A', userEmail: 'B', description: 'C' });

    expect(service.feedbacks()[0].status).toBe('resuelto');
    expect(service.feedbacks()[0].adminNotes).toBe('Listo');
  });

  it('debería manejar error en sendFeedback', () => {
    service.sendFeedback({ type: 'error', title: 'Fallo', description: 'Desc' }).subscribe({
      error: () => {}
    });

    const req = httpMock.expectOne('/api/feedback');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    expect(service.isSubmitting()).toBe(false);
  });

  it('debería manejar error en loadFeedbacks y filtrar por solo status o solo type', () => {
    service.loadFeedbacks().subscribe({ error: () => {} });
    const reqErr = httpMock.expectOne('/api/feedback');
    reqErr.flush('Error', { status: 500, statusText: 'Server Error' });
    expect(service.isLoading()).toBe(false);

    // Solo status
    service.loadFeedbacks({ status: 'en_revision' }).subscribe();
    const reqStatus = httpMock.expectOne('/api/feedback?status=en_revision');
    reqStatus.flush([]);

    // Solo type
    service.loadFeedbacks({ type: 'sugerencia' }).subscribe();
    const reqType = httpMock.expectOne('/api/feedback?type=sugerencia');
    reqType.flush([]);
  });

  it('debería actualizar estado de un feedback entre varios items', () => {
    service.feedbacks.set([
      { _id: 'fb1', title: 'Bug 1', status: 'pendiente', type: 'error', userId: '1', userName: 'A', userEmail: 'B', description: 'C' },
      { _id: 'fb2', title: 'Bug 2', status: 'pendiente', type: 'error', userId: '1', userName: 'A', userEmail: 'B', description: 'C' }
    ]);
    
    service.updateFeedbackStatus('fb1', 'resuelto', 'Listo').subscribe();
    const req = httpMock.expectOne('/api/feedback/fb1');
    req.flush({ _id: 'fb1', title: 'Bug 1', status: 'resuelto', type: 'error', adminNotes: 'Listo', userId: '1', userName: 'A', userEmail: 'B', description: 'C' });

    expect(service.feedbacks()[0].status).toBe('resuelto');
    expect(service.feedbacks()[1].status).toBe('pendiente');
  });

  it('debería eliminar feedback', () => {
    service.feedbacks.set([{ _id: 'fb1', title: 'Bug', status: 'pendiente', type: 'error', userId: '1', userName: 'A', userEmail: 'B', description: 'C' }]);

    service.deleteFeedback('fb1').subscribe();
    const req = httpMock.expectOne('/api/feedback/fb1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'OK' });

    expect(service.feedbacks().length).toBe(0);
  });
});
