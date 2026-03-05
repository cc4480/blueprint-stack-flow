import { test, expect } from "@playwright/test";
import { getJson, postJson } from "../helpers/api";

test.describe("Analytics & Metrics API", () => {
  test("GET /api/analytics/events returns events array", async ({
    request,
  }) => {
    const { status, body } = await getJson(request, "/api/analytics/events");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/analytics/events records an event", async ({ request }) => {
    const payload = {
      eventType: "e2e_test_event",
      sessionId: `e2e-session-${Date.now()}`,
      eventData: { action: "test", source: "playwright" },
    };

    const { status, body } = await postJson(
      request,
      "/api/analytics/events",
      payload,
    );

    expect(status).toBe(200);
    const event = body as Record<string, unknown>;
    expect(event.id).toBeTruthy();
    expect(event.eventType).toBe(payload.eventType);
  });

  test("GET /api/analytics/live returns live metrics", async ({ request }) => {
    const { status, body } = await getJson(request, "/api/analytics/live");

    expect(status).toBe(200);
    // Response should be an object with metric data
    expect(typeof body).toBe("object");
    expect(body).not.toBeNull();
  });

  test("GET /api/system-metrics returns metrics array", async ({ request }) => {
    const { status, body } = await getJson(request, "/api/system-metrics");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/system-metrics records a metric", async ({ request }) => {
    const payload = {
      metricName: "e2e_test_metric",
      value: 42.0,
      category: "performance",
    };

    const { status, body } = await postJson(
      request,
      "/api/system-metrics",
      payload,
    );

    expect(status).toBe(200);
    const metric = body as Record<string, unknown>;
    expect(metric.id).toBeTruthy();
    expect(metric.metricName).toBe(payload.metricName);
    expect(Number(metric.value)).toBe(42);
  });

  test("GET /api/integration-status returns integration statuses", async ({
    request,
  }) => {
    const { status, body } = await getJson(request, "/api/integration-status");

    expect([200, 500]).toContain(status);
    if (status === 200) {
      expect(Array.isArray(body)).toBe(true);
    }
  });

  test("GET /api/rag-queries returns query history", async ({ request }) => {
    const { status, body } = await getJson(request, "/api/rag-queries");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/rag-queries records a query", async ({ request }) => {
    const payload = {
      query: "E2E test search query",
      totalFound: 5,
      processingTimeMs: 150,
      sessionId: `e2e-session-${Date.now()}`,
    };

    const { status, body } = await postJson(
      request,
      "/api/rag-queries",
      payload,
    );

    expect(status).toBe(200);
    const ragQuery = body as Record<string, unknown>;
    expect(ragQuery.id).toBeTruthy();
    expect(ragQuery.query).toBe(payload.query);
  });
});
