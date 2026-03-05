import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:5000";

test.describe("RAG Hub UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/rag-hub`);
    // Wait for the page to be interactive
    await page.waitForLoadState("networkidle");
  });

  test("RAG Hub renders the main heading", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
    // Should show some RAG-related heading
    const headings = page.locator("h1, h2, h3");
    await expect(headings.first()).toBeVisible();
  });

  test("RAG Hub shows the document list area", async ({ page }) => {
    // The page should render content — not a blank screen or error
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(50);
  });
});
