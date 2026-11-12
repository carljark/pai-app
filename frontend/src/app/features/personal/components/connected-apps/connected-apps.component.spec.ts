import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConnectedAppsComponent } from './connected-apps.component';
import { OAuthConsentService } from '../../../oauth/services/oauth-consent.service';
import { TranslationService } from '../../../../services/translation.service';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';

const grants = [
  { _id: 'g1', clientName: 'Claude', createdAt: '2026-11-12', lastUsedAt: null },
  { _id: 'g2', clientName: 'Otro', createdAt: '2026-11-12', lastUsedAt: '2026-11-12T10:00:00Z' },
];

describe('ConnectedAppsComponent', () => {
  let fixture: ComponentFixture<ConnectedAppsComponent>;
  let service: any;

  const el = () => fixture.nativeElement as HTMLElement;
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const create = async () => {
    fixture = TestBed.createComponent(ConnectedAppsComponent);
    fixture.componentRef.setInput('serverUrl', 'https://plappin.org/api/mcp');
    await render();
  };

  beforeEach(async () => {
    service = {
      listGrants: vi.fn(() => of(grants)),
      revokeGrant: vi.fn(() => of({})),
    };
    await TestBed.configureTestingModule({
      imports: [ConnectedAppsComponent],
      providers: [
        { provide: OAuthConsentService, useValue: service },
        { provide: TranslationService, useValue: { t: signal(TRANSLATIONS_ES) } },
      ],
    }).compileComponents();
  });

  it('lista las aplicaciones y muestra la URL para claude.ai', async () => {
    await create();
    const items = el().querySelectorAll('.connected-apps__item');
    expect(items).toHaveLength(2);
    expect(items[0]!.textContent).toContain(TRANSLATIONS_ES.aiConnectionNever);
    expect(el().querySelector('.connected-apps__url')?.textContent).toBe(
      'https://plappin.org/api/mcp',
    );
  });

  it('desconecta una aplicación', async () => {
    await create();
    (el().querySelector('.connected-apps__disconnect') as HTMLButtonElement).click();
    await render();
    expect(service.revokeGrant).toHaveBeenCalledWith('g1');
    expect(el().querySelectorAll('.connected-apps__item')).toHaveLength(1);
  });

  it('sin aplicaciones muestra cómo conectar y avisa de los errores', async () => {
    service.listGrants.mockReturnValue(of([]));
    await create();
    expect(el().textContent).toContain(TRANSLATIONS_ES.connectedAppsEmpty);

    service.listGrants.mockReturnValue(throwError(() => new Error('500')));
    await create();
    expect(el().querySelector('[role="alert"]')).not.toBeNull();

    service.listGrants.mockReturnValue(of(grants));
    service.revokeGrant.mockReturnValue(throwError(() => new Error('500')));
    await create();
    fixture.componentInstance.disconnect('g1');
    expect(fixture.componentInstance.error()).toBe(true);
  });
});
