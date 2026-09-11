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
      analyticsData: signal({
        summary: { totalUsageSeconds: 3600, totalSessions: 5, totalDocxExports: 3, totalPdfExports: 2, totalProjectsGenerated: 4, totalUsers: 3 },
        userMetrics: [{ userId: '1', name: 'Test User', email: 'test@test.com', role: 'teacher', canUseAi: true, createdAt: new Date().toISOString(), totalDurationSeconds: 1200, sessionCount: 2, lastActive: new Date().toISOString(), docxExportsCount: 2, pdfExportsCount: 1, projectsGeneratedCount: 3 }],
        exportTimeline: [{ _id: '1', action: 'EXPORT_DOCX', createdAt: new Date().toISOString(), userId: { _id: '1', name: 'Test User', email: 'test@test.com' }, projectId: { _id: 'p1', title: 'Test Project' } }]
      }),
      loadUsers: vi.fn(),
      loadSettings: vi.fn(),
      loadLogs: vi.fn(),
      loadAnalytics: vi.fn(),
      formatDuration: vi.fn().mockImplementation((s: number) => `${s}s`),
      updateUserRole: vi.fn().mockReturnValue(of({})),
      updateUserAi: vi.fn().mockReturnValue(of({})),
      deleteUser: vi.fn().mockReturnValue(of({})),
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

    // changeRole
    component.changeRole('1', 'admin');
    expect(mockFacade.updateUserRole).toHaveBeenCalledWith('1', 'admin');

    // deleteUser
    component.deleteUser('1');
    expect(mockFacade.deleteUser).toHaveBeenCalledWith('1');

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
      { _id: '2', role: 'teacher', canUseAi: true },
      { _id: '3', role: 'admin', canUseAi: false }
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
  });

  it('should toggle AI access', () => {
    component.toggleAiAccess('1', false);
    expect(mockFacade.updateUserAi).toHaveBeenCalledWith('1', true);
  });

  it('should render users', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test User');
    expect(compiled.textContent).toContain('Aprobar (Profesor)');
    expect(compiled.textContent).toContain('Activar IA');
  });

  it('should render analytics data and handle null/empty analytics states', () => {
    // 1. With analytics data (Word and PDF items)
    mockFacade.analyticsData.set({
      summary: { totalUsageSeconds: 3600, totalSessions: 5, totalDocxExports: 3, totalPdfExports: 2, totalProjectsGenerated: 4, totalUsers: 3 },
      userMetrics: [
        { userId: '1', name: 'Test User', email: 'test@test.com', role: 'teacher', canUseAi: true, createdAt: new Date().toISOString(), totalDurationSeconds: 1200, sessionCount: 2, lastActive: '', docxExportsCount: 2, pdfExportsCount: 1, projectsGeneratedCount: 3 }
      ],
      exportTimeline: [
        { _id: '1', action: 'EXPORT_DOCX', createdAt: new Date().toISOString(), userId: { _id: '1', name: 'Test User', email: 'test@test.com' }, projectId: { _id: 'p1', title: 'Test Project' } },
        { _id: '2', action: 'EXPORT_PDF', createdAt: new Date().toISOString(), userId: { _id: '1', name: 'Test User', email: 'test@test.com' }, details: { projectTitle: 'Detalle' } }
      ]
    });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Analítica y Métricas de Uso');
    expect(compiled.textContent).toContain('WORD (.docx)');
    expect(compiled.textContent).toContain('PDF');

    // 2. Empty timeline
    mockFacade.analyticsData.set({
      summary: { totalUsageSeconds: 0, totalSessions: 0, totalDocxExports: 0, totalPdfExports: 0, totalProjectsGenerated: 0, totalUsers: 0 },
      userMetrics: [],
      exportTimeline: []
    });
    fixture.detectChanges();
    expect(compiled.textContent).toContain('No hay exportaciones registradas');

    // 3. Null analyticsData
    mockFacade.analyticsData.set(null);
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Cargando analíticas');
  });

  it('should render logs and AI model information covering all branches', () => {
    mockFacade.logs.set([
      {
        _id: '1',
        action: 'GENERATE_PROJECT',
        createdAt: new Date(),
        userId: { name: 'Admin', email: 'admin@test.com' },
        projectId: { title: 'Proyecto Con Titulo' },
        details: {
          generationTimeMs: 1500,
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          provider: 'openrouter',
          fallbackUsed: true
        }
      },
      {
        _id: '2',
        action: 'GENERATE_PROJECT',
        createdAt: new Date(),
        userId: null,
        projectId: {
          title: 'Proyecto 2',
          usedModel: 'gemini-3.6-flash',
          usedAiProvider: 'gemini'
        },
        details: {
          generationTimeMs: 2000
        }
      },
      {
        _id: '3',
        action: 'GENERATE_PROJECT',
        createdAt: new Date(),
        userId: { name: 'Profesor', email: 'profe@test.com' },
        projectId: null,
        details: {
          title: 'Proyecto Detalle Fallido',
          error: 'Error de cuota agotada'
        }
      },
      {
        _id: '4',
        action: 'CUSTOM',
        createdAt: new Date(),
        projectId: { usedModel: 'custom-ai-engine' }
      }
    ]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Admin');
    expect(compiled.textContent).toContain('Desconocido');
    expect(compiled.textContent).toContain('N/A');
    expect(compiled.textContent).toContain('GENERATE_PROJECT');
    expect(compiled.textContent).toContain('Proyecto Con Titulo');
    expect(compiled.textContent).toContain('Proyecto Detalle Fallido');
    expect(compiled.textContent).toContain('1.5s');
    expect(compiled.textContent).toContain('meta-llama/llama-3.3-70b-instruct:free');
    expect(compiled.textContent).toContain('Secundario');
    expect(compiled.textContent).toContain('Fallback');
    expect(compiled.textContent).toContain('gemini-3.6-flash');
    expect(compiled.textContent).toContain('Primario');
    expect(compiled.textContent).toContain('custom-ai-engine');
    expect(compiled.textContent).toContain('Error: Error de cuota agotada');
  });

  it('getLogModel and getLogProviderLabel should handle all branches', () => {
    // details.model
    expect(component.getLogModel({ details: { model: 'exact-model' } })).toBe('exact-model');
    // projectId.usedModel
    expect(component.getLogModel({ projectId: { usedModel: 'proj-model' } })).toBe('proj-model');
    // provider openrouter in details and in projectId
    expect(component.getLogModel({ details: { provider: 'openrouter' } })).toBe('openrouter/free');
    expect(component.getLogModel({ projectId: { usedAiProvider: 'openrouter' } })).toBe('openrouter/free');
    // provider gemini in details and in projectId
    expect(component.getLogModel({ details: { provider: 'gemini' } })).toBe('gemini-3.6-flash');
    expect(component.getLogModel({ projectId: { usedAiProvider: 'gemini' } })).toBe('gemini-3.6-flash');
    // null / other
    expect(component.getLogModel({ details: { provider: 'other' } })).toBeNull();
    expect(component.getLogModel({})).toBeNull();

    // getLogProviderLabel
    expect(component.getLogProviderLabel({ details: { provider: 'openrouter' } })).toBe('Secundario');
    expect(component.getLogProviderLabel({ projectId: { usedAiProvider: 'openrouter' } })).toBe('Secundario');
    expect(component.getLogProviderLabel({ details: { provider: 'gemini' } })).toBe('Primario');
    expect(component.getLogProviderLabel({ projectId: { usedAiProvider: 'gemini' } })).toBe('Primario');
    expect(component.getLogProviderLabel({ details: { provider: 'other' } })).toBeNull();
    expect(component.getLogProviderLabel({})).toBeNull();
  });
});
