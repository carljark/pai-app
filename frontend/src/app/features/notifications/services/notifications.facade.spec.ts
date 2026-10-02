import { TestBed } from '@angular/core/testing';
import { NotificationsFacade } from './notifications.facade';
import { AuthFacade } from '../../../features/auth/services/auth.facade';
import { PaiService } from '../../../services/pai.service';
import { HttpClient } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('NotificationsFacade', () => {
  let facade: NotificationsFacade;
  let authFacadeMock: any;
  let paiServiceMock: any;
  let httpMock: any;
  let updatesSubject: Subject<any>;

  beforeEach(() => {
    updatesSubject = new Subject();
    authFacadeMock = {
      currentUser: signal<any>(null)
    };
    paiServiceMock = {
      listenToProjectUpdates: vi.fn(() => updatesSubject.asObservable())
    };
    httpMock = {
      get: vi.fn(() => of([])),
      post: vi.fn(() => of({ success: true }))
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationsFacade,
        { provide: AuthFacade, useValue: authFacadeMock },
        { provide: PaiService, useValue: paiServiceMock },
        { provide: HttpClient, useValue: httpMock }
      ]
    });

    facade = TestBed.inject(NotificationsFacade);
  });

  it('should initialize and not subscribe if user is null', () => {
    TestBed.flushEffects();
    expect(paiServiceMock.listenToProjectUpdates).not.toHaveBeenCalled();
    expect(httpMock.get).not.toHaveBeenCalled();
  });

  it('should subscribe and load notifications when user becomes available', () => {
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    expect(paiServiceMock.listenToProjectUpdates).toHaveBeenCalled();
    expect(httpMock.get).toHaveBeenCalledWith('/api/notifications');
  });

  it('loadNotifications should populate notifications from DB and handle error', () => {
    const mockItems = [{ _id: 'n1', title: 'Notif DB', status: 'borrador', type: 'PROJECT_COMPLETED' }];
    httpMock.get.mockReturnValueOnce(of(mockItems));

    facade.loadNotifications();
    expect(facade.notifications().length).toBe(1);
    expect(facade.notifications()[0].title).toBe('Notif DB');

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    httpMock.get.mockReturnValueOnce(throwError(() => new Error('Network error')));
    facade.loadNotifications();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();

    httpMock.get.mockReturnValueOnce(of(null));
    authFacadeMock.currentUser.set(null);
    facade.loadNotifications();
    expect(facade.notifications()).toEqual([]);
  });

  it('handleSseEvent should update existing notification and sort by date', () => {
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    updatesSubject.next({ type: 'PROJECT_STATUS', projectId: 'p1', status: 'en_cola' });
    updatesSubject.next({ type: 'PROJECT_STATUS', projectId: 'p2', status: 'en_cola' });
    expect(facade.notifications().length).toBe(2);

    updatesSubject.next({
      type: 'PROJECT_STATUS',
      projectId: 'p1',
      status: 'generando',
      notification: { _id: 'n1', projectId: 'p1', updatedAt: new Date(Date.now() + 10000) }
    });
    expect(facade.notifications().length).toBe(2);
    expect(facade.notifications()[0].projectId).toBe('p1');

    updatesSubject.next({
      type: 'PROJECT_STATUS',
      projectId: 'p2',
      status: 'generando',
      notification: { _id: 'n2', projectId: 'p2' }
    });
    expect(facade.notifications().length).toBe(2);

    updatesSubject.next({ type: 'OTHER_EVENT', message: 'No project' });
    expect(facade.notifications().length).toBe(2);
  });

  it('should resync notifications from the database on SSE reconnect (CONNECTED)', () => {
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();
    httpMock.get.mockClear();
    httpMock.get.mockReturnValueOnce(of([
      { _id: 'n9', projectId: 'p9', status: 'borrador', type: 'PROJECT_COMPLETED' }
    ]));

    updatesSubject.next({ type: 'CONNECTED' });

    expect(httpMock.get).toHaveBeenCalledWith('/api/notifications');
    expect(facade.notifications().length).toBe(1);
    expect(facade.notifications()[0].projectId).toBe('p9');
  });

  it('should keep notifications received by SSE while a load request is in flight', () => {
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    const inFlight = new Subject<any[]>();
    httpMock.get.mockReturnValueOnce(inFlight.asObservable());

    facade.loadNotifications();

    updatesSubject.next({ type: 'PROJECT_STATUS', projectId: 'new', status: 'generando' });
    expect(facade.notifications().some(n => n.projectId === 'new')).toBe(true);

    inFlight.next([{ _id: 'old', projectId: 'old', status: 'borrador', type: 'PROJECT_COMPLETED' }]);
    inFlight.complete();

    const ids = facade.notifications().map(n => n.projectId);
    expect(ids).toContain('new');
    expect(ids).toContain('old');
  });

  it('should prefer a newer in-memory notification over a stale snapshot', () => {
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    facade.notifications.set([{
      _id: 'n', projectId: 'p', status: 'borrador',
      updatedAt: new Date(Date.now() - 10000), timestamp: new Date(Date.now() - 10000)
    } as any]);

    httpMock.get.mockReturnValueOnce(of([{
      _id: 'n', projectId: 'p', status: 'generando', type: 'PROJECT_STATUS',
      updatedAt: new Date(Date.now() - 20000).toISOString()
    }]));
    facade.loadNotifications();

    const item = facade.notifications().find(n => n.projectId === 'p');
    expect(item?.status).toBe('borrador');
  });

  it('should clear notifications and unsubscribe on logout', () => {
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    updatesSubject.next({ type: 'PROJECT_COMPLETED', projectId: '1' });
    expect(facade.notifications().length).toBe(1);

    authFacadeMock.currentUser.set(null);
    TestBed.flushEffects();

    expect(facade.notifications().length).toBe(0);
    expect(facade.latestNotification()).toBeNull();
  });

  it('markAsRead should set read to true for specific notification', () => {
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    updatesSubject.next({ type: 'PROJECT_COMPLETED', projectId: '1' });
    updatesSubject.next({ type: 'PROJECT_COMPLETED', projectId: '2' });
    const id = facade.notifications()[0].id;
    
    facade.markAsRead(id);
    expect(facade.notifications()[0].read).toBe(true);
    expect(facade.notifications()[1].read).toBe(false);
  });

  it('markAllAsRead should set read to true for all and call backend', () => {
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    updatesSubject.next({ type: 'PROJECT_COMPLETED', projectId: '1' });
    
    facade.markAllAsRead();
    expect(facade.notifications().every(n => n.read)).toBe(true);
    expect(httpMock.post).toHaveBeenCalledWith('/api/notifications/read-all', {});

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    httpMock.post.mockReturnValueOnce(throwError(() => new Error('Post error')));
    facade.markAllAsRead();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle SSE error in facade', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    updatesSubject.error('Test SSE Error');
    expect(consoleSpy).toHaveBeenCalledWith('SSE Error in facade', 'Test SSE Error');
    consoleSpy.mockRestore();
  });

  it('should not re-subscribe if already subscribed', () => {
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();
    expect(paiServiceMock.listenToProjectUpdates).toHaveBeenCalledTimes(1);

    authFacadeMock.currentUser.set({ _id: '2' });
    TestBed.flushEffects();
    expect(paiServiceMock.listenToProjectUpdates).toHaveBeenCalledTimes(1);
  });

  it('clearLatestNotification should set latestNotification to null', () => {
    facade.latestNotification.set({ type: 'COMPLETED' } as any);
    expect(facade.latestNotification()).toBeTruthy();

    facade.clearLatestNotification();
    expect(facade.latestNotification()).toBeNull();
  });

  it('loadNotifications should filter items by projectId or known status', () => {
    httpMock.get.mockReturnValueOnce(of([
      { _id: 'a', projectId: 'p1' },
      { _id: 'b', status: 'generando' },
      { _id: 'c', status: 'desconocido' },
      { _id: 'd' }
    ]));

    facade.loadNotifications();

    const ids = facade.notifications().map(n => n.id);
    expect(ids).toContain('a');
    expect(ids).toContain('b');
    expect(ids).not.toContain('c');
    expect(ids).not.toContain('d');
    expect(ids.length).toBe(2);
  });

  it('handleSseEvent should accept events whose only projectId is inside the notification', () => {
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    updatesSubject.next({
      type: 'PROJECT_STATUS',
      notification: { _id: 'n5', projectId: 'p5', status: 'generando' }
    });

    expect(facade.notifications().some(n => n.projectId === 'p5')).toBe(true);
    expect(facade.latestNotification()?.projectId).toBe('p5');
  });

  it('handleSseEvent should handle a missing current user id', () => {
    (facade as any).handleSseEvent({ type: 'PROJECT_STATUS', projectId: 'p7', status: 'en_cola' });

    expect(facade.notifications().some(n => n.projectId === 'p7')).toBe(true);
  });

  it('mergeNotification should prepend notifications without projectId', () => {
    const result = (facade as any).mergeNotification([], { id: 'x' });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('x');
  });

  it('openRecentActivity should resync, open and mark all as read; closeRecentActivity should close', () => {
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();
    httpMock.get.mockClear();

    facade.openRecentActivity();

    expect(httpMock.get).toHaveBeenCalledWith('/api/notifications');
    expect(facade.recentActivityOpen()).toBe(true);
    expect(httpMock.post).toHaveBeenCalledWith('/api/notifications/read-all', {});

    facade.closeRecentActivity();
    expect(facade.recentActivityOpen()).toBe(false);
  });

  it('should reload notifications when the tab becomes visible and there is a user', () => {
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();
    httpMock.get.mockClear();

    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(httpMock.get).toHaveBeenCalledWith('/api/notifications');
  });

  it('should not reload notifications when the tab is hidden or there is no user', () => {
    TestBed.flushEffects();
    httpMock.get.mockClear();

    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(httpMock.get).not.toHaveBeenCalled();

    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(httpMock.get).not.toHaveBeenCalled();
  });

  it('should construct without a document (SSR-safe)', () => {
    vi.stubGlobal('document', undefined);
    try {
      expect(() => TestBed.runInInjectionContext(() => new NotificationsFacade())).not.toThrow();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

