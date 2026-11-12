import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AiConnectionComponent } from './ai-connection.component';
import { ApiTokensService } from '../../services/api-tokens.service';
import { TranslationService } from '../../../../services/translation.service';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { OAuthConsentService } from '../../../oauth/services/oauth-consent.service';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';

const token = {
  _id: 't1',
  name: 'Claude',
  prefix: 'plp_abcdef',
  createdAt: '2026-11-12',
  lastUsedAt: null as string | null,
};

describe('AiConnectionComponent', () => {
  let fixture: ComponentFixture<AiConnectionComponent>;
  let service: any;
  let currentUser: ReturnType<typeof signal<any>>;
  let writeText: ReturnType<typeof vi.fn>;

  const el = () => fixture.nativeElement as HTMLElement;
  const query = (selector: string) => el().querySelector(selector) as HTMLElement | null;
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const typeName = async (value: string) => {
    const input = query('.ai-connection__input') as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await render();
  };
  const submit = async () => {
    query('form')!.dispatchEvent(new Event('submit'));
    await render();
  };

  beforeEach(async () => {
    currentUser = signal<any>({ role: 'teacher' });
    service = {
      tokens: signal<any[]>([token, { ...token, _id: 't2', lastUsedAt: '2026-11-12T10:00:00Z' }]),
      load: vi.fn(() => of([])),
      create: vi.fn(() => of({ ...token, _id: 't3', token: 'plp_secreto' })),
      revoke: vi.fn(() => of({})),
    };
    writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    await TestBed.configureTestingModule({
      imports: [AiConnectionComponent],
      providers: [
        { provide: ApiTokensService, useValue: service },
        { provide: TranslationService, useValue: { t: signal(TRANSLATIONS_ES) } },
        { provide: AuthFacade, useValue: { currentUser } },
        { provide: OAuthConsentService, useValue: { listGrants: () => of([]) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AiConnectionComponent);
    await render();
  });

  afterEach(() => vi.restoreAllMocks());

  it('carga los tokens y muestra su último uso', () => {
    expect(service.load).toHaveBeenCalled();
    const items = el().querySelectorAll('.ai-connection__item');
    expect(items).toHaveLength(2);
    expect(items[0]!.textContent).toContain(TRANSLATIONS_ES.aiConnectionNever);
    expect(items[1]!.textContent).not.toContain(TRANSLATIONS_ES.aiConnectionNever);
  });

  it('crea un token, lo muestra una vez y lo usa en la configuración', async () => {
    await submit();
    expect(service.create).not.toHaveBeenCalled();

    await typeName('  Gemini  ');
    await submit();
    expect(service.create).toHaveBeenCalledWith('Gemini');
    expect(query('.ai-connection__token')?.textContent).toBe('plp_secreto');
    expect(query('.ai-connection__config')?.textContent).toContain('Bearer plp_secreto');

    (query('.ai-connection__copy-row button') as HTMLButtonElement).click();
    await new Promise((resolve) => setTimeout(resolve));
    await render();
    expect(writeText).toHaveBeenCalledWith('plp_secreto');
    expect(query('.ai-connection__copy-row button')?.textContent).toContain(
      TRANSLATIONS_ES.aiConnectionCopied,
    );
  });

  it('cambia de asistente y copia su configuración', async () => {
    expect(query('.ai-connection__config')?.textContent).toContain('claude mcp add');
    const tabs = el().querySelectorAll<HTMLButtonElement>('.ai-connection__tab');
    tabs[2]!.click();
    await render();
    expect(query('.ai-connection__tab--active')?.textContent).toContain('Gemini CLI');
    expect(query('.ai-connection__config')?.textContent).toContain('httpUrl');
    (query('.ai-connection__copy-config') as HTMLButtonElement).click();
    await render();
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('plp_TU_TOKEN'));
    expect(query('.ai-connection__client-note')).toBeNull();
  });

  it('explica cómo usar LibreChat u otro cliente MCP con DeepSeek o Gemini', async () => {
    const tabs = el().querySelectorAll<HTMLButtonElement>('.ai-connection__tab');
    expect(tabs).toHaveLength(5);
    tabs[4]!.click();
    await render();
    expect(query('.ai-connection__tab--active')?.textContent).toContain('Otro cliente MCP');
    expect(query('.ai-connection__client-note')?.textContent).toContain('DeepSeek');
    expect(query('.ai-connection__config')?.textContent).toContain('Streamable HTTP');
    tabs[3]!.click();
    await render();
    expect(query('.ai-connection__config')?.textContent).toContain('type: streamable-http');
  });

  it('pide confirmación antes de revocar', async () => {
    const revoke = () => (query('.ai-connection__revoke') as HTMLButtonElement).click();
    revoke();
    await render();
    expect(service.revoke).not.toHaveBeenCalled();
    expect(query('.ai-connection__revoke')?.textContent).toContain(
      TRANSLATIONS_ES.aiConnectionConfirmRevoke,
    );
    revoke();
    await render();
    expect(service.revoke).toHaveBeenCalledWith('t1');
  });

  it('muestra los errores y no permite crear tokens a cuentas pendientes', async () => {
    service.create.mockReturnValue(throwError(() => new Error('409')));
    await typeName('X');
    await submit();
    expect(query('[role="alert"]')?.textContent).toContain(TRANSLATIONS_ES.aiConnectionError);

    service.revoke.mockReturnValue(throwError(() => new Error('500')));
    fixture.componentInstance.error.set(false);
    fixture.componentInstance.revoke('t1');
    fixture.componentInstance.revoke('t1');
    expect(fixture.componentInstance.error()).toBe(true);

    currentUser.set({ role: 'pending' });
    await render();
    expect(query('form')).toBeNull();
  });

  it('marca el error si no se pueden cargar los tokens o copiar', async () => {
    service.load.mockReturnValue(throwError(() => new Error('500')));
    fixture.componentInstance.ngOnInit();
    expect(fixture.componentInstance.error()).toBe(true);

    writeText.mockRejectedValue(new Error('sin permiso'));
    await fixture.componentInstance.copy('x');
    expect(fixture.componentInstance.copied()).toBe(false);
    expect(fixture.componentInstance.clientLabel('desconocido' as any)).toBe('desconocido');
  });

  it('sin tokens no muestra la lista', async () => {
    service.tokens.set([]);
    await render();
    expect(query('.ai-connection__list')).toBeNull();
  });
});
