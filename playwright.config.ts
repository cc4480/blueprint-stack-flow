import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E Test Configuration
 * Covers both API-level tests (no browser required) and UI tests (browser required).
 * Run API tests with: npx playwright test --project=api
 * Run UI tests with:  npx playwright test --project=ui-chromium
 * Run all tests with: npx playwright test
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:5000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "api",
      testMatch: "**/api/**/*.spec.ts",
      use: {
        // API tests only use the request fixture — no browser needed
        baseURL: process.env.BASE_URL || "http://localhost:5000",
      },
    },
    {
      name: "ui-chromium",
      testMatch: "**/ui/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.BASE_URL || "http://localhost:5000",
      },
    },
  ],

  // Automatically start the dev server before running tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5000/api/health",
    reuseExistingServer: true,
    timeout: 60_000,
    env: {
      NODE_ENV: "test",
    },
  },
});
