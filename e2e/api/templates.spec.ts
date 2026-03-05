import { test, expect } from "@playwright/test";
import { getJson, postJson, putJson, deleteRequest } from "../helpers/api";

test.describe("Templates API", () => {
  let createdTemplateId: string;

  test("GET /api/templates returns an array", async ({ request }) => {
    const { status, body } = await getJson(request, "/api/templates");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/templates creates a new template", async ({ request }) => {
    const payload = {
      name: "E2E Test Template",
      description: "Template created by E2E tests",
      category: "testing",
      content: "# E2E Template\n\nThis is a test template.",
      tags: ["e2e", "testing"],
      isPublic: false,
    };

    const { status, body } = await postJson(
      request,
      "/api/templates",
      payload,
    );

    expect(status).toBe(200);
    const template = body as Record<string, unknown>;
    expect(template.id).toBeTruthy();
    expect(template.name).toBe(payload.name);
    expect(template.category).toBe(payload.category);
    createdTemplateId = template.id as string;
  });

  test("GET /api/templates/:id returns a single template", async ({
    request,
  }) => {
    // First create a template to fetch
    const { body: created } = await postJson(request, "/api/templates", {
      name: "Template Fetch Test",
      category: "testing",
      content: "Content for fetch test",
    });
    const id = (created as Record<string, unknown>).id as string;

    const { status, body } = await getJson(request, `/api/templates/${id}`);

    expect(status).toBe(200);
    const template = body as Record<string, unknown>;
    expect(template.id).toBe(id);
    expect(template.name).toBe("Template Fetch Test");
  });

  test("PUT /api/templates/:id updates a template", async ({ request }) => {
    // Create template first
    const { body: created } = await postJson(request, "/api/templates", {
      name: "Template to Update",
      category: "testing",
      content: "Original content",
    });
    const id = (created as Record<string, unknown>).id as string;

    // Update it
    const { status, body } = await putJson(request, `/api/templates/${id}`, {
      name: "Updated Template Name",
      category: "testing",
      content: "Updated content",
    });

    expect(status).toBe(200);
    const updated = body as Record<string, unknown>;
    expect(updated.name).toBe("Updated Template Name");
  });

  test("DELETE /api/templates/:id removes a template", async ({ request }) => {
    // Create template to delete
    const { body: created } = await postJson(request, "/api/templates", {
      name: "Template to Delete",
      category: "testing",
      content: "Will be deleted",
    });
    const id = (created as Record<string, unknown>).id as string;

    // Delete it
    const { status } = await deleteRequest(request, `/api/templates/${id}`);
    expect(status).toBe(200);

    // Verify deletion — fetching by ID should return 404
    const { status: fetchStatus } = await getJson(
      request,
      `/api/templates/${id}`,
    );
    expect(fetchStatus).toBe(404);
  });

  test("POST /api/templates/:id/use increments download count", async ({
    request,
  }) => {
    const { body: created } = await postJson(request, "/api/templates", {
      name: "Template Use Count Test",
      category: "testing",
      content: "Will be used",
    });
    const id = (created as Record<string, unknown>).id as string;

    const response = await request.post(
      `${process.env.BASE_URL || "http://localhost:5000"}/api/templates/${id}/use`,
    );

    expect([200, 201]).toContain(response.status());
    const body = (await response.json()) as Record<string, unknown>;
    // After using, downloadCount should be at least 1
    const count = body.downloadCount ?? body.download_count;
    expect(Number(count)).toBeGreaterThanOrEqual(1);
  });
});
