import { Pipe, PipeTransform, inject } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { NivelesService } from '../../../services/niveles.service';

/**
 * Nombre del nivel de un proyecto en el idioma activo, tomado del catálogo:
 * `{{ project.tipoNivel | nivelNombre }}`. Es impuro para reflejar la carga del catálogo
 * y el cambio de idioma (ambos son signals).
 */
@Pipe({ name: 'nivelNombre', standalone: true, pure: false })
export class NivelNombrePipe implements PipeTransform {
  private niveles = inject(NivelesService);
  private layout = inject(LayoutService);

  transform(tipoNivel: string | null | undefined): string {
    return this.niveles.nombreDe(tipoNivel, this.layout.language() === 'catalan');
  }
}
