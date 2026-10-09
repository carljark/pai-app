/**
 * Edit Lock Facade (Application Layer)
 * Turno de edición del proyecto abierto en el taller: mientras otra persona lo tiene, la IA y
 * los cambios quedan bloqueados; quien no es autor ni colaborador solo puede leer.
 */

import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthFacade } from '../../auth/services/auth.facade';
import { LayoutService } from '../../../services/layout.service';
import { NotificationsFacade } from '../../notifications/services/notifications.facade';
import { ProjectsFacade } from './projects.facade';
import { CollaborationService } from './collaboration.service';
import { EDIT_LOCK_RENEW_MS, EditLock, EditLockEvent } from '../models/collaboration.model';
import { canEditProject } from '../utils/project-access';

@Injectable({ providedIn: 'root' })
export class EditLockFacade {
  private service = inject(CollaborationService);
  private projects = inject(ProjectsFacade);
  private auth = inject(AuthFacade);
  private layout = inject(LayoutService);
  private notifications = inject(NotificationsFacade);

  /** Turno vigente del proyecto vigilado (el abierto en el taller). */
  lock = signal<EditLock | null>(null);
  private watchedId: string | null = null;
  private lastRenewAt = 0;
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;

  private myId = computed(() => this.auth.currentUser()?._id || this.auth.currentUser()?.id);
  canEdit = computed(() => canEditProject(this.projects.currentProject(), this.auth.currentUser()));
  readOnly = computed(() => Boolean(this.projects.currentProject()) && !this.canEdit());
  lockedByOther = computed(() => {
    const lock = this.lock();
    return Boolean(lock) && lock!.userId !== this.myId();
  });
  hasLock = computed(() => Boolean(this.lock()) && !this.lockedByOther());
  holderName = computed(() => (this.lockedByOther() ? this.lock()!.userName : ''));
  /** La IA y los cambios están deshabilitados (solo lectura o turno de otra persona). */
  blocked = computed(() => this.readOnly() || this.lockedByOther());

  constructor() {
    effect(() => {
      const inTaller = this.layout.currentView() === 'taller';
      const id = inTaller ? this.projects.currentProjectId() : null;
      untracked(() => this.watch(id));
    });
    effect(() => {
      const event = this.notifications.editLockEvent();
      if (event) untracked(() => this.onLockEvent(event));
    });
    if (typeof window !== 'undefined') {
      window.addEventListener('pagehide', () => this.releaseOnUnload());
    }
  }

  /** Actividad de edición (escribir en el asistente IA): toma o renueva el turno. */
  touch(): void {
    const id = this.watchedId;
    if (!id || this.blocked()) return;
    if (this.hasLock() && Date.now() - this.lastRenewAt < EDIT_LOCK_RENEW_MS) return;
    this.lastRenewAt = Date.now();
    this.service.takeEditLock(id).subscribe({
      next: (res) => this.applyIfWatched(id, res.lock),
      error: (err: HttpErrorResponse) => this.handleConflict(err),
    });
  }

  /** Si la petición falló porque otra persona tiene el turno, lo refleja y devuelve `true`. */
  handleConflict(err: HttpErrorResponse | null | undefined): boolean {
    if (err?.status !== 409) return false;
    this.lastRenewAt = 0;
    const lock = (err.error as { lock?: EditLock } | null)?.lock ?? null;
    this.setLock(lock);
    if (!lock) this.refresh();
    return true;
  }

  /** Libera el turno si es propio (al salir del taller o cambiar de proyecto). */
  release(): void {
    const id = this.watchedId;
    if (!id || !this.hasLock()) return;
    this.lastRenewAt = 0;
    this.setLock(null);
    this.service.releaseEditLock(id).subscribe({
      error: (err) => console.error('Error al liberar el turno de edición', err),
    });
  }

  refresh(): void {
    const id = this.watchedId;
    if (!id) return;
    this.service.getEditLock(id).subscribe({
      next: (res) => this.applyIfWatched(id, res.lock),
      error: (err) => console.error('Error al consultar el turno de edición', err),
    });
  }

  private watch(id: string | null): void {
    if (id === this.watchedId) return;
    this.release();
    this.watchedId = id;
    this.setLock(null);
    this.refresh();
  }

  private releaseOnUnload(): void {
    if (this.watchedId && this.hasLock()) this.service.releaseOnUnload(this.watchedId);
  }

  private onLockEvent(event: EditLockEvent): void {
    if (event.projectId === this.watchedId) this.setLock(event.lock);
  }

  private applyIfWatched(id: string, lock: EditLock | null): void {
    if (id === this.watchedId) this.setLock(lock);
  }

  /** Guarda el turno y programa su caducidad con el tiempo restante que indica el servidor. */
  private setLock(lock: EditLock | null): void {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    this.expiryTimer = null;
    this.lock.set(lock);
    if (lock) this.expiryTimer = setTimeout(() => this.onExpired(), lock.remainingMs);
  }

  private onExpired(): void {
    this.expiryTimer = null;
    this.lock.set(null);
    this.refresh();
  }
}
