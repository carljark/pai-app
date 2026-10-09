import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { describe, it, expect, vi } from 'vitest';
import { SolicitudesViewComponent } from './solicitudes-view.component';
import { SolicitudesService } from '../../services/solicitudes.service';

describe('SolicitudesViewComponent', () => {
  it('muestra el título, el formulario y las solicitudes del docente', async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesViewComponent],
      providers: [
        {
          provide: SolicitudesService,
          useValue: {
            oferta: signal([]),
            misSolicitudes: signal([]),
            isSubmitting: signal(false),
            loadOferta: vi.fn().mockReturnValue(of([])),
            loadMias: vi.fn().mockReturnValue(of([])),
          },
        },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(SolicitudesViewComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.solicitudes-view__titulo')?.textContent).toBeTruthy();
    expect(el.querySelector('app-solicitud-form')).toBeTruthy();
    expect(el.querySelector('app-mis-solicitudes')).toBeTruthy();
  });
});
