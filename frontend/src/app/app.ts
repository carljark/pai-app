import { Component, OnInit, inject, signal, computed, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaiService } from './services/pai.service';
import { MarkdownComponent } from 'ngx-markdown';
// @ts-ignore
import html2pdf from 'html2pdf.js';

import { AuthService } from './services/auth.service';
import { ErrorModalComponent } from './components/error-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownComponent, ErrorModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private paiService = inject(PaiService);
  authService = inject(AuthService);

  // Estado de Autenticación
  authMode = signal<'login' | 'register'>('login');
  authForm = signal({ email: '', password: '', name: '' });
  authError = signal('');

  // Señales para manejar el estado reactivo
  ras = signal<any[]>([]);
  selectedRas = signal<string[]>([]);
  methodology = signal<string>('ABP (Aprendizaje Basado en Proyectos)');
  isGenerating = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  generatedProject = signal<string>('');
  currentProjectId = signal<string | null>(null);
  currentProject = computed(() => this.projectsHistory().find(p => p._id === this.currentProjectId()));

  login() {
    this.authError.set('');
    this.authService.login(this.authForm()).subscribe({
      next: () => {
        this.loadHistory();
      },
      error: (err) => this.authError.set(err.error?.error || 'Error al iniciar sesión')
    });
  }

  register() {
    this.authError.set('');
    this.authService.register(this.authForm()).subscribe({
      next: () => {
        this.authMode.set('login');
        this.authError.set('Registro exitoso. Ahora inicia sesión.');
      },
      error: (err) => this.authError.set(err.error?.error || 'Error al registrarse')
    });
  }

  logout() {
    this.authService.logout();
    this.ras.set([]);
    this.ces.set([]);
    this.projectsHistory.set([]);
  }

  downloadWord() {
    if (!this.currentProjectId()) return;
    this.paiService.exportDocx(this.currentProjectId()!).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Proyecto.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: () => alert('Error al descargar el archivo Word.')
    });
  }

  triggerUpload() {
    const fileInput = document.getElementById('docxUpload') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  uploadWord(event: any) {
    const file = event.target.files[0];
    if (!file || !this.currentProjectId()) return;
    
    this.paiService.importDocx(this.currentProjectId()!, file).subscribe({
      next: (res) => {
        this.generatedProject.set(res.project.generatedContent.rawText);
        alert('Archivo procesado correctamente. ¡El diseño se ha purificado a Markdown!');
      },
      error: () => alert('Error al procesar el archivo Word.')
    });
    // Limpiar input
    event.target.value = '';
  }

  saveDraft() {
    if(!this.currentProjectId()) return;
    this.paiService.updateProject(this.currentProjectId()!, this.generatedProject(), 'borrador').subscribe({
      next: () => alert('Borrador guardado correctamente.'),
      error: (e) => alert('Error al guardar el borrador.')
    });
  }

  publishProject() {
    if(!this.currentProjectId()) return;
    this.paiService.updateProject(this.currentProjectId()!, this.generatedProject(), 'publicado').subscribe({
      next: () => alert('¡Proyecto Validado y Publicado! Estará disponible en el Repositorio (Futuro).'),
      error: (e) => alert('Error al publicar.')
    });
  }

  exportPDF() {
    if (this.isEditMode()) {
      alert('Por favor, haz clic en "Terminar Edición" antes de exportar el PDF.');
      return;
    }
    const element = document.getElementById('pdf-content');
    if (!element) return;
    
    // Guardar estilos originales
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflowY;
    
    // Expandir el div para que html2pdf capture el documento entero
    element.style.height = 'auto';
    element.style.overflowY = 'visible';

    const opt: any = {
      margin:       15,
      filename:     'proyecto_intermodular.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: 'css', avoid: ['h1', 'h2', 'h3', 'h4', 'table', 'tr', 'li', 'blockquote'] }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
      // Restaurar el scroll una vez exportado
      element.style.height = originalHeight;
      element.style.overflowY = originalOverflow;
    });
  }

  aiPrompt = signal<string>('');
  isRewriting = signal<boolean>(false);

  rewriteWithAI() {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      alert('Por favor, selecciona (subraya) con el ratón el texto del documento que quieres que la IA modifique.');
      return;
    }

    const selectedText = selection.toString();
    const instruction = this.aiPrompt();

    if (!instruction.trim()) {
      alert('Por favor, escribe una instrucción en la caja de texto (ej. "Hazlo más corto").');
      return;
    }

    this.isRewriting.set(true);

    this.paiService.rewriteSection(this.generatedProject(), selectedText, instruction).subscribe({
      next: (res) => {
        // Ahora el backend nos devuelve el documento completo ya modificado
        this.generatedProject.set(res.newText);
        this.isRewriting.set(false);
        this.aiPrompt.set('');
      },
      error: (err) => {
        console.error('Error reescribiendo:', err);
        alert('Hubo un error al reescribir con IA.');
        this.isRewriting.set(false);
      }
    });
  }

  // Agrupación por asignaturas
  tipoNivel = signal<'FP_BASICA' | 'DIVERSIFICACION_CURRICULAR'>('FP_BASICA');
  courseLevel = signal<string>('1º Curso');
  language = signal<'castellano' | 'catalan'>('castellano');
  ces = signal<any[]>([]);
  projectFiles = signal<any[]>([]);
  isUploading = signal<boolean>(false);
  
  historyTab = signal<'FP_BASICA' | 'ESO'>('FP_BASICA');

  selectedItemsDetails = computed(() => {
    // Build a lookup map from the grouped items so we get the exact computed category and index
    const lookup = new Map<string, { subject: string, index: number }>();
    for (const group of this.groupedItems()) {
      for (const item of group.items) {
        lookup.set(item.text, { subject: group.category, index: item.index });
      }
    }
    
    return this.selectedRas().map(desc => {
      const info = lookup.get(desc) || { subject: 'Desconocido', index: 0 };
      let shortDesc = desc.substring(0, 60);
      if (desc.length > 60) shortDesc += '...';
      return { subject: info.subject, index: info.index, shortDesc, fullDesc: desc };
    });
  });

  groupedSelectedItems = computed(() => {
    const list = this.selectedItemsDetails();
    const groups: { [key: string]: typeof list } = {};
    for (const item of list) {
      if (!groups[item.subject]) groups[item.subject] = [];
      groups[item.subject].push(item);
    }
    return Object.keys(groups).map(key => ({
      subject: key,
      items: groups[key].sort((a, b) => a.index - b.index)
    })).sort((a, b) => a.subject.localeCompare(b.subject));
  });

  searchQuery = signal<string>('');

  errorMessage = signal<string>('');
  showErrorModal = signal<boolean>(false);
  
  fpProjects = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.projectsHistory().filter(p => {
      const matchLevel = p.tipoNivel === 'FP_BASICA' || !p.tipoNivel;
      if (!matchLevel) return false;
      if (!q) return true;
      const titleMatch = p.title?.toLowerCase().includes(q);
      const textMatch = p.generatedContent?.rawText?.toLowerCase().includes(q);
      return titleMatch || textMatch;
    });
  });

  esoProjects = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.projectsHistory().filter(p => {
      const matchLevel = p.tipoNivel === 'DIVERSIFICACION_CURRICULAR';
      if (!matchLevel) return false;
      if (!q) return true;
      const titleMatch = p.title?.toLowerCase().includes(q);
      const textMatch = p.generatedContent?.rawText?.toLowerCase().includes(q);
      return titleMatch || textMatch;
    });
  });

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

  getCategoryStyle(category: string): { bg: string, text: string, icon: string } {
    const name = category.toLowerCase();
    if (name.includes('ciencia') || name.includes('ciència') || 
        name.includes('científico') || name.includes('científic') ||
        name.includes('biología') || name.includes('biologia') ||
        name.includes('física') || name.includes('matemática') || name.includes('matemàtique') ||
        name.includes('tecnología') || name.includes('tecnologia')) {
      return { bg: '#e8f4f8', text: '#2c3e50', icon: '' }; // Azul clarito (Ciencias)
    } else if (name.includes('lengua') || name.includes('llengua') || 
               name.includes('lingüístico') || name.includes('lingüístic') ||
               name.includes('comunicación') || name.includes('comunicació') ||
               name.includes('geografía') || name.includes('geografia') ||
               name.includes('social')) {
      return { bg: '#fcf3cf', text: '#7d6608', icon: '' }; // Amarillo/Naranja clarito (Letras/Sociales)
    } else {
      return { bg: '#ebdef0', text: '#512e5f', icon: '' }; // Morado clarito (Otros/FP)
    }
  }

  groupedItems = computed(() => {
    if (this.tipoNivel() === 'FP_BASICA') {
      const list = this.ras();
      const groups: { [key: string]: any[] } = {};
      
      for (const ra of list) {
        let categoryName = ra.module;
        // Se ha eliminado la lógica de unificación de Ciencias Aplicadas y Comunicación y Sociedad
        // para que aparezcan I y II por separado en el desplegable de FP Básica, según el Word de mejoras.
        
        if (!groups[categoryName]) groups[categoryName] = [];
        groups[categoryName].push(ra);
      }
      
      return Object.keys(groups).map(key => {
        const moduleItems = groups[key];
        const finalCategory = key;
        
        const uniqueTexts: string[] = [];
        for (const ra of moduleItems) {
          if (!uniqueTexts.includes(ra.description)) {
            uniqueTexts.push(ra.description);
          }
        }
        
        const items = uniqueTexts.map((text, idx) => ({ index: idx + 1, text }));
        return { category: finalCategory, items, totalItems: items.length };
      });
      
    } else {
      const list = this.ces();
      const groups: { [key: string]: any[] } = {};
      
      for (const ce of list) {
        const groupName = `${ce.area} - ${ce.subject}`;
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(ce);
      }
      
      return Object.keys(groups).map(key => {
        const uniqueTexts = Array.from(new Set(groups[key].map((ce: any) => ce.description)));
        const items = uniqueTexts.map((text, idx) => ({ index: idx + 1, text }));
        return { category: key, items, totalItems: items.length };
      });
    }
  });

  // Historial
  // Vistas e Historial
  currentView = signal<'generator' | 'history' | 'taller' | 'admin'>('generator');
  projectsHistory = signal<any[]>([]);

  // Admin
  usersList = signal<any[]>([]);

  // Señal para detectar vista móvil
  isMobile = signal<boolean>(window.innerWidth <= 768);

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth <= 768);
  }

  schoolSettings = signal({ schoolName: '', schoolCity: '', schoolContext: '' });
  isSavingSettings = signal(false);

  loadUsers() {
    this.paiService.getUsers().subscribe(users => this.usersList.set(users));
  }

  loadSettings() {
    this.paiService.getSettings().subscribe(settings => {
      this.schoolSettings.set({
        schoolName: settings.schoolName || '',
        schoolCity: settings.schoolCity || '',
        schoolContext: settings.schoolContext || ''
      });
    });
  }

  saveSettings(e: Event) {
    e.preventDefault();
    this.isSavingSettings.set(true);
    this.paiService.updateSettings(this.schoolSettings()).subscribe({
      next: () => {
        alert('Configuración guardada correctamente.');
        this.isSavingSettings.set(false);
      },
      error: () => {
        alert('Error al guardar la configuración.');
        this.isSavingSettings.set(false);
      }
    });
  }

  approveUser(userId: string) {
    this.paiService.updateUserPermissions(userId, { role: 'teacher' }).subscribe(() => {
      this.loadUsers();
    });
  }

  toggleAiAccess(userId: string, currentStatus: boolean) {
    this.paiService.updateUserPermissions(userId, { canUseAi: !currentStatus }).subscribe(() => {
      this.loadUsers();
    });
  }

  constructor() {
    // Restaurar estado guardado
    const savedView = localStorage.getItem('pai_view') as any;
    if (savedView) this.currentView.set(savedView);
    
    const savedTab = localStorage.getItem('pai_historyTab') as any;
    if (savedTab) this.historyTab.set(savedTab);
    
    const savedProjectId = localStorage.getItem('pai_projectId');
    if (savedProjectId) this.currentProjectId.set(savedProjectId);

    effect(() => {
      // Guardar preferencias visuales automáticamente
      localStorage.setItem('pai_view', this.currentView());
      localStorage.setItem('pai_historyTab', this.historyTab());
      if (this.currentProjectId()) {
        localStorage.setItem('pai_projectId', this.currentProjectId()!);
      }
    });

    effect(() => {
      const currentLang = this.language();
      const user = this.authService.currentUser();
      if (user) {
        this.paiService.getRas(currentLang).subscribe((res) => this.ras.set(res));
        this.paiService.getCes(currentLang).subscribe((res) => this.ces.set(res));
        this.paiService.getProjects().subscribe((res) => this.projectsHistory.set(res));
      }
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.loadHistory();
    }
    // Prevenir que Chrome/Safari intente restaurar el scroll de la sesión anterior al refrescar
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Forzar scroll arriba del todo cuando se refresca la página (F5)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0);
  }

  deleteProject(projectId: string) {
    if (!confirm('¿Seguro que quieres borrar este proyecto?')) return;
    this.paiService.deleteProject(projectId).subscribe({
      next: () => {
        this.loadHistory(); // Recargar la lista
      },
      error: (err) => {
        alert(err.error?.error || 'Error al borrar el proyecto');
      }
    });
  }

  loadHistory() {
    this.paiService.getProjects().subscribe({
      next: (data) => {
        this.projectsHistory.set(data);
        
        // Si estábamos en el taller y recargamos la página, recuperamos el contenido del proyecto
        if (this.currentView() === 'taller' && this.currentProjectId()) {
          const proj = data.find((p: any) => p._id === this.currentProjectId());
          if (proj) {
            this.generatedProject.set(proj.generatedContent?.rawText || 'Sin contenido');
            this.selectedRas.set(proj.ras || []);
            this.tipoNivel.set(proj.tipoNivel || 'FP_BASICA');
            this.loadProjectFiles(proj._id);
          }
        }
      },
      error: (err) => console.error('Error fetching history:', err),
    });
  }

  switchView(view: 'generator' | 'taller' | 'history' | 'admin') {
    this.currentView.set(view);
    if (view === 'admin') {
      this.loadUsers();
      this.loadSettings();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleView() {
    if (this.currentView() === 'history') {
      this.switchView('generator');
    } else {
      this.loadHistory();
      this.switchView('history');
    }
  }

  viewPastProject(project: any) {
    this.currentProjectId.set(project._id);
    this.generatedProject.set(project.generatedContent?.rawText || 'Sin contenido');
    this.selectedRas.set(project.ras || []);
    this.tipoNivel.set(project.tipoNivel || 'FP_BASICA');
    this.loadProjectFiles(project._id);
    this.switchView('taller');
  }

  toggleRa(itemDesc: string) {
    const current = this.selectedRas();
    if (current.includes(itemDesc)) {
      this.selectedRas.set(current.filter((r) => r !== itemDesc));
    } else {
      this.selectedRas.set([...current, itemDesc]);
    }
  }

  generateProject() {
    if (this.selectedRas().length === 0) {
      alert('Por favor, selecciona al menos un elemento de la lista.');
      return;
    }
    
    this.isGenerating.set(true);

    let involvedModules: string[] = [];
    if (this.tipoNivel() === 'FP_BASICA') {
      const selected = this.ras().filter(ra => this.selectedRas().includes(ra.description));
      involvedModules = Array.from(new Set(selected.map(ra => ra.module)));
    } else {
      const selected = this.ces().filter(ce => this.selectedRas().includes(ce.description));
      involvedModules = Array.from(new Set(selected.map(ce => ce.subject)));
    }

    this.paiService.generateProject(this.selectedRas(), this.methodology(), involvedModules, this.tipoNivel(), this.language(), this.courseLevel()).subscribe({
      next: (res) => {
        this.currentProjectId.set(res._id);
        this.generatedProject.set(res.generatedContent?.rawText || 'Proyecto generado sin contenido.');
        this.loadProjectFiles(res._id);
        this.isGenerating.set(false);
        this.switchView('taller');
        this.loadHistory(); // Refrescar historial
      },
      error: (err) => {
        console.error('Error:', err);
        const serverMsg = err.error?.error || err.error?.message || err.message || 'Error desconocido';
        this.errorMessage.set(`El servidor devolvió el siguiente error:\n\n${serverMsg}`);
        this.showErrorModal.set(true);
        this.isGenerating.set(false);
      },
    });
  }

  // --- GESTIÓN DE ARCHIVOS ---

  loadProjectFiles(projectId: string) {
    this.paiService.getProjectFiles(projectId).subscribe({
      next: (files) => this.projectFiles.set(files),
      error: (err) => console.error("Error al cargar archivos", err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.currentProjectId()) {
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
    if (file && this.currentProjectId()) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File) {
    this.isUploading.set(true);
    this.paiService.uploadFile(this.currentProjectId()!, file).subscribe({
      next: () => {
        this.loadProjectFiles(this.currentProjectId()!);
        this.isUploading.set(false);
      },
      error: (err) => {
        console.error("Error al subir archivo", err);
        this.isUploading.set(false);
      }
    });
  }

  deleteFile(filename: string) {
    if (confirm(this.t().deleteFile + ' ' + filename + '?')) {
      this.paiService.deleteFile(this.currentProjectId()!, filename).subscribe({
        next: () => this.loadProjectFiles(this.currentProjectId()!),
        error: (err) => console.error("Error al borrar archivo", err)
      });
    }
  }

  getDownloadUrl(filename: string): string {
    return this.paiService.getDownloadUrl(this.currentProjectId()!, filename);
  }
}
