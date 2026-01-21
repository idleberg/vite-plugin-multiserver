import {
	type CommonServerOptions,
	createServer,
	type Plugin,
	type ResolvedConfig,
	type UserConfig,
	type ViteDevServer,
} from 'vite';

// Mix and match, based on the existing types of Vite options.
export type PluginOptions = CommonServerOptions & {
	overrides?: Pick<
		UserConfig,
		| 'base'
		| 'cacheDir'
		| 'clearScreen'
		| 'customLogger'
		| 'define'
		| 'envDir'
		| 'envPrefix'
		| 'mode'
		| 'plugins'
		| 'publicDir'
		| 'root'
	>;
};

/**

* Exports a Vite plugin launches multiple servers.

* @param options - an array of server options and Vite overrides

* @returns a Vite plugins

*/

export default function MultiserverPlugin(options: PluginOptions | PluginOptions[]): Plugin {
	const servers: ViteDevServer[] = [];

	let appConfig: UserConfig = {};

	async function createServers() {
		const optionsArray = Array.isArray(options) ? options : [options];

		for (const [index, config] of optionsArray.entries()) {
			const devServer = await createServer({
				configFile: false,

				...mergeOptions(config, appConfig),
			});

			servers[index] = await devServer.listen();

			console.log(/* let it breathe */);

			servers[index].printUrls();

			servers[index].bindCLIShortcuts({
				print: true,
			});
		}
	}

	async function handleServer(server: ViteDevServer) {
		await createServers();

		server.httpServer?.on('close', () => {
			for (const s of servers) {
				s.close();
			}
		});
	}

	return {
		name: 'vite-plugin-multiserver',

		configResolved(config) {
			appConfig = mergeOptions({}, config);
		},

		async configureServer(server) {
			await handleServer(server);
		},

		async configurePreviewServer() {
			await createServer();
		},
	};
}

/**

* Helper function to filter & merge options.
* @param config
* @param appConfig
* @returns
*/
export function mergeOptions(config: PluginOptions, appConfig: ResolvedConfig | UserConfig): UserConfig {
	return {
		// Overrides
		base: config.overrides?.base ?? appConfig.base ?? undefined,
		cacheDir: config.overrides?.cacheDir ?? appConfig.cacheDir ?? undefined,
		clearScreen: config.overrides?.clearScreen ?? appConfig.clearScreen ?? undefined,
		customLogger: config.overrides?.customLogger ?? appConfig.customLogger ?? undefined,
		define: config.overrides?.define ?? appConfig.define ?? undefined,
		envDir: config.overrides?.envDir ?? appConfig.envDir ?? undefined,
		envPrefix: config.overrides?.envPrefix ?? appConfig.envPrefix ?? undefined,
		mode: config.overrides?.mode ?? appConfig.mode ?? undefined,
		publicDir: config.overrides?.publicDir ?? appConfig.publicDir ?? undefined,
		root: config.overrides?.root ?? appConfig.root ?? undefined,
		plugins: config.overrides?.plugins ?? [],

		// Server options
		server: {
			allowedHosts: config.allowedHosts ?? appConfig.server?.allowedHosts ?? undefined,
			cors: config.cors ?? appConfig.server?.cors ?? undefined,
			headers: config.headers ?? appConfig.server?.headers ?? undefined,
			https: config.https ?? appConfig.server?.https ?? undefined,
			proxy: config.proxy ?? appConfig.server?.proxy ?? undefined,
			strictPort: config.strictPort ?? appConfig.server?.strictPort ?? undefined,

			// Don't inherit the app config
			host: config.host ?? undefined,
			open: config.open ?? undefined,
			port: config.port ?? undefined,
		},
	};
}
