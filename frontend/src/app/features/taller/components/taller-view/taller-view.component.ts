import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import html2pdf from 'html2pdf.js';
import { AppFacade } from '../../../../app.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AIProvider } from '../../../projects/models/project.model';
import {
  RewriteResultDto,
  RewriteSectionResponseDto,
} from '../../../projects/mappers/projects.mapper';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { PaiService } from '../../../../services/pai.service';
import { TranslationBannerComponent } from '../translation-banner/translation-banner.component';
import { EditLockBannerComponent } from '../edit-lock-banner/edit-lock-banner.component';
import { ProjectChangeLogComponent } from '../project-change-log/project-change-log.component';
import { EditLockFacade } from '../../../projects/services/edit-lock.facade';
import { NivelNombrePipe } from '../../../projects/pipes/nivel-nombre.pipe';
import {
  AppSelectComponent,
  SelectOption,
} from '../../../../components/app-select/app-select.component';

@Component({
  selector: 'app-taller-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MarkdownComponent,
    AppSelectComponent,
    TranslationBannerComponent,
    EditLockBannerComponent,
    ProjectChangeLogComponent,
    NivelNombrePipe,
  ],
  templateUrl: './taller-view.component.html',
})
export class TallerViewComponent {
  appFacade = inject(AppFacade);
  layout = inject(LayoutService);
  trans = inject(TranslationService);
  projects = inject(ProjectsFacade);
  auth = inject(AuthFacade);
  paiService = inject(PaiService);
  /** Turno de edición y permisos: con `blocked()` se deshabilitan la IA y los cambios. */
  editLock = inject(EditLockFacade);

  isSidebarCollapsed = signal<boolean>(false);
  isMobileResourcesCollapsed = signal<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false,
  );

  sortByDate = (a: { createdAt: string | Date }, b: { createdAt: string | Date }) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  /** Solo los proveedores que ofrece el backend (Gemini puede estar desactivado). */
  aiOptions = computed<SelectOption[]>(() =>
    [
      { value: 'gemini', label: this.trans.t().aiGemini },
      { value: 'openrouter', label: this.trans.t().aiOpenRouter },
    ].filter((option) => this.projects.availableProviders().includes(option.value as AIProvider)),
  );

  modelOptions = computed<SelectOption[]>(() =>
    this.projects.availableModels().map((model) => ({ value: model.value, label: model.label })),
  );

  /** Helpers para template - acceso seguro a userId */
  getCurrentProjectUserName(): string | null {
    const project = this.projects.currentProject();
    if (!project) return null;
    const userId = project.userId;
    if (typeof userId === 'string') return null;
    return userId.name || null;
  }

  getCurrentProjectUserEmail(): string | null {
    const project = this.projects.currentProject();
    if (!project) return null;
    const userId = project.userId;
    if (typeof userId === 'string') return null;
    return userId.email || null;
  }

  downloadWord() {
    this.projects.exportDocx()?.subscribe((blob) => {
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

  uploadWord(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files![0];
    if (!file || !this.projects.currentProjectId()) return;
    this.paiService.importDocx(this.projects.currentProjectId()!, file).subscribe({
      next: (res) => {
        this.projects.generatedProject.set(res.project.generatedContent!.rawText);
        this.showInfoModal(
          'Archivo Procesado',
          'El diseño se ha purificado a Markdown exitosamente.',
        );
      },
      error: () => {
        this.appFacade.errorMessage.set('Error al procesar el archivo Word.');
        this.appFacade.showErrorModal.set(true);
      },
    });
    input.value = '';
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
        this.showInfoModal(
          'Guardado',
          this.layout.language() === 'castellano'
            ? 'Borrador guardado correctamente.'
            : 'Esborrany guardat correctament.',
        );
      },
      error: (err) => console.error('Error saving draft:', err),
    });
  }

  publishProject() {
    this.projects.updateProjectStatus('publicado')?.subscribe({
      next: () => {
        this.projects.loadHistory();
        this.showInfoModal(
          'Publicado',
          this.layout.language() === 'castellano'
            ? 'Proyecto publicado y validado correctamente.'
            : 'Projecte publicat i validat correctament.',
        );
      },
      error: (err) => console.error('Error publishing project:', err),
    });
  }

  exportPDF() {
    const element = document.querySelector('markdown');
    if (element) {
      this.appFacade.telemetry
        ?.logEvent('EXPORT_PDF', this.projects.currentProjectId() || undefined)
        ?.subscribe();
      html2pdf()
        .from(element as HTMLElement)
        .save('Proyecto.pdf');
    }
  }

  onAiChange(value: string) {
    const provider = value as 'gemini' | 'openrouter';
    this.projects.selectedAi.set(provider);
    this.projects.selectedModel.set(this.projects.defaultModelForProvider(provider));
  }

  onModelChange(value: string) {
    this.projects.selectedModel.set(value);
  }

  private handleRewriteSuccess(res: RewriteSectionResponseDto) {
    // Una respuesta en texto plano no trae metadatos: se trata como objeto vacío
    const result: RewriteResultDto = typeof res === 'string' ? {} : res;
    if (result.fallbackUsed && result.provider) {
      this.projects.selectedAi.set(result.provider);
    }
    this.projects.generatedProject.set(result.newText || result.rewrittenPart || '');
    this.projects.aiPrompt.set('');
    this.projects.isThinking.set(false);
    this.projects.updateProjectStatus('borrador')?.subscribe();
  }

  private handleRewriteError(err: HttpErrorResponse) {
    console.error('Error en IA', err);
    this.projects.isThinking.set(false);
    this.projects.popUndo();
    this.editLock.handleConflict(err);
    this.appFacade.errorTitle.set(
      this.layout.language() === 'catalan' ? "Error a l'Assistent IA" : 'Error en el Asistente IA',
    );
    const serverMsg =
      err.error?.error ||
      err.error?.message ||
      err.message ||
      'Error al conectar con la IA para reescribir.';
    this.appFacade.errorMessage.set(serverMsg);
    this.appFacade.showErrorModal.set(true);
  }

  private showMissingInstructionAlert() {
    this.appFacade.infoTitle.set(this.layout.language() === 'castellano' ? 'Atención' : 'Atenció');
    this.appFacade.infoMessage.set(
      this.layout.language() === 'castellano'
        ? 'Por favor, introduce una instrucción para la IA.'
        : 'Per favor, introdueix una instrucció per a la IA.',
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
    this.projects
      .rewriteSection(instruction, this.projects.selectedAi(), this.projects.selectedModel())
      .subscribe({
        next: (res) => this.handleRewriteSuccess(res),
        error: (err) => this.handleRewriteError(err),
      });
  }

  undoAI() {
    if (!this.projects.canUndo()) return;
    this.projects.undoLastChange();
    const title = this.layout.language() === 'castellano' ? 'Deshecho' : 'Desfet';
    const msg =
      this.layout.language() === 'castellano'
        ? 'Se ha restaurado la versión anterior del proyecto.'
        : "S'ha restaurat la versió anterior del projecte.";
    this.showInfoModal(title, msg);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    if (file && this.projects.currentProjectId()) this.uploadFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
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
        console.error('Error al subir archivo', err);
        this.projects.isUploading.set(false);
      },
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
          console.error('Error al borrar archivo', err);
          this.appFacade.showConfirmModal.set(false);
        },
      });
    });
    this.appFacade.showConfirmModal.set(true);
  }

  getDownloadUrl(filename: string): string {
    return this.projects.getDownloadUrl(filename);
  }
}
