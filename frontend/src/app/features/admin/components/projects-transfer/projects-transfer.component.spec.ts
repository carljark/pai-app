import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ProjectsTransferComponent } from './projects-transfer.component';
import {
  ExportableProject,
  ImportSummary,
  ProjectsTransferService,
  TRANSFER_FORMAT,
  TRANSFER_VERSION,
} from '../../services/projects-transfer.service';

const transferFile = (projects: unknown[]) =>
  JSON.stringify({ format: TRANSFER_FORMAT, version: TRANSFER_VERSION, projects });

const exportable = (id: string, title: string): ExportableProject => ({
  _id: id,
  title,
  tipoNivel: 'FP_BASICA',
  status: 'borrador',
  owner: { email: `${id}@test.com`, name: `Autor ${id}` },
});

/** Selecciona un fichero en el input real del DOM y espera a que termine la importación. */
const selectFile = async (fixture: ComponentFixture<ProjectsTransferComponent>, text?: string) => {
  const input = fixture.nativeElement.querySelector(
    '.projects-transfer__file-input',
  ) as HTMLInputElement;
  const files = text === undefined ? [] : [{ text: () => Promise.resolve(text) }];
  Object.defineProperty(input, 'files', { value: files, configurable: true });
  input.dispatchEvent(new Event('change'));
  await new Promise((resolve) => setTimeout(resolve));
  await fixture.whenStable();
  fixture.detectChanges();
};

const summary = (extra: Partial<ImportSummary> = {}): ImportSummary => ({
  imported: 1,
  skipped: 0,
  errors: [],
  ...extra,
});

