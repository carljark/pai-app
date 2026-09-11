import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { AppFacade } from '../../../../app.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { PaiService } from '../../../../services/pai.service';

@Component({
  selector: 'app-taller-view',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownComponent],
  templateUrl: './taller-view.component.html'
})
export class TallerViewComponent {
  appFacade = inject(AppFacade);
  layout = inject(LayoutService);
  trans = inject(TranslationService);
  projects = inject(ProjectsFacade);
  auth = inject(AuthFacade);
  paiService = inject(PaiService);

  isSidebarCollapsed = signal<boolean>(false);
  isMobileResourcesCollapsed = signal<boolean>(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  sortByDate = (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  downloadWord() {
    this.projects.exportDocx()?.subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Proyecto_Generado.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  triggerUpload() {
    const fileInput = document.getElementById('docxUpload') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  uploadWord(event: any) {
    const file = event.target.files[0];
    if (!file || !this.projects.currentProjectId()) return;
    this.paiService.importDocx(this.projects.currentProjectId()!, file).subscribe({
      next: (res) => {
        this.projects.generatedProject.set(res.project.generatedContent.rawText);
        this.showInfoModal('Archivo Procesado', 'El diseño se ha purificado a Markdown exitosamente.');
      },
      error: () => {
        this.appFacade.errorMessage.set('Error al procesar el archivo Word.');
        this.appFacade.showErrorModal.set(true);
      }
    });
    event.target.value = '';
  }

  private showInfoModal(title: string, message: string) {
    this.appFacade.infoTitle.set(title);
    this.appFacade.infoMessage.set(message);
    this.appFacade.infoType.set('success');
    this.appFacade.showInfoModal.set(true);
  }

  saveDraft() {
    this.projects.updateProjectStatus('borrador')?.subscribe({
      next: () => {
        this.projects.loadHistory();
        this.showInfoModal('Guardado', this.layout.language() === 'castellano' ? 'Borrador guardado correctamente.' : 'Esborrany guardat correctament.');
      },
      error: (err) => console.error('Error saving draft:', err),
    });
  }

  publishProject() {
    this.projects.updateProjectStatus('publicado')?.subscribe({
      next: () => {
        this.projects.loadHistory();
        this.showInfoModal('Publicado', this.layout.language() === 'castellano' ? 'Proyecto publicado y validado correctamente.' : 'Projecte publicat i validat correctament.');
      },
      error: (err) => console.error('Error publishing project:', err),
    });
  }

  exportPDF() {
    const element = document.querySelector('markdown');
    if (element) {
      this.appFacade.telemetry?.logEvent('EXPORT_PDF', this.projects.currentProjectId() || undefined)?.subscribe();
      html2pdf().from(element as HTMLElement).save('Proyecto.pdf');
    }
  }

  onAiChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'gemini' | 'openrouter';
    this.projects.selectedAi.set(value);
  }

  private handleRewriteSuccess(res: any) {
    if (res.fallbackUsed && res.provider) {
      this.projects.selectedAi.set(res.provider);
    }
    this.projects.generatedProject.set(res.newText || res.rewrittenPart || '');
    this.projects.aiPrompt.set('');
    this.projects.isThinking.set(false);
    this.projects.updateProjectStatus('borrador')?.subscribe();
  }

  private handleRewriteError(err: any) {
    console.error('Error en IA', err);
    this.projects.isThinking.set(false);
    this.projects.popUndo();
    this.appFacade.errorTitle.set(this.layout.language() === 'catalan' ? "Error a l'Assistent IA" : 'Error en el Asistente IA');
    const serverMsg = err.error?.error || err.error?.message || err.message || 'Error al conectar con la IA para reescribir.';
    this.appFacade.errorMessage.set(serverMsg);
    this.appFacade.showErrorModal.set(true);
  }

  private showMissingInstructionAlert() {
    this.appFacade.infoTitle.set(this.layout.language() === 'castellano' ? 'Atención' : 'Atenció');
    this.appFacade.infoMessage.set(
      this.layout.language() === 'castellano' 
        ? 'Por favor, introduce una instrucción para la IA.' 
        : 'Per favor, introdueix una instrucció per a la IA.'
    );
    this.appFacade.infoType.set('info');
    this.appFacade.showInfoModal.set(true);
  }

  rewriteWithAI() {
    const instruction = this.projects.aiPrompt().trim();
    if (!instruction) return this.showMissingInstructionAlert();
    if (!this.projects.generatedProject()) return;

    this.projects.pushUndo();
    this.projects.isThinking.set(true);
    this.projects.rewriteSection(instruction).subscribe({
      next: (res) => this.handleRewriteSuccess(res),
      error: (err) => this.handleRewriteError(err)
    });
  }

  undoAI() {
    if (!this.projects.canUndo()) return;
    this.projects.undoLastChange();
    const title = this.layout.language() === 'castellano' ? 'Deshecho' : 'Desfet';
    const msg = this.layout.language() === 'castellano'
      ? 'Se ha restaurado la versión anterior del proyecto.'
      : 'S\'ha restaurat la versió anterior del projecte.';
    this.showInfoModal(title, msg);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.projects.currentProjectId()) this.uploadFile(file);
  }

  onDragOver(event: DragEvent) { event.preventDefault(); event.stopPropagation(); }
  onDragLeave(event: DragEvent) { event.preventDefault(); event.stopPropagation(); }
  onDrop(event: DragEvent) {
    event.preventDefault(); event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file && this.projects.currentProjectId()) this.uploadFile(file);
  }

  uploadFile(file: File) {
    this.projects.isUploading.set(true);
    this.projects.uploadFile(file)?.subscribe({
      next: () => { this.projects.loadProjectFiles(); this.projects.isUploading.set(false); },
      error: (err) => { console.error("Error al subir archivo", err); this.projects.isUploading.set(false); }
    });
  }

  deleteFile(filename: string) {
    this.appFacade.confirmTitle.set('Eliminar Archivo');
    this.appFacade.confirmMessage.set(this.trans.t().deleteFile + ' ' + filename + '?');
    this.appFacade.confirmAction.set(() => {
      this.projects.deleteFile(filename)?.subscribe({
        next: () => { this.projects.loadProjectFiles(); this.appFacade.showConfirmModal.set(false); },
        error: (err) => { console.error("Error al borrar archivo", err); this.appFacade.showConfirmModal.set(false); }
      });
    });
    this.appFacade.showConfirmModal.set(true);
  }

  getDownloadUrl(filename: string): string {
    return this.projects.getDownloadUrl(filename);
  }
}
