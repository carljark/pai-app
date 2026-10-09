import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EditLockFacade } from './edit-lock.facade';
import { CollaborationService } from './collaboration.service';
import { ProjectsFacade } from './projects.facade';
import { AuthFacade } from '../../auth/services/auth.facade';
import { LayoutService } from '../../../services/layout.service';
import { NotificationsFacade } from '../../notifications/services/notifications.facade';
import { EditLock, EditLockEvent } from '../models/collaboration.model';

const lockOf = (userId: string, remainingMs = 60_000): EditLock => ({
  userId,
  userName: userId === 'me' ? 'Yo' : 'Ana',
  expiresAt: new Date(Date.now() + remainingMs).toISOString(),
  remainingMs,
});

const conflict = (lock: EditLock | null) =>
  new HttpErrorResponse({ status: 409, error: lock ? { lock } : {} });

describe('EditLockFacade', () => {
  let facade: EditLockFacade;
  let service: any;
  let currentProjectId: ReturnType<typeof signal<string | null>>;
  let currentProject: ReturnType<typeof signal<any>>;
  let currentUser: ReturnType<typeof signal<any>>;
  let currentView: ReturnType<typeof signal<string>>;
  let editLockEvent: ReturnType<typeof signal<EditLockEvent | null>>;

  const project = (overrides: object = {}) => ({
    _id: 'p1',
    userId: 'me',
    collaborators: [{ userId: { _id: 'ana', name: 'Ana' } }],
    ...overrides,
  });

  beforeEach(() => {
    service = {
      getEditLock: vi.fn(() => of({ lock: null })),
      takeEditLock: vi.fn(() => of({ lock: lockOf('me') })),
      releaseEditLock: vi.fn(() => of({ released: true })),
      releaseOnUnload: vi.fn(),
    };
    currentProjectId = signal<string | null>('p1');
    currentProject = signal<any>(project());
    currentUser = signal<any>({ _id: 'me', name: 'Yo', email: 'yo@test.com' });
    currentView = signal('taller');
    editLockEvent = signal<EditLockEvent | null>(null);
    TestBed.configureTestingModule({
      providers: [
        EditLockFacade,
        { provide: CollaborationService, useValue: service },
        { provide: ProjectsFacade, useValue: { currentProjectId, currentProject } },
        { provide: AuthFacade, useValue: { currentUser } },
        { provide: LayoutService, useValue: { currentView } },
        { provide: NotificationsFacade, useValue: { editLockEvent } },
      ],
    });
    facade = TestBed.inject(EditLockFacade);
    TestBed.flushEffects();
  });

  afterEach(() => vi.useRealTimers());

  it('consulta el turno del proyecto abierto en el taller', () => {
    expect(service.getEditLock).toHaveBeenCalledWith('p1');
    expect(facade.lock()).toBeNull();
    expect(facade.blocked()).toBe(false);
  });

  it('bloquea la IA y los cambios cuando otra persona tiene el turno', () => {
    service.getEditLock.mockReturnValueOnce(of({ lock: lockOf('ana') }));
    facade.refresh();

    expect(facade.lockedByOther()).toBe(true);
    expect(facade.holderName()).toBe('Ana');
    expect(facade.blocked()).toBe(true);
    facade.touch();
    expect(service.takeEditLock).not.toHaveBeenCalled();
  });

  it('el proyecto es de solo lectura para quien no es autor ni colaborador', () => {
    currentUser.set({ _id: 'otro' });
    expect(facade.readOnly()).toBe(true);
    expect(facade.blocked()).toBe(true);

    currentUser.set({ _id: 'otro', role: 'admin' });
    expect(facade.readOnly()).toBe(false);
    currentUser.set({ id: 'ana' });
    expect(facade.canEdit()).toBe(true);
    currentProject.set(undefined);
    expect(facade.readOnly()).toBe(false);
  });

  it('al escribir toma el turno y lo renueva como mucho cada 30 s', () => {
    facade.touch();
    expect(service.takeEditLock).toHaveBeenCalledTimes(1);
    expect(facade.hasLock()).toBe(true);

    facade.touch();
    expect(service.takeEditLock).toHaveBeenCalledTimes(1);
  });

  it('si otro tomó el turno antes, refleja el 409 sin bloquear la interfaz con errores', () => {
    service.takeEditLock.mockReturnValueOnce(throwError(() => conflict(lockOf('ana'))));
    facade.touch();
    expect(facade.lockedByOther()).toBe(true);

    service.getEditLock.mockReturnValueOnce(of({ lock: lockOf('ana') }));
    expect(facade.handleConflict(conflict(null))).toBe(true);
    expect(service.getEditLock).toHaveBeenCalledTimes(2);
    expect(facade.handleConflict(new HttpErrorResponse({ status: 500 }))).toBe(false);
    expect(facade.handleConflict(undefined)).toBe(false);
  });

  it('libera el turno propio al salir del taller y al cambiar de proyecto', () => {
    facade.touch();
    currentView.set('history');
    TestBed.flushEffects();
    expect(service.releaseEditLock).toHaveBeenCalledWith('p1');
    expect(facade.lock()).toBeNull();

    currentView.set('taller');
    TestBed.flushEffects();
    facade.touch();
    currentProjectId.set('p2');
    TestBed.flushEffects();
    expect(service.releaseEditLock).toHaveBeenCalledTimes(2);
    expect(service.getEditLock).toHaveBeenLastCalledWith('p2');
  });

  it('no libera nada si el turno no es propio y registra los errores HTTP', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    facade.release();
    expect(service.releaseEditLock).not.toHaveBeenCalled();

    facade.touch();
    service.releaseEditLock.mockReturnValueOnce(throwError(() => new Error('red')));
    facade.release();
    service.getEditLock.mockReturnValueOnce(throwError(() => new Error('red')));
    facade.refresh();
    expect(errorSpy).toHaveBeenCalledTimes(2);
    errorSpy.mockRestore();
  });

  it('aplica los eventos SSE solo del proyecto vigilado', () => {
    editLockEvent.set({ projectId: 'otro', lock: lockOf('ana') });
    TestBed.flushEffects();
    expect(facade.lock()).toBeNull();

    editLockEvent.set({ projectId: 'p1', lock: lockOf('ana') });
    TestBed.flushEffects();
    expect(facade.lockedByOther()).toBe(true);
  });

  it('ignora respuestas de un proyecto que ya no está abierto', () => {
    service.getEditLock.mockReturnValueOnce(of({ lock: lockOf('ana') }));
    currentView.set('home');
    TestBed.flushEffects();
    expect(facade.lock()).toBeNull();
    facade.refresh();
    facade.touch();
    expect(service.takeEditLock).not.toHaveBeenCalled();
  });

  it('al caducar el turno ajeno vuelve a consultarlo', () => {
    vi.useFakeTimers();
    service.getEditLock.mockReturnValueOnce(of({ lock: lockOf('ana', 1000) }));
    facade.refresh();
    expect(facade.lockedByOther()).toBe(true);

    vi.advanceTimersByTime(1000);
    expect(facade.lockedByOther()).toBe(false);
    expect(service.getEditLock).toHaveBeenCalledTimes(3);
  });

  it('al cerrar la pestaña libera el turno propio con keepalive', () => {
    window.dispatchEvent(new Event('pagehide'));
    expect(service.releaseOnUnload).not.toHaveBeenCalled();

    facade.touch();
    window.dispatchEvent(new Event('pagehide'));
    expect(service.releaseOnUnload).toHaveBeenCalledWith('p1');
  });
});
