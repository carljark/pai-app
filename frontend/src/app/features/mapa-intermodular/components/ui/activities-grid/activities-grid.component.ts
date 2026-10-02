import { Component, inject, computed, input } from '@angular/core';
import { LayoutService } from '../../../../../services/layout.service';
import { IntermodularActivity } from '@mapa-intermodular/models/mapa-intermodular.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activities-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activities-grid.component.html',
  styleUrl: './activities-grid.component.scss',
})
export class ActivitiesGridComponent {
  layout = inject(LayoutService);
  isCa = computed(() => this.layout.language() === 'catalan');

  activities = input.required<IntermodularActivity[]>();
  activeTab = input.required<'FPB' | 'CFGM' | 'CFGM_PELUQUERIA' | 'CFGM_PELUQUERIA_2'>();
}
