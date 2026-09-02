import { TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { TelemetryService } from "./telemetry.service";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("TelemetryService", () => {
  let service: TelemetryService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TelemetryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TelemetryService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    service.stopTracking(false);
    httpTestingController.verify();
  });

  it("should be created and manage session id", () => {
    expect(service).toBeTruthy();
    service.setCurrentPage("mapa");
  });

  it("should start and stop tracking with flush and timer tick", () => {
    vi.useFakeTimers();
    service.startTracking();
    // Second call should be no-op
    service.startTracking();

    vi.advanceTimersByTime(60000);
    const reqTimer = httpTestingController.expectOne("/api/telemetry/heartbeat");
    reqTimer.flush({ ok: true, durationSeconds: 60 });
    vi.useRealTimers();

    service.flushHeartbeat();
    const req = httpTestingController.expectOne("/api/telemetry/heartbeat");
    expect(req.request.method).toBe("POST");
    expect(req.request.body.sessionId).toBeDefined();
    req.flush({ ok: true, durationSeconds: 60 });

    service.stopTracking(true);
    const reqStop = httpTestingController.expectOne("/api/telemetry/heartbeat");
    expect(reqStop.request.body.isClosing).toBe(true);
    reqStop.flush({ ok: true, durationSeconds: 60 });
  });

  it("should log custom events", () => {
    service.logEvent("EXPORT_PDF", "proj-1", { format: "A4" }).subscribe(res => {
      expect(res.ok).toBe(true);
    });

    const req = httpTestingController.expectOne("/api/telemetry/event");
    expect(req.request.method).toBe("POST");
    expect(req.request.body.action).toBe("EXPORT_PDF");
    req.flush({ ok: true });
  });

  it("should handle error when flushing heartbeat without throwing", () => {
    service.flushHeartbeat();
    const req = httpTestingController.expectOne("/api/telemetry/heartbeat");
    req.error(new ProgressEvent("error"));
  });

  it("should handle visibility change events", () => {
    service.startTracking();

    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    const reqHidden = httpTestingController.expectOne("/api/telemetry/heartbeat");
    reqHidden.flush({ ok: true, durationSeconds: 60 });

    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));

    service.stopTracking(false);
  });

  it("should handle beforeunload with sendBeacon if token exists", () => {
    localStorage.setItem("token", "test-token");
    const beaconSpy = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "sendBeacon", { value: beaconSpy, configurable: true });

    service.flushHeartbeat(true);
    expect(beaconSpy).toHaveBeenCalled();
    localStorage.removeItem("token");
  });

  it("should handle beforeunload window event directly", () => {
    service.startTracking();
    window.dispatchEvent(new Event("beforeunload"));
    const req = httpTestingController.expectOne("/api/telemetry/heartbeat");
    req.flush({ ok: true, durationSeconds: 60 });
    service.stopTracking(false);
  });
});