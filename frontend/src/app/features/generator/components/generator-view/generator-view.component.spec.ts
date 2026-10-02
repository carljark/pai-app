import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GeneratorViewComponent } from './generator-view.component';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AppFacade } from '../../../../app.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-curriculum-selector',
  standalone: true,
  template: '<div></div>',
})
class MockCurriculumSelectorComponent {
  @Input() title = '';
  @Input() generateText = '';
  @Input() generatingText = '';
  @Input() isGenerating = false;
  @Output() generate = new EventEmitter<void>();
}

describe('GeneratorViewComponent', () => {
  let component: GeneratorViewComponent;
  let fixture: ComponentFixture<GeneratorViewComponent>;

  const mockLayout = {};

  const mockTrans = {
    t: signal({
      subtitle: 'Subtitle',
      selectedItemsTitle: 'Selected Items',
      generateBtn: 'Generate',
      generatingBtn: 'Generating',
      generatorExtraInstructionsLabel: 'Instrucciones adicionales para la IA',
      generatorExtraInstructionsOptional: '(Opcional)',
      generatorExtraInstructionsPlaceholder: 'Ej: Enfocar...',
      generatorModelLabel: 'Modelo de IA',
    }),
  };

  const tipoNivelSignal = signal<string>('FP_BASICA');
  const cursoSignal = signal<string>('1º');
  const setTipoNivelSpy = vi.fn((val: string) => tipoNivelSignal.set(val));

  const mockCurriculum = {
    tipoNivel: tipoNivelSignal,
    curso: cursoSignal,
    groupedItems: signal([]),
    selectedRas: signal([]),
    selectedItemsDetails: signal([]),
    groupedSelectedItems: signal([]),
    getCategoryStyle: vi.fn().mockReturnValue({ bg: '#fff', text: '#000', icon: '' }),
    toggleRa: vi.fn(),
    setTipoNivel: setTipoNivelSpy,
    setCurso: vi.fn((val: string) => cursoSignal.set(val)),
  };

  const mockProjects = {
    isGenerating: signal(false),
    methodology: signal('ABP (Aprendizaje Basado en Problemas / Proyectos)'),
    selectedAi: signal<'gemini' | 'openrouter'>('gemini'),
    selectedModel: signal('gemini-3.6-flash'),
    extraInstructions: signal(''),
    availableModels: () =>
      mockProjects.selectedAi() === 'gemini'
        ? [{ value: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash', provider: 'gemini' }]
        : [
            {
              value: 'openrouter/free',
              label: 'Auto Gratuito (Router automático)',
              provider: 'openrouter',
            },
            {
              value: 'dots-studio/dots-3-note-preview:free',
              label: 'Dots3 Note 512k (Documentos)',
              provider: 'openrouter',
            },
            {
              value: 'deepseek/deepseek-v4.1-flash',
              label: 'DeepSeek V4.1 Flash',
              provider: 'openrouter',
            },
          ],
    defaultModelForProvider: (p: string) =>
      p === 'gemini' ? 'gemini-3.6-flash' : 'deepseek/deepseek-v4.1-flash',
    directory: signal([{ _id: 'u2', name: 'Compañero', email: 'comp@test.com', role: 'teacher' }]),
    selectedCollaborators: signal<string[]>([]),
    toggleCollaborator: vi.fn(),
    matchingProjects: signal([]),
  };

  const mockAppFacade = {
    generateProject: vi.fn(),
    openProjectInNewWindow: vi.fn(),
  };

  const mockAuthFacade = {
    currentUser: signal<any>({ role: 'admin' }),
  };

  beforeEach(async () => {
    mockAuthFacade.currentUser.set({ role: 'admin' });
    // Los signals del mock se comparten entre tests: se restablece el estado inicial
    tipoNivelSignal.set('FP_BASICA');
    setTipoNivelSpy.mockClear();
    await TestBed.configureTestingModule({
      imports: [GeneratorViewComponent],
      providers: [
        { provide: LayoutService, useValue: mockLayout },
        { provide: TranslationService, useValue: mockTrans },
        { provide: CurriculumFacade, useValue: mockCurriculum },
        { provide: ProjectsFacade, useValue: mockProjects },
        { provide: AppFacade, useValue: mockAppFacade },
        { provide: AuthFacade, useValue: mockAuthFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneratorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change tipoNivel with the Enter key', () => {
    const tabs = fixture.debugElement.nativeElement.querySelectorAll('.tabs-item');
    const expected = [
      'FP_BASICA',
      'CFGM_ESTETICA',
      'CFGM_PELUQUERIA',
      'DIVERSIFICACION_CURRICULAR',
    ];

    tabs.forEach((tab: HTMLElement, i: number) => {
      tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(setTipoNivelSpy).toHaveBeenLastCalledWith(expected[i]);
    });
  });

  it('should change tipoNivel on click', () => {
    const tabs = fixture.debugElement.nativeElement.querySelectorAll('.tabs-item');

    expect(mockCurriculum.tipoNivel()).toBe('FP_BASICA');

    // click CFGM_ESTETICA
    tabs[1].click();
    expect(setTipoNivelSpy).toHaveBeenCalledWith('CFGM_ESTETICA');

    // click CFGM_PELUQUERIA
    tabs[2].click();
    expect(setTipoNivelSpy).toHaveBeenCalledWith('CFGM_PELUQUERIA');

    // click FP Básica
    tabs[0].click();
    expect(setTipoNivelSpy).toHaveBeenCalledWith('FP_BASICA');

    // click Diversificación Curricular
    tabs[3].click();
    expect(setTipoNivelSpy).toHaveBeenCalledWith('DIVERSIFICACION_CURRICULAR');
  });

  it('should call generateProject on AppFacade when button clicked', () => {
    const selectorDe = fixture.debugElement.query(By.css('app-curriculum-selector'));
    selectorDe.triggerEventHandler('generate', null);
    expect(mockAppFacade.generateProject).toHaveBeenCalled();
  });

  it('should change curso on select change', () => {
    mockCurriculum.tipoNivel.set('FP_BASICA');
    fixture.detectChanges();
    const courseSelect = fixture.debugElement.query(
      By.css('#generator-course-select'),
    ).nativeElement;

    courseSelect.value = '2º';
    courseSelect.dispatchEvent(new Event('change'));
    expect(mockCurriculum.setCurso).toHaveBeenCalled();

    mockCurriculum.tipoNivel.set('DIVERSIFICACION_CURRICULAR');
    fixture.detectChanges();

    courseSelect.value = '4º';
    courseSelect.dispatchEvent(new Event('change'));
    expect(mockCurriculum.setCurso).toHaveBeenCalledWith('4º');
  });

  it('should disable generate button if generating', () => {
    mockProjects.isGenerating.set(true);
    fixture.detectChanges();
    const selectorDe = fixture.debugElement.query(By.css('app-curriculum-selector'));
    const selectorInstance = selectorDe.componentInstance as MockCurriculumSelectorComponent;
    expect((selectorInstance as any).isGenerating()).toBe(true);
  });

  it('should change methodology on select change', () => {
    fixture.detectChanges();
    const methodologySelect = fixture.debugElement.query(
      By.css('#generator-methodology-select'),
    ).nativeElement;

    methodologySelect.value = 'ABR (Aprendizaje Basado en Retos)';
    methodologySelect.dispatchEvent(new Event('change'));
    expect(mockProjects.methodology()).toContain('ABR');
  });

  it('should change selectedAi and default selectedModel on select change when admin', () => {
    mockAuthFacade.currentUser.set({ role: 'admin' });
    mockProjects.selectedAi.set('gemini');
    mockProjects.selectedModel.set('gemini-3.6-flash');
    fixture.detectChanges();
    const aiSelect = fixture.debugElement.query(By.css('#generator-ai-select')).nativeElement;

    aiSelect.value = 'openrouter';
    aiSelect.dispatchEvent(new Event('change'));
    expect(mockProjects.selectedAi()).toBe('openrouter');
    expect(mockProjects.selectedModel()).toBe('deepseek/deepseek-v4.1-flash');

    aiSelect.value = 'gemini';
    aiSelect.dispatchEvent(new Event('change'));
    expect(mockProjects.selectedAi()).toBe('gemini');
    expect(mockProjects.selectedModel()).toBe('gemini-3.6-flash');
  });

  it('should change selectedModel on model select change when admin', () => {
    mockAuthFacade.currentUser.set({ role: 'admin' });
    mockProjects.selectedAi.set('gemini');
    fixture.detectChanges();

    const modelSelect = fixture.debugElement.query(By.css('#generator-model-select')).nativeElement;
    modelSelect.value = 'gemini-3.6-flash';
    modelSelect.dispatchEvent(new Event('change'));
    expect(mockProjects.selectedModel()).toBe('gemini-3.6-flash');

    // Switch to OpenRouter and choose a document model
    mockProjects.selectedAi.set('openrouter');
    fixture.detectChanges();
    const modelSelectOR = fixture.debugElement.query(
      By.css('#generator-model-select'),
    ).nativeElement;
    modelSelectOR.value = 'dots-studio/dots-3-note-preview:free';
    modelSelectOR.dispatchEvent(new Event('change'));
    expect(mockProjects.selectedModel()).toBe('dots-studio/dots-3-note-preview:free');
  });

  it('should not show generator-ai-select or generator-model-select for non-admin users', () => {
    mockAuthFacade.currentUser.set({ role: 'teacher' });
    fixture.detectChanges();
    const aiSelect = fixture.debugElement.query(By.css('#generator-ai-select'));
    const modelSelect = fixture.debugElement.query(By.css('#generator-model-select'));
    expect(aiSelect).toBeNull();
    expect(modelSelect).toBeNull();
  });

  it('should update extraInstructions on textarea input', () => {
    fixture.detectChanges();
    const textarea = fixture.debugElement.query(
      By.css('#generator-extra-instructions'),
    ).nativeElement;
    textarea.value = 'Enfocar en sostenibilidad y dinámicas DUA';
    textarea.dispatchEvent(new Event('input'));
    expect(mockProjects.extraInstructions()).toBe('Enfocar en sostenibilidad y dinámicas DUA');
  });

  it('should render selected collaborators and toggle them', () => {
    mockProjects.selectedCollaborators.set(['u2']);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Compañero');

    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'))
      .nativeElement as HTMLInputElement;
    checkbox.dispatchEvent(new Event('change'));
    expect(mockProjects.toggleCollaborator).toHaveBeenCalledWith('u2');

    const removeBtn = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((b) => b.textContent?.includes('×')) as HTMLButtonElement;
    removeBtn.click();
    expect(mockProjects.toggleCollaborator).toHaveBeenCalledWith('u2');
  });

  it('should handle CFGM_ESTETICA course options and getUserName fallback', () => {
    mockCurriculum.tipoNivel.set('CFGM_ESTETICA');
    fixture.detectChanges();
    expect(component.courseOptions().map((o) => o.value)).toEqual(['1º']);
    expect(component.getUserName('u2')).toBe('Compañero');
    expect(component.getUserName('desconocido')).toBe('desconocido');
  });
});