describe('ProjectsTransferComponent', () => {
  let fixture: ComponentFixture<ProjectsTransferComponent>;
  let component: ProjectsTransferComponent;
  let transfer: {
    listExportable: ReturnType<typeof vi.fn>;
    exportProjects: ReturnType<typeof vi.fn>;
    importChunk: ReturnType<typeof vi.fn>;
  };
  const text = () => fixture.nativeElement.textContent as string;
  const button = (selector: string) =>
    fixture.nativeElement.querySelector(selector) as HTMLButtonElement;

  beforeEach(async () => {
    transfer = {
      listExportable: vi.fn(() =>
        of([exportable('a', 'Proyecto A'), exportable('b', 'Proyecto B')]),
      ),
      exportProjects: vi.fn(),
      importChunk: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [ProjectsTransferComponent],
      providers: [{ provide: ProjectsTransferService, useValue: transfer }],
    }).compileComponents();
    fixture = TestBed.createComponent(ProjectsTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  const mockDownload = () => {
    const revokeUrl = vi.fn();
    Object.assign(window.URL, {
      createObjectURL: vi.fn(() => 'blob:x'),
      revokeObjectURL: revokeUrl,
    });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    return { click, revokeUrl };
  };

  it('debería cargar y mostrar la lista de proyectos exportables', () => {
    expect(transfer.listExportable).toHaveBeenCalled();
    expect(text()).toContain('Proyecto A');
    expect(text()).toContain('Exportar todos (2)');
  });

  it('debería exportar solo los proyectos seleccionados', () => {
    transfer.exportProjects.mockReturnValue(of(new Blob(['{}'])));
    const { click, revokeUrl } = mockDownload();
    expect(button('.btn-primary').disabled).toBe(true);

    const checkbox = fixture.nativeElement.querySelector(
      '.export-selection__item .export-selection__checkbox',
    ) as HTMLInputElement;
    checkbox.click();
    fixture.detectChanges();
    expect(button('.btn-primary').textContent).toContain('Exportar seleccionados (1)');
    button('.btn-primary').click();

    expect(transfer.exportProjects).toHaveBeenCalledWith(['a']);
    expect(click).toHaveBeenCalled();
    expect(revokeUrl).toHaveBeenCalledWith('blob:x');
    expect(component.isExporting()).toBe(false);
  });

  it('debería exportar todos los proyectos con «Exportar todos»', () => {
    transfer.exportProjects.mockReturnValue(of(new Blob(['{}'])));
    mockDownload();
    button('.projects-transfer__export-all').click();
    expect(transfer.exportProjects).toHaveBeenCalledWith([]);
  });

  it('debería avisar si la exportación falla', () => {
    transfer.exportProjects.mockReturnValue(throwError(() => new Error('500')));
    button('.projects-transfer__export-all').click();
    fixture.detectChanges();
    expect(text()).toContain('No se pudieron exportar los proyectos.');
    expect(component.isExporting()).toBe(false);
  });

  it('debería avisar si no se puede cargar la lista', () => {
    transfer.listExportable.mockReturnValue(throwError(() => new Error('500')));
    component.loadExportable();
    fixture.detectChanges();
    expect(text()).toContain('No se pudo cargar la lista de proyectos.');
  });

  it('debería quitar de la selección los proyectos que ya no están en la lista', () => {
    component.selectedIds.set(['a', 'desaparecido']);
    component.loadExportable();
    expect(component.selectedIds()).toEqual(['a']);
  });

  it('debería deshabilitar la exportación mientras se exporta', () => {
    component.selectedIds.set(['a']);
    component.isExporting.set(true);
    fixture.detectChanges();
    expect(button('.btn-primary').disabled).toBe(true);
    expect(button('.btn-primary').textContent).toContain('Exportando…');
  });

  it('debería importar a nombre del usuario activo, mostrar el resumen y recargar la lista', async () => {
    transfer.importChunk.mockReturnValue(
      of(
        summary({
          imported: 2,
          skipped: 1,
          errors: [{ title: 'Vacío', error: 'No tiene contenido.' }],
        }),
      ),
    );
    transfer.listExportable.mockClear();

    await selectFile(fixture, transferFile([{ title: 'A' }, { title: 'B' }]));

    expect(transfer.importChunk).toHaveBeenCalledTimes(1);
    expect(text()).toContain('Importados a tu nombre: 2 · Ya los tenías: 1 · Con errores: 1');
    expect(text()).toContain('Vacío: No tiene contenido.');
    expect(transfer.listExportable).toHaveBeenCalledTimes(1);
  });

  it('debería enviar los ficheros grandes en varios trozos y sumar sus resúmenes', async () => {
    transfer.importChunk.mockReturnValue(of(summary()));
    const big = 'x'.repeat(1_600_000);
    await selectFile(fixture, transferFile([{ big }, { big }]));
    expect(transfer.importChunk).toHaveBeenCalledTimes(2);
    expect(component.summary()?.imported).toBe(2);
  });

  it('debería mostrar el progreso mientras importa', async () => {
    const pending = new Subject<ImportSummary>();
    transfer.importChunk.mockReturnValue(pending);
    const done = component.onFileSelected({
      target: { files: [{ text: () => Promise.resolve(transferFile([{}, {}])) }], value: 'f' },
    } as unknown as Event);
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();
    expect(text()).toContain('Importando proyectos: 0 de 2');
    expect(text()).toContain('Importando…');

    pending.next(summary());
    pending.complete();
    await done;
    fixture.detectChanges();
    expect(component.progress()).toBeNull();
    expect(component.isImporting()).toBe(false);
  });

  it('debería explicar por qué rechaza un fichero no válido', async () => {
    await selectFile(fixture, '{ no es json');
    expect(text()).toContain('El fichero no es un JSON válido.');
    expect(transfer.importChunk).not.toHaveBeenCalled();
  });

  it('no debería hacer nada si no se elige ningún fichero', async () => {
    await selectFile(fixture);
    expect(transfer.importChunk).not.toHaveBeenCalled();
    expect(component.error()).toBeNull();
  });

  it('debería conservar el resumen parcial si la importación se interrumpe', async () => {
    transfer.importChunk
      .mockReturnValueOnce(of(summary()))
      .mockReturnValueOnce(throwError(() => new Error('413')));
    const big = 'x'.repeat(1_600_000);
    await selectFile(fixture, transferFile([{ big }, { big }]));
    expect(text()).toContain('La importación se interrumpió');
    expect(component.summary()?.imported).toBe(1);
  });

  it('no debería mostrar resumen si falla el primer trozo', async () => {
    transfer.importChunk.mockReturnValue(throwError(() => new Error('500')));
    await selectFile(fixture, transferFile([{}]));
    expect(component.summary()).toBeNull();
    expect(component.error()).toContain('se interrumpió');
  });
});
