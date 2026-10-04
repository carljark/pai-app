import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ExportSelectionComponent } from './export-selection.component';
import { ExportableProject } from '../../services/projects-transfer.service';

const projects: ExportableProject[] = [
  {
    _id: '1',
    title: 'Peinados de fiesta',
    tipoNivel: 'CFGM_PELUQUERIA',
    courseLevel: '2º',
    status: 'borrador',
    createdAt: '2026-10-01T10:00:00Z',
    owner: { email: 'eva@plappin.org', name: 'Eva Martínez' },
  },
  {
    _id: '2',
    title: 'Huerto escolar',
    tipoNivel: 'DESCONOCIDO',
    status: 'publicado',
    owner: { email: 'carlos@test.com' },
  },
  { _id: '3', title: 'Proyecto antiguo', owner: null },
];

describe('ExportSelectionComponent', () => {
  let fixture: ComponentFixture<ExportSelectionComponent>;
  let component: ExportSelectionComponent;
  const el = () => fixture.nativeElement as HTMLElement;
  const checkboxes = () =>
    Array.from(
      el().querySelectorAll('.export-selection__item .export-selection__checkbox'),
    ) as HTMLInputElement[];
  const selectAll = () =>
    el().querySelector('.export-selection__select-all input') as HTMLInputElement;
  const search = (value: string) => {
    const input = el().querySelector('.export-selection__search') as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportSelectionComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ExportSelectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('projects', projects);
    fixture.detectChanges();
  });

  it('debería mostrar título, autor, nivel, curso, estado y fecha de cada proyecto', () => {
    const items = el().querySelectorAll('.export-selection__item');
    expect(items).toHaveLength(3);
    expect(items[0]!.textContent).toContain('Peinados de fiesta');
    expect(items[0]!.textContent).toContain('Eva Martínez · CFGM Peluquería');
    expect(items[0]!.textContent).toContain('2º · borrador · 01/10/2026');
    expect(items[1]!.textContent).toContain('carlos@test.com · DESCONOCIDO');
    expect(items[2]!.textContent).toContain('Sin autor');
  });

  it('debería marcar y desmarcar proyectos con sus casillas', () => {
    checkboxes()[0]!.click();
    fixture.detectChanges();
    expect(component.selectedIds()).toEqual(['1']);
    expect(checkboxes()[0]!.checked).toBe(true);
    expect(el().textContent).toContain('1 seleccionados');

    checkboxes()[0]!.click();
    fixture.detectChanges();
    expect(component.selectedIds()).toEqual([]);
  });

  it('debería filtrar por título, nombre o email del autor sin distinguir acentos', () => {
    search('MARTINEZ');
    expect(component.filtered().map((p) => p._id)).toEqual(['1']);
    search('carlos@');
    expect(component.filtered().map((p) => p._id)).toEqual(['2']);
    search('  ');
    expect(component.filtered()).toHaveLength(3);
    search('no existe');
    expect(el().textContent).toContain('Ningún proyecto coincide con la búsqueda.');
    expect(selectAll().disabled).toBe(true);
  });

  it('debería seleccionar y deseleccionar todos los visibles sin tocar los ocultos', () => {
    component.selectedIds.set(['3']);
    search('huerto');
    selectAll().click();
    fixture.detectChanges();
    expect(component.selectedIds()).toEqual(['3', '2']);
    expect(selectAll().checked).toBe(true);

    selectAll().click();
    fixture.detectChanges();
    expect(component.selectedIds()).toEqual(['3']);
  });

  it('debería indicar cuando no hay proyectos para exportar', () => {
    fixture.componentRef.setInput('projects', []);
    fixture.detectChanges();
    expect(el().textContent).toContain('No hay proyectos para exportar.');
    expect(component.allFilteredSelected()).toBe(false);
  });

  it('levelLabel debería devolver el nombre corto o el valor original', () => {
    expect(component.levelLabel('FP_BASICA')).toBe('FP Básica');
    expect(component.levelLabel('OTRO')).toBe('OTRO');
    expect(component.levelLabel(undefined)).toBe('');
  });
});
