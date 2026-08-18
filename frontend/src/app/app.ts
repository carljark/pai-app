import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaiService } from './services/pai.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  generatedProject = signal<string>('');

  ngOnInit() {
    // Al iniciar, cargamos los RAs desde el backend
    this.paiService.getRas().subscribe({
      next: (data) => this.ras.set(data),
      error: (err) => console.error('Error fetching RAs:', err),
    });
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
    
    this.isGenerating.set(true);
    this.generatedProject.set('');

    this.paiService.generateProject(this.selectedRas(), this.methodology()).subscribe({
      next: (res) => {
        // Asumiendo que Gemini nos devuelve texto markdown en rawText
        this.generatedProject.set(res.generatedContent?.rawText || 'Proyecto generado sin contenido.');
        this.isGenerating.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Hubo un error al generar el proyecto. Revisa la consola y que hayas configurado tu API Key en el backend.');
        this.isGenerating.set(false);
      },
    });
  }
}
