import { describe, expect, it } from 'vitest';
import MultiserverPlugin from '../../src/plugin.ts';

describe('MultiserverPlugin', () => {
	describe('plugin structure', () => {
		it('should return a valid Vite plugin object', () => {
			const plugin = MultiserverPlugin({ port: 3000 });

			expect(plugin).toBeDefined();
			expect(plugin.name).toBe('vite-plugin-multiserver');
			expect(plugin.configResolved).toBeDefined();
			expect(plugin.configureServer).toBeDefined();
			expect(plugin.configurePreviewServer).toBeDefined();
		});

		it('should have correct plugin name', () => {
			const plugin = MultiserverPlugin({ port: 3000 });

			expect(plugin.name).toBe('vite-plugin-multiserver');
		});

		it('should expose configResolved hook', () => {
			const plugin = MultiserverPlugin({ port: 3000 });

			expect(typeof plugin.configResolved).toBe('function');
		});

		it('should expose configureServer hook', () => {
			const plugin = MultiserverPlugin({ port: 3000 });

			expect(typeof plugin.configureServer).toBe('function');
		});

		it('should expose configurePreviewServer hook', () => {
			const plugin = MultiserverPlugin({ port: 3000 });

			expect(typeof plugin.configurePreviewServer).toBe('function');
		});
	});

	describe('options handling', () => {
		it('should accept single options object', () => {
			const plugin = MultiserverPlugin({ port: 3000 });

			expect(plugin).toBeDefined();
		});

		it('should accept array of options', () => {
			const plugin = MultiserverPlugin([{ port: 3000 }, { port: 4000 }]);

			expect(plugin).toBeDefined();
		});

		it('should accept options with overrides', () => {
			const plugin = MultiserverPlugin({
				port: 3000,
				overrides: {
					base: '/custom/',
					root: './custom',
				},
			});

			expect(plugin).toBeDefined();
		});

		it('should accept options with server configuration', () => {
			const plugin = MultiserverPlugin({
				port: 3000,
				host: 'localhost',
				strictPort: true,
			});

			expect(plugin).toBeDefined();
		});

		it('should accept options with CORS configuration', () => {
			const plugin = MultiserverPlugin({
				port: 3000,
				cors: {
					origin: '*',
					methods: ['GET', 'POST'],
				},
			});

			expect(plugin).toBeDefined();
		});

		it('should accept options with custom headers', () => {
			const plugin = MultiserverPlugin({
				port: 3000,
				headers: {
					'X-Custom-Header': 'value',
				},
			});

			expect(plugin).toBeDefined();
		});

		it('should accept options with proxy configuration', () => {
			const plugin = MultiserverPlugin({
				port: 3000,
				proxy: {
					'/api': 'http://localhost:4000',
				},
			});

			expect(plugin).toBeDefined();
		});

		it('should accept empty options object', () => {
			const plugin = MultiserverPlugin({});

			expect(plugin).toBeDefined();
		});

		it('should accept array with empty options', () => {
			const plugin = MultiserverPlugin([{}, {}]);

			expect(plugin).toBeDefined();
		});
	});

	describe('multiple instances', () => {
		it('should allow creating multiple plugin instances', () => {
			const plugin1 = MultiserverPlugin({ port: 3000 });
			const plugin2 = MultiserverPlugin({ port: 4000 });

			expect(plugin1).toBeDefined();
			expect(plugin2).toBeDefined();
			expect(plugin1).not.toBe(plugin2);
		});

		it('should create independent plugin instances', () => {
			const plugin1 = MultiserverPlugin({ port: 3000 });
			const plugin2 = MultiserverPlugin({ port: 4000 });

			expect(plugin1.name).toBe(plugin2.name);
			expect(plugin1.configResolved).not.toBe(plugin2.configResolved);
		});
	});

	describe('TypeScript types', () => {
		it('should accept valid CommonServerOptions', () => {
			const plugin = MultiserverPlugin({
				port: 3000,
				host: 'localhost',
				strictPort: true,
				open: true,
				proxy: {},
				cors: true,
				headers: {},
				allowedHosts: [],
			});

			expect(plugin).toBeDefined();
		});

		it('should accept valid override options', () => {
			const plugin = MultiserverPlugin({
				port: 3000,
				overrides: {
					base: '/',
					cacheDir: '.vite',
					clearScreen: false,
					define: {},
					envDir: './',
					envPrefix: 'VITE_',
					mode: 'development',
					publicDir: 'public',
					root: './',
					plugins: [],
				},
			});

			expect(plugin).toBeDefined();
		});
	});
});
