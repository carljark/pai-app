import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AdminFacade } from './admin.facade';
import { AdminUser, CenterSettings, ActivityLog } from '../models/admin.model';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('AdminFacade', () => {
  let facade: AdminFacade;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminFacade,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    facade = TestBed.inject(AdminFacade);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should load users', () => {
    const mockUsers: AdminUser[] = [{ _id: '1', name: 'User 1', email: 'user@test.com', role: 'admin', canUseAi: true, createdAt: new Date().toISOString() }];
    facade.loadUsers();
    
    const req = httpTestingController.expectOne('/api/admin/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
    
    expect(facade.users()).toEqual(mockUsers);
  });

  it('should load settings', () => {
    const mockSettings: CenterSettings = { name: 'School', educationalLevel: 'Secondary', context: 'Urban' };
    facade.loadSettings();
    
    const req = httpTestingController.expectOne('/api/settings');
    expect(req.request.method).toBe('GET');
    req.flush(mockSettings);
    
    expect(facade.settings()).toEqual(mockSettings);
  });

  it('should load logs', () => {
    const mockLogs: ActivityLog[] = [{ _id: '1', userId: { _id: 'u1', name: 'User', email: 'a@a.com'}, action: 'LOGIN', details: {}, createdAt: new Date().toISOString() }];
    facade.loadLogs();
    
    const req = httpTestingController.expectOne('/api/admin/logs');
    expect(req.request.method).toBe('GET');
    req.flush(mockLogs);
    
    expect(facade.logs()).toEqual(mockLogs);
  });

  it('should update user role and reload users', () => {
    const mockUsers: AdminUser[] = [];
    facade.updateUserRole('1', 'teacher').subscribe();
    
    const reqUpdate = httpTestingController.expectOne('/api/admin/users/1/role');
    expect(reqUpdate.request.method).toBe('PUT');
    expect(reqUpdate.request.body).toEqual({ role: 'teacher' });
    reqUpdate.flush({});
    
    const reqLoad = httpTestingController.expectOne('/api/admin/users');
    reqLoad.flush(mockUsers);
  });

  it('should update user AI permission and reload users', () => {
    facade.updateUserAi('1', true).subscribe();
    
    const reqUpdate = httpTestingController.expectOne('/api/admin/users/1/ai');
    expect(reqUpdate.request.method).toBe('PUT');
    expect(reqUpdate.request.body).toEqual({ canUseAi: true });
    reqUpdate.flush({});
    
    const reqLoad = httpTestingController.expectOne('/api/admin/users');
    reqLoad.flush([]);
  });

  it('should delete user and reload users', () => {
    facade.deleteUser('1').subscribe();
    
    const reqDelete = httpTestingController.expectOne('/api/admin/users/1');
    expect(reqDelete.request.method).toBe('DELETE');
    reqDelete.flush({});
    
    const reqLoad = httpTestingController.expectOne('/api/admin/users');
    reqLoad.flush([]);
  });

  it('should save settings and reload settings', () => {
    const mockSettings: CenterSettings = { name: 'School', educationalLevel: 'Secondary', context: 'Urban' };
    facade.saveSettings(mockSettings).subscribe();
    
    const reqSave = httpTestingController.expectOne('/api/settings');
    expect(reqSave.request.method).toBe('PUT');
    expect(reqSave.request.body).toEqual(mockSettings);
    reqSave.flush({});
    
    const reqLoad = httpTestingController.expectOne('/api/settings');
    reqLoad.flush(mockSettings);
  });

  it('should load analytics data and handle error without throw', () => {
    facade.loadAnalytics();
    const req = httpTestingController.expectOne('/api/admin/analytics');
    expect(req.request.method).toBe('GET');
    req.flush({
      summary: { totalUsageSeconds: 120, totalSessions: 2, totalDocxExports: 1, totalPdfExports: 0, totalProjectsGenerated: 1, totalUsers: 2 },
      userMetrics: [],
      exportTimeline: []
    });
    expect(facade.analyticsData()?.summary.totalUsageSeconds).toBe(120);

    // Error case
    facade.loadAnalytics();
    const reqErr = httpTestingController.expectOne('/api/admin/analytics');
    reqErr.error(new ProgressEvent('error'));
  });

  it('should format duration nicely', () => {
    expect(facade.formatDuration(0)).toBe('0s');
    expect(facade.formatDuration(45)).toBe('45s');
    expect(facade.formatDuration(75)).toBe('1m 15s');
    expect(facade.formatDuration(3665)).toBe('1h 1m');
  });
});
