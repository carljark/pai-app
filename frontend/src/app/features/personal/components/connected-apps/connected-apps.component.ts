import { Component, OnInit, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslationService } from '../../../../services/translation.service';
import { OAuthConsentService, OAuthGrant } from '../../../oauth/services/oauth-consent.service';

/**
 * Aplicaciones conectadas por OAuth (p. ej. el conector de claude.ai) e instrucciones para añadir
 * Plappin como conector personalizado. Desconectar invalida sus tokens al momento.
 */
@Component({
  selector: 'app-connected-apps',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './connected-apps.component.html',
  styleUrl: './connected-apps.component.scss',
})
export class ConnectedAppsComponent implements OnInit {
  trans = inject(TranslationService);
  private service = inject(OAuthConsentService);

  /** URL del servidor MCP que se pega en claude.ai. */
  serverUrl = input.required<string>();

  grants = signal<OAuthGrant[]>([]);
  error = signal(false);

  ngOnInit(): void {
    this.service.listGrants().subscribe({
      next: (list) => this.grants.set(list),
      error: () => this.error.set(true),
    });
  }

  disconnect(id: string): void {
    this.service.revokeGrant(id).subscribe({
      next: () => this.grants.update((list) => list.filter((g) => g._id !== id)),
      error: () => this.error.set(true),
    });
  }
}
