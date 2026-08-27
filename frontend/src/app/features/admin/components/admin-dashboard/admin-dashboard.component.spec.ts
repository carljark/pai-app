import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminFacade } from '../../services/admin.facade';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let mockFacade: any;

  beforeEach(async () => {
    mockFacade = {
      users: signal([{ _id: '1', name: 'Test User', email: 'test@test.com', role: 'pending', canUseAi: false, createdAt: new Date() }]),
      settings: signal({ name: 'School A', educationalLevel: 'City A', context: 'Context A' }),
      logs: signal([{ _id: '1', action: 'LOGIN', createdAt: new Date(), userId: { name: 'Admin', email: 'admin@test.com' }, details: { generationTimeMs: 1000 } }]),
      loadUsers: vi.fn(),
      loadSettings: vi.fn(),
      loadLogs: vi.fn(),
      updateUserRole: vi.fn().mockReturnValue(of({})),
      updateUserAi: vi.fn().mockReturnValue(of({})),
      saveSettings: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: AdminFacade, useValue: mockFacade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  it('should cover component methods directly', () => {
    // approveUser
    component.approveUser('1');
    expect(mockFacade.updateUserRole).toHaveBeenCalledWith('1', 'teacher');
    expect(mockFacade.loadUsers).toHaveBeenCalled();

    // toggleAiAccess
    component.toggleAiAccess('2', false);
    expect(mockFacade.updateUserAi).toHaveBeenCalledWith('2', true);
    
    // saveSettings next
    component.schoolSettings.set({ schoolName: 'A', schoolCity: 'B', schoolContext: 'C' });
    const ev = new Event('submit');
    vi.useFakeTimers(); component.saveSettings(ev); vi.runAllTimers(); vi.useRealTimers();
    expect(mockFacade.saveSettings).toHaveBeenCalled();
  });

  
  it('should handle saveSettings error', () => {
    mockFacade.saveSettings.mockReturnValue(throwError(() => new Error('err')));
    component.saveSettings(new Event('submit'));
    expect(component.saveSuccess()).toBe(false);
  });

  
  it('should trigger ALL HTML events safely', () => {
    mockFacade.users.set([
      { _id: '1', role: 'pending', canUseAi: false },
      { _id: '2', role: 'teacher', canUseAi: true }
    ]);
    mockFacade.logs.set([{ _id: '1', action: 'test', projectId: { title: 'T' }, details: { generationTimeMs: 1000, error: 'err' } }]);
    fixture.detectChanges();
    
    // Form buttons and inputs
    component.schoolSettings.set({ schoolName: 'A', schoolCity: 'B', schoolContext: 'C' });
    fixture.detectChanges();
    
    const form = fixture.debugElement.nativeElement.querySelector('form');
    if (form) form.dispatchEvent(new Event('submit'));
    
    const inputs = fixture.debugElement.nativeElement.querySelectorAll('input');
    inputs.forEach((i: any) => i.dispatchEvent(new Event('ngModelChange')));
    
    const textareas = fixture.debugElement.nativeElement.querySelectorAll('textarea');
    textareas.forEach((t: any) => t.dispatchEvent(new Event('ngModelChange')));

    // All buttons
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('button');
    buttons.forEach((b: any) => b.click());
  });

  it('should create and load initial data', () => {
    expect(component).toBeTruthy();
    expect(mockFacade.loadUsers).toHaveBeenCalled();
    expect(mockFacade.loadSettings).toHaveBeenCalled();
    expect(mockFacade.loadLogs).toHaveBeenCalled();
  });

  it('should reflect settings in form', () => {
    // The effect in constructor sets the signal
    fixture.detectChanges(); 
    expect(component.schoolSettings().schoolName).toBe('School A');
    expect(component.schoolSettings().schoolCity).toBe('City A');
    expect(component.schoolSettings().schoolContext).toBe('Context A');
  });

  it('should save settings successfully', () => {
    const event = new Event('submit');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    
    component.schoolSettings.set({ schoolName: 'New School', schoolCity: 'New City', schoolContext: 'New Context' });
    component.saveSettings(event);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(component.isSavingSettings()).toBe(false);
    expect(component.saveSuccess()).toBe(true);
    expect(mockFacade.saveSettings).toHaveBeenCalledWith({
      name: 'New School',
      educationalLevel: 'New City',
      context: 'New Context'
    });
  });

  it('should handle save settings error', () => {
    mockFacade.saveSettings.mockReturnValueOnce(throwError(() => new Error('Error')));
    const event = new Event('submit');
    
    component.saveSettings(event);
    
    expect(component.isSavingSettings()).toBe(false);
    expect(component.saveSuccess()).toBe(false);
  });

  it('should approve user', () => {
    component.approveUser('1');
    expect(mockFacade.updateUserRole).toHaveBeenCalledWith('1', 'teacher');
    expect(mockFacade.loadUsers).toHaveBeenCalled();
  });

  it('should toggle AI access', () => {
    component.toggleAiAccess('1', false);
    expect(mockFacade.updateUserAi).toHaveBeenCalledWith('1', true);
    expect(mockFacade.loadUsers).toHaveBeenCalled();
  });

  it('should render users', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test User');
    expect(compiled.textContent).toContain('Aprobar (Hacer Profesor)');
    expect(compiled.textContent).toContain('Activar IA');
  });

  it('should render logs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Admin');
    expect(compiled.textContent).toContain('LOGIN');
    expect(compiled.textContent).toContain('1.0s');
  });
});
