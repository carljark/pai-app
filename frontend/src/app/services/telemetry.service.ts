import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface HeartbeatPayload {
  sessionId: string;
  activeSeconds: number;
  currentPage: string;
  isClosing: boolean;
}

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private http = inject(HttpClient);

  private sessionId: string;
  private lastActiveTimestamp: number = Date.now();
  private accumulatedActiveSeconds = 0;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private isTracking = false;
  private currentPage = 'home';

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.initVisibilityListener();
  }

  private getOrCreateSessionId(): string {
    const existing = sessionStorage.getItem('plappin_session_id');
    if (existing) return existing;
    const sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('plappin_session_id', sid);
    return sid;
  }

  startTracking() {
    if (this.isTracking) return;
    this.isTracking = true;
    this.lastActiveTimestamp = Date.now();

    this.heartbeatInterval = setInterval(() => {
      this.flushHeartbeat();
    }, 60000);

    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  stopTracking(flush = false) {
    if (!this.isTracking) return;
    if (flush) this.flushHeartbeat(true);
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    this.isTracking = false;
  }

  setCurrentPage(page: string) {
    this.currentPage = page;
  }

  private initVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.updateActiveSeconds();
        this.flushHeartbeat();
      } else {
        this.lastActiveTimestamp = Date.now();
      }
    });
  }

  private updateActiveSeconds() {
    const now = Date.now();
    if (document.visibilityState === 'visible') {
      const diffSec = Math.max(
        0,
        Math.min(300, Math.round((now - this.lastActiveTimestamp) / 1000)),
      );
      this.accumulatedActiveSeconds += diffSec;
    }
    this.lastActiveTimestamp = now;
  }

  flushHeartbeat(isClosing = false) {
    this.updateActiveSeconds();
    const activeSec = this.accumulatedActiveSeconds;
    this.accumulatedActiveSeconds = 0;

    const payload: HeartbeatPayload = {
      sessionId: this.sessionId,
      activeSeconds: activeSec,
      currentPage: this.currentPage,
      isClosing,
    };
    if (this.sendBeaconOnClose(payload)) return;

    this.http
      .post<{ ok: boolean; durationSeconds: number }>('/api/telemetry/heartbeat', payload)
      .subscribe({
        error: () => {
          // Re-accumulate if failed
          this.accumulatedActiveSeconds += activeSec;
        },
      });
  }

  /** Al cerrar la pestaña, `sendBeacon` sobrevive al unload; solo se usa con sesión iniciada. */
  private sendBeaconOnClose(payload: HeartbeatPayload): boolean {
    if (!payload.isClosing || typeof navigator === 'undefined' || !navigator.sendBeacon) {
      return false;
    }
    const token = localStorage.getItem('pai_token') || localStorage.getItem('token');
    if (!token) return false;
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon('/api/telemetry/heartbeat', blob);
    return true;
  }

  logEvent(action: string, projectId?: string, details?: Record<string, unknown>) {
    return this.http.post<{ ok: boolean }>('/api/telemetry/event', {
      action,
      projectId,
      details,
    });
  }

  private onBeforeUnload = () => {
    this.flushHeartbeat(true);
  };
}
