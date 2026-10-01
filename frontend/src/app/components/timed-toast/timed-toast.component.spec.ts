import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TimedToastComponent } from './timed-toast.component';

describe('TimedToastComponent', () => {
  let fixture: ComponentFixture<TimedToastComponent>;
  let componentRef: ComponentRef<TimedToastComponent>;

  afterEach(() => {
    vi.useRealTimers();
    fixture?.destroy();
  });

  async function createToast(message: string, durationMs = 5000): Promise<void> {
    await TestBed.configureTestingModule({ imports: [TimedToastComponent] }).compileComponents();
    fixture = TestBed.createComponent(TimedToastComponent);
    componentRef = fixture.componentRef;
    componentRef.setInput('message', message);
    componentRef.setInput('durationMs', durationMs);
    fixture.detectChanges();
    TestBed.flushEffects();
  }

  it('renders the message with an accessible status role', async () => {
    await createToast('Proyecto puesto en cola');

    const toast = fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;
    expect(toast.textContent).toContain('Proyecto puesto en cola');
    expect(toast.getAttribute('aria-live')).toBe('polite');
  });

  it('emits dismissed after the configured duration', async () => {
    vi.useFakeTimers();
    await createToast('Proyecto puesto en cola', 5000);
    const dismissed = vi.fn();
    componentRef.instance.dismissed.subscribe(dismissed);

    vi.advanceTimersByTime(4999);
    expect(dismissed).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(dismissed).toHaveBeenCalledOnce();
  });

  it('restarts the timer when the restart token changes', async () => {
    vi.useFakeTimers();
    await createToast('Proyecto puesto en cola', 5000);
    const dismissed = vi.fn();
    componentRef.instance.dismissed.subscribe(dismissed);

    vi.advanceTimersByTime(4000);
    componentRef.setInput('restartToken', 1);
    fixture.detectChanges();
    TestBed.flushEffects();
    vi.advanceTimersByTime(4000);
    expect(dismissed).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(dismissed).toHaveBeenCalledOnce();
  });
});
