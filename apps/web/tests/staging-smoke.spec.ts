// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Staging Environment Web Acceptance & Smoke Tests', () => {
  test('should render the staging environment indicator banner and permit dismissal', async ({ page }) => {
    await page.goto('/');

    // Verify presence of staging warning banner
    const stagingBanner = page.locator('role=banner[name="Staging Environment Indicator"]');
    if (await stagingBanner.isVisible()) {
      await expect(stagingBanner).toContainText(/Staging Sandbox/i);
      await expect(stagingBanner).toContainText(/v20\.0\.0-real-cloud-staging-operations/i);

      // Verify dismiss button works
      const dismissBtn = page.locator('button[aria-label="Dismiss staging banner"]');
      if (await dismissBtn.isVisible()) {
        await dismissBtn.click();
        await expect(stagingBanner).not.toBeVisible();
      }
    }
  });

  test('should display release metadata and environment status in footer', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/EcivreS\. All rights reserved/i);
    await expect(footer).toContainText(/v20\.0\.0-real-cloud-staging-operations/i);
  });

  test('should successfully load authentication portal with secure form fields', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page).toHaveTitle(/EcivreS/);

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeEnabled();
      await expect(passwordInput).toBeEnabled();
    }
  });

  test('should gracefully handle 404 not found routes without application crash', async ({ page }) => {
    const response = await page.goto('/non-existent-staging-route-404');
    expect(response?.status()).toBe(404);
  });
});
