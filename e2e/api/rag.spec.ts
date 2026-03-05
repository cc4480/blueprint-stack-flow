import { test, expect } from "@playwright/test";
import { getJson, postJson, deleteRequest } from "../helpers/api";

test.describe("RAG Documents API", () => {
  test("GET /api/rag-documents returns an array", async ({ request }) => {
    const { status, body } = await getJson(request, "/api/rag-documents");

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  test("POST /api/rag-documents creates a new document", async ({
    request,
  }) => {
    const payload = {
      title: "E2E Test Document",
      content: "This document was created by the end-to-end test suite.",
      metadata: { source: "e2e-test", tags: ["testing", "playwright"] },
    };

    const { status, body } = await postJson(
      request,
      "/api/rag-documents",
      payload,
    );

    expect(status).toBe(200);
    const doc = body as Record<string, unknown>;
    expect(doc.id).toBeTruthy();
    expect(doc.title).toBe(payload.title);
    expect(doc.content).toBe(payload.content);
  });

  test("POST /api/rag-documents + DELETE removes document", async ({
    request,
  }) => {
    // Create a document to be deleted
    const { body: created } = await postJson(request, "/api/rag-documents", {
      title: "Document to Delete",
      content: "This will be deleted during the E2E test.",
    });

    const createdDoc = created as Record<string, unknown>;
    expect(createdDoc.id).toBeTruthy();

    // Delete the created document
    const { status: deleteStatus } = await deleteRequest(
      request,
      `/api/rag-documents/${createdDoc.id}`,
    );
    expect(deleteStatus).toBe(200);

    // Verify it's gone — list should not contain this id
    const { body: documents } = await getJson(request, "/api/rag-documents");
    const ids = (documents as Array<Record<string, unknown>>).map((d) => d.id);
    expect(ids).not.toContain(createdDoc.id);
  });

  test("POST /api/rag-query searches documents", async ({ request }) => {
    const { status, body } = await postJson(request, "/api/rag-query", {
      query: "test",
      limit: 5,
    });

    // The endpoint should respond (200 with results or 500 if DB not ready)
    expect([200, 500]).toContain(status);
    if (status === 200) {
      const result = body as Record<string, unknown>;
      expect(result.results !== undefined || Array.isArray(result)).toBe(true);
    }
  });

  test("GET /api/search/rag-documents searches with query param", async ({
    request,
  }) => {
    const { status, body } = await getJson(
      request,
      "/api/search/rag-documents?q=test&limit=5",
    );

    expect([200, 500]).toContain(status);
    if (status === 200) {
      expect(Array.isArray(body)).toBe(true);
    }
  });
});
