import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DraggablePanelDirective } from './draggable-panel.directive';

const STORAGE_KEY = 'test.panelPosition';

@Component({
  standalone: true,
  imports: [DraggablePanelDirective],
  template: `<div class="panel" appDraggablePanel=".panel__handle" [storageKey]="key">
    <div class="panel__handle">Asa</div>
    <div class="panel__body">Cuerpo</div>
  </div>`,
})
class HostComponent {
  key = STORAGE_KEY;
  drag = viewChild.required(DraggablePanelDirective);
}

const pointer = (type: string, x: number, y: number, button = 0) =>
  new MouseEvent(type, { clientX: x, clientY: y, button, bubbles: true, cancelable: true });

describe('DraggablePanelDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let panel: HTMLElement;
  let handle: HTMLElement;

  const createHost = async () => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    panel = fixture.nativeElement.querySelector('.panel');
    handle = fixture.nativeElement.querySelector('.panel__handle');
  };

  const drag = (target: HTMLElement, dx: number, dy: number) => {
    target.dispatchEvent(pointer('pointerdown', 100, 100));
    document.dispatchEvent(pointer('pointermove', 100 + dx, 100 + dy));
    document.dispatchEvent(pointer('pointerup', 100 + dx, 100 + dy));
  };

  beforeEach(async () => {
    localStorage.clear();
    vi.useFakeTimers();
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      right: 980,
      bottom: 780,
    } as DOMRect);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('moves the panel from the handle and saves its position', async () => {
    await createHost();
    drag(handle, -50, -30);

    expect(panel.style.right).toBe('70px');
    expect(panel.style.bottom).toBe('50px');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({ x: 70, y: 50 });
  });

  it('reports the drag until the following click has been handled', async () => {
    await createHost();
    const directive = fixture.componentInstance.drag();
    drag(handle, -40, 0);

    expect(directive.wasDragged()).toBe(true);
    vi.runAllTimers();
    expect(directive.wasDragged()).toBe(false);
  });

  it('treats small movements as a click', async () => {
    await createHost();
    drag(handle, 2, 2);

    expect(fixture.componentInstance.drag().wasDragged()).toBe(false);
    expect(panel.style.right).toBe('');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('ignores gestures outside the handle or with other buttons', async () => {
    await createHost();
    drag(fixture.nativeElement.querySelector('.panel__body'), -50, -50);
    handle.dispatchEvent(pointer('pointerdown', 100, 100, 2));
    document.dispatchEvent(pointer('pointermove', 0, 0));

    expect(panel.style.right).toBe('');
  });

  it('keeps the panel inside the window', async () => {
    await createHost();
    drag(handle, 5000, 5000);

    expect(panel.style.right).toBe('0px');
    expect(panel.style.bottom).toBe('0px');
  });

  it('restores the saved position and clamps it again on resize', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: 120, y: 60 }));
    await createHost();
    expect(panel.style.right).toBe('120px');

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(100);
    window.dispatchEvent(new Event('resize'));
    expect(panel.style.right).toBe('100px');
    expect(panel.style.bottom).toBe('60px');
  });

  it('ignores corrupt saved positions and unavailable storage', async () => {
    localStorage.setItem(STORAGE_KEY, '{roto');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    await createHost();
    expect(panel.style.right).toBe('');

    expect(() => drag(handle, -10, -10)).not.toThrow();
    expect(panel.style.right).toBe('30px');
  });

  it('does not touch storage without a key', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem');
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.key = '';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.nativeElement
      .querySelector('.panel__handle')
      .dispatchEvent(pointer('pointerdown', 100, 100));
    document.dispatchEvent(pointer('pointermove', 50, 50));
    document.dispatchEvent(pointer('pointerup', 50, 50));

    expect(getItem).not.toHaveBeenCalled();
    expect(localStorage.length).toBe(0);
  });

  it('stops listening when destroyed', async () => {
    await createHost();
    handle.dispatchEvent(pointer('pointerdown', 100, 100));
    fixture.destroy();
    document.dispatchEvent(pointer('pointermove', 0, 0));

    expect(panel.style.right).toBe('');
  });
});
