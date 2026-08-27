import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurriculumSelectorComponent } from './curriculum-selector.component';
import { CurriculumFacade } from '../../services/curriculum.facade';
import { ComponentRef, signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CurriculumSelectorComponent', () => {
  let component: CurriculumSelectorComponent;
  let fixture: ComponentFixture<CurriculumSelectorComponent>;
  let mockFacade: Partial<CurriculumFacade>;

  beforeEach(async () => {
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
        { provide: CurriculumFacade, useValue: mockFacade }
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
    const cartSummary = compiled.querySelector('details[open] summary');
    expect(cartSummary?.textContent).toContain('Select Curriculum (1)');
    
    const cartItems = compiled.querySelectorAll('details[open] li li');
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].textContent).toContain('RA1');
  });

  it('should call toggleRa when removing from cart', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const removeBtn = compiled.querySelector('details[open] li li button') as HTMLButtonElement;
    removeBtn.click();
    expect(mockFacade.toggleRa).toHaveBeenCalledWith('RA1');
  });

  it('should emit generate event on button click', () => {
    const generateSpy = vi.spyOn(component.generate, 'emit');
    const compiled = fixture.nativeElement as HTMLElement;
    const generateBtn = compiled.querySelector('details[open] button:last-of-type') as HTMLButtonElement; // Assuming it's the main button
    
    // There are 2 buttons. The remove button and the generate button.
    const buttons = compiled.querySelectorAll('button');
    const genBtn = buttons[buttons.length - 1];
    
    genBtn.click();
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
});
