# vite-plugin-multiserver

> A Vite plugin to launch multiple servers for the same app.

[![License](https://img.shields.io/github/license/idleberg/vite-plugin-multiserver?color=blue&style=for-the-badge)](https://github.com/idleberg/vite-plugin-multiserver/blob/main/LICENSE)
[![Version: npm](https://img.shields.io/npm/v/vite-plugin-multiserver?style=for-the-badge)](https://www.npmjs.org/package/vite-plugin-multiserver)
[![Version: jsr](https://img.shields.io/jsr/v/@idleberg/vite-plugin-multiserver?style=for-the-badge)](https://jsr.io/@idleberg/vite-plugin-multiserver)
[![CI: Node](https://img.shields.io/github/actions/workflow/status/idleberg/vite-plugin-multiserver/node.yml?logo=nodedotjs&logoColor=white&style=for-the-badge)](https://github.com/idleberg/vite-plugin-multiserver/actions/workflows/node.yml)
[![CI: Deno](https://img.shields.io/github/actions/workflow/status/idleberg/vite-plugin-multiserver/deno.yml?logo=deno&logoColor=white&style=for-the-badge)](https://github.com/idleberg/vite-plugin-multiserver/actions/workflows/deno.yml)

## Why?

This plugin was created for rare use-cases where one would want to spin up multiple versions of the same page, both for development and testing. The same could be achieved using the command-line or multiple Vite configs, but the idea was to keep the setup simple.

## Installation

On NodeJS or Bun you can install from npm

```shell
npm install vite-plugin-multiserver
```

On Deno you can install using JSR

```shell
deno add jsr:@idleberg/vite-plugin-multiserver
```

## Usage

Let's start with a basic example where we spin up a server for the main website and a second one for an iFrame embedded by that page. The idea is that both are part of the same application, but we want to be able to test cross-origin messaging.

```javascript
import { defineConfig } from "vite";
import multiServer from "vite-plugin-multiserver";

export default defineConfig({
	// The main server for our application.
	server: {
		open: "/",
		port: 7001,
	},
	plugins: [
		// This server hosts the iFrame route, embedded by the page above.
		multiServer({
			open: "/iframe",
			port: 7002,
		}),
	],
});
```

### API

`multiServer(options)`

### Options

> [!TIP]
> The options can be provided as both, a single options object or an array of many.

The default options are currently a subset of the Vite server options:

- [`allowedHosts`](https://vite.dev/config/server-options.html#server-allowedhosts)
- [`cors`](https://vite.dev/config/server-options.html#server-cors)
- [`headers`](https://vite.dev/config/server-options.html#server-headers)
- [`host`](https://vite.dev/config/server-options.html#server-host)
- [`https`](https://vite.dev/config/server-options.html#server-https)
- [`open`](https://vite.dev/config/server-options.html#server-open)
- [`port`](https://vite.dev/config/server-options.html#server-port)
- [`proxy`](https://vite.dev/config/server-options.html#server-proxy)
- [`strictPort`](https://vite.dev/config/server-options.html#server-strictport)

Additionally, you can override some of Vite's top-level options:

- [`overrides.base`](https://vite.dev/config/shared-options.html#base)
- [`overrides.cacheDir`](https://vite.dev/config/shared-options.html#cachedir)
- [`overrides.clearScreen`](https://vite.dev/config/shared-options.html#clearscreen)
- [`overrides.customLogger`](https://vite.dev/config/shared-options.html#customlogger)
- [`overrides.define`](https://vite.dev/config/shared-options.html#define)
- [`overrides.envDir`](https://vite.dev/config/shared-options.html#envdir)
- [`overrides.envPrefix`](https://vite.dev/config/shared-options.html#envprefix)
- [`overrides.mode`](https://vite.dev/config/shared-options.html#mode)
- [`overrides.publicDir`](https://vite.dev/config/shared-options.html#publicdir)
- [`overrides.root`](https://vite.dev/config/shared-options.html#root)

## Related

If this project is not for you, maybe these alternatives suit you better:

- [vite-plugin-multiple](https://github.com/vite-plugin/vite-plugin-multiple)

## License

This work is licensed under [The MIT License](LICENSE).
