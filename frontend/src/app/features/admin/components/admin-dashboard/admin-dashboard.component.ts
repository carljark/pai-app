import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminFacade } from '../../services/admin.facade';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Panel de Configuración del Centro -->
    <section style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 40px;">
      <h2 style="color: #2c3e50; margin-top: 0;">Configuración del Centro Educativo</h2>
      <p style="color: #7f8c8d; font-size: 0.95rem;">Estos datos se inyectarán en la IA para que adapte todos los proyectos a vuestro contexto particular.</p>
      
      <form (submit)="saveSettings($event)" style="display: grid; gap: 15px; max-width: 600px;">
        <div>
          <label style="display: block; font-weight: bold; margin-bottom: 5px;">Nombre del Centro</label>
          <input type="text" [ngModel]="schoolSettings().schoolName" (ngModelChange)="schoolSettings.set({...schoolSettings(), schoolName: $event})" name="schoolName" placeholder="Ej: IES Antonio Machado" style="width: 100%; padding: 12px; font-size: 1rem; border: 1px solid #bdc3c7; border-radius: 6px;">
        </div>
        <div>
          <label style="display: block; font-weight: bold; margin-bottom: 5px;">Ciudad / Localidad</label>
          <input type="text" [ngModel]="schoolSettings().schoolCity" (ngModelChange)="schoolSettings.set({...schoolSettings(), schoolCity: $event})" name="schoolCity" placeholder="Ej: Alcalá de Henares, Madrid" style="width: 100%; padding: 12px; font-size: 1rem; border: 1px solid #bdc3c7; border-radius: 6px;">
        </div>
        <div>
          <label style="display: block; font-weight: bold; margin-bottom: 5px;">Contexto Socioeconómico (Opcional)</label>
          <textarea [ngModel]="schoolSettings().schoolContext" (ngModelChange)="schoolSettings.set({...schoolSettings(), schoolContext: $event})" name="schoolContext" rows="3" placeholder="Ej: Entorno rural con predominio del sector agrícola, o barrio periférico con alumnado multicultural." style="width: 100%; padding: 12px; font-size: 1rem; border: 1px solid #bdc3c7; border-radius: 6px; font-family: inherit; resize: vertical;"></textarea>
        </div>
        <div>
          <button type="submit" [disabled]="isSavingSettings()" style="background: #27ae60; color: white; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-size: 1.1rem; font-weight: bold; transition: background 0.3s;">
            {{ isSavingSettings() ? 'Guardando...' : 'Guardar Configuración' }}
          </button>
        </div>
      </form>
    </section>

    <!-- Panel de Usuarios -->
    <section style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 40px;">
      <h2 style="color: #2c3e50; margin-top: 0;">Panel de Administración: Usuarios Registrados</h2>
      <button (click)="adminFacade.loadUsers()" style="margin-bottom: 20px; background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer;"> Refrescar lista</button>
      
      <div style="display: grid; gap: 15px;">
        @for (u of adminFacade.users(); track u._id) {
          <div class="history-card" style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; display: flex; justify-content: space-between; align-items: center; background: #fafafa;">
            <div>
              <strong style="color: #2c3e50; font-size: 1.1rem;">{{ u.name }}</strong> ({{ u.email }})
              <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #7f8c8d;">
                Rol actual: 
                <span [style.color]="u.role === 'admin' ? '#e74c3c' : (u.role === 'teacher' ? '#27ae60' : '#f39c12')" style="font-weight: bold;">
                  {{ u.role | uppercase }}
                </span>
                | Permiso IA: 
                <strong [style.color]="u.canUseAi ? '#27ae60' : '#e74c3c'">{{ u.canUseAi ? 'SÍ' : 'NO' }}</strong>
                | Registrado el: {{ u.createdAt | date:'shortDate' }}
              </p>
            </div>
            
            <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
              @if (u.role === 'pending') {
                <button (click)="approveUser(u._id)" style="background: #27ae60; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">
                  Aprobar (Profesor)
                </button>
              } @else if (u.role === 'teacher') {
                <button (click)="changeRole(u._id, 'admin')" style="background: #8e44ad; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">
                  Hacer Admin
                </button>
              } @else if (u.role === 'admin') {
                <button (click)="changeRole(u._id, 'teacher')" style="background: #f39c12; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">
                  Hacer Profesor
                </button>
              }
              <button (click)="toggleAiAccess(u._id, u.canUseAi)" [style.background]="u.canUseAi ? '#e74c3c' : '#3498db'" style="color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">
                {{ u.canUseAi ? 'Desactivar IA' : 'Activar IA' }}
              </button>
              <button (click)="deleteUser(u._id)" style="background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">
                Eliminar
              </button>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Panel de Registros de Actividad -->
    <section style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 40px;">
      <h2 style="color: #2c3e50; margin-top: 0;">Registro de Actividad de la Aplicación</h2>
      <button (click)="adminFacade.loadLogs()" style="margin-bottom: 20px; background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer;"> Refrescar registros</button>
      
      <div style="display: grid; gap: 15px; max-height: 500px; overflow-y: auto;">
        @for (log of adminFacade.logs(); track log._id) {
          <div class="history-card" style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; background: #fafafa; border-left: 5px solid #3498db;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <strong style="color: #2c3e50;">{{ log.userId?.name || 'Desconocido' }} ({{ log.userId?.email || 'N/A' }})</strong>
              <span style="color: #7f8c8d; font-size: 0.85rem;">{{ log.createdAt | date:'short' }}</span>
            </div>
            
            <p style="margin: 0 0 5px 0; font-size: 0.95rem;">
              <span style="display: inline-block; padding: 3px 8px; background: #ecf0f1; border-radius: 4px; font-size: 0.8rem; font-weight: bold; margin-right: 10px;">{{ log.action }}</span>
              @if (log.projectId?.title) {
                <strong style="color: #8e44ad;">{{ log.projectId.title }}</strong>
              }
              @if (!log.projectId?.title && log.details?.title) {
                <strong style="color: #8e44ad;">{{ log.details.title }}</strong>
              }
            </p>

            @if (log.details?.generationTimeMs) {
              <p style="margin: 0; font-size: 0.85rem; color: #27ae60;">
                ⏱️ Tiempo de generación de la IA: <strong>{{ (log.details.generationTimeMs / 1000).toFixed(1) }}s</strong>
              </p>
            }
            @if (log.details?.error) {
              <p style="margin: 0; font-size: 0.85rem; color: #e74c3c;">
                ⚠️ Error: {{ log.details.error }}
              </p>
            }
          </div>
        }
        @if (adminFacade.logs().length === 0) {
          <div style="text-align: center; color: #7f8c8d; padding: 20px;">No hay actividad registrada aún.</div>
        }
      </div>
    </section>
  `
})
export class AdminDashboardComponent {
  adminFacade = inject(AdminFacade);

  schoolSettings = signal({ schoolName: '', schoolCity: '', schoolContext: '' });
  isSavingSettings = signal(false);
  saveSuccess = signal<boolean>(false);

  constructor() {
    this.adminFacade.loadUsers();
    this.adminFacade.loadSettings();
    effect(() => {
      const s = this.adminFacade.settings();
      if (s) this.schoolSettings.set({schoolName: s.name, schoolCity: s.educationalLevel, schoolContext: s.context});
    });
    this.adminFacade.loadLogs();
  }

  saveSettings(e: Event) {
    e.preventDefault();
    this.isSavingSettings.set(true);
    this.adminFacade.saveSettings({name: this.schoolSettings().schoolName, educationalLevel: this.schoolSettings().schoolCity, context: this.schoolSettings().schoolContext}).subscribe({
      next: () => {
        this.saveSuccess.set(true); setTimeout(() => this.saveSuccess.set(false), 3000);
        this.isSavingSettings.set(false);
      },
      error: () => {
        this.saveSuccess.set(false);
        this.isSavingSettings.set(false);
      }
    });
  }

  approveUser(userId: string) {
    this.adminFacade.updateUserRole(userId, 'teacher').subscribe();
  }

  changeRole(userId: string, newRole: string) {
    this.adminFacade.updateUserRole(userId, newRole).subscribe();
  }

  toggleAiAccess(userId: string, currentStatus: boolean) {
    this.adminFacade.updateUserAi(userId, !currentStatus).subscribe();
  }

  deleteUser(userId: string) {
    this.adminFacade.deleteUser(userId).subscribe();
  }
}
