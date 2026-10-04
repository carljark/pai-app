import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Formato de intercambio de proyectos entre instalaciones (ver backend project-transfer.service). */
export const TRANSFER_FORMAT = 'plappin-projects';
export const TRANSFER_VERSION = 1;
/**
 * Tamaño máximo de cada petición de importación. El backend acepta cuerpos JSON de hasta 10 MB y
 * Nginx de hasta 50 MB: se envía el fichero en trozos para no depender del tamaño total.
 */
export const IMPORT_CHUNK_BYTES = 3_000_000;

export interface ProjectsTransferFile {
  format: string;
  version: number;
  exportedAt?: string;
  count?: number;
  projects: unknown[];
}

export interface ImportSummary {
  imported: number;
  skipped: number;
  errors: { title: string; error: string }[];
}

/** Proyecto de la lista para elegir qué exportar (GET /api/admin/projects/exportable). */
export interface ExportableProject {
  _id: string;
  title: string;
  tipoNivel?: string;
  courseLevel?: string;
  status?: string;
  language?: string;
  createdAt?: string;
  owner: { email: string; name?: string } | null;
}

export const emptySummary = (): ImportSummary => ({ imported: 0, skipped: 0, errors: [] });

export const mergeSummaries = (a: ImportSummary, b: ImportSummary): ImportSummary => ({
  imported: a.imported + b.imported,
  skipped: a.skipped + b.skipped,
  errors: [...a.errors, ...b.errors],
});

/** Exportación válida, o un mensaje de error para mostrar. */
export const parseTransferFile = (text: string): ProjectsTransferFile | string => {
  let data: Partial<ProjectsTransferFile> | null;
  try {
    data = JSON.parse(text);
  } catch {
    return 'El fichero no es un JSON válido.';
  }
  if (data?.format !== TRANSFER_FORMAT)
    return 'El fichero no es una exportación de proyectos de Plappin.';
  if (data.version !== TRANSFER_VERSION)
    return `Versión de exportación no compatible (${data.version}).`;
  if (!Array.isArray(data.projects)) return 'La exportación no contiene una lista de proyectos.';
  return data as ProjectsTransferFile;
};

/** Agrupa los proyectos en trozos de como mucho `maxBytes` (un proyecto mayor va solo). */
export const chunkProjects = (projects: unknown[], maxBytes = IMPORT_CHUNK_BYTES): unknown[][] => {
  const chunks: unknown[][] = [];
  let current: unknown[] = [];
  let size = 0;
  for (const project of projects) {
    const bytes = JSON.stringify(project).length;
    if (current.length && size + bytes > maxBytes) {
      chunks.push(current);
      current = [];
      size = 0;
    }
    current.push(project);
    size += bytes;
  }
  if (current.length) chunks.push(current);
  return chunks;
};

export const exportFileName = (date = new Date()) =>
  `plappin-proyectos-${date.toISOString().slice(0, 10)}.json`;

@Injectable({ providedIn: 'root' })
export class ProjectsTransferService {
  private http = inject(HttpClient);

  listExportable(): Observable<ExportableProject[]> {
    return this.http.get<ExportableProject[]>('/api/admin/projects/exportable');
  }

  /** Sin `ids`, exporta todos los proyectos terminados. */
  exportProjects(ids: string[] = []): Observable<Blob> {
    const params = ids.length ? { ids: ids.join(',') } : undefined;
    return this.http.get('/api/admin/projects/export', {
      responseType: 'blob',
      ...(params ? { params } : {}),
    });
  }

  importChunk(file: ProjectsTransferFile, projects: unknown[]): Observable<ImportSummary> {
    return this.http.post<ImportSummary>('/api/admin/projects/import', {
      format: file.format,
      version: file.version,
      projects,
    });
  }
}
