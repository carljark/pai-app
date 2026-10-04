import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  ImportSummary,
  ProjectsTransferFile,
  ProjectsTransferService,
  chunkProjects,
  emptySummary,
  exportFileName,
  mergeSummaries,
  parseTransferFile,
} from '../../services/projects-transfer.service';

/** Exportar todos los proyectos a un fichero JSON e importar ficheros de otra instalación. */
@Component({
  selector: 'app-projects-transfer',
  standalone: true,
  templateUrl: './projects-transfer.component.html',
  styleUrl: './projects-transfer.component.scss',
})
export class ProjectsTransferComponent {
  private transfer = inject(ProjectsTransferService);

  isExporting = signal(false);
  isImporting = signal(false);
  progress = signal<{ done: number; total: number } | null>(null);
  summary = signal<ImportSummary | null>(null);
  error = signal<string | null>(null);

  exportProjects() {
    this.isExporting.set(true);
    this.error.set(null);
    this.transfer.exportProjects().subscribe({
      next: (blob) => {
        this.download(blob, exportFileName());
        this.isExporting.set(false);
      },
      error: () => {
        this.error.set('No se pudieron exportar los proyectos.');
        this.isExporting.set(false);
      },
    });
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.summary.set(null);
    this.error.set(null);
    const parsed = parseTransferFile(await file.text());
    if (typeof parsed === 'string') {
      this.error.set(parsed);
      return;
    }
    await this.importFile(parsed);
  }

  private async importFile(file: ProjectsTransferFile) {
    this.isImporting.set(true);
    try {
      await this.sendChunks(file);
    } catch {
      // Se conserva el resumen de los trozos ya importados, si los hay
      const partial = this.summary();
      if (!partial?.imported && !partial?.skipped) this.summary.set(null);
      this.error.set(
        'La importación se interrumpió. Los proyectos ya importados se conservan; puedes volver a importar el fichero.',
      );
    } finally {
      this.isImporting.set(false);
      this.progress.set(null);
    }
  }

  /** Envía el fichero en trozos, uno tras otro, acumulando el resumen. */
  private async sendChunks(file: ProjectsTransferFile) {
    const total = file.projects.length;
    let done = 0;
    this.summary.set(emptySummary());
    for (const chunk of chunkProjects(file.projects)) {
      this.progress.set({ done, total });
      const result = await firstValueFrom(this.transfer.importChunk(file, chunk));
      this.summary.update((current) => mergeSummaries(current ?? emptySummary(), result));
      done += chunk.length;
    }
  }

  private download(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}
