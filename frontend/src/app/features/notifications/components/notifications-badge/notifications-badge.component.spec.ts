import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsBadgeComponent } from './notifications-badge.component';
import { NotificationsFacade } from '../../services/notifications.facade';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('NotificationsBadgeComponent', () => {
  let component: NotificationsBadgeComponent;
  let fixture: ComponentFixture<NotificationsBadgeComponent>;
  let facadeMock: any;

  beforeEach(async () => {
    facadeMock = {
      notifications: signal([]),
      markAllAsRead: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [NotificationsBadgeComponent],
      providers: [
        { provide: NotificationsFacade, useValue: facadeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsBadgeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('projects', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate unreadCount correctly', () => {
    facadeMock.notifications.set([
      { read: false, type: 'COMPLETED' },
      { read: true, type: 'COMPLETED' },
      { read: false, type: 'INFO' }
    ]);
    expect(component.unreadCount()).toBe(1);
  });

  it('should calculate activeCount correctly', () => {
    fixture.componentRef.setInput('projects', [
      { status: 'en_cola' },
      { status: 'generando' },
      { status: 'completado' }
    ]);
    expect(component.activeCount()).toBe(2);
  });

  it('should filter recentProjects correctly', () => {
    const now = new Date();
    const old = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    
    fixture.componentRef.setInput('projects', [
      { _id: '1', status: 'en_cola', createdAt: old.toISOString() },
      { _id: '2', status: 'completado', createdAt: old.toISOString() },
      { _id: '3', status: 'completado', createdAt: now.toISOString() }
    ]);

    expect(component.recentProjects().length).toBe(2);
  });

  it('should open modal and mark as read when openNotifications is called', () => {
    component.openNotifications();
    expect(component.isOpen()).toBe(true);
    expect(facadeMock.markAllAsRead).toHaveBeenCalled();
  });
});
