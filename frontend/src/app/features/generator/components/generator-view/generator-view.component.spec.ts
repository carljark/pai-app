import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GeneratorViewComponent } from './generator-view.component';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { CurriculumFacade } from '../../../curriculum/services/curriculum.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AppFacade } from '../../../../app.facade';
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
      generatingBtn: 'Generating'
    })
  };

  const mockCurriculum = {
    tipoNivel: signal('FP_BASICA'),
    groupedItems: signal([]),
    selectedRas: signal([]),
    selectedItemsDetails: signal([]),
    groupedSelectedItems: signal([]),
    getCategoryStyle: vi.fn().mockReturnValue({ bg: '#fff', text: '#000', icon: '' }),
    toggleRa: vi.fn(),
    setTipoNivel: vi.fn((val) => mockCurriculum.tipoNivel.set(val))
  };
  mockCurriculum.tipoNivel.set = vi.fn((val) => mockCurriculum.tipoNivel.set(val));
  const mockSet = vi.fn((v) => { mockCurriculum.tipoNivel = signal(v); mockCurriculum.tipoNivel.set = mockSet; });
  mockCurriculum.tipoNivel.set = mockSet;

  const mockProjects = {
    isGenerating: signal(false)
  };

  const mockAppFacade = {
    generateProject: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratorViewComponent],
      providers: [
        { provide: LayoutService, useValue: mockLayout },
        { provide: TranslationService, useValue: mockTrans },
        { provide: CurriculumFacade, useValue: mockCurriculum },
        { provide: ProjectsFacade, useValue: mockProjects },
        { provide: AppFacade, useValue: mockAppFacade }
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
    expect(mockSet).toHaveBeenCalledWith('DIVERSIFICACION_CURRICULAR');

    // click FP Básica
    tabs[0].click();
    expect(mockSet).toHaveBeenCalledWith('FP_BASICA');
  });

  it('should call generateProject on AppFacade when button clicked', () => {
    const selectorDe = fixture.debugElement.query(By.css('app-curriculum-selector'));
    selectorDe.triggerEventHandler('generate', null);
    expect(mockAppFacade.generateProject).toHaveBeenCalled();
  });

  it('should disable generate button if generating', () => {
    mockProjects.isGenerating.set(true);
    fixture.detectChanges();
    const selectorDe = fixture.debugElement.query(By.css('app-curriculum-selector'));
    const selectorInstance = selectorDe.componentInstance as MockCurriculumSelectorComponent;
    expect((selectorInstance as any).isGenerating()).toBe(true);
  });
});
