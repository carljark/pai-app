import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GeneratorViewComponent } from './generator-view.component';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AppFacade } from '../../../../app.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { CurriculumSelectorComponent } from '../../../curriculum/components/curriculum-selector/curriculum-selector.component';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-curriculum-selector',
  standalone: true,
  template: '<div></div>'
})
class MockCurriculumSelectorComponent {
  @Input() title: string = '';
  @Input() generateText: string = '';
  @Input() generatingText: string = '';
  @Input() isGenerating: boolean = false;
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
      generatorModelLabel: 'Modelo de IA'
    })
  };

  const mockCurriculum = {
    tipoNivel: signal('FP_BASICA'),
    curso: signal('1º'),
    groupedItems: signal([]),
    selectedRas: signal([]),
    selectedItemsDetails: signal([]),
    groupedSelectedItems: signal([]),
    getCategoryStyle: vi.fn().mockReturnValue({ bg: '#fff', text: '#000', icon: '' }),
    toggleRa: vi.fn(),
    setTipoNivel: vi.fn((val) => mockCurriculum.tipoNivel.set(val)),
    setCurso: vi.fn((val) => mockCurriculum.curso.set(val))
  };
  mockCurriculum.tipoNivel.set = vi.fn((val) => mockCurriculum.tipoNivel.set(val));
  const mockSet = vi.fn((v) => { mockCurriculum.tipoNivel = signal(v); mockCurriculum.tipoNivel.set = mockSet; });
  mockCurriculum.tipoNivel.set = mockSet;

  const mockProjects = {
    isGenerating: signal(false),
    methodology: signal('ABP (Aprendizaje Basado en Problemas / Proyectos)'),
    selectedAi: signal<'gemini' | 'openrouter'>('gemini'),
    selectedModel: signal('gemini-3.8-flash'),
    extraInstructions: signal('')
  };

  const mockAppFacade = {
    generateProject: vi.fn()
  };

  const mockAuthFacade = {
    currentUser: signal<any>({ role: 'admin' })
  };

  beforeEach(async () => {
    mockAuthFacade.currentUser.set({ role: 'admin' });
    await TestBed.configureTestingModule({
      imports: [GeneratorViewComponent],
      providers: [
        { provide: LayoutService, useValue: mockLayout },
        { provide: TranslationService, useValue: mockTrans },
        { provide: CurriculumFacade, useValue: mockCurriculum },
        { provide: ProjectsFacade, useValue: mockProjects },
        { provide: AppFacade, useValue: mockAppFacade },
        { provide: AuthFacade, useValue: mockAuthFacade }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change tipoNivel on click', () => {
    const tabs = fixture.debugElement.nativeElement.querySelectorAll('.tabs-item');
    
    expect(mockCurriculum.tipoNivel()).toBe('FP_BASICA');
    
    // click Diversificación Curricular
    tabs[1].click();
    expect(mockSet).toHaveBeenCalledWith('CFGM_ESTETICA');

    // click FP Básica
    tabs[0].click();
    expect(mockSet).toHaveBeenCalledWith('FP_BASICA');
  });

  it('should call generateProject on AppFacade when button clicked', () => {
    const selectorDe = fixture.debugElement.query(By.css('app-curriculum-selector'));
    selectorDe.triggerEventHandler('generate', null);
    expect(mockAppFacade.generateProject).toHaveBeenCalled();
  });

  it('should change curso on select change', () => {
    mockCurriculum.tipoNivel.set('FP_BASICA');
    fixture.detectChanges();
    const courseSelect = fixture.debugElement.query(By.css('#generator-course-select')).nativeElement;
    
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
    const methodologySelect = fixture.debugElement.query(By.css('#generator-methodology-select')).nativeElement;
    
    methodologySelect.value = 'ABR (Aprendizaje Basado en Retos)';
    methodologySelect.dispatchEvent(new Event('change'));
    expect(mockProjects.methodology()).toContain('ABR');
  });

  it('should change selectedAi and default selectedModel on select change when admin', () => {
    mockAuthFacade.currentUser.set({ role: 'admin' });
    mockProjects.selectedAi.set('gemini');
    mockProjects.selectedModel.set('gemini-3.8-flash');
    fixture.detectChanges();
    const aiSelect = fixture.debugElement.query(By.css('#generator-ai-select')).nativeElement;
    
    aiSelect.value = 'openrouter';
    aiSelect.dispatchEvent(new Event('change'));
    expect(mockProjects.selectedAi()).toBe('openrouter');
    expect(mockProjects.selectedModel()).toBe('openrouter/free');

    aiSelect.value = 'gemini';
    aiSelect.dispatchEvent(new Event('change'));
    expect(mockProjects.selectedAi()).toBe('gemini');
    expect(mockProjects.selectedModel()).toBe('gemini-3.8-flash');
  });

  it('should change selectedModel on model select change when admin', () => {
    mockAuthFacade.currentUser.set({ role: 'admin' });
    mockProjects.selectedAi.set('gemini');
    fixture.detectChanges();

    const modelSelect = fixture.debugElement.query(By.css('#generator-model-select')).nativeElement;
    modelSelect.value = 'gemini-2.5-pro';
    modelSelect.dispatchEvent(new Event('change'));
    expect(mockProjects.selectedModel()).toBe('gemini-2.5-pro');

    // Switch to OpenRouter and choose Claude model
    mockProjects.selectedAi.set('openrouter');
    fixture.detectChanges();
    const modelSelectOR = fixture.debugElement.query(By.css('#generator-model-select')).nativeElement;
    modelSelectOR.value = 'nex-agi/nex-n2.5-pro:free';
    modelSelectOR.dispatchEvent(new Event('change'));
    expect(mockProjects.selectedModel()).toBe('nex-agi/nex-n2.5-pro:free');
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
    const textarea = fixture.debugElement.query(By.css('#generator-extra-instructions')).nativeElement;
    textarea.value = 'Enfocar en sostenibilidad y dinámicas DUA';
    textarea.dispatchEvent(new Event('input'));
    expect(mockProjects.extraInstructions()).toBe('Enfocar en sostenibilidad y dinámicas DUA');
  });
});
