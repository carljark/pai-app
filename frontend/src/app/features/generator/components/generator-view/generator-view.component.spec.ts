import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GeneratorViewComponent } from './generator-view.component';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AppFacade } from '../../../../app.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { NivelesService } from '../../../../services/niveles.service';
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

  const mockLayout = { language: signal<'castellano' | 'catalan'>('castellano') };

  const nivel = (id: string, nombre_es: string, nombre_ca: string, cursos: string[]) => ({
    id,
    nombre_es,
    nombre_ca,
    cursos: cursos.map((curso) => ({ curso })),
  });
  const CATALOGO = [
    nivel('FP_BASICA', 'CFGB Peluquería y Estética', 'CFGB Perruqueria i Estètica', ['1º', '2º']),
    nivel('CFGM_ESTETICA', 'CFGM Estética y Belleza', 'CFGM Estètica i Bellesa', ['1º']),
    nivel('CFGM_PELUQUERIA', 'CFGM Peluquería', 'CFGM Perruqueria', ['1º', '2º']),
    nivel('CFGS_EDUCACION_INFANTIL', 'CFGS Educación Infantil', 'CFGS Educació Infantil', [
      '1º',
      '2º',
    ]),
    nivel('ESO_ORDINARIA', 'ESO', 'ESO', ['1º', '2º', '3º', '4º']),
    nivel('DIVERSIFICACION_CURRICULAR', 'ESO (PDC)', 'ESO (PDC)', ['3º', '4º', '5º']),
  ];
  const mockNiveles = {
    niveles: signal<any[]>(CATALOGO),
    find: (id: string) => CATALOGO.find((n) => n.id === id),
    nombre: (n: any, isCa: boolean) => (isCa ? n.nombre_ca : n.nombre_es),
  };

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
    availableProviders: signal(['gemini', 'openrouter']),
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
    mockLayout.language.set('castellano');
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
        { provide: NivelesService, useValue: mockNiveles },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneratorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change tipoNivel from the level dropdown', () => {
    const levelSelect = fixture.debugElement.query(By.css('#generator-level-select')).nativeElement;
    const options = Array.from(levelSelect.options as HTMLOptionsCollection).map((o) => o.value);
    expect(options).toEqual([
      'FP_BASICA',
      'CFGM_ESTETICA',
      'CFGM_PELUQUERIA',
      'CFGS_EDUCACION_INFANTIL',
      'ESO_ORDINARIA',
      'DIVERSIFICACION_CURRICULAR',
    ]);

    options.forEach((value) => {
      levelSelect.value = value;
      levelSelect.dispatchEvent(new Event('change'));
      expect(setTipoNivelSpy).toHaveBeenLastCalledWith(value);
    });
  });

  it('should label the levels in the active language', () => {
    mockLayout.language.set('catalan');
    fixture.detectChanges();
    const levelSelect = fixture.debugElement.query(By.css('#generator-level-select')).nativeElement;
    expect(levelSelect.options[3].textContent.trim()).toBe('CFGS Educació Infantil');
  });

  it('should offer the four ESO courses and keep unknown course labels', () => {
    mockCurriculum.tipoNivel.set('ESO_ORDINARIA');
    fixture.detectChanges();
    expect(component.courseOptions().map((o) => o.value)).toEqual(['1º', '2º', '3º', '4º']);
    mockCurriculum.tipoNivel.set('DIVERSIFICACION_CURRICULAR');
    expect(component.courseOptions()[2]).toEqual({ value: '5º', label: '5º' });
  });

  it('should have no courses for a level missing from the catalog', () => {
    mockCurriculum.tipoNivel.set('DESCONOCIDO');
    expect(component.courseOptions()).toEqual([]);
  });

  it('should offer 1st and 2nd year for CFGS Educación Infantil', () => {
    mockCurriculum.tipoNivel.set('CFGS_EDUCACION_INFANTIL');
    fixture.detectChanges();
    expect(component.courseOptions().map((o) => o.value)).toEqual(['1º', '2º']);
  });

  it('should call generateProject on AppFacade when button clicked', () => {
    const selectorDe = fixture.debugElement.query(By.css('app-curriculum-selector'));
    selectorDe.triggerEventHandler('generate', null);
    expect(mockAppFacade.generateProject).toHaveBeenCalled();
  });

  it('should change curso with the segmented buttons', () => {
    const courseButtons = () =>
      fixture.nativeElement.querySelectorAll(
        '.generator-view__curso',
      ) as NodeListOf<HTMLButtonElement>;

    mockCurriculum.tipoNivel.set('FP_BASICA');
    cursoSignal.set('1º');
    fixture.detectChanges();
    expect(courseButtons()[0]!.getAttribute('aria-pressed')).toBe('true');
    courseButtons()[1]!.click();
    expect(mockCurriculum.setCurso).toHaveBeenCalledWith('2º');

    mockCurriculum.tipoNivel.set('DIVERSIFICACION_CURRICULAR');
    fixture.detectChanges();
    courseButtons()[1]!.click();
    expect(mockCurriculum.setCurso).toHaveBeenCalledWith('4º');
  });

  it('should hide the course selector when the level has a single course', () => {
    mockCurriculum.tipoNivel.set('CFGM_ESTETICA');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.generator-view__segmented')).toBeNull();
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
