import { Component, inject, input } from '@angular/core';
import { CriterioItem } from '../../models/curriculum.model';
import { CriteriosFacade } from '../../services/criterios.facade';
import { TranslationService } from '../../../../services/translation.service';

/** Criterios de evaluación de una CE, con «seleccionar todos» y selección individual. */
@Component({
  selector: 'app-ce-criterios-list',
  standalone: true,
  templateUrl: './ce-criterios-list.component.html',
  styleUrl: './ce-criterios-list.component.scss',
})
export class CeCriteriosListComponent {
  criterios = inject(CriteriosFacade);
  trans = inject(TranslationService);
  /** Valor con el que se selecciona la CE. */
  ceKey = input.required<string>();
  items = input.required<CriterioItem[]>();
}
