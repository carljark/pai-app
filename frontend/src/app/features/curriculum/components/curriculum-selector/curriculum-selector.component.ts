import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurriculumFacade } from '../../services/curriculum.facade';
import { CriteriosFacade } from '../../services/criterios.facade';
import { CeCriteriosListComponent } from '../ce-criterios-list/ce-criterios-list.component';
import { DraggablePanelDirective } from '../../directives/draggable-panel.directive';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { Project } from '../../../projects/models/project.model';
import { AppFacade } from '../../../../app.facade';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-curriculum-selector',
  standalone: true,
  imports: [CommonModule, CeCriteriosListComponent, DraggablePanelDirective],
  templateUrl: './curriculum-selector.component.html',
  styleUrls: ['./curriculum-selector.component.scss'],
})
export class CurriculumSelectorComponent {
  facade = inject(CurriculumFacade);
  criterios = inject(CriteriosFacade);
  projects = inject(ProjectsFacade);
  appFacade = inject(AppFacade);
  trans = inject(TranslationService);
  title = input.required<string>();
  isOpen = signal(true);

  // Novedades para el botón
  isGenerating = input<boolean>(false);
  generateText = input.required<string>();
  generatingText = input.required<string>();
  generate = output<void>();

  /** Acordeones de módulos/materias desplegados (ver `groupKey`). */
  private readonly openGroups = signal<ReadonlySet<string>>(new Set());

  isGroupOpen(index: number): boolean {
    return this.openGroups().has(this.groupKey(index));
  }

  onGroupToggle(index: number, event: Event): void {
    const open = (event.target as HTMLDetailsElement).open;
    const key = this.groupKey(index);
    if (open === this.openGroups().has(key)) return;
    const next = new Set(this.openGroups());
    if (open) next.add(key);
    else next.delete(key);
    this.openGroups.set(next);
  }

  /**
   * Un acordeón se identifica por su posición dentro del nivel y curso activos, no por el nombre
   * del módulo, que cambia con el idioma: así sigue desplegado al cambiar de idioma y se pliega
   * al cambiar de nivel o curso.
   */
  private groupKey(index: number): string {
    return `${this.facade.tipoNivel()}|${this.facade.curso()}|${index}`;
  }

  /** Contrae o despliega el carrito, salvo que el clic sea el final de un arrastre. */
  toggleCart(drag: DraggablePanelDirective): void {
    if (drag.wasDragged()) return;
    this.isOpen.set(!this.isOpen());
  }

  openProject(project: Project): void {
    this.appFacade.openProjectInNewWindow(project);
  }
}
