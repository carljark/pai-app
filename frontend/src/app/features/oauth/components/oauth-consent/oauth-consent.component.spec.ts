import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OAuthConsentComponent, redirectTo } from './oauth-consent.component';
import { OAuthConsentService } from '../../services/oauth-consent.service';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';
import { TRANSLATIONS_CA } from '../../../../services/translations.ca';

const request = { clientName: 'Claude', clientUri: null, redirectHost: 'claude.ai', scopes: [] };

describe('OAuthConsentComponent', () => {
  let fixture: ComponentFixture<OAuthConsentComponent>;
  let service: any;
  let layout: { switchView: ReturnType<typeof vi.fn> };
  let t: ReturnType<typeof signal<any>>;
  let go: ReturnType<typeof vi.spyOn>;

  const el = () => fixture.nativeElement as HTMLElement;
  const query = (selector: string) => el().querySelector(selector) as HTMLElement | null;

  const create = async (search = '?view=oauth-consent&request=r1') => {
    window.history.replaceState(null, '', `/${search}`);
    fixture = TestBed.createComponent(OAuthConsentComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    service = {
      getRequest: vi.fn(() => of(request)),
      answer: vi.fn(() => of({ redirectUrl: 'https://claude.ai/api/mcp/auth_callback?code=c' })),
    };
    layout = { switchView: vi.fn() };
    t = signal(TRANSLATIONS_ES);
    go = vi.spyOn(redirectTo, 'go').mockImplementation(() => {});
    await TestBed.configureTestingModule({
      imports: [OAuthConsentComponent],
      providers: [
        { provide: OAuthConsentService, useValue: service },
        { provide: LayoutService, useValue: layout },
        { provide: TranslationService, useValue: { t } },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    go.mockRestore();
    window.history.replaceState(null, '', '/');
  });

  it('muestra el cliente, su dominio y los permisos', async () => {
    await create();
    expect(service.getRequest).toHaveBeenCalledWith('r1');
    expect(query('.oauth-consent__title')?.textContent).toContain(
      '¿Permitir que Claude use tu cuenta de Plappin?',
    );
    expect(query('.oauth-consent__host')?.textContent).toContain('claude.ai');
    expect(el().querySelectorAll('.oauth-consent__item')).toHaveLength(
      TRANSLATIONS_ES.oauthPermissions.length,
    );
  });

  it('al autorizar o cancelar vuelve al asistente con la URL del backend', async () => {
    await create();
    query('.oauth-consent__approve')!.click();
    expect(service.answer).toHaveBeenCalledWith('r1', true);
    expect(go).toHaveBeenCalledWith('https://claude.ai/api/mcp/auth_callback?code=c');

    query('.oauth-consent__deny')!.click();
    expect(service.answer).toHaveBeenLastCalledWith('r1', false);
  });

  it('muestra el error si falla la respuesta', async () => {
    service.answer.mockReturnValue(throwError(() => new Error('500')));
    await create();
    query('.oauth-consent__approve')!.click();
    fixture.detectChanges();
    expect(query('[role="alert"]')?.textContent).toContain(TRANSLATIONS_ES.oauthError);
    expect(go).not.toHaveBeenCalled();
  });

  it('sin petición o con una caducada ofrece volver al inicio', async () => {
    await create('?view=oauth-consent');
    expect(service.getRequest).not.toHaveBeenCalled();
    expect(el().textContent).toContain(TRANSLATIONS_ES.oauthInvalidTitle);
    (query('.btn-primary') as HTMLButtonElement).click();
    expect(layout.switchView).toHaveBeenCalledWith('home');

    service.getRequest.mockReturnValue(throwError(() => new Error('404')));
    await create();
    expect(el().textContent).toContain(TRANSLATIONS_ES.oauthInvalidText);
  });

  it('desactiva los botones mientras envía y no pinta nada sin petición cargada', async () => {
    service.answer.mockReturnValue(of());
    await create();
    query('.oauth-consent__approve')!.click();
    fixture.detectChanges();
    expect((query('.oauth-consent__approve') as HTMLButtonElement).disabled).toBe(true);
    expect((query('.oauth-consent__deny') as HTMLButtonElement).disabled).toBe(true);

    fixture.componentInstance.request.set(null);
    fixture.detectChanges();
    expect(query('.oauth-consent__approve')).toBeNull();
  });

  it('redirectTo.go navega con window.location', () => {
    go.mockRestore();
    redirectTo.go('#vuelta');
    expect(window.location.hash).toBe('#vuelta');
    go = vi.spyOn(redirectTo, 'go').mockImplementation(() => {});
  });

  it('se muestra en catalán y mientras carga', async () => {
    t.set(TRANSLATIONS_CA);
    service.getRequest.mockReturnValue(of());
    await create();
    expect(el().textContent).toContain(TRANSLATIONS_CA.loadingData);
  });
});
