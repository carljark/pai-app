import { TestBed } from '@angular/core/testing';
import { NotificationsFacade } from './notifications.facade';
import { AuthFacade } from '../../../features/auth/services/auth.facade';
import { PaiService } from '../../../services/pai.service';
import { Subject } from 'rxjs';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('NotificationsFacade', () => {
  let facade: NotificationsFacade;
  let authFacadeMock: any;
  let paiServiceMock: any;
  let updatesSubject: Subject<any>;

  beforeEach(() => {
    updatesSubject = new Subject();
    authFacadeMock = {
      currentUser: signal(null)
    };
    paiServiceMock = {
      listenToProjectUpdates: vi.fn(() => updatesSubject.asObservable())
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationsFacade,
        { provide: AuthFacade, useValue: authFacadeMock },
        { provide: PaiService, useValue: paiServiceMock }
      ]
    });
  });

  it('should initialize and not subscribe if user is null', () => {
    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
    TestBed.flushEffects();
    expect(paiServiceMock.listenToProjectUpdates).not.toHaveBeenCalled();
  });

  it('should subscribe when user becomes available', () => {
    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
    
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    expect(paiServiceMock.listenToProjectUpdates).toHaveBeenCalled();
  });

  it('should add notification when event received', () => {
    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    updatesSubject.next({ type: 'PROJECT_COMPLETED', projectId: '1' });

    expect(facade.notifications().length).toBe(1);
    expect(facade.latestNotification()?.type).toBe('COMPLETED');
    expect(facade.notifications()[0].read).toBe(false);
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
    const id = facade.notifications()[0].id;
    
    facade.markAsRead(id);
    expect(facade.notifications()[0].read).toBe(true);
  });

  it('markAllAsRead should set read to true for all notifications', () => {
    TestBed.runInInjectionContext(() => {
      facade = new NotificationsFacade();
    });
    authFacadeMock.currentUser.set({ _id: '1' });
    TestBed.flushEffects();

    updatesSubject.next({ type: 'PROJECT_COMPLETED', projectId: '1' });
    updatesSubject.next({ type: 'PROJECT_STATUS', projectId: '1', status: 'generando' });
    
    facade.markAllAsRead();
    expect(facade.notifications().every(n => n.read)).toBe(true);
  });
});
