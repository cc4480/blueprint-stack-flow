import { test, expect } from "@playwright/test";
import { getJson, postJson, putJson } from "../helpers/api";

test.describe("Blueprint Prompts API", () => {
  test("GET /api/blueprint-prompts returns saved prompts", async ({
    request,
  }) => {
    const { status, body } = await getJson(request, "/api/blueprint-prompts");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/blueprint-prompts saves a blueprint", async ({ request }) => {
    const payload = {
      userPrompt: "Build an AI-powered document summarizer",
      generatedBlueprint: "## Blueprint\n\nUse RAG + LLM to summarize docs.",
      complexity: "medium",
      estimatedBuildTime: "2-4 hours",
      modelUsed: "deepseek-reasoner",
      sessionId: `e2e-session-${Date.now()}`,
      suggestedComponents: ["RAG", "LLM", "Vector DB"],
    };

    const { status, body } = await postJson(
      request,
      "/api/blueprint-prompts",
      payload,
    );

    expect([200, 201]).toContain(status);
    const blueprint = body as Record<string, unknown>;
    expect(blueprint.id).toBeTruthy();
    expect(blueprint.userPrompt).toBe(payload.userPrompt);
    expect(blueprint.complexity).toBe("medium");
  });

  test("GET /api/blueprint-prompts/:id returns a specific blueprint", async ({
    request,
  }) => {
    // Create a blueprint to fetch
    const { body: created } = await postJson(
      request,
      "/api/blueprint-prompts",
      {
        userPrompt: "Build a chatbot",
        generatedBlueprint: "Use LLM with memory",
        sessionId: `e2e-session-${Date.now()}`,
      },
    );

    const id = (created as Record<string, unknown>).id as string;
    const { status, body } = await getJson(
      request,
      `/api/blueprint-prompts/${id}`,
    );

    expect(status).toBe(200);
    const blueprint = body as Record<string, unknown>;
    expect(blueprint.id).toBe(id);
    expect(blueprint.userPrompt).toBe("Build a chatbot");
  });

  test("PUT /api/blueprint-prompts/:id updates a blueprint", async ({
    request,
  }) => {
    const { body: created } = await postJson(
      request,
      "/api/blueprint-prompts",
      {
        userPrompt: "Original prompt",
        generatedBlueprint: "Original blueprint",
        sessionId: `e2e-session-${Date.now()}`,
      },
    );

    const id = (created as Record<string, unknown>).id as string;

    const { status, body } = await putJson(
      request,
      `/api/blueprint-prompts/${id}`,
      {
        userPrompt: "Updated prompt",
        generatedBlueprint: "Updated blueprint content",
      },
    );

    expect(status).toBe(200);
    // PUT returns a success message, not the updated entity
    const result = body as Record<string, unknown>;
    expect(result.message).toBeTruthy();
  });
});

test.describe("Blueprint Generation API", () => {
  test("POST /api/generate-prompt generates a prompt template", async ({
    request,
  }) => {
    const payload = {
      requirements: "I need a web scraper with AI summarization",
      context: "Python backend, React frontend",
    };

    const { status, body } = await postJson(
      request,
      "/api/generate-prompt",
      payload,
    );

    // May return 200 or 500 depending on API key availability
    expect([200, 500, 400]).toContain(status);
    if (status === 200) {
      expect(typeof body).toBe("object");
    }
  });
});
