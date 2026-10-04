import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ProjectsTransferComponent } from './projects-transfer.component';
import {
  ImportSummary,
  ProjectsTransferService,
  TRANSFER_FORMAT,
  TRANSFER_VERSION,
} from '../../services/projects-transfer.service';

const transferFile = (projects: unknown[]) =>
  JSON.stringify({ format: TRANSFER_FORMAT, version: TRANSFER_VERSION, projects });

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
  ownerFallback: 0,
  errors: [],
  ...extra,
});

describe('ProjectsTransferComponent', () => {
  let fixture: ComponentFixture<ProjectsTransferComponent>;
  let component: ProjectsTransferComponent;
  let transfer: { exportProjects: ReturnType<typeof vi.fn>; importChunk: ReturnType<typeof vi.fn> };
  const text = () => fixture.nativeElement.textContent as string;

  beforeEach(async () => {
    transfer = { exportProjects: vi.fn(), importChunk: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [ProjectsTransferComponent],
      providers: [{ provide: ProjectsTransferService, useValue: transfer }],
    }).compileComponents();
    fixture = TestBed.createComponent(ProjectsTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  it('debería descargar la exportación al pulsar «Exportar proyectos»', () => {
    transfer.exportProjects.mockReturnValue(of(new Blob(['{}'])));
    const createUrl = vi.fn(() => 'blob:exportacion');
    const revokeUrl = vi.fn();
    Object.assign(window.URL, { createObjectURL: createUrl, revokeObjectURL: revokeUrl });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    (fixture.nativeElement.querySelector('.btn-primary') as HTMLButtonElement).click();

    expect(click).toHaveBeenCalled();
    expect(revokeUrl).toHaveBeenCalledWith('blob:exportacion');
    expect(component.isExporting()).toBe(false);
  });

  it('debería avisar si la exportación falla', () => {
    transfer.exportProjects.mockReturnValue(throwError(() => new Error('500')));
    (fixture.nativeElement.querySelector('.btn-primary') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(text()).toContain('No se pudieron exportar los proyectos.');
    expect(component.isExporting()).toBe(false);
  });

  it('debería deshabilitar la exportación mientras se exporta', () => {
    component.isExporting.set(true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.btn-primary') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Exportando…');
  });

  it('debería importar el fichero seleccionado y mostrar el resumen', async () => {
    transfer.importChunk.mockReturnValue(
      of(
        summary({
          imported: 2,
          skipped: 1,
          ownerFallback: 1,
          errors: [{ title: 'Vacío', error: 'No tiene contenido.' }],
        }),
      ),
    );

    await selectFile(fixture, transferFile([{ title: 'A' }, { title: 'B' }]));

    expect(transfer.importChunk).toHaveBeenCalledTimes(1);
    expect(text()).toContain('Importados: 2 · Ya existían: 1 · Con errores: 1');
    expect(text()).toContain('1 proyecto(s) quedaron a tu nombre');
    expect(text()).toContain('Vacío: No tiene contenido.');
  });

  it('debería enviar los ficheros grandes en varios trozos y sumar sus resúmenes', async () => {
    transfer.importChunk.mockReturnValue(of(summary()));
    const big = 'x'.repeat(1_600_000);
    await selectFile(fixture, transferFile([{ big }, { big }]));
    expect(transfer.importChunk).toHaveBeenCalledTimes(2);
    expect(component.summary()?.imported).toBe(2);
    expect(text()).not.toContain('quedaron a tu nombre');
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
