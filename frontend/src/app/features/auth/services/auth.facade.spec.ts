import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthFacade } from './auth.facade';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthFacade]
    });
    facade = TestBed.inject(AuthFacade);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should initialize with currentUser as null if no localStorage', () => {
    expect(facade.currentUser()).toBeNull();
  });

  it('should load user from localStorage on init', () => {
    const user = { _id: '123', name: 'John', email: 'j@t.com', role: 'admin', canUseAi: true };
    localStorage.setItem('pai_user', JSON.stringify(user));
    
    TestBed.runInInjectionContext(() => {
      const newFacade = new AuthFacade();
      expect(newFacade.currentUser()).toEqual(user);
    });
  });

  it('login should post credentials and update state on success', () => {
    const mockRes = {
      token: 'fake-token',
      user: { _id: '1', name: 'John', email: 'j@t.com', role: 'admin', canUseAi: true }
    };
    const creds = { email: 'j@t.com', password: 'pw' };

    facade.login(creds).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(creds);
    req.flush(mockRes);

    expect(localStorage.getItem('pai_token')).toBe('fake-token');
    expect(localStorage.getItem('pai_user')).toBeTruthy();
    expect(facade.currentUser()).toEqual(mockRes.user);
  });

  it('login should handle response without token gracefully', () => {
    const mockRes = {
      user: { _id: '1', name: 'John', email: 'j@t.com', role: 'admin', canUseAi: true }
    };
    const creds = { email: 'j@t.com', password: 'pw' };

    facade.login(creds).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    req.flush(mockRes);

    expect(localStorage.getItem('pai_token')).toBeNull();
  });

  it('register should post data', () => {
    const mockRes = { token: 't', user: { _id: '1' } as any };
    const regData = { email: 'j@t.com', password: 'pw', name: 'John' };

    facade.register(regData).subscribe();

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(regData);
    req.flush(mockRes);
  });

  it('logout should clear localStorage and state', () => {
    localStorage.setItem('pai_token', 't');
    localStorage.setItem('pai_user', '{}');
    facade.currentUser.set({ _id: '1' } as any);

    facade.logout();

    expect(localStorage.getItem('pai_token')).toBeNull();
    expect(localStorage.getItem('pai_user')).toBeNull();
    expect(facade.currentUser()).toBeNull();
  });

  it('isAuthenticated should return true if token exists', () => {
    expect(facade.isAuthenticated()).toBe(false);
    localStorage.setItem('pai_token', 't');
    expect(facade.isAuthenticated()).toBe(true);
  });
});
