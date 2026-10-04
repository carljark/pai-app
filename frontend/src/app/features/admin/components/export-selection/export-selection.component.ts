import { Component, computed, input, model, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ExportableProject } from '../../services/projects-transfer.service';

/** Nombre corto de cada nivel para la lista (el panel de administración está en castellano). */
const LEVEL_LABELS: Record<string, string> = {
  FP_BASICA: 'FP Básica',
  DIVERSIFICACION_CURRICULAR: 'Diversificación',
  CFGM_ESTETICA: 'CFGM Estética',
  CFGM_PELUQUERIA: 'CFGM Peluquería',
  CFGS_EDUCACION_INFANTIL: 'CFGS Educación Infantil',
};

const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Lista de proyectos de cualquier usuario con buscador y casillas para elegir cuáles exportar. */
@Component({
  selector: 'app-export-selection',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './export-selection.component.html',
  styleUrl: './export-selection.component.scss',
})
export class ExportSelectionComponent {
  projects = input.required<ExportableProject[]>();
  selectedIds = model<string[]>([]);
  query = signal('');

  filtered = computed(() => {
    const q = normalize(this.query().trim());
    if (!q) return this.projects();
    return this.projects().filter((p) =>
      normalize(`${p.title} ${p.owner?.name ?? ''} ${p.owner?.email ?? ''}`).includes(q),
    );
  });

  allFilteredSelected = computed(() => {
    const selected = new Set(this.selectedIds());
    const visible = this.filtered();
    return visible.length > 0 && visible.every((p) => selected.has(p._id));
  });

  levelLabel(tipoNivel?: string): string {
    return (tipoNivel && LEVEL_LABELS[tipoNivel]) || tipoNivel || '';
  }

  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  toggle(id: string) {
    this.selectedIds.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }

  /** Marca o desmarca todos los proyectos visibles con el filtro actual. */
  toggleAllFiltered() {
    const visible = this.filtered().map((p) => p._id);
    if (this.allFilteredSelected()) {
      this.selectedIds.update((ids) => ids.filter((id) => !visible.includes(id)));
    } else {
      this.selectedIds.update((ids) => [...new Set([...ids, ...visible])]);
    }
  }

  onSearch(event: Event) {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
