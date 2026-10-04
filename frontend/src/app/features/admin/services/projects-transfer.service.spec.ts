import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  ProjectsTransferService,
  TRANSFER_FORMAT,
  TRANSFER_VERSION,
  chunkProjects,
  emptySummary,
  exportFileName,
  mergeSummaries,
  parseTransferFile,
} from './projects-transfer.service';

describe('ProjectsTransferService', () => {
  let service: ProjectsTransferService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProjectsTransferService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('exportProjects debería descargar la exportación como blob', () => {
    let received: Blob | undefined;
    service.exportProjects().subscribe((blob) => (received = blob));
    const req = http.expectOne('/api/admin/projects/export');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['{}']));
    expect(received).toBeInstanceOf(Blob);
  });

  it('importChunk debería enviar el formato, la versión y solo los proyectos del trozo', () => {
    const file = {
      format: TRANSFER_FORMAT,
      version: TRANSFER_VERSION,
      exportedAt: 'x',
      projects: [1, 2, 3],
    };
    service.importChunk(file, [2]).subscribe();
    const req = http.expectOne('/api/admin/projects/import');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      format: TRANSFER_FORMAT,
      version: TRANSFER_VERSION,
      projects: [2],
    });
    req.flush(emptySummary());
  });
});

describe('utilidades de exportación', () => {
  const valid = { format: TRANSFER_FORMAT, version: TRANSFER_VERSION, projects: [] };

  it('parseTransferFile debería aceptar una exportación válida', () => {
    expect(parseTransferFile(JSON.stringify(valid))).toEqual(valid);
  });

  it('parseTransferFile debería explicar por qué rechaza un fichero', () => {
    expect(parseTransferFile('{ roto')).toBe('El fichero no es un JSON válido.');
    expect(parseTransferFile('null')).toContain('no es una exportación');
    expect(parseTransferFile(JSON.stringify({ ...valid, version: 9 }))).toContain('(9)');
    expect(parseTransferFile(JSON.stringify({ ...valid, projects: {} }))).toContain(
      'lista de proyectos',
    );
  });

  it('chunkProjects debería agrupar por tamaño sin partir proyectos', () => {
    const projects = ['a'.repeat(40), 'b'.repeat(40), 'c'.repeat(40), 'd'.repeat(200)];
    const chunks = chunkProjects(projects, 100);
    expect(chunks).toEqual([[projects[0], projects[1]], [projects[2]], [projects[3]]]);
    expect(chunkProjects([])).toEqual([]);
    expect(chunkProjects([1, 2])).toEqual([[1, 2]]);
  });

  it('mergeSummaries debería sumar contadores y concatenar errores', () => {
    const a = { imported: 1, skipped: 2, ownerFallback: 1, errors: [{ title: 'A', error: 'x' }] };
    const b = { imported: 3, skipped: 0, ownerFallback: 0, errors: [{ title: 'B', error: 'y' }] };
    expect(mergeSummaries(a, b)).toEqual({
      imported: 4,
      skipped: 2,
      ownerFallback: 1,
      errors: [a.errors[0], b.errors[0]],
    });
    expect(mergeSummaries(emptySummary(), emptySummary())).toEqual(emptySummary());
  });

  it('exportFileName debería llevar la fecha', () => {
    expect(exportFileName(new Date('2026-10-04T12:00:00Z'))).toBe(
      'plappin-proyectos-2026-10-04.json',
    );
    expect(exportFileName()).toMatch(/^plappin-proyectos-\d{4}-\d{2}-\d{2}\.json$/);
  });
});
