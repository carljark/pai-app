import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackViewComponent } from './feedback-view.component';
import { FeedbackService } from '../../services/feedback.service';
import { TranslationService } from '../../../../services/translation.service';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FeedbackViewComponent', () => {
  let component: FeedbackViewComponent;
  let fixture: ComponentFixture<FeedbackViewComponent>;

  const mockFeedbackService = {
    feedbacks: signal<any[]>([]),
    isSubmitting: signal(false),
    isLoading: signal(false),
    loadFeedbacks: vi.fn().mockReturnValue(of([])),
    sendFeedback: vi.fn().mockReturnValue(of({ _id: 'fb1', title: 'Test' })),
    deleteFeedback: vi.fn().mockReturnValue(of({ message: 'OK' }))
  };

  const mockTranslationService = {
    t: signal({
      feedbackTitle: 'Buzón de Sugerencias',
      feedbackSubtitle: 'Envía propuestas',
      feedbackTypeSuggestion: '💡 Sugerencia',
      feedbackTypeError: '⚠️ Error',
      feedbackSubject: 'Asunto',
      feedbackSubjectPlaceholder: 'Asunto placeholder',
      feedbackDesc: 'Descripción',
      feedbackDescPlaceholder: 'Desc placeholder',
      feedbackSend: 'Enviar',
      feedbackSending: 'Enviando...',
      feedbackSuccess: 'Enviado con éxito',
      feedbackErrorSending: 'Error al enviar',
      feedbackMySubmissions: 'Mis envíos',
      feedbackNoSubmissions: 'No hay envíos',
      feedbackStatusPending: 'Pendiente',
      feedbackStatusReviewing: 'En revisión',
      feedbackStatusResolved: 'Resuelto',
      feedbackStatusDismissed: 'Descartado',
      removeTooltip: 'Eliminar'
    })
  };

  beforeEach(async () => {
    mockFeedbackService.feedbacks.set([]);
    mockFeedbackService.isSubmitting.set(false);
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [FeedbackViewComponent],
      providers: [
        { provide: FeedbackService, useValue: mockFeedbackService },
        { provide: TranslationService, useValue: mockTranslationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse e inicializar cargando feedbacks', () => {
    expect(component).toBeTruthy();
    expect(mockFeedbackService.loadFeedbacks).toHaveBeenCalled();
  });

  it('debería cambiar entre tipo sugerencia y error al hacer click en los botones', () => {
    expect(component.selectedType()).toBe('sugerencia');
    
    const typeButtons = fixture.nativeElement.querySelectorAll('.type-btn');
    expect(typeButtons.length).toBe(2);

    // Click on Error button
    typeButtons[1].click();
    fixture.detectChanges();
    expect(component.selectedType()).toBe('error');

    // Click on Suggestion button
    typeButtons[0].click();
    fixture.detectChanges();
    expect(component.selectedType()).toBe('sugerencia');
  });

  it('debería enviar feedback mediante formulario en el DOM y limpiar alerta tras timeout', () => {
    vi.useFakeTimers();
    const inputs = fixture.nativeElement.querySelectorAll('.form-input, .form-textarea');
    const titleInput = inputs[0] as HTMLInputElement;
    const descInput = inputs[1] as HTMLTextAreaElement;

    titleInput.value = 'Nueva idea';
    titleInput.dispatchEvent(new Event('input'));
    descInput.value = 'Detalle idea';
    descInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(mockFeedbackService.sendFeedback).toHaveBeenCalledWith({
      type: 'sugerencia',
      title: 'Nueva idea',
      description: 'Detalle idea'
    });
    expect(component.alertType()).toBe('success');
    expect(component.alertMessage()).toBe('Enviado con éxito');
    expect(fixture.nativeElement.textContent).toContain('Enviado con éxito');

    vi.advanceTimersByTime(5000);
    expect(component.alertMessage()).toBeNull();
    vi.useRealTimers();
  });

  it('debería manejar error en loadFeedbacks durante ngOnInit', () => {
    mockFeedbackService.loadFeedbacks.mockReturnValueOnce(throwError(() => new Error('Load error')));
    component.ngOnInit();
    expect(mockFeedbackService.loadFeedbacks).toHaveBeenCalled();
  });

  it('debería manejar error en deleteFeedback', () => {
    mockFeedbackService.deleteFeedback.mockReturnValueOnce(throwError(() => new Error('Delete error')));
    component.deleteFeedback('fb1');
    expect(mockFeedbackService.deleteFeedback).toHaveBeenCalledWith('fb1');
  });

  it('no debería enviar si el título o descripción están vacíos', () => {
    component.title.set('   ');
    component.description.set('   ');
    component.submitFeedback();
    expect(mockFeedbackService.sendFeedback).not.toHaveBeenCalled();
  });

  it('debería manejar error al enviar feedback y mostrar alerta de error', () => {
    mockFeedbackService.sendFeedback.mockReturnValueOnce(throwError(() => new Error('Error')));
    component.title.set('Error test');
    component.description.set('Desc');
    component.submitFeedback();
    fixture.detectChanges();

    expect(component.alertType()).toBe('error');
    expect(component.alertMessage()).toBe('Error al enviar');
    expect(fixture.nativeElement.textContent).toContain('Error al enviar');
  });

  it('debería mostrar texto de enviando cuando feedbackService.isSubmitting es true', () => {
    mockFeedbackService.isSubmitting.set(true);
    fixture.detectChanges();
    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitBtn.textContent).toContain('Enviando...');
  });

  it('debería llamar a eliminar feedback desde botón en el DOM', () => {
    mockFeedbackService.feedbacks.set([
      {
        _id: 'fb1',
        title: 'Error en taller',
        type: 'error',
        status: 'resuelto',
        description: 'No guarda el archivo',
        adminNotes: 'Corregido',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'fb2',
        title: 'Sugerencia sin fecha ni admin',
        type: 'sugerencia',
        status: 'pendiente',
        description: 'Mejorar UI'
      }
    ]);
    fixture.detectChanges();

    const deleteButtons = fixture.nativeElement.querySelectorAll('button[title="Eliminar"]');
    expect(deleteButtons.length).toBe(2);

    deleteButtons[0].click();
    expect(mockFeedbackService.deleteFeedback).toHaveBeenCalledWith('fb1');

    component.deleteFeedback(undefined);
    expect(mockFeedbackService.deleteFeedback).toHaveBeenCalledTimes(1);
  });

  it('debería retornar etiquetas de estado correctas', () => {
    expect(component.getStatusLabel('en_revision')).toBe('En revisión');
    expect(component.getStatusLabel('resuelto')).toBe('Resuelto');
    expect(component.getStatusLabel('descartado')).toBe('Descartado');
    expect(component.getStatusLabel('pendiente')).toBe('Pendiente');
    expect(component.getStatusLabel('otro')).toBe('Pendiente');
  });

  it('debería renderizar la lista de feedbacks y respuesta del admin o estado vacío', () => {
    // Lista vacía
    mockFeedbackService.feedbacks.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No hay envíos');

    // Con elementos
    mockFeedbackService.feedbacks.set([
      {
        _id: 'fb1',
        title: 'Error en taller',
        type: 'error',
        status: 'resuelto',
        description: 'No guarda el archivo',
        adminNotes: 'Corregido en versión 2',
        createdAt: new Date().toISOString()
      }
    ]);
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.textContent).toContain('Error en taller');
    expect(el.textContent).toContain('Resuelto');
    expect(el.textContent).toContain('Corregido en versión 2');
  });
});
