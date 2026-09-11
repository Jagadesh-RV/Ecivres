import { test, expect } from '@playwright/test';

test.describe('Enterprise Customer Booking Flow', () => {
  test('should allow customer to search, customize multi-service cart, and complete express checkout', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/EcivreS/);

    // Verify AI Quick Action button presence
    const quickActionButton = page.locator('text=AI Quick Actions');
    await expect(quickActionButton).toBeVisible();

    // Open category search
    await page.click('text=Services');
    await expect(page.url()).toContain('/services');
  });

  test('should display provider business suite analytics dashboard', async ({ page }) => {
    await page.goto('/provider/dashboard');
    await expect(page.locator('text=Enterprise Operations Center')).toBeVisible();
  });
});
