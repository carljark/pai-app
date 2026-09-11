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
  });

  it('should initialize and not subscribe if user is null', () => {
    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
    TestBed.flushEffects();
    expect(paiServiceMock.listenToProjectUpdates).not.toHaveBeenCalled();
    expect(httpMock.get).not.toHaveBeenCalled();
  });

  it('should subscribe and load notifications when user becomes available', () => {
    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    expect(paiServiceMock.listenToProjectUpdates).toHaveBeenCalled();
    expect(httpMock.get).toHaveBeenCalledWith('/api/notifications');
  });

  it('loadNotifications should populate notifications from DB and handle error', () => {
    const mockItems = [{ _id: 'n1', title: 'Notif DB', status: 'borrador', type: 'PROJECT_COMPLETED' }];
    httpMock.get.mockReturnValueOnce(of(mockItems));

    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
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
    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
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

    updatesSubject.next({ type: 'CONNECTED' });
    expect(facade.notifications().length).toBe(3);

    authFacadeMock.currentUser.set(null);
    updatesSubject.next({ type: 'PROJECT_STATUS', projectId: 'p3' });
    expect(facade.notifications().length).toBe(4);
  });



  it('should clear notifications and unsubscribe on logout', () => {
    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
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
    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
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
    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
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
    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    updatesSubject.error('Test SSE Error');
    expect(consoleSpy).toHaveBeenCalledWith('SSE Error in facade', 'Test SSE Error');
    consoleSpy.mockRestore();
  });

  it('should not re-subscribe if already subscribed', () => {
    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();
    expect(paiServiceMock.listenToProjectUpdates).toHaveBeenCalledTimes(1);

    authFacadeMock.currentUser.set({ _id: '2' });
    TestBed.flushEffects();
    expect(paiServiceMock.listenToProjectUpdates).toHaveBeenCalledTimes(1);
  });
});

