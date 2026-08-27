import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsBadgeComponent } from './notifications-badge.component';
import { NotificationsFacade } from '../../services/notifications.facade';
import { ComponentRef, signal } from '@angular/core';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('NotificationsBadgeComponent', () => {
  let component: NotificationsBadgeComponent;
  let fixture: ComponentFixture<NotificationsBadgeComponent>;
  let componentRef: ComponentRef<NotificationsBadgeComponent>;
  let notificationsFacadeMock: any;

  beforeEach(async () => {
    notificationsFacadeMock = {
      notifications: signal([]),
      markAllAsRead: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [NotificationsBadgeComponent],
      providers: [
        { provide: NotificationsFacade, useValue: notificationsFacadeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsBadgeComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    
    componentRef.setInput('projects', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute activeCount based on projects', () => {
    componentRef.setInput('projects', [
      { status: 'en_cola' },
      { status: 'generando' },
      { status: 'completado' }
    ]);
    fixture.detectChanges();
    expect(component.activeCount()).toBe(2);
  });

  it('should compute unreadCount based on notifications facade', () => {
    notificationsFacadeMock.notifications.set([
      { read: false, type: 'COMPLETED' },
      { read: true, type: 'COMPLETED' },
      { read: false, type: 'ERROR' }
    ]);
    fixture.detectChanges();
    expect(component.unreadCount()).toBe(1);
  });

  it('should open notifications modal and mark as read', () => {
    component.openNotifications();
    expect(component.isOpen()).toBe(true);
    expect(notificationsFacadeMock.markAllAsRead).toHaveBeenCalled();
  });

  it('should render correct text and styles when open', () => {
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 2); 
    
    const projects = [
      { _id: '1', status: 'en_cola', modules: ['RA1'], createdAt: pastDate.toISOString() },
      { _id: '2', status: 'generando', createdAt: pastDate.toISOString() },
      { _id: '3', status: 'error', modules: ['RA3'], createdAt: pastDate.toISOString() },
      { _id: '4', status: 'completado', createdAt: pastDate.toISOString() }
    ];
    
    componentRef.setInput('projects', projects);
    component.openNotifications();
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('RA1');
    expect(compiled.textContent).toContain('Múltiples RA/CE');
    expect(compiled.textContent).toContain('En cola...');
    expect(compiled.textContent).toContain('Generando IA...');
    expect(compiled.textContent).toContain('Error');
    expect(compiled.textContent).toContain('Completado');
  });

  it('should close modal on backdrop or close button click', () => {
    component.isOpen.set(true);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const backdrop = compiled.querySelector('div[style*="rgba(0,0,0,0.5)"]') as HTMLElement;
    
    backdrop.click();
    expect(component.isOpen()).toBe(false);
  });
});
