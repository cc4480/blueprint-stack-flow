import { test, expect } from "@playwright/test";
import { getJson, postJson } from "../helpers/api";

test.describe("MCP Servers API", () => {
  test("GET /api/mcp-servers returns an array", async ({ request }) => {
    const { status, body } = await getJson(request, "/api/mcp-servers");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/mcp-servers creates a new server", async ({ request }) => {
    const payload = {
      name: "E2E Test MCP Server",
      transport: "http",
      status: "inactive",
      endpoint: "http://localhost:9999/mcp",
      capabilities: { tools: true, resources: false },
    };

    const { status, body } = await postJson(
      request,
      "/api/mcp-servers",
      payload,
    );

    expect(status).toBe(200);
    const server = body as Record<string, unknown>;
    expect(server.id).toBeTruthy();
    expect(server.name).toBe(payload.name);
    expect(server.transport).toBe(payload.transport);
  });

  test("GET /api/mcp/servers (legacy route) also returns array", async ({
    request,
  }) => {
    const { status, body } = await getJson(request, "/api/mcp/servers");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("GET /api/mcp-tool-executions returns execution history", async ({
    request,
  }) => {
    const { status, body } = await getJson(
      request,
      "/api/mcp-tool-executions",
    );

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/mcp-tool-executions records a tool execution", async ({
    request,
  }) => {
    const payload = {
      toolName: "e2e_test_tool",
      status: "completed",
      executionTimeMs: 42,
      inputParams: { param: "value" },
      outputData: { result: "success" },
    };

    const { status, body } = await postJson(
      request,
      "/api/mcp-tool-executions",
      payload,
    );

    expect(status).toBe(200);
    const exec = body as Record<string, unknown>;
    expect(exec.id).toBeTruthy();
    expect(exec.toolName).toBe(payload.toolName);
  });
});
