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

  isRewriting = signal<boolean>(false);

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
        this.appFacade.infoTitle.set('Archivo Procesado');
        this.appFacade.infoMessage.set('El diseño se ha purificado a Markdown exitosamente.');
        this.appFacade.infoType.set('success');
        this.appFacade.showInfoModal.set(true);
      },
      error: () => {
        this.appFacade.errorMessage.set('Error al procesar el archivo Word.');
        this.appFacade.showErrorModal.set(true);
      }
    });
    event.target.value = '';
  }

  saveDraft() {
    this.projects.updateProjectStatus('borrador')?.subscribe({
      next: () => {
        this.projects.loadHistory();
        this.appFacade.infoTitle.set('Guardado');
        this.appFacade.infoMessage.set(this.layout.language() === 'castellano' ? 'Borrador guardado correctamente.' : 'Esborrany guardat correctament.');
        this.appFacade.infoType.set('success');
        this.appFacade.showInfoModal.set(true);
      },
      error: (err) => console.error('Error saving draft:', err),
    });
  }

  publishProject() {
    this.projects.updateProjectStatus('publicado')?.subscribe({
      next: () => {
        this.projects.loadHistory();
        this.appFacade.infoTitle.set('Publicado');
        this.appFacade.infoMessage.set(this.layout.language() === 'castellano' ? 'Proyecto publicado y validado correctamente.' : 'Projecte publicat i validat correctament.');
        this.appFacade.infoType.set('success');
        this.appFacade.showInfoModal.set(true);
      },
      error: (err) => console.error('Error publishing project:', err),
    });
  }

  exportPDF() {
    const element = document.querySelector('markdown');
    if (element) {
      html2pdf().from(element as HTMLElement).save('Proyecto.pdf');
    }
  }

  rewriteWithAI() {
    const selectedText = window.getSelection()?.toString();
    const instruction = this.projects.aiPrompt();
    if (!selectedText || !instruction) {
      this.appFacade.infoTitle.set('Atención');
      this.appFacade.infoMessage.set('Selecciona texto en el documento e introduce una instrucción para la IA.');
      this.appFacade.infoType.set('info');
      this.appFacade.showInfoModal.set(true);
      return;
    }
    this.projects.isThinking.set(true);
    this.projects.rewriteSection(selectedText, instruction).subscribe({
      next: (res) => {
        this.projects.generatedProject.set(res.newText);
        this.projects.aiPrompt.set('');
        this.projects.isThinking.set(false);
        this.projects.updateProjectStatus('borrador')?.subscribe();
      },
      error: (err) => {
        console.error("Error en IA", err);
        this.projects.isThinking.set(false);
      }
    });
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
      next: () => {
        this.projects.loadProjectFiles();
        this.projects.isUploading.set(false);
      },
      error: (err) => {
        console.error("Error al subir archivo", err);
        this.projects.isUploading.set(false);
      }
    });
  }

  deleteFile(filename: string) {
    this.appFacade.confirmTitle.set('Eliminar Archivo');
    this.appFacade.confirmMessage.set(this.trans.t().deleteFile + ' ' + filename + '?');
    this.appFacade.confirmAction.set(() => {
      this.projects.deleteFile(filename)?.subscribe({
        next: () => {
          this.projects.loadProjectFiles();
          this.appFacade.showConfirmModal.set(false);
        },
        error: (err) => {
          console.error("Error al borrar archivo", err);
          this.appFacade.showConfirmModal.set(false);
        }
      });
    });
    this.appFacade.showConfirmModal.set(true);
  }

  getDownloadUrl(filename: string): string {
    return this.projects.getDownloadUrl(filename);
  }
}
