import { Project } from '../../projects/models/project.model';
import { SelectOption } from '../../../components/app-select/app-select.component';
import { CurriculumResolver, FilterOption } from './curriculum-resolver';

/** Opciones distintas (por clave) que aportan los proyectos. */
export function collectOptions(
  projects: Project[],
  pick: (project: Project) => FilterOption[],
): FilterOption[] {
  const byKey = new Map<string, FilterOption>();
  projects.forEach((p) => pick(p).forEach((o) => byKey.has(o.key) || byKey.set(o.key, o)));
  return Array.from(byKey.values());
}

const label = (option: FilterOption, isCa: boolean) => (isCa ? option.ca : option.es);

/** Código oficial del módulo: el último tramo de su clave (`NIVEL|0337`). */
const moduleCode = (key: string) => key.slice(key.lastIndexOf('|') + 1);

/** Posición de un módulo en el orden oficial del catálogo; al final si no figura. */
const position = (order: string[], key: string) => {
  const index = order.indexOf(moduleCode(key));
  return index < 0 ? order.length : index;
};

/** Módulos en el orden oficial del nivel y, si no lo tiene, alfabéticamente. */
export function sortModules(options: FilterOption[], order: string[], isCa: boolean) {
  return [...options].sort(
    (a, b) =>
      position(order, a.key) - position(order, b.key) ||
      label(a, isCa).localeCompare(label(b, isCa)),
  );
}

/** RA de un módulo en su orden oficial (RA1, RA2…). */
export function sortItems(options: FilterOption[], isCa: boolean) {
  return [...options].sort(
    (a, b) => a.order - b.order || label(a, isCa).localeCompare(label(b, isCa)),
  );
}

export function toSelectOptions(options: FilterOption[], isCa: boolean): SelectOption[] {
  return options.map((o) => ({ value: o.key, label: label(o, isCa) }));
}

/** RA del módulo elegido; los que no están en el índice valen para cualquier módulo del proyecto. */
export function itemsOfModule(
  projects: Project[],
  resolver: CurriculumResolver,
  module: string,
): FilterOption[] {
  const withModule = projects.filter((p) => resolver.modulesOf(p).some((m) => m.key === module));
  return collectOptions(withModule, (p) => resolver.itemsOf(p)).filter(
    (o) => !o.moduleKey || o.moduleKey === module,
  );
}
