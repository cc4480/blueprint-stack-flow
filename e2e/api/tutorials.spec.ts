import { test, expect } from "@playwright/test";
import { getJson, postJson, putJson } from "../helpers/api";

test.describe("Tutorials API", () => {
  test("GET /api/tutorial-categories returns categories array", async ({
    request,
  }) => {
    const { status, body } = await getJson(
      request,
      "/api/tutorial-categories",
    );

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/tutorial-categories creates a category", async ({
    request,
  }) => {
    const slug = `e2e-test-category-${Date.now()}`;
    const payload = {
      name: "E2E Test Category",
      description: "Category created by E2E tests",
      icon: "book",
      slug,
      order: 999,
    };

    const { status, body } = await postJson(
      request,
      "/api/tutorial-categories",
      payload,
    );

    expect([200, 201]).toContain(status);
    const category = body as Record<string, unknown>;
    expect(category.id).toBeTruthy();
    expect(category.name).toBe(payload.name);
    expect(category.slug).toBe(slug);
  });

  test("GET /api/learning-paths returns learning paths array", async ({
    request,
  }) => {
    const { status, body } = await getJson(request, "/api/learning-paths");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/learning-paths creates a learning path", async ({
    request,
  }) => {
    const slug = `e2e-learning-path-${Date.now()}`;
    const payload = {
      title: "E2E Test Learning Path",
      description: "A learning path created by E2E tests",
      difficulty: "beginner",
      duration: "1 hour",
      slug,
      order: 999,
    };

    const { status, body } = await postJson(
      request,
      "/api/learning-paths",
      payload,
    );

    expect([200, 201]).toContain(status);
    const path = body as Record<string, unknown>;
    expect(path.id).toBeTruthy();
    expect(path.title).toBe(payload.title);
    expect(path.difficulty).toBe("beginner");
  });

  test("GET /api/tutorials returns tutorials array", async ({ request }) => {
    const { status, body } = await getJson(request, "/api/tutorials");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/tutorials creates a tutorial", async ({ request }) => {
    const slug = `e2e-tutorial-${Date.now()}`;
    const payload = {
      title: "E2E Test Tutorial",
      description: "Tutorial created by E2E tests",
      type: "interactive",
      difficulty: "beginner",
      duration: "30 minutes",
      slug,
      estimatedMinutes: 30,
    };

    const { status, body } = await postJson(request, "/api/tutorials", payload);

    expect([200, 201]).toContain(status);
    const tutorial = body as Record<string, unknown>;
    expect(tutorial.id).toBeTruthy();
    expect(tutorial.title).toBe(payload.title);
  });

  test("GET /api/tutorials/:id returns a specific tutorial", async ({
    request,
  }) => {
    // Create a tutorial first
    const slug = `e2e-tutorial-fetch-${Date.now()}`;
    const { body: created } = await postJson(request, "/api/tutorials", {
      title: "Tutorial Fetch Test",
      type: "deep_dive",
      difficulty: "intermediate",
      slug,
    });

    const id = (created as Record<string, unknown>).id as string;
    const { status, body } = await getJson(request, `/api/tutorials/${id}`);

    expect(status).toBe(200);
    const tutorial = body as Record<string, unknown>;
    expect(tutorial.id).toBe(id);
  });

  test("GET /api/tutorial-modules returns modules array", async ({
    request,
  }) => {
    const { status, body } = await getJson(request, "/api/tutorial-modules");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("GET /api/user-progress returns progress array", async ({ request }) => {
    const { status, body } = await getJson(request, "/api/user-progress");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });
});
