import { Component, inject } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';

/** Banner final de la home: logotipos de las universidades del máster y aviso de fase beta. */
@Component({
  selector: 'app-home-credits',
  standalone: true,
  templateUrl: './home-credits.component.html',
  styleUrl: './home-credits.component.scss',
})
export class HomeCreditsComponent {
  t = inject(TranslationService).t;
}
