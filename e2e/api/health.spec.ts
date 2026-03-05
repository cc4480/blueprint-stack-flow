import { test, expect } from "@playwright/test";
import { getJson } from "../helpers/api";

test.describe("Health Check API", () => {
  test("GET /api/health returns healthy status", async ({ request }) => {
    const { status, body } = await getJson(request, "/api/health");

    expect(status).toBe(200);
    expect(body).toMatchObject({
      status: "healthy",
      version: expect.any(String),
    });
    expect((body as Record<string, unknown>).timestamp).toBeTruthy();
    expect(Array.isArray((body as Record<string, unknown>).services)).toBe(
      true,
    );
  });

  test("GET /api/db/health returns database connectivity status", async ({
    request,
  }) => {
    const { status, body } = await getJson(request, "/api/db/health");

    // Accept both healthy and error — the test verifies the endpoint responds
    expect([200, 500]).toContain(status);

    if (status === 200) {
      expect(body).toMatchObject({
        status: "healthy",
        database: "postgresql",
      });
    } else {
      expect((body as Record<string, unknown>).status).toBe("error");
    }
  });
});
