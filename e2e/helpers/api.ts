import type { APIRequestContext } from "@playwright/test";

/** Base URL for all API calls — can be overridden by BASE_URL env var */
export const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

/** Convenience wrapper: GET and parse JSON */
export async function getJson(
  request: APIRequestContext,
  path: string,
): Promise<{ status: number; body: unknown }> {
  const response = await request.get(`${BASE_URL}${path}`);
  const body = await response.json().catch(() => null);
  return { status: response.status(), body };
}

/** Convenience wrapper: POST JSON and parse response */
export async function postJson(
  request: APIRequestContext,
  path: string,
  data: unknown,
): Promise<{ status: number; body: unknown }> {
  const response = await request.post(`${BASE_URL}${path}`, {
    data,
    headers: { "Content-Type": "application/json" },
  });
  const body = await response.json().catch(() => null);
  return { status: response.status(), body };
}

/** Convenience wrapper: PUT JSON and parse response */
export async function putJson(
  request: APIRequestContext,
  path: string,
  data: unknown,
): Promise<{ status: number; body: unknown }> {
  const response = await request.put(`${BASE_URL}${path}`, {
    data,
    headers: { "Content-Type": "application/json" },
  });
  const body = await response.json().catch(() => null);
  return { status: response.status(), body };
}

/** Convenience wrapper: DELETE and parse response */
export async function deleteRequest(
  request: APIRequestContext,
  path: string,
): Promise<{ status: number; body: unknown }> {
  const response = await request.delete(`${BASE_URL}${path}`);
  const body = await response.json().catch(() => null);
  return { status: response.status(), body };
}
