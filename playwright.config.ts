import { env } from 'node:process';
import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: false,
	forbidOnly: Boolean(env.CI),
	retries: env.CI ? 2 : 0,
	workers: 1,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:7001',
		trace: 'on-first-retry',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

	webServer: {
		command: 'vite --config tests/fixtures/basic/vite.config.ts tests/fixtures/basic',
		url: 'http://localhost:7001',
		reuseExistingServer: !env.CI,
		timeout: 10_000,
	},
});
