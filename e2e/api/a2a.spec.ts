import { test, expect } from "@playwright/test";
import { getJson, postJson } from "../helpers/api";

test.describe("A2A Agents API", () => {
  test("GET /api/a2a-agents returns an array", async ({ request }) => {
    const { status, body } = await getJson(request, "/api/a2a-agents");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/a2a-agents creates a new agent", async ({ request }) => {
    const payload = {
      name: "E2E Test Agent",
      description: "An agent created by the E2E test suite",
      status: "inactive",
      capabilities: ["research", "summarize"],
      endpoint: "http://localhost:9998/agent",
    };

    const { status, body } = await postJson(
      request,
      "/api/a2a-agents",
      payload,
    );

    expect(status).toBe(200);
    const agent = body as Record<string, unknown>;
    expect(agent.id).toBeTruthy();
    expect(agent.name).toBe(payload.name);
    expect(agent.description).toBe(payload.description);
  });

  test("GET /api/a2a/agents (legacy route) also returns array", async ({
    request,
  }) => {
    const { status, body } = await getJson(request, "/api/a2a/agents");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("GET /api/a2a-tasks returns task list", async ({ request }) => {
    const { status, body } = await getJson(request, "/api/a2a-tasks");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/a2a-tasks creates a task", async ({ request }) => {
    const payload = {
      taskType: "research",
      status: "pending",
      metadata: { topic: "AI architectures" },
      complexityScore: 3,
    };

    const { status, body } = await postJson(
      request,
      "/api/a2a-tasks",
      payload,
    );

    expect(status).toBe(200);
    const task = body as Record<string, unknown>;
    expect(task.id).toBeTruthy();
    expect(task.taskType).toBe(payload.taskType);
    expect(task.status).toBe("pending");
  });
});
