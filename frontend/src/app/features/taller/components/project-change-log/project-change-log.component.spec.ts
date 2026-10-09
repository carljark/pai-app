import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectChangeLogComponent } from './project-change-log.component';
import { CollaborationService } from '../../../projects/services/collaboration.service';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { NotificationsFacade } from '../../../notifications/services/notifications.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';
import { TRANSLATIONS_CA } from '../../../../services/translations.ca';
import { ProjectChange } from '../../../projects/models/collaboration.model';

const change = (overrides: Partial<ProjectChange> = {}): ProjectChange => ({
  id: 'c1',
  action: 'AI_REWRITE',
  userName: 'Ana',
  userEmail: 'ana@test.com',
  details: { instruction: 'Añade evaluación' },
  createdAt: '2026-10-09T08:30:00.000Z',
  ...overrides,
});

describe('ProjectChangeLogComponent', () => {
  let fixture: ComponentFixture<ProjectChangeLogComponent>;
  let service: any;
  let currentProjectId: ReturnType<typeof signal<string | null>>;
  let generatedProject: ReturnType<typeof signal<string>>;
  let editLockEvent: ReturnType<typeof signal<any>>;
  let language: ReturnType<typeof signal<string>>;
  let t: ReturnType<typeof signal<any>>;

  const el = () => fixture.nativeElement as HTMLElement;
  const items = () => el().querySelectorAll('.project-change-log__item');
  const toggle = () => el().querySelector('.project-change-log__toggle') as HTMLButtonElement;

  beforeEach(async () => {
    service = {
      getChanges: vi.fn(() =>
        of([change(), change({ id: 'c2', action: 'OTRA', userName: '', details: {} })]),
      ),
    };
    currentProjectId = signal<string | null>('p1');
    generatedProject = signal('# Texto');
    editLockEvent = signal<any>(null);
    language = signal('castellano');
    t = signal<any>(TRANSLATIONS_ES);
    await TestBed.configureTestingModule({
      imports: [ProjectChangeLogComponent],
      providers: [
        { provide: CollaborationService, useValue: service },
        { provide: ProjectsFacade, useValue: { currentProjectId, generatedProject } },
        { provide: NotificationsFacade, useValue: { editLockEvent } },
        { provide: LayoutService, useValue: { language } },
        { provide: TranslationService, useValue: { t } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ProjectChangeLogComponent);
    fixture.detectChanges();
  });

  const open = async () => {
    toggle().click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  it('no carga nada hasta que se despliega', () => {
    expect(service.getChanges).not.toHaveBeenCalled();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('al desplegarse muestra quién cambió el proyecto, qué hizo y cuándo', async () => {
    await open();
    expect(service.getChanges).toHaveBeenCalledWith('p1');
    expect(items().length).toBe(2);
    const first = items()[0].textContent || '';
    expect(first).toContain('Ana');
    expect(first).toContain(TRANSLATIONS_ES.changeActions['AI_REWRITE']);
    expect(first).toContain('Añade evaluación');
    expect(first).toContain('9/10/26');
    expect(items()[1].textContent).toContain('ana@test.com');
    expect(items()[1].textContent).toContain(TRANSLATIONS_ES.changeActionDefault);
  });

  it('se traduce al catalán', async () => {
    language.set('catalan');
    t.set(TRANSLATIONS_CA);
    await open();
    expect(el().textContent).toContain(TRANSLATIONS_CA.changeLogTitle);
    expect(items()[0].textContent).toContain(TRANSLATIONS_CA.changeActions['AI_REWRITE']);
  });

  it('se recarga al editar, al cambiar el turno y con el botón actualizar', async () => {
    await open();
    generatedProject.set('# Otro');
    fixture.detectChanges();
    editLockEvent.set({ projectId: 'p1', lock: null });
    fixture.detectChanges();
    (el().querySelector('.project-change-log__refresh') as HTMLButtonElement).click();
    expect(service.getChanges).toHaveBeenCalledTimes(4);
  });

  it('muestra el estado vacío, ignora la carga sin proyecto y registra errores', async () => {
    service.getChanges.mockReturnValueOnce(of([]));
    await open();
    expect(el().textContent).toContain(TRANSLATIONS_ES.changeLogEmpty);

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    service.getChanges.mockReturnValueOnce(throwError(() => new Error('red')));
    fixture.componentInstance.load();
    expect(errorSpy).toHaveBeenCalled();
    expect(fixture.componentInstance.isLoading()).toBe(false);
    errorSpy.mockRestore();

    currentProjectId.set(null);
    fixture.detectChanges();
    expect(service.getChanges).toHaveBeenCalledTimes(2);

    toggle().click();
    fixture.detectChanges();
    expect(items().length).toBe(0);
  });
});
