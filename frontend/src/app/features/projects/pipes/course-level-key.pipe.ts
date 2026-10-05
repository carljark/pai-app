import { Pipe, PipeTransform } from '@angular/core';
import { ProjectType, courseLevelLabelKey } from '../models/project.model';

/** Clave de traducción del nivel de un proyecto: `trans.t()[(tipoNivel | courseLevelKey)]`. */
@Pipe({ name: 'courseLevelKey', standalone: true })
export class CourseLevelKeyPipe implements PipeTransform {
  transform(tipoNivel: ProjectType | undefined) {
    return courseLevelLabelKey(tipoNivel);
  }
}
