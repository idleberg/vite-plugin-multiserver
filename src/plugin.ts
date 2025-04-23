import {
	createServer,
	type CommonServerOptions,
	type UserConfig,
	type Plugin,
	type ViteDevServer,
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
 * @returns a Vite plugins
 */
export default function MultiserverPlugin(options: PluginOptions[]): Plugin {
	return {
		name: 'vite-plugin-multiserver',
		configureServer() {
			const optionsArray = Array.isArray(options) ? options : [options];

			optionsArray.forEach(async (config, index) => {
				const devServer = await createServer({
					configFile: false,

					// Overrides
					base: config.overrides?.base,
					cacheDir: config.overrides?.cacheDir,
					clearScreen: config.overrides?.clearScreen,
					customLogger: config.overrides?.customLogger,
					define: config.overrides?.define,
					envDir: config.overrides?.envDir,
					envPrefix: config.overrides?.envPrefix,
					mode: config.overrides?.mode,
					publicDir: config.overrides?.publicDir,
					root: config.overrides?.root,

					// Server options
					server: {
						allowedHosts: config.allowedHosts,
						cors: config.cors,
						headers: config.headers,
						host: config.host,
						https: config.https,
						open: config.open,
						port: config.port,
						proxy: config.proxy,
						strictPort: config.strictPort,
					},
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
