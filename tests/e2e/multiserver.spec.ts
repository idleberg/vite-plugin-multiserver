import { expect, test } from '@playwright/test';

test.describe('vite-plugin-multiserver', () => {
	test('should run main server on port 7001', async ({ page }) => {
		const response = await page.goto('http://localhost:7001');

		expect(response?.status()).toBe(200);
		await expect(page.locator('h1')).toHaveText('Main Server (Port 7001)');
	});

	test('should run secondary server on port 7002', async ({ page }) => {
		const response = await page.goto('http://localhost:7002/iframe.html');

		expect(response?.status()).toBe(200);
		await expect(page.locator('h2')).toHaveText('Iframe Server (Port 7002)');
		await expect(page.locator('[data-testid="iframe-status"]')).toHaveText('Iframe loaded');
	});

	test('should enable cross-origin communication between servers', async ({ page }) => {
		await page.goto('http://localhost:7001');

		// Wait for iframe to load
		const iframe = page.frameLocator('#test-iframe');
		await iframe.locator('[data-testid="iframe-status"]').waitFor();

		// Wait for cross-origin message exchange
		await page.waitForSelector('[data-testid="message-received"]', { timeout: 5000 });

		const status = await page.locator('#status').textContent();
		expect(status).toContain('Received message from iframe: Hello from iframe');

		// Verify iframe also received message
		const iframeStatus = await iframe.locator('#iframe-status').textContent();
		expect(iframeStatus).toContain('Received: Hello from main page');
	});

	test('should serve different content on different ports', async ({ page, context }) => {
		// Open both pages in different tabs
		const page1 = await context.newPage();
		const page2 = await context.newPage();

		await page1.goto('http://localhost:7001');
		await page2.goto('http://localhost:7002/iframe.html');

		const mainTitle = await page1.locator('h1').textContent();
		const iframeTitle = await page2.locator('h2').textContent();

		expect(mainTitle).toBe('Main Server (Port 7001)');
		expect(iframeTitle).toBe('Iframe Server (Port 7002)');

		await page1.close();
		await page2.close();
	});

	test('should handle requests to both servers simultaneously', async ({ context }) => {
		const [page1, page2] = await Promise.all([context.newPage(), context.newPage()]);

		const [response1, response2] = await Promise.all([
			page1.goto('http://localhost:7001'),
			page2.goto('http://localhost:7002/iframe.html'),
		]);

		expect(response1?.ok()).toBeTruthy();
		expect(response2?.ok()).toBeTruthy();

		await page1.close();
		await page2.close();
	});
});
