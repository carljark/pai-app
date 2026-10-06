import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CeCriteriosListComponent } from './ce-criterios-list.component';
import { CriteriosFacade } from '../../services/criterios.facade';
import { TranslationService } from '../../../../services/translation.service';

describe('CeCriteriosListComponent', () => {
  let fixture: ComponentFixture<CeCriteriosListComponent>;
  let criterios: any;
  const items = [
    { id: '1.1', text: 'Primero' },
    { id: '1.2', text: 'Segundo' },
  ];

  beforeEach(async () => {
    criterios = {
      selectedCount: vi.fn().mockReturnValue(1),
      allChecked: vi.fn().mockReturnValue(false),
      isChecked: vi.fn((_k: string, id: string) => id === '1.1'),
      toggle: vi.fn(),
      toggleAll: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [CeCriteriosListComponent],
      providers: [
        { provide: CriteriosFacade, useValue: criterios },
        {
          provide: TranslationService,
          useValue: {
            t: signal({
              criteriaTitle: 'Criterios de evaluación',
              selectAllCriteria: 'Seleccionar todos los criterios',
            }),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CeCriteriosListComponent);
    fixture.componentRef.setInput('ceKey', 'CE1');
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  const el = () => fixture.nativeElement as HTMLElement;

  it('shows the title with the selected count and every criterion with its official number', () => {
    expect(el().querySelector('.ce-criterios-list__summary')!.textContent).toContain(
      'Criterios de evaluación (1/2)',
    );
    const texts = Array.from(el().querySelectorAll('.ce-criterios-list__text')).map((e) =>
      e.textContent!.replace(/\s+/g, ' ').trim(),
    );
    expect(texts).toEqual(['1.1 Primero', '1.2 Segundo']);
  });

  it('reflects the checked state of each criterion', () => {
    const boxes = el().querySelectorAll<HTMLInputElement>('.ce-criterios-list__label input');
    expect(boxes[0]!.checked).toBe(true);
    expect(boxes[1]!.checked).toBe(false);
  });

  it('toggles one criterion when its checkbox changes', () => {
    el()
      .querySelectorAll<HTMLInputElement>('.ce-criterios-list__label input')[1]!
      .dispatchEvent(new Event('change'));
    expect(criterios.toggle).toHaveBeenCalledWith('CE1', '1.2', items);
  });

  it('selects all criteria from the select-all checkbox', () => {
    expect(el().querySelector('.ce-criterios-list__all')!.textContent).toContain(
      'Seleccionar todos los criterios',
    );
    el()
      .querySelector<HTMLInputElement>('.ce-criterios-list__all input')!
      .dispatchEvent(new Event('change'));
    expect(criterios.toggleAll).toHaveBeenCalledWith('CE1', items);
  });
});
