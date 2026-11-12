import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../../services/translation.service';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { ApiTokensService } from '../../services/api-tokens.service';
import { ConnectedAppsComponent } from '../connected-apps/connected-apps.component';
import {
  MCP_CLIENTS,
  McpClientId,
  TOKEN_PLACEHOLDER,
  mcpClientConfig,
  mcpServerUrl,
} from '../../utils/mcp-client-config';

/**
 * Área Personal → Conectar con IA: tokens personales para usar Plappin desde Claude, Gemini u
 * otros asistentes compatibles con MCP, e instrucciones de configuración de cada uno.
 */
@Component({
  selector: 'app-ai-connection',
  standalone: true,
  imports: [FormsModule, DatePipe, ConnectedAppsComponent],
  templateUrl: './ai-connection.component.html',
  styleUrl: './ai-connection.component.scss',
})
export class AiConnectionComponent implements OnInit {
  trans = inject(TranslationService);
  tokens = inject(ApiTokensService);
  private auth = inject(AuthFacade);

  readonly clients = MCP_CLIENTS;
  readonly serverUrl = mcpServerUrl(window.location.origin);

  newName = signal('');
  /** Token recién creado: solo se puede ver (y copiar) ahora. */
  createdToken = signal<string | null>(null);
  selectedClient = signal<McpClientId>('claudeCode');
  confirmingRevoke = signal<string | null>(null);
  copied = signal(false);
  error = signal(false);

  /** Las cuentas pendientes de aprobación no pueden crear tokens. */
  canCreate = computed(() => this.auth.currentUser()?.role !== 'pending');

  config = computed(() =>
    mcpClientConfig(
      this.selectedClient(),
      this.serverUrl,
      this.createdToken() ?? TOKEN_PLACEHOLDER,
    ),
  );

  /** Aclaración del asistente elegido (LibreChat, otro cliente…), si la tiene. */
  clientNote = computed(
    () => this.trans.t().aiConnectionClientNotes?.[this.selectedClient()] ?? null,
  );

  ngOnInit(): void {
    this.tokens.load().subscribe({ error: () => this.error.set(true) });
  }

  create(): void {
    const name = this.newName().trim();
    if (!name) return;
    this.error.set(false);
    this.tokens.create(name).subscribe({
      next: (created) => {
        this.createdToken.set(created.token);
        this.newName.set('');
      },
      error: () => this.error.set(true),
    });
  }

  /** Primer clic: pide confirmación; segundo clic: revoca. */
  revoke(id: string): void {
    if (this.confirmingRevoke() !== id) {
      this.confirmingRevoke.set(id);
      return;
    }
    this.confirmingRevoke.set(null);
    this.tokens.revoke(id).subscribe({ error: () => this.error.set(true) });
  }

  async copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(true);
    } catch {
      this.copied.set(false);
    }
  }

  clientLabel(id: McpClientId): string {
    return this.trans.t().aiConnectionClients?.[id] ?? id;
  }
}
