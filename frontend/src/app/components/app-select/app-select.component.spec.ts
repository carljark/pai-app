import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppSelectComponent } from './app-select.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AppSelectComponent', () => {
  let component: AppSelectComponent;
  let fixture: ComponentFixture<AppSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppSelectComponent] }).compileComponents();
    fixture = TestBed.createComponent(AppSelectComponent);
    component = fixture.componentInstance;
  });

  it('should render options and placeholder', () => {
    fixture.componentRef.setInput('inputId', 'sel');
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]);
    fixture.componentRef.setInput('placeholder', 'Todos');
    fixture.componentRef.setInput('value', '');
    fixture.detectChanges();

    const select = fixture.nativeElement.querySelector('select');
    expect(select.id).toBe('sel');
    expect(select.querySelectorAll('option').length).toBe(3);
    expect(fixture.nativeElement.textContent).toContain('Todos');
  });

  it('should emit valueChange on change', () => {
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]);
    fixture.componentRef.setInput('value', 'a');
    fixture.detectChanges();

    const spy = vi.fn();
    component.valueChange.subscribe(spy);

    const select = fixture.nativeElement.querySelector('select');
    select.value = 'b';
    select.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith('b');
  });

  it('should render label and sm/disabled modifiers', () => {
    fixture.componentRef.setInput('label', 'Curso');
    fixture.componentRef.setInput('inputId', 'x');
    fixture.componentRef.setInput('size', 'sm');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('.app-select');
    expect(root.classList.contains('app-select--sm')).toBe(true);
    expect(root.classList.contains('app-select--disabled')).toBe(true);
    expect(fixture.nativeElement.querySelector('label').textContent).toContain('Curso');
    expect(fixture.nativeElement.querySelector('select').disabled).toBe(true);
  });
});
