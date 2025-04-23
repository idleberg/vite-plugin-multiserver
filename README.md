# vite-plugin-multiserver

> A Vite plugin to launches multiple servers.

[![License](https://img.shields.io/github/license/idleberg/vite-plugin-multiserver?color=blue&style=for-the-badge)](https://github.com/idleberg/vite-plugin-multiserver/blob/main/LICENSE)
[![Version: npm](https://img.shields.io/npm/v/vite-plugin-multiserver?style=for-the-badge)](https://www.npmjs.org/package/vite-plugin-multiserver)
[![Version: jsr](https://img.shields.io/jsr/v/@idleberg/vite-plugin-multiserver?style=for-the-badge)](https://jsr.io/@idleberg/vite-plugin-multiserver)
[![CI: Node](https://img.shields.io/github/actions/workflow/status/idleberg/vite-plugin-multiserver/node.yml?logo=nodedotjs&logoColor=white&style=for-the-badge)](https://github.com/idleberg/vite-plugin-multiserver/actions/workflows/node.yml)
[![CI: Deno](https://img.shields.io/github/actions/workflow/status/idleberg/vite-plugin-multiserver/deno.yml?logo=deno&logoColor=white&style=for-the-badge)](https://github.com/idleberg/vite-plugin-multiserver/actions/workflows/deno.yml)

## Installation

```shell
npm install -D vite-plugin-multiserver valibot
```

## Usage

Let's start with a very basic example

```javascript
import { defineConfig } from 'vite';
import multiServer from 'vite-plugin-multiserver';

export default defineConfig({
	plugins: [
		multiServer([
			{
				host: 'saturn.local',
				port: 7001
			},
						{
				host: 'jupiter.local',
				port: 7002
			}
		]),
	]
});
```

### API

`multiServer(schema, options?)`

### Options

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

- [`base`](https://vite.dev/config/shared-options.html#base)
- [`cacheDir`](https://vite.dev/config/shared-options.html#cachedir)
- [`clearScreen`](https://vite.dev/config/shared-options.html#clearscreen)
- [`customLogger`](https://vite.dev/config/shared-options.html#customlogger)
- [`define`](https://vite.dev/config/shared-options.html#define)
- [`envDir`](https://vite.dev/config/shared-options.html#envdir)
- [`envPrefix`](https://vite.dev/config/shared-options.html#envprefix)
- [`mode`](https://vite.dev/config/shared-options.html#mode)
- [`publicDir`](https://vite.dev/config/shared-options.html#publicdir)
- [`root`](https://vite.dev/config/shared-options.html#root)

## Related

- [vite-plugin-multiple](https://github.com/vite-plugin/vite-plugin-multiple) Allow multiple Vite to run simultaneously

## License

This work is licensed under [The MIT License](LICENSE).
