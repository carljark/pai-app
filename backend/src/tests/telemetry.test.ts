import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import request from "supertest";
import { app } from "../server";
import { connectDB, closeDB, clearDB } from "./testSetup";
import { createTestUser } from "./testUtils";
import { UserSession } from "../models/UserSession";
import { ActivityLog } from "../models/ActivityLog";
import { Project } from "../models/Project";

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());
beforeEach(async () => await clearDB());

describe("Telemetry and Analytics API", () => {
  it("Debería registrar un nuevo heartbeat de sesión y acumular segundos", async () => {
    const { token } = await createTestUser("teacher", "telemetry@test.com");

    const res1 = await request(app)
      .post("/api/telemetry/heartbeat")
      .set("Authorization", "Bearer " + token)
      .send({ sessionId: "session-123", activeSeconds: 60, currentPage: "generator" });

    expect(res1.status).toBe(200);
    expect(res1.body.ok).toBe(true);
    expect(res1.body.durationSeconds).toBe(60);

    const res2 = await request(app)
      .post("/api/telemetry/heartbeat")
      .set("Authorization", "Bearer " + token)
      .send({ sessionId: "session-123", activeSeconds: 60, currentPage: "mapa", isClosing: true });

    expect(res2.status).toBe(200);
    expect(res2.body.ok).toBe(true);
    expect(res2.body.durationSeconds).toBe(120);

    const session = await UserSession.findOne({ sessionId: "session-123" });
    expect(session).toBeTruthy();
    expect(session?.durationSeconds).toBe(120);
    expect(session?.pagesVisited).toContain("generator");
    expect(session?.pagesVisited).toContain("mapa");
    expect(session?.endTime).toBeDefined();
  });

  it("Debería validar campos obligatorios en heartbeat y event", async () => {
    const { token } = await createTestUser("teacher", "val@test.com");

    const resHb = await request(app)
      .post("/api/telemetry/heartbeat")
      .set("Authorization", "Bearer " + token)
      .send({});
    expect(resHb.status).toBe(400);

    const resEv = await request(app)
      .post("/api/telemetry/event")
      .set("Authorization", "Bearer " + token)
      .send({});
    expect(resEv.status).toBe(400);
  });

  it("Debería registrar un evento personalizado de telemetría", async () => {
    const { token, user } = await createTestUser("teacher", "event@test.com");

    const res = await request(app)
      .post("/api/telemetry/event")
      .set("Authorization", "Bearer " + token)
      .send({ action: "EXPORT_PDF", details: { format: "A4" } });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const log = await ActivityLog.findOne({ userId: user._id, action: "EXPORT_PDF" });
    expect(log).toBeTruthy();
    expect(log?.details.format).toBe("A4");
  });

  it("Debería registrar EXPORT_DOCX automáticamente al exportar a Word", async () => {
    const { token, user } = await createTestUser("teacher", "docx_export@test.com");

    const project = await Project.create({
      userId: user._id,
      title: "Proyecto Exportable",
      status: "publicado",
      generatedContent: { rawText: "# Contenido del proyecto" }
    });

    const res = await request(app)
      .get("/api/projects/" + project._id + "/export-docx")
      .set("Authorization", "Bearer " + token);

    expect(res.status).toBe(200);

    const log = await ActivityLog.findOne({ userId: user._id, action: "EXPORT_DOCX", projectId: project._id });
    expect(log).toBeTruthy();
    expect(log?.details.projectTitle).toBe("Proyecto Exportable");
  });

  it("Debería obtener métricas agregadas de analítica para administradores", async () => {
    const { token: adminToken } = await createTestUser("admin", "admin_analytics@plappin.org");
    const { user: teacherUser } = await createTestUser("teacher", "teacher_analytics@plappin.org");

    await UserSession.create({
      userId: teacherUser._id,
      sessionId: "sess-1",
      startTime: new Date(),
      lastHeartbeat: new Date(),
      durationSeconds: 300
    });

    await ActivityLog.create({
      userId: teacherUser._id,
      action: "EXPORT_DOCX",
      details: { projectTitle: "P1" }
    });

    await ActivityLog.create({
      userId: teacherUser._id,
      action: "GENERATE_PROJECT",
      details: { projectTitle: "P1" }
    });

    const res = await request(app)
      .get("/api/admin/analytics")
      .set("Authorization", "Bearer " + adminToken);

    expect(res.status).toBe(200);
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.totalUsageSeconds).toBe(300);
    expect(res.body.summary.totalDocxExports).toBe(1);
    expect(res.body.summary.totalProjectsGenerated).toBe(1);

    expect(res.body.userMetrics.length).toBeGreaterThanOrEqual(2);
    const teacherMetric = res.body.userMetrics.find((u) => u.userId === teacherUser._id.toString());
    expect(teacherMetric).toBeTruthy();
    expect(teacherMetric?.totalDurationSeconds).toBe(300);
    expect(teacherMetric?.docxExportsCount).toBe(1);

    expect(res.body.exportTimeline.length).toBe(1);
  });

  it("Debería manejar errores 500 en telemetry y admin analytics", async () => {
    const { token } = await createTestUser("admin", "admin_err@plappin.org");

    // 1. Error in heartbeat
    const findOneSpy = vi.spyOn(UserSession, 'findOne').mockRejectedValueOnce(new Error('DB Error'));
    const resHb = await request(app)
      .post("/api/telemetry/heartbeat")
      .set("Authorization", "Bearer " + token)
      .send({ sessionId: "sess-err", activeSeconds: 10 });
    expect(resHb.status).toBe(500);
    findOneSpy.mockRestore();

    // 2. Error in logEvent
    const createSpy = vi.spyOn(ActivityLog, 'create').mockRejectedValueOnce(new Error('DB Error'));
    const resEv = await request(app)
      .post("/api/telemetry/event")
      .set("Authorization", "Bearer " + token)
      .send({ action: "CUSTOM_ACTION" });
    expect(resEv.status).toBe(500);
    createSpy.mockRestore();

    // 3. Error in getAnalytics
    const aggSpy = vi.spyOn(UserSession, 'aggregate').mockRejectedValueOnce(new Error('DB Error'));
    const resAn = await request(app)
      .get("/api/admin/analytics")
      .set("Authorization", "Bearer " + token);
    expect(resAn.status).toBe(500);
    aggSpy.mockRestore();
  });
});