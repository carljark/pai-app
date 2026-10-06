import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { CriteriosFacade } from './criterios.facade';
import { CurriculumFacade } from './curriculum.facade';

const todos = [
  { id: '1.1', text: 'a' },
  { id: '1.2', text: 'b' },
  { id: '1.3', text: 'c' },
];

describe('CriteriosFacade', () => {
  let facade: CriteriosFacade;
  let selected: ReturnType<typeof signal<string[]>>;

  beforeEach(() => {
    selected = signal<string[]>([]);
    const curriculum = {
      selectedRas: selected,
      toggleRa: (key: string) =>
        selected.update((l) => (l.includes(key) ? l.filter((k) => k !== key) : [...l, key])),
    };
    TestBed.configureTestingModule({
      providers: [CriteriosFacade, { provide: CurriculumFacade, useValue: curriculum }],
    });
    facade = TestBed.inject(CriteriosFacade);
  });

  it('has no criteria checked while the CE is not selected', () => {
    expect(facade.elegidos('CE1', todos)).toEqual([]);
    expect(facade.allChecked('CE1', todos)).toBe(false);
    expect(facade.isChecked('CE1', '1.1', todos)).toBe(false);
  });

  it('checks every criterion when a CE is selected without a partial choice', () => {
    selected.set(['CE1']);
    expect(facade.elegidos('CE1', todos)).toEqual(['1.1', '1.2', '1.3']);
    expect(facade.allChecked('CE1', todos)).toBe(true);
    expect(facade.selectedCount('CE1', 3)).toBe(3);
    expect(facade.payload()).toEqual([]);
  });

  it('selects the CE with only that criterion when one is checked', () => {
    facade.toggle('CE1', '1.2', todos);
    expect(selected()).toEqual(['CE1']);
    expect(facade.elegidos('CE1', todos)).toEqual(['1.2']);
    expect(facade.selectedCount('CE1', 3)).toBe(1);
    expect(facade.payload()).toEqual([{ ce: 'CE1', ids: ['1.2'] }]);
  });

  it('keeps official order when criteria are added and drops the partial choice when all are checked', () => {
    facade.toggle('CE1', '1.3', todos);
    facade.toggle('CE1', '1.1', todos);
    expect(facade.payload()).toEqual([{ ce: 'CE1', ids: ['1.1', '1.3'] }]);
    facade.toggle('CE1', '1.2', todos);
    expect(facade.payload()).toEqual([]);
    expect(facade.allChecked('CE1', todos)).toBe(true);
  });

  it('deselects the CE when its last criterion is unchecked', () => {
    facade.toggle('CE1', '1.1', todos);
    facade.toggle('CE1', '1.1', todos);
    expect(selected()).toEqual([]);
    expect(facade.payload()).toEqual([]);
  });

  it('select all selects the CE with every criterion and a second click deselects it', () => {
    facade.toggleAll('CE1', todos);
    expect(selected()).toEqual(['CE1']);
    expect(facade.allChecked('CE1', todos)).toBe(true);
    facade.toggleAll('CE1', todos);
    expect(selected()).toEqual([]);
  });

  it('select all completes a partial choice', () => {
    facade.toggle('CE1', '1.1', todos);
    facade.toggleAll('CE1', todos);
    expect(facade.allChecked('CE1', todos)).toBe(true);
    expect(facade.payload()).toEqual([]);
  });

  it('forgets the partial choice when the CE is deselected outside the list (cart, new level)', () => {
    facade.toggle('CE1', '1.1', todos);
    selected.set([]);
    TestBed.tick();
    selected.set(['CE1']);
    expect(facade.elegidos('CE1', todos)).toEqual(['1.1', '1.2', '1.3']);
    expect(facade.payload()).toEqual([]);
  });

  it('ignores an empty list of criteria', () => {
    selected.set(['CE1']);
    expect(facade.allChecked('CE1', [])).toBe(false);
  });
});
