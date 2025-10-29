// E2E Test: Authentication Flow
// e2e/auth.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and local storage
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should show login page', async ({ page }) => {
    await page.goto('/auth/login');
    
    await expect(page).toHaveTitle(/BettaDayz/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show registration page', async ({ page }) => {
    await page.goto('/auth/register');
    
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should validate password length', async ({ page }) => {
    await page.goto('/auth/register');
    
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', '123'); // Too short
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should redirect to dashboard after login', async ({ page }) => {
    // Mock successful login
    await page.route('/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            id: 'user-123',
            email: 'test@example.com',
            profile: {
              username: 'testuser',
              displayName: 'Test User',
              level: 1,
              bettaBuckZ: 1000
            }
          }
        })
      });
    });

    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe('Cross-Domain Navigation', () => {
  test('should navigate between domains', async ({ page, context }) => {
    // Test domain switching functionality
    await page.goto('http://localhost:3000'); // bettadayz.shop
    
    // Look for domain switcher or cross-domain link
    const storeLinkSelector = '[data-testid="store-link"]';
    if (await page.locator(storeLinkSelector).isVisible()) {
      await page.click(storeLinkSelector);
      
      // Should navigate to store domain
      await expect(page).toHaveURL(/localhost:3001/);
    }
  });
});

test.describe('Game Features', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user
    await page.addInitScript(() => {
      localStorage.setItem('session-token', 'mock-session-token');
    });
  });

  test('should load game dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
    await expect(page.locator('[data-testid="bettabuckz-balance"]')).toBeVisible();
    await expect(page.locator('[data-testid="level-display"]')).toBeVisible();
  });

  test('should navigate to store', async ({ page }) => {
    await page.goto('/store');
    
    await expect(page.locator('[data-testid="store-items"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-bar"]')).toBeVisible();
  });

  test('should show guild list', async ({ page }) => {
    await page.goto('/guilds');
    
    await expect(page.locator('[data-testid="guild-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="create-guild-button"]')).toBeVisible();
  });

  test('should show tournament list', async ({ page }) => {
    await page.goto('/tournaments');
    
    await expect(page.locator('[data-testid="tournament-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="tournament-filters"]')).toBeVisible();
  });
});

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user with balance
    await page.addInitScript(() => {
      localStorage.setItem('session-token', 'mock-session-token');
    });
  });

  test('should show payment options', async ({ page }) => {
    await page.goto('/store/purchase?item=test-package');
    
    await expect(page.locator('[data-testid="payment-options"]')).toBeVisible();
    await expect(page.locator('[data-testid="stripe-option"]')).toBeVisible();
    await expect(page.locator('[data-testid="cashapp-option"]')).toBeVisible();
    await expect(page.locator('[data-testid="bitcoin-option"]')).toBeVisible();
  });

  test('should validate payment amount', async ({ page }) => {
    await page.goto('/store/purchase?item=test-package');
    
    // Should show package details and price
    await expect(page.locator('[data-testid="package-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="package-description"]')).toBeVisible();
  });
});