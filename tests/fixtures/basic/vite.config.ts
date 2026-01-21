import { defineConfig } from 'vite';
import multiServer from '../../../src/plugin';

export default defineConfig({
	// Main server configuration
	server: {
		port: 7001,
		strictPort: true,
	},
	plugins: [
		// Additional server for iframe
		multiServer({
			port: 7002,
			strictPort: true,
		}),
	],
});
