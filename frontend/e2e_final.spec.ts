import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Mock all API calls
  await page.route('**/api/auth/profile', async (route) => {
    await route.fulfill({ status: 200, body: JSON.stringify({ data: { name: 'Admin', role: 'ADMIN' } }) });
  });

  await page.route('**/api/settings', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, body: JSON.stringify({ data: [
        { key: 'OPENAI_API_KEY', value: '********', category: 'AI', isSecret: true },
        { key: 'SMTP_HOST', value: 'smtp.test.com', category: 'COMMUNICATION', isSecret: false }
      ] }) });
    } else {
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
    }
  });

  await page.route('**/api/alerts', async (route) => {
    await route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) });
  });

  // Add more mocks as needed for each page...
});

test('Validate all modules load correctly', async ({ page }) => {
  // Mock login by setting localStorage
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem('auth-storage', JSON.stringify({
      state: { user: { name: 'Admin', role: 'ADMIN' }, token: 'mock-token' }
    }));
  });
  await page.reload();

  const modules = [
    { name: 'Dashboard', path: '/' },
    { name: 'Comprensión', path: '/business-understanding' },
    { name: 'Crecimiento', path: '/growth' },
    { name: 'Alertas', path: '/alerts' },
    { name: 'Secretaria', path: '/secretary' },
    { name: 'Memoria', path: '/memory' },
    { name: 'Analizador BD', path: '/db-analyzer' },
    { name: 'Simulación', path: '/simulations' },
    { name: 'Automatización', path: '/automation' },
    { name: 'Agentes', path: '/agents' },
    { name: 'Comunicación', path: '/communication' },
    { name: 'Configuración', path: '/settings' },
  ];

  for (const mod of modules) {
    console.log(`Verificando módulo: ${mod.name}`);
    await page.goto(`http://localhost:5173${mod.path}`);
    await expect(page).not.toHaveTitle(/Login/);
    // Check for some text or element unique to the page if possible
    if (mod.name === 'Configuración') {
       await expect(page.locator('text=Configuración del Sistema')).toBeVisible();
    }
  }
});
