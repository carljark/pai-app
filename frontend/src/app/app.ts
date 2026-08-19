import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaiService } from './services/pai.service';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownComponent } from 'ngx-markdown';
// @ts-ignore
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private paiService = inject(PaiService);

  // Señales para manejar el estado reactivo
  ras = signal<any[]>([]);
  selectedRas = signal<string[]>([]);
  methodology = signal<string>('ABP (Aprendizaje Basado en Proyectos)');
  isGenerating = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  generatedProject = signal<string>('');
  currentProjectId = signal<string | null>(null);

  toggleEditMode() {
    this.isEditMode.set(!this.isEditMode());
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
      margin:       10,
      filename:     'proyecto_intermodular.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
  groupedRas = computed(() => {
    const list = this.ras();
    const groups: { [key: string]: any[] } = {};
    for (const ra of list) {
      if (!groups[ra.module]) groups[ra.module] = [];
      groups[ra.module].push(ra);
    }
    return Object.keys(groups).map(key => ({
      module: key,
      ras: groups[key]
    }));
  });

  // Historial
  currentView = signal<'generator' | 'history' | 'taller'>('generator');
  projectsHistory = signal<any[]>([]);

  ngOnInit() {
    this.paiService.getRas().subscribe({
      next: (data) => this.ras.set(data),
      error: (err) => console.error('Error fetching RAs:', err),
    });
    this.loadHistory();
  }

  loadHistory() {
    this.paiService.getProjects().subscribe({
      next: (data) => this.projectsHistory.set(data),
      error: (err) => console.error('Error fetching history:', err),
    });
  }

  toggleView() {
    if (this.currentView() === 'history') {
      this.currentView.set('generator');
    } else {
      this.loadHistory();
      this.currentView.set('history');
    }
  }

  viewPastProject(project: any) {
    this.currentProjectId.set(project._id);
    this.generatedProject.set(project.generatedContent?.rawText || 'Sin contenido');
    this.selectedRas.set(project.ras || []);
    this.currentView.set('taller');
  }

  toggleRa(raDesc: string) {
    const current = this.selectedRas();
    if (current.includes(raDesc)) {
      this.selectedRas.set(current.filter((r) => r !== raDesc));
    } else {
      this.selectedRas.set([...current, raDesc]);
    }
  }

  generateProject() {
    if (this.selectedRas().length === 0) {
      alert('Por favor, selecciona al menos un Resultado de Aprendizaje.');
      return;
    }
    
    const selectedDescriptions = this.selectedRas();
    const involvedModules = Array.from(new Set(
      this.ras()
        .filter(ra => selectedDescriptions.includes(ra.description))
        .map(ra => ra.module)
    ));

    this.isGenerating.set(true);

    this.paiService.generateProject(this.selectedRas(), this.methodology(), involvedModules).subscribe({
      next: (res) => {
        this.currentProjectId.set(res._id);
        this.generatedProject.set(res.generatedContent?.rawText || 'Proyecto generado sin contenido.');
        this.isGenerating.set(false);
        this.currentView.set('taller');
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Hubo un error al generar el proyecto. Revisa la consola y que hayas configurado tu API Key en el backend.');
        this.isGenerating.set(false);
      },
    });
  }
}
