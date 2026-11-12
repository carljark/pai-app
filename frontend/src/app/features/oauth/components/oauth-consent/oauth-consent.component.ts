import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import { LayoutService } from '../../../../services/layout.service';
import { parseViewRoute } from '../../../../services/view-route';
import {
  OAuthAuthorizationRequest,
  OAuthConsentService,
} from '../../services/oauth-consent.service';

/** Navegación fuera de la aplicación (vuelta al asistente); aislada para poder simularla en los tests. */
export const redirectTo = {
  go: (url: string): void => window.location.assign(url),
};

/**
 * Pantalla de consentimiento OAuth: un asistente (p. ej. claude.ai) pide usar la cuenta de Plappin
 * por MCP. Al aceptar o rechazar, se vuelve al asistente con el código o con `access_denied`.
 */
@Component({
  selector: 'app-oauth-consent',
  standalone: true,
  templateUrl: './oauth-consent.component.html',
  styleUrl: './oauth-consent.component.scss',
})
export class OAuthConsentComponent implements OnInit {
  trans = inject(TranslationService);
  private layout = inject(LayoutService);
  private service = inject(OAuthConsentService);

  request = signal<OAuthAuthorizationRequest | null>(null);
  status = signal<'loading' | 'ready' | 'invalid' | 'sending' | 'error'>('loading');
  private requestId = parseViewRoute(window.location.search)?.request ?? '';

  ngOnInit(): void {
    if (!this.requestId) {
      this.status.set('invalid');
      return;
    }
    this.service.getRequest(this.requestId).subscribe({
      next: (request) => {
        this.request.set(request);
        this.status.set('ready');
      },
      error: () => this.status.set('invalid'),
    });
  }

  answer(approve: boolean): void {
    this.status.set('sending');
    this.service.answer(this.requestId, approve).subscribe({
      next: ({ redirectUrl }) => redirectTo.go(redirectUrl),
      error: () => this.status.set('error'),
    });
  }

  goHome(): void {
    this.layout.switchView('home');
  }
}
