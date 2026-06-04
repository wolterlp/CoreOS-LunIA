import { test, expect } from '@playwright/test';

test.describe('Cerebro Empresarial IA - Final Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: { id: '1', email: 'admin@test.com', name: 'Jules Senior', role: 'ADMIN' },
          token: 'mock-token',
          isAuthenticated: true
        },
        version: 0
      }));
    });

    await page.route('**/api/auth/profile', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { id: '1', email: 'admin@test.com', role: 'ADMIN', name: 'Jules Senior' } }),
      });
    });
  });

  test('Dashboard and Simulations Visual Check', async ({ page }) => {
    await page.route('**/api/alerts', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [
          { id: 'a1', title: 'Alerta Final', description: 'Todo funcionando.', severity: 'INFO', createdAt: new Date().toISOString(), isRead: false }
        ] }),
      });
    });
    await page.route('**/api/memory', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
    });
    await page.route('**/api/agents', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
    });
    await page.route('**/api/automation/rules', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
    });
    await page.route('**/api/simulations/history', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [
          { id: 's1', name: 'Test Final', status: 'COMPLETED', variables: {}, results: { best: 1 }, createdAt: new Date().toISOString() }
        ] }),
      });
    });

    await page.goto('http://localhost:5173/');
    await expect(page.getByText('Panel de Control Inteligente')).toBeVisible();
    await expect(page.locator('.recharts-responsive-container')).toBeVisible();

    await page.click('a[href="/simulations"]');
    await page.click('text=Test Final');
    await expect(page.locator('.recharts-bar')).toBeVisible();

    await page.screenshot({ path: '/home/jules/verification/final_visual_verification.png' });
  });
});
