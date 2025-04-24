import {
	type CommonServerOptions,
	type Plugin,
	type ResolvedConfig,
	type UserConfig,
	type ViteDevServer,
	createServer,
} from 'vite';

// Mix and match, based on the existing types of Vite options.
type PluginOptions = CommonServerOptions & {
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
		| 'publicDir'
		| 'root'
	>;
};

const servers: ViteDevServer[] = [];

/**
 * Exports a Vite plugin launches multiple servers.
 * @param options - an array of server options and Vite overrides
 * @param inheritAppOptions - whether to inherit the app options
 * @returns a Vite plugins
 */
export default function MultiserverPlugin(options: PluginOptions | PluginOptions[], inheritAppOptions = true): Plugin {
	let appConfig: UserConfig = {};

	return {
		name: 'vite-plugin-multiserver',
		configResolved(config) {
			if (!inheritAppOptions) {
				return;
			}

			appConfig = mergeOptions({}, config);
		},

		configureServer() {
			const optionsArray = Array.isArray(options) ? options : [options];

			optionsArray.forEach(async (config, index) => {
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
			});
		},

		closeBundle() {
			/**
			 * It seems I have to close the servers because otherwise they will start
			 * on different ports whenever the `vite.config.ts` file is changed. This
			 * can't be right and I hope I can get around this in the future.
			 *
			 * Any ideas?
			 */
			for (const server of servers) {
				server.close();
			}
		},
	};
}

/**
 * Helper function to filter & merge options.
 * @param config
 * @param appConfig
 * @returns
 */
function mergeOptions(config: PluginOptions, appConfig: ResolvedConfig | UserConfig): UserConfig {
	return {
		// Overrides
		base: config.overrides?.base ?? appConfig.base,
		cacheDir: config.overrides?.cacheDir ?? appConfig.cacheDir,
		clearScreen: config.overrides?.clearScreen ?? appConfig.clearScreen,
		customLogger: config.overrides?.customLogger ?? appConfig.customLogger,
		define: config.overrides?.define ?? appConfig.define,
		envDir: config.overrides?.envDir ?? appConfig.envDir,
		envPrefix: config.overrides?.envPrefix ?? appConfig.envPrefix,
		mode: config.overrides?.mode ?? appConfig.mode,
		publicDir: config.overrides?.publicDir ?? appConfig.publicDir,
		root: config.overrides?.root ?? appConfig.root,

		// Server options
		server: {
			allowedHosts: config.allowedHosts ?? appConfig.server?.allowedHosts,
			cors: config.cors ?? appConfig.server?.cors,
			headers: config.headers ?? appConfig.server?.headers,
			host: config.host ?? appConfig.server?.host,
			https: config.https ?? appConfig.server?.https,
			open: config.open ?? appConfig.server?.open,
			port: config.port ?? appConfig.server?.port,
			proxy: config.proxy ?? appConfig.server?.proxy,
			strictPort: config.strictPort ?? appConfig.server?.strictPort,
		},
	};
}
