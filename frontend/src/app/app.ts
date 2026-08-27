import { Component, inject, signal, computed, effect, HostListener, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaiService } from './services/pai.service';
import { MarkdownComponent } from 'ngx-markdown';
// @ts-ignore
import html2pdf from 'html2pdf.js';

import { AuthFacade } from './features/auth/services/auth.facade';
import { AuthFormComponent } from './features/auth/components/auth-form/auth-form.component';
import { NotificationsFacade } from './features/notifications/services/notifications.facade';
import { NotificationsBadgeComponent } from './features/notifications/components/notifications-badge/notifications-badge.component';
import { CurriculumFacade } from './features/curriculum/services/curriculum.facade';
import { ProjectsFacade } from './features/projects/services/projects.facade';
import { CurriculumSelectorComponent } from './features/curriculum/components/curriculum-selector/curriculum-selector.component';
import { ErrorModalComponent } from './components/error-modal.component';
import { InfoModalComponent } from './components/info-modal.component';
import { ConfirmModalComponent } from './components/confirm-modal.component';
import { AdminDashboardComponent } from './features/admin/components/admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownComponent, ErrorModalComponent, InfoModalComponent, ConfirmModalComponent, AdminDashboardComponent, AuthFormComponent, NotificationsBadgeComponent, CurriculumSelectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private paiService = inject(PaiService);
  authService = inject(AuthFacade);
  notificationsFacade = inject(NotificationsFacade);
  curriculumFacade = inject(CurriculumFacade);
  projectsFacade = inject(ProjectsFacade);

  // Estado de Autenticación

  // Señales para manejar el estado reactivo



  logout() {
    this.authService.logout();
  }

  downloadWord() {
    this.projectsFacade.exportDocx()?.subscribe(blob => {
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
    if (!file || !this.projectsFacade.currentProjectId()) return;
    
    this.paiService.importDocx(this.projectsFacade.currentProjectId()!, file).subscribe({
      next: (res) => {
        this.projectsFacade.generatedProject.set(res.project.generatedContent.rawText);
        this.infoTitle.set('Archivo Procesado');
        this.infoMessage.set('El diseño se ha purificado a Markdown exitosamente.');
        this.infoType.set('success');
        this.showInfoModal.set(true);
      },
      error: () => {
        this.errorMessage.set('Error al procesar el archivo Word.');
        this.showErrorModal.set(true);
      }
    });
    // Limpiar input
    event.target.value = '';
  }

  saveDraft() {
    this.projectsFacade.updateProjectStatus('borrador')?.subscribe({
      next: () => {
        this.projectsFacade.loadHistory();
        this.infoTitle.set('Guardado');
        this.infoMessage.set(this.language() === 'castellano' ? 'Borrador guardado correctamente.' : 'Esborrany guardat correctament.');
        this.infoType.set('success');
        this.showInfoModal.set(true);
      },
      error: (err) => console.error('Error saving draft:', err),
    });
  }

  publishProject() {
    this.projectsFacade.updateProjectStatus('publicado')?.subscribe({
      next: () => {
        this.projectsFacade.loadHistory();
        this.infoTitle.set('Publicado');
        this.infoMessage.set(this.language() === 'castellano' ? 'Proyecto publicado y validado correctamente.' : 'Projecte publicat i validat correctament.');
        this.infoType.set('success');
        this.showInfoModal.set(true);
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

  isRewriting = signal<boolean>(false);

  rewriteWithAI() {
    const selectedText = window.getSelection()?.toString();
    const instruction = this.projectsFacade.aiPrompt();
    
    if (!selectedText || !instruction) {
      this.infoTitle.set('Atención');
      this.infoMessage.set('Selecciona texto en el documento e introduce una instrucción para la IA.');
      this.infoType.set('info');
      this.showInfoModal.set(true);
      return;
    }

    this.projectsFacade.isThinking.set(true);
    this.projectsFacade.rewriteSection(selectedText, instruction).subscribe({
      next: (res) => {
        this.projectsFacade.generatedProject.set(res.newText);
        this.projectsFacade.aiPrompt.set('');
        this.projectsFacade.isThinking.set(false);
        this.projectsFacade.updateProjectStatus('borrador')?.subscribe();
      },
      error: (err) => {
        console.error("Error en IA", err);
        this.projectsFacade.isThinking.set(false);
      }
    });
  }

  // Agrupación por asignaturas
  language = signal<'castellano' | 'catalan'>('castellano');
  


  errorMessage = signal<string>('');
  showErrorModal = signal<boolean>(false);
  
  infoMessage = signal<string>('');
  infoTitle = signal<string>('Información');
  infoType = signal<'info'|'success'>('info');
  showInfoModal = signal<boolean>(false);
  
  showConfirmModal = signal<boolean>(false);
  confirmTitle = signal<string>('');
  confirmMessage = signal<string>('');
  confirmAction = signal<() => void>(() => {});

  


  t = computed(() => {
    if (this.language() === 'catalan') {
      return {
        logout: 'Sortir',
        downloadWord: 'Descarregar com a Word',
        uploadWord: 'Pujar Word editat',
        subtitle: 'Disseny de Projectes d\'Aprenentatge Intermodular',
        backGenerator: '⬅️ Tornar al Generador',
        historyBtn: 'Veure Historial de Projectes',
        historyTitle: 'Historial de Projectes Generats',
        noProjects: 'No hi ha projectes guardats encara.',
        cross: 'Encreuament',
        generatedOn: 'Generat el',
        status: 'Estat',
        viewProject: '️ Veure Projecte',
        configTitle: 'Configuració del Disseny',
        whatToDesign: 'Què dissenyaràs avui?',
        fpBtn: ' Projecte FP Bàsica',
        esoBtn: ' Situació d\'Aprenentatge (ESO)',
        generalConfig: '1. Configuració General',
        methodology: 'Metodologia',
        langLabel: 'Idioma de la Interfície i Sortida',
        courseLevelLabel: 'Curs / Nivell',
        firstYearFP: '1r FP Bàsica',
        secondYearFP: '2n FP Bàsica',
        thirdYearESO: '3r ESO (PDC)',
        fourthYearESO: '4t ESO (PDC)',
        curricularSelection: '2. Selecció Curricular',
        selectItemsFP: 'Selecciona els Resultats d\'Aprenentatge que formaran part del disseny.',
        selectItemsESO: 'Selecciona les Competències Específiques que formaran part del disseny.',
        generateBtn: 'Generar Projecte Intermodular',
        generatingBtn: 'Generant... (pot trigar 1-2 minuts)',
        selectedItemsTitle: 'Selecció Actual',
        noItemsSelected: 'Encara no has seleccionat cap ítem.',
        noFP: 'No hi ha projectes de Formació Professional a l\'historial.',
        noESO: 'No hi ha Situacions d\'Aprenentatge de Diversificació a l\'historial.',
        workshopTitle: 'Taller de Projectes',
        endEdit: '️ Acabar Edició',
        manualEdit: '️ Editar Manualment',
        resources: 'Recursos del Projecte',
        dragFiles: 'Arrossega arxius aquí o fes clic',
        uploading: 'Pujant...',
        deleteFile: 'Esborrar arxiu',
        fileUploaded: 'Arxiu pujat',
        saveDraft: 'Guardar Esborrany',
        publish: ' Validar i Publicar',
        exportPDF: ' Exportar PDF',
        aiAssistant: 'Assistent IA',
        aiIntro: 'Hola! Soc el teu assistent pedagògic. Segueix aquests passos per editar el projecte:',
        aiStep1: 'Escriu a sota què vols canviar (ex. "Fes-ho més curt").',
        aiStep2: 'Selecciona/Subratlla el text a modificar en el llenç de l\'esquerra.',
        aiStep3: 'Fes clic a "Reescriure amb IA".',
        aiPlaceholder: 'Demana a la IA que modifiqui el projecte...',
        rewriteBtn: 'Reescriure amb IA',
        thinking: 'Pensant...'
      };
    } else {
      return {
        logout: 'Salir',
        downloadWord: 'Bajar como Word',
        uploadWord: 'Subir Word editado',
        subtitle: 'Diseño de Proyectos de Aprendizaje Intermodular',
        backGenerator: '⬅️ Volver al Generador',
        historyBtn: 'Ver Historial de Proyectos',
        historyTitle: 'Historial de Proyectos Generados',
        noProjects: 'No hay proyectos guardados aún.',
        cross: 'Cruce',
        generatedOn: 'Generado el',
        status: 'Estado',
        viewProject: '️ Ver Proyecto',
        configTitle: 'Configuración del Diseño',
        whatToDesign: '¿Qué vas a diseñar hoy?',
        fpBtn: ' Proyecto FP Básica',
        esoBtn: ' Situación de Aprendizaje (ESO)',
        generalConfig: '1. Configuración General',
        methodology: 'Metodología',
        langLabel: 'Idioma de la Interfaz y Salida',
        courseLevelLabel: 'Curso / Nivel',
        firstYearFP: '1º FP Básica',
        secondYearFP: '2º FP Básica',
        thirdYearESO: '3º ESO (PDC)',
        fourthYearESO: '4º ESO (PDC)',
        curricularSelection: '2. Selección Curricular',
        selectItemsFP: 'Selecciona los Resultados de Aprendizaje que formarán part del diseño.',
        selectItemsESO: 'Selecciona las Competencias Específicas que formarán part del diseño.',
        generateBtn: 'Generar Proyecto Intermodular',
        generatingBtn: 'Generando... (puede tardar 1-2 minutos)',
        selectedItemsTitle: 'Selección Actual',
        noItemsSelected: 'Aún no has seleccionado ningún ítem.',
        noFP: 'No hay proyectos de Formación Profesional en el historial.',
        noESO: 'No hay Situaciones de Aprendizaje de Diversificación en el historial.',
        workshopTitle: 'Taller de Proyectos',
        endEdit: '️ Terminar Edición',
        manualEdit: '️ Editar Manualmente',
        resources: 'Recursos del Proyecto',
        dragFiles: 'Arrastra archivos aquí o haz clic',
        uploading: 'Subiendo...',
        deleteFile: 'Borrar archivo',
        fileUploaded: 'Archivo subido',
        saveDraft: 'Guardar Borrador',
        publish: ' Validar y Publicar',
        exportPDF: ' Exportar PDF',
        aiAssistant: 'Asistente IA',
        aiIntro: '¡Hola! Soy tu asistente pedagógico. Sigue estos pasos para editar el proyecto:',
        aiStep1: 'Escribe abajo qué quieres cambiar (ej. "Hazlo más corto").',
        aiStep2: 'Selecciona/Subraya el text a modificar en el lienzo de la izquierda.',
        aiStep3: 'Haz clic en "Reescribir con IA".',
        aiPlaceholder: 'Pide a la IA que modifique el proyecto...',
        rewriteBtn: 'Reescribir con IA',
        thinking: 'Pensando...'
      };
    }
  });

  // Historial
  // Vistas e Historial
  currentView = signal<'generator' | 'history' | 'taller' | 'admin'>('generator');
  // Admin variables moved to component
  // Señal para detectar vista móvil
  isMobile = signal<boolean>(window.innerWidth <= 768);
  isSidebarCollapsed = signal<boolean>(false);
  toggleSidebar() { this.isSidebarCollapsed.update(v => !v); }

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth <= 768);
  }

  // Admin panel moved to AdminDashboardComponent
  constructor() {
    // Restaurar estado guardado
    const savedView = localStorage.getItem('pai_view') as any;
    if (savedView) this.currentView.set(savedView);
    
    const savedTab = localStorage.getItem('pai_historyTab') as any;
    if (savedTab) this.projectsFacade.historyTab.set(savedTab);
    
    const savedProjectId = localStorage.getItem('pai_projectId');
    if (savedProjectId) this.projectsFacade.currentProjectId.set(savedProjectId);

    effect(() => {
      // Guardar preferencias visuales automáticamente
      localStorage.setItem('pai_view', this.currentView());
      localStorage.setItem('pai_historyTab', this.projectsFacade.historyTab());
      if (this.projectsFacade.currentProjectId()) {
        localStorage.setItem('pai_projectId', this.projectsFacade.currentProjectId()!);
      }
    });

    effect(() => {
      const currentLang = this.language();
      const user = this.authService.currentUser();
      if (user) {
        this.curriculumFacade.loadRas(currentLang);
        this.curriculumFacade.loadCes(currentLang);
        this.paiService.getProjects().subscribe((res) => this.projectsFacade.projectsHistory.set(res));
      }
    });

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0);

    effect(() => {
      const user = this.authService.currentUser();
      untracked(() => {
        if (user) {
          this.projectsFacade.loadHistory();
        }
      });
    });

    effect(() => {
      const notif = this.notificationsFacade.latestNotification();
      if (notif) {
        untracked(() => {
          if (notif.type === 'COMPLETED' || notif.type === 'ERROR' || notif.type === 'STATUS') {
            this.projectsFacade.loadHistory();
          }
          
          // Mostrar modal cuando llega una notificación del SSE
          if (notif.type === 'COMPLETED') {
            // Retrasar ligeramente para asegurar que la UI se actualice, 
            // especialmente si el usuario acaba de cerrar el modal previo.
            setTimeout(() => {
              this.infoTitle.set('¡Proyecto Generado!');
              this.infoMessage.set(notif.message);
              this.infoType.set('success');
              this.showInfoModal.set(true);
            }, 100);
          } else if (notif.type === 'ERROR') {
            this.errorMessage.set(notif.message);
            this.showErrorModal.set(true);
          }
        });
      }
    });
  }


  deleteProject(projectId: string) {
    this.confirmTitle.set('Eliminar Proyecto');
    this.confirmMessage.set('¿Seguro que quieres borrar este proyecto? Esta acción no se puede deshacer.');
    this.confirmAction.set(() => {
      this.projectsFacade.deleteProject(projectId).subscribe({
        next: () => {
          this.projectsFacade.loadHistory();
          this.showConfirmModal.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.error || 'Error al borrar el proyecto');
          this.showErrorModal.set(true);
          this.showConfirmModal.set(false);
        }
      });
    });
    this.showConfirmModal.set(true);
  }


  switchView(view: 'generator' | 'taller' | 'history' | 'admin') {
    this.currentView.set(view);
    if (view === 'admin') {
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleView() {
    if (this.currentView() === 'history') {
      this.switchView('generator');
    } else {
      this.projectsFacade.loadHistory();
      this.switchView('history');
    }
  }

  viewPastProject(project: any) {
    this.projectsFacade.currentProjectId.set(project._id);
    this.projectsFacade.generatedProject.set(project.generatedContent?.rawText || 'Sin contenido');
    this.curriculumFacade.selectedRas.set(project.ras || []);
    this.curriculumFacade.tipoNivel.set(project.tipoNivel || 'FP_BASICA');
    this.projectsFacade.loadProjectFiles();
    this.switchView('taller');
  }


  generateProject() {
    if (this.curriculumFacade.selectedRas().length === 0) {
      this.infoTitle.set('Atención');
      this.infoMessage.set('Por favor, selecciona al menos un elemento de la lista.');
      this.infoType.set('info');
      this.showInfoModal.set(true);
      return;
    }
    
    this.projectsFacade.isGenerating.set(true);
    this.projectsFacade.generateProject(this.language()).subscribe({
      next: (res) => {
        // 'res' es ahora { message: '...', project: { ... } } debido al sistema de colas
        const newProject = res.project || res;
        
        this.projectsFacade.isGenerating.set(false);
        this.curriculumFacade.clearSelection();
        
        this.infoTitle.set('Proyecto en Cola');
        this.infoMessage.set('Tu proyecto ha sido puesto en la cola de generación. Se está procesando en segundo plano.\n\nPuedes ver su estado desde el botón de notificaciones o el historial.');
        this.infoType.set('info');
        this.showInfoModal.set(true);
        
        this.projectsFacade.loadHistory();
        // Cambiamos al historial para que el usuario pueda ver el estado de carga
        this.switchView('history');
      },
      error: (err) => {
        console.error('Error:', err);
        const serverMsg = err.error?.error || err.error?.message || err.message || 'Error desconocido';
        this.errorMessage.set(`El servidor devolvió el siguiente error:

${serverMsg}`);
        this.showErrorModal.set(true);
        this.projectsFacade.isGenerating.set(false);
      },
    });
  }

  // --- GESTIÓN DE ARCHIVOS ---


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.projectsFacade.currentProjectId()) {
      this.uploadFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Podríamos añadir una señal isDragging para cambiar el fondo
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file && this.projectsFacade.currentProjectId()) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File) {
    this.projectsFacade.isUploading.set(true);
    this.projectsFacade.uploadFile(file)?.subscribe({
      next: () => {
        this.projectsFacade.loadProjectFiles();
        this.projectsFacade.isUploading.set(false);
      },
      error: (err) => {
        console.error("Error al subir archivo", err);
        this.projectsFacade.isUploading.set(false);
      }
    });
  }

  deleteFile(filename: string) {
    this.confirmTitle.set('Eliminar Archivo');
    this.confirmMessage.set(this.t().deleteFile + ' ' + filename + '?');
    this.confirmAction.set(() => {
      this.projectsFacade.deleteFile(filename)?.subscribe({
        next: () => {
          this.projectsFacade.loadProjectFiles();
          this.showConfirmModal.set(false);
        },
        error: (err) => {
          console.error("Error al borrar archivo", err);
          this.showConfirmModal.set(false);
        }
      });
    });
    this.showConfirmModal.set(true);
  }

  getDownloadUrl(filename: string): string {
    return this.projectsFacade.getDownloadUrl(filename);
  }
}
