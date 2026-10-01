import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumFacade } from '../../services/curriculum.facade';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-curriculum-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curriculum-selector.component.html',
  styleUrls: ['./curriculum-selector.component.scss']
})
export class CurriculumSelectorComponent {
  facade = inject(CurriculumFacade);
  trans = inject(TranslationService);
  title = input.required<string>();
  isOpen = signal(true);

  // Novedades para el botón
  isGenerating = input<boolean>(false);
  generateText = input.required<string>();
  generatingText = input.required<string>();
  generate = output<void>();
}
