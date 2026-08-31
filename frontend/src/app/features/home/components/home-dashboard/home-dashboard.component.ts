import { TranslationService } from '../../../../services/translation.service';
import { Component, inject, output, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';

type AppView = 'home' | 'generator' | 'history' | 'taller' | 'admin';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-dashboard">

      <!-- Hero Section -->
      <div class="home-hero">
        <div class="home-hero__logo-container">
          <img src="word-transparent.png" alt="Plappin" class="home-hero__word">
          <img src="logo-transparent.png" alt="Logo" class="home-hero__logo">
        </div>
        <h1 class="home-hero__title">{{ t().homeTitle }}</h1>
        <p class="home-hero__greeting">{{ t().homeGreeting }}, <strong>{{ userName() }}</strong>!</p>
        <div class="home-hero__description" [innerHTML]="t().homeDescription"></div>

        <!-- CTA Buttons -->
        <div class="home-hero__actions">
          <button class="home-cta home-cta--primary" (click)="navigate.emit('generator')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            {{ t().homeNewProject }}
          </button>
          <button class="home-cta home-cta--secondary" (click)="navigate.emit('history')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ t().homeViewHistory }}
          </button>
        </div>
      </div>

      <!-- Recent Projects Section -->
      <div class="home-recent">
        <h2 class="home-recent__title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{ t().homeRecentTitle }}
        </h2>

        @if (recentProjects().length === 0) {
          <div class="home-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c4d4cc" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <p>{{ t().homeEmpty }}</p>
            <button class="home-cta home-cta--primary" style="margin-top: 12px;" (click)="navigate.emit('generator')">{{ t().homeStartNow }}</button>
          </div>
        } @else {
          <div class="home-recent__grid">
            @for (project of recentProjects(); track project._id) {
              <div class="home-project-card" (click)="openProject.emit(project)">
                <div class="home-project-card__header">
                  <span class="home-project-card__badge" [class]="'status--' + project.status">
                    {{ statusLabel(project.status) }}
                  </span>
                  <span class="home-project-card__date">{{ project.createdAt | date:'d MMM, HH:mm' }}</span>
                </div>
                <p class="home-project-card__modules">
                  {{ project.modules?.join(' · ') || project.generatedContent?.modules?.join(' · ') || t().homeDefaultModules }}
                </p>
                <div class="home-project-card__footer">
                  <span class="home-project-card__level">{{ project.tipoNivel === 'DIVERSIFICACION_CURRICULAR' ? t().courseLevelPDC : t().courseLevelFP }}</span>
                  <span class="home-project-card__open">{{ t().homeOpen }}</span>
                </div>
              </div>
            }
          </div>
          @if (projectsFacade.projectsHistory().length > 5) {
            <div style="text-align: center; margin-top: 16px;">
              <button class="home-cta home-cta--ghost" (click)="navigate.emit('history')">
                {{ t().workshopViewAll }} ({{ projectsFacade.projectsHistory().length }})
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    /* ─── Paleta local (refleja variables SCSS globales) ────────────────────── */
    :host {
      --c-primary:       #4a7c65;
      --c-primary-dark:  #345a49;
      --c-primary-light: #e8f2ee;
      --c-bg:            #f5f7f6;
      --c-surface:       #ffffff;
      --c-border:        #dde5e2;
      --c-text:          #1f2937;
      --c-text-muted:    #6b7280;
      --c-text-light:    #9ca3af;
      /* estados */
      --c-success:       #5a9e7c;
      --c-success-bg:    #eaf4ee;
      --c-danger:        #b05c5c;
      --c-danger-bg:     #f8eded;
      --c-warning:       #c49a3c;
      --c-warning-bg:    #fdf4e0;
      --c-info:          #4d7a9e;
      --c-info-bg:       #eaf1f8;
    }

    .home-dashboard {
      display: flex;
      flex-direction: column;
      gap: 40px;
      max-width: 900px;
      margin: 0 auto;
      padding: 24px 0;
    }

    /* ─── Hero ─────────────────────────────────────────────────────────────── */
    .home-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
      padding: 40px 24px;
      background: linear-gradient(135deg, var(--c-primary-light) 0%, var(--c-surface) 100%);
      border-radius: 16px;
      border: 1px solid var(--c-border);
    }

    .home-hero__logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    
    .home-hero__word {
      height: 88px;
      width: auto;
      object-fit: contain;
    }

    .home-hero__logo {
      height: 72px;
      width: auto;
      object-fit: contain;
    }

    .home-hero__title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--c-text);
      line-height: 1.2;
      margin: 0;
    }

    .home-hero__greeting {
      font-size: 1.1rem;
      color: var(--c-text-muted);
      margin: 0;
    }

    .home-hero__description {
      font-size: 1rem;
      color: var(--c-text-muted);
      max-width: 760px;
      line-height: 1.7;
      margin: 0;
    }

    .home-hero__pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
    }

    .home-pill {
      background: var(--c-surface);
      border: 1px solid var(--c-border);
      color: var(--c-primary-dark);
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 500;
    }

    .home-hero__actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 8px;
    }

    /* ─── CTA Buttons ──────────────────────────────────────────────────────── */
    .home-cta {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 13px 26px;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .home-cta--primary {
      background: var(--c-primary);
      color: white;
      box-shadow: 0 4px 12px rgba(74, 124, 101, 0.25);
    }
    .home-cta--primary:hover {
      background: var(--c-primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(74, 124, 101, 0.32);
    }

    .home-cta--secondary {
      background: var(--c-surface);
      color: var(--c-primary-dark);
      border: 2px solid var(--c-border);
    }
    .home-cta--secondary:hover {
      background: var(--c-primary-light);
      border-color: var(--c-primary);
    }

    .home-cta--ghost {
      background: transparent;
      color: var(--c-text-muted);
      border: 1px solid var(--c-border);
      font-size: 0.9rem;
      padding: 10px 20px;
    }
    .home-cta--ghost:hover {
      background: var(--c-bg);
      color: var(--c-text);
    }

    /* ─── Recent section ───────────────────────────────────────────────────── */
    .home-recent__title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--c-text);
      margin: 0 0 16px;
    }

    .home-recent__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }

    /* ─── Project Card ─────────────────────────────────────────────────────── */
    .home-project-card {
      background: var(--c-surface);
      border: 1px solid var(--c-border);
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .home-project-card:hover {
      border-color: var(--c-primary);
      box-shadow: 0 4px 16px rgba(74, 124, 101, 0.12);
      transform: translateY(-2px);
    }

    .home-project-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .home-project-card__badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 3px 9px;
      border-radius: 20px;
      background: var(--c-bg);
      color: var(--c-text-muted);
    }
    .status--publicado { background: var(--c-success-bg); color: var(--c-success); }
    .status--borrador  { background: var(--c-bg);         color: var(--c-text-muted); }
    .status--en_cola   { background: var(--c-warning-bg); color: var(--c-warning); }
    .status--generando { background: var(--c-info-bg);    color: var(--c-info); }
    .status--error     { background: var(--c-danger-bg);  color: var(--c-danger); }

    .home-project-card__date {
      font-size: 0.75rem;
      color: var(--c-text-light);
      white-space: nowrap;
    }

    .home-project-card__modules {
      font-size: 0.9rem;
      color: var(--c-text);
      font-weight: 500;
      line-height: 1.4;
      margin: 0;
    }

    .home-project-card__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.78rem;
    }

    .home-project-card__level {
      color: var(--c-text-muted);
      background: var(--c-bg);
      padding: 2px 8px;
      border-radius: 10px;
    }

    .home-project-card__open {
      color: var(--c-primary);
      font-weight: 600;
    }

    /* ─── Empty state ──────────────────────────────────────────────────────── */
    .home-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      text-align: center;
      color: var(--c-text-light);
      background: var(--c-bg);
      border-radius: 12px;
      border: 1px dashed var(--c-border);
    }
    .home-empty p { margin: 12px 0 0; font-size: 0.95rem; }

    /* ─── Responsive ───────────────────────────────────────────────────────── */
    @media (max-width: 600px) {
      .home-hero__title { font-size: 1.4rem; }
      .home-cta { width: 100%; justify-content: center; }
      .home-hero__actions { flex-direction: column; width: 100%; }
    }
  `]
})
export class HomeDashboardComponent {
  projectsFacade = inject(ProjectsFacade);
  translationService = inject(TranslationService);
  t = this.translationService.t;
  private authFacade = inject(AuthFacade);

  navigate = output<AppView>();
  openProject = output<any>();

  userName = computed(() => this.authFacade.currentUser()?.name || this.t().defaultUser);

  recentProjects = computed(() =>
    [...this.projectsFacade.projectsHistory()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  );

  constructor() {
    effect(() => {
      this.projectsFacade.loadHistory();
    });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      publicado: this.t().statusPublished,
      borrador: this.t().statusDraft,
      en_cola: this.t().statusQueued,
      generando: this.t().statusGenerating,
      error: this.t().statusError
    };
    return labels[status] ?? status;
  }
}
