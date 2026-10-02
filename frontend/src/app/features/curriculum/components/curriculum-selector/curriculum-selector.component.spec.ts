import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurriculumSelectorComponent } from './curriculum-selector.component';
import { CurriculumFacade } from '../../services/curriculum.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AppFacade } from '../../../../app.facade';
import { ComponentRef, signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { TranslationService } from '../../../../services/translation.service';

describe('CurriculumSelectorComponent', () => {
  let component: CurriculumSelectorComponent;
  let fixture: ComponentFixture<CurriculumSelectorComponent>;
  let mockFacade: Partial<CurriculumFacade>;
  let mockTrans: any;
  let mockProjects: any;
  let mockAppFacade: any;

  beforeEach(async () => {
    mockTrans = {
      t: signal({
        removeTooltip: 'Quitar',
        matchingProjectsTitle: 'proyectos con esta selección',
        longGenerationNoticePlural: 'Muchos elementos seleccionados'
      })
    };

    mockProjects = {
      matchingProjects: signal<any[]>([])
    };

    mockAppFacade = {
      openProjectInNewWindow: vi.fn()
    };

    mockFacade = {
      groupedItems: signal([
        {
          category: 'Ciencia',
          totalItems: 2,
          items: [{ index: 1, text: 'RA1' }, { index: 2, text: 'RA2' }]
        }
      ]),
      selectedRas: signal(['RA1']),
      toggleRa: vi.fn(),
      getCategoryStyle: () => ({ bg: '#e8f4f8', text: '#2c3e50', icon: '' }),
      selectedItemsDetails: signal([{ subject: 'Ciencia', index: 1, shortDesc: 'RA1', fullDesc: 'RA1' }]),
      groupedSelectedItems: signal([
        {
          subject: 'Ciencia',
          items: [{ subject: 'Ciencia', index: 1, shortDesc: 'RA1', fullDesc: 'RA1' }]
        }
      ])
    };

    await TestBed.configureTestingModule({
      imports: [CurriculumSelectorComponent],
      providers: [
        { provide: CurriculumFacade, useValue: mockFacade },
        { provide: ProjectsFacade, useValue: mockProjects },
        { provide: AppFacade, useValue: mockAppFacade },
        { provide: TranslationService, useValue: mockTrans }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CurriculumSelectorComponent);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('title', 'Select Curriculum');
    fixture.componentRef.setInput('isGenerating', false);
    fixture.componentRef.setInput('generateText', 'Generate');
    fixture.componentRef.setInput('generatingText', 'Generating...');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render grouped items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('summary')?.textContent).toContain('Ciencia (2)');
    const labels = compiled.querySelectorAll('label');
    expect(labels.length).toBe(2);
    expect(labels[0].textContent).toContain('RA1');
  });

  it('should reflect selected items in checkboxes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const checkboxes = compiled.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(false);
  });

  it('should call toggleRa on checkbox change', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const checkboxes = compiled.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkboxes[1].dispatchEvent(new Event('change'));
    expect(mockFacade.toggleRa).toHaveBeenCalledWith('RA2');
  });

  it('should display selected items in the cart', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cartHeader = compiled.querySelector('.floating-cart__header');
    expect(cartHeader?.textContent).toContain('Select Curriculum (1)');
    
    const cartItems = compiled.querySelectorAll('.floating-cart__body li li');
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].textContent).toContain('RA1');
  });

  it('should call toggleRa when removing from cart', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const removeBtn = compiled.querySelector('.floating-cart__body li li button') as HTMLButtonElement;
    removeBtn.click();
    expect(mockFacade.toggleRa).toHaveBeenCalledWith('RA1');
  });

  it('should emit generate event on button click', () => {
    const generateSpy = vi.spyOn(component.generate, 'emit');
    const compiled = fixture.nativeElement as HTMLElement;
    const generateBtn = compiled.querySelector('.floating-cart__footer button') as HTMLButtonElement;
    
    generateBtn.click();
    expect(generateSpy).toHaveBeenCalled();
  });

  it('should disable generate button and show generating text when isGenerating is true', () => {
    fixture.componentRef.setInput('isGenerating', true);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    const genBtn = buttons[buttons.length - 1] as HTMLButtonElement;
    
    expect(genBtn.disabled).toBe(true);
    expect(genBtn.textContent).toContain('Generating...');
  });

  it('should toggle isOpen signal when header is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('.floating-cart__header') as HTMLElement;
    
    expect(component.isOpen()).toBe(true);
    header.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
    
    header.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
  });

  it('should list matching existing projects and open them in a new window', () => {
    mockProjects.matchingProjects.set([
      { _id: 'p1', title: 'Proyecto existente', status: 'borrador', createdAt: new Date().toISOString() }
    ]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.floating-cart__matches-summary')?.textContent).toContain('proyectos con esta selección');

    const link = compiled.querySelector('.floating-cart__match-link') as HTMLButtonElement;
    link.click();
    expect(mockAppFacade.openProjectInNewWindow).toHaveBeenCalledWith(expect.objectContaining({ _id: 'p1' }));
  });

  it('should not render the matching section when there are no matches', () => {
    mockProjects.matchingProjects.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.floating-cart__matches')).toBeNull();
  });

  it('should render matches without title and the long generation notice', () => {
    mockProjects.matchingProjects.set([
      { _id: 'm1', status: 'borrador', createdAt: new Date().toISOString(), modules: ['Modulo X'] }
    ]);
    (mockFacade.selectedItemsDetails as any).set([
      { subject: 'S', index: 1, shortDesc: 'a', fullDesc: 'a' },
      { subject: 'S', index: 2, shortDesc: 'b', fullDesc: 'b' },
      { subject: 'S', index: 3, shortDesc: 'c', fullDesc: 'c' }
    ]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.floating-cart__match-title')?.textContent).toContain('Modulo X');
    expect(compiled.querySelector('.generation-notice')).toBeTruthy();
  });
});
