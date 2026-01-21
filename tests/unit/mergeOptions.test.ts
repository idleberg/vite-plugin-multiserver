import type { UserConfig } from 'vite';
import { describe, expect, it } from 'vitest';
import { mergeOptions, type PluginOptions } from '../../src/plugin.ts';

describe('mergeOptions', () => {
	describe('server options', () => {
		it('should merge server port from plugin config', () => {
			const pluginConfig: PluginOptions = {
				port: 3000,
			};
			const appConfig: Partial<UserConfig> = {
				server: { port: 5173 },
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.server?.port).toBe(3000);
		});

		it('should not inherit port from app config', () => {
			const pluginConfig: PluginOptions = {};
			const appConfig: Partial<UserConfig> = {
				server: { port: 5173 },
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.server?.port).toBeUndefined();
		});

		it('should not inherit host from app config', () => {
			const pluginConfig: PluginOptions = {};
			const appConfig: Partial<UserConfig> = {
				server: { host: 'localhost' },
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.server?.host).toBeUndefined();
		});

		it('should not inherit open from app config', () => {
			const pluginConfig: PluginOptions = {};
			const appConfig: Partial<UserConfig> = {
				server: { open: true },
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.server?.open).toBeUndefined();
		});

		it('should merge strictPort from plugin config', () => {
			const pluginConfig: PluginOptions = {
				strictPort: true,
			};
			const appConfig: Partial<UserConfig> = {
				server: { strictPort: false },
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.server?.strictPort).toBe(true);
		});

		it('should inherit strictPort from app config when not specified', () => {
			const pluginConfig: PluginOptions = {};
			const appConfig: Partial<UserConfig> = {
				server: { strictPort: true },
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.server?.strictPort).toBe(true);
		});

		it('should merge https from plugin config', () => {
			const pluginConfig: PluginOptions = {
				https: true,
			};
			const appConfig: Partial<UserConfig> = {};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.server?.https).toBe(true);
		});

		it('should merge cors from plugin config', () => {
			const pluginConfig: PluginOptions = {
				cors: { origin: '*' },
			};
			const appConfig: Partial<UserConfig> = {};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.server?.cors).toEqual({ origin: '*' });
		});

		it('should merge headers from plugin config', () => {
			const headers = { 'X-Custom': 'value' };
			const pluginConfig: PluginOptions = {
				headers,
			};
			const appConfig: Partial<UserConfig> = {};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.server?.headers).toEqual(headers);
		});

		it('should merge proxy from plugin config', () => {
			const proxy = { '/api': 'http://localhost:4000' };
			const pluginConfig: PluginOptions = {
				proxy,
			};
			const appConfig: Partial<UserConfig> = {};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.server?.proxy).toEqual(proxy);
		});

		it('should merge allowedHosts from plugin config', () => {
			const allowedHosts = ['example.com'];
			const pluginConfig: PluginOptions = {
				allowedHosts,
			};
			const appConfig: Partial<UserConfig> = {};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.server?.allowedHosts).toEqual(allowedHosts);
		});
	});

	describe('override options', () => {
		it('should use override base when specified', () => {
			const pluginConfig: PluginOptions = {
				overrides: { base: '/custom/' },
			};
			const appConfig: Partial<UserConfig> = {
				base: '/app/',
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.base).toBe('/custom/');
		});

		it('should inherit base from app config when override not specified', () => {
			const pluginConfig: PluginOptions = {};
			const appConfig: Partial<UserConfig> = {
				base: '/app/',
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.base).toBe('/app/');
		});

		it('should use override root when specified', () => {
			const pluginConfig: PluginOptions = {
				overrides: { root: '/custom/root' },
			};
			const appConfig: Partial<UserConfig> = {
				root: '/app/root',
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.root).toBe('/custom/root');
		});

		it('should use override publicDir when specified', () => {
			const pluginConfig: PluginOptions = {
				overrides: { publicDir: 'custom-public' },
			};
			const appConfig: Partial<UserConfig> = {
				publicDir: 'public',
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.publicDir).toBe('custom-public');
		});

		it('should use override cacheDir when specified', () => {
			const pluginConfig: PluginOptions = {
				overrides: { cacheDir: 'custom-cache' },
			};
			const appConfig: Partial<UserConfig> = {
				cacheDir: '.vite',
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.cacheDir).toBe('custom-cache');
		});

		it('should use override mode when specified', () => {
			const pluginConfig: PluginOptions = {
				overrides: { mode: 'production' },
			};
			const appConfig: Partial<UserConfig> = {
				mode: 'development',
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.mode).toBe('production');
		});

		it('should use override define when specified', () => {
			const defineOverride = { __TEST__: 'true' };
			const pluginConfig: PluginOptions = {
				overrides: { define: defineOverride },
			};
			const appConfig: Partial<UserConfig> = {
				define: { __APP__: 'true' },
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.define).toEqual(defineOverride);
		});

		it('should use override plugins when specified', () => {
			const customPlugins = [{ name: 'custom-plugin' }];
			const pluginConfig: PluginOptions = {
				overrides: { plugins: customPlugins },
			};
			const appConfig: Partial<UserConfig> = {};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.plugins).toEqual(customPlugins);
		});

		it('should default plugins to empty array when not specified', () => {
			const pluginConfig: PluginOptions = {};
			const appConfig: Partial<UserConfig> = {};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.plugins).toEqual([]);
		});

		it('should use override envDir when specified', () => {
			const pluginConfig: PluginOptions = {
				overrides: { envDir: './custom-env' },
			};
			const appConfig: Partial<UserConfig> = {
				envDir: './',
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.envDir).toBe('./custom-env');
		});

		it('should use override envPrefix when specified', () => {
			const pluginConfig: PluginOptions = {
				overrides: { envPrefix: 'CUSTOM_' },
			};
			const appConfig: Partial<UserConfig> = {
				envPrefix: 'VITE_',
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.envPrefix).toBe('CUSTOM_');
		});

		it('should use override clearScreen when specified', () => {
			const pluginConfig: PluginOptions = {
				overrides: { clearScreen: false },
			};
			const appConfig: Partial<UserConfig> = {
				clearScreen: true,
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.clearScreen).toBe(false);
		});
	});

	describe('priority', () => {
		it('should prioritize plugin config over app config for server options', () => {
			const pluginConfig: PluginOptions = {
				port: 8080,
				host: '0.0.0.0',
				strictPort: true,
				https: true,
			};
			const appConfig: Partial<UserConfig> = {
				server: {
					port: 3000,
					host: 'localhost',
					strictPort: false,
					https: false,
				},
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.server?.port).toBe(8080);
			expect(result.server?.host).toBe('0.0.0.0');
			expect(result.server?.strictPort).toBe(true);
			expect(result.server?.https).toBe(true);
		});

		it('should prioritize override values over app config values', () => {
			const pluginConfig: PluginOptions = {
				overrides: {
					base: '/override/',
					root: '/override/root',
					mode: 'test',
				},
			};
			const appConfig: Partial<UserConfig> = {
				base: '/app/',
				root: '/app/root',
				mode: 'development',
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.base).toBe('/override/');
			expect(result.root).toBe('/override/root');
			expect(result.mode).toBe('test');
		});
	});

	describe('empty configs', () => {
		it('should handle empty plugin config', () => {
			const pluginConfig: PluginOptions = {};
			const appConfig: Partial<UserConfig> = {
				base: '/app/',
				server: { strictPort: true },
			};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.base).toBe('/app/');
			expect(result.server?.strictPort).toBe(true);
			expect(result.server?.port).toBeUndefined();
		});

		it('should handle empty app config', () => {
			const pluginConfig: PluginOptions = {
				port: 3000,
				overrides: { base: '/custom/' },
			};
			const appConfig: Partial<UserConfig> = {};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.base).toBe('/custom/');
			expect(result.server?.port).toBe(3000);
		});

		it('should handle both empty configs', () => {
			const pluginConfig: PluginOptions = {};
			const appConfig: Partial<UserConfig> = {};

			const result = mergeOptions(pluginConfig, appConfig as UserConfig);

			expect(result.plugins).toEqual([]);
			expect(result.server).toBeDefined();
		});
	});
});
