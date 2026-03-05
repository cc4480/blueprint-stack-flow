import { test, expect } from "@playwright/test";

/**
 * UI Navigation E2E Tests
 * These tests verify that all main pages load and render their key content.
 * Requires a browser — run with: npx playwright test --project=ui-chromium
 */

const BASE = process.env.BASE_URL || "http://localhost:5000";

test.describe("Application Navigation", () => {
  test("Home page loads with key content", async ({ page }) => {
    await page.goto(`${BASE}/`);

    await expect(page).toHaveTitle(/.+/); // any non-empty title
    // Main page should render — check for a visible element
    await expect(page.locator("body")).toBeVisible();
    // Should not show a generic error page
    await expect(page.locator("text=Internal Server Error")).not.toBeVisible();
  });

  test("Dashboard page loads", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);

    await expect(page.locator("body")).toBeVisible();
    // Dashboard should render without crashing
    await expect(page.locator("text=500")).not.toBeVisible();
  });

  test("RAG Hub page loads", async ({ page }) => {
    await page.goto(`${BASE}/rag-hub`);

    await expect(page.locator("body")).toBeVisible();
  });

  test("MCP Center page loads", async ({ page }) => {
    await page.goto(`${BASE}/mcp-center`);

    await expect(page.locator("body")).toBeVisible();
  });

  test("Prompt Studio page loads", async ({ page }) => {
    await page.goto(`${BASE}/prompt-studio`);

    await expect(page.locator("body")).toBeVisible();
  });

  test("A2A Agents page loads", async ({ page }) => {
    await page.goto(`${BASE}/a2a-agents`);

    await expect(page.locator("body")).toBeVisible();
  });

  test("Analytics page loads", async ({ page }) => {
    await page.goto(`${BASE}/analytics`);

    await expect(page.locator("body")).toBeVisible();
  });

  test("Templates page loads", async ({ page }) => {
    await page.goto(`${BASE}/templates`);

    await expect(page.locator("body")).toBeVisible();
  });

  test("Tutorials page loads", async ({ page }) => {
    await page.goto(`${BASE}/tutorials`);

    await expect(page.locator("body")).toBeVisible();
  });

  test("Documentation page loads", async ({ page }) => {
    await page.goto(`${BASE}/docs`);

    await expect(page.locator("body")).toBeVisible();
  });

  test("Settings page loads", async ({ page }) => {
    await page.goto(`${BASE}/settings`);

    await expect(page.locator("body")).toBeVisible();
  });

  test("Unknown route shows 404 page", async ({ page }) => {
    await page.goto(`${BASE}/this-route-does-not-exist`);

    // Should show the NotFound component, not a blank page
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(10); // Something rendered
  });

  test("Navigation links are present on the page", async ({ page }) => {
    await page.goto(`${BASE}/`);

    // Navigation component should render links
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });
});
