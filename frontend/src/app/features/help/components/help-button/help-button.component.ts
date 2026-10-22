import { Component, inject, input } from '@angular/core';
import { HelpTextsService } from '../../services/help-texts.service';
import { TourService } from '../../services/tour.service';
import { TourId } from '../../tours/tour.model';

/** Botón «?» junto al título de una pantalla: lanza la visita guiada de esa pantalla. */
@Component({
  selector: 'app-help-button',
  standalone: true,
  templateUrl: './help-button.component.html',
  styleUrl: './help-button.component.scss',
})
export class HelpButtonComponent {
  tour = input.required<TourId>();
  t = inject(HelpTextsService).t;
  private tours = inject(TourService);

  start(): void {
    void this.tours.start(this.tour());
  }
}
