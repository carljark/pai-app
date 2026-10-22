import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, vi } from 'vitest';
import { HelpButtonComponent } from './help-button.component';
import { TourService } from '../../services/tour.service';
import { LayoutService } from '../../../../services/layout.service';
import { HELP_ES } from '../../i18n/help.es';

describe('HelpButtonComponent', () => {
  it('lanza la visita de su pantalla y tiene un nombre accesible', async () => {
    const tours = { start: vi.fn(async () => undefined) };
    await TestBed.configureTestingModule({
      imports: [HelpButtonComponent],
      providers: [
        { provide: TourService, useValue: tours },
        { provide: LayoutService, useValue: { language: signal('castellano') } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(HelpButtonComponent);
    fixture.componentRef.setInput('tour', 'mapa');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe(HELP_ES.helpButtonLabel);
    button.click();
    expect(tours.start).toHaveBeenCalledWith('mapa');
  });
});
