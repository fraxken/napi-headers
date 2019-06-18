# napi-headers
![ver](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/fraxken/napi-headers/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/fraxken/napi-headers/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![dep](https://img.shields.io/david/fraxken/napi-headers.svg)
![size](https://img.shields.io/github/repo-size/fraxken/napi-headers.svg)
[![Known Vulnerabilities](https://snyk.io//test/github/fraxken/napi-headers/badge.svg?targetFile=package.json)](https://snyk.io//test/github/fraxken/napi-headers?targetFile=package.json)

npm CLI to download Node.js [N-API](https://nodejs.org/api/n-api.html) headers and/or [node-addon-api](https://github.com/nodejs/node-addon-api) headers (for C++).

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm install napi-headers -g
# or
$ npx napi-headers
```

## Usage example

When installed globally the `nodehead` (or `napihead`) executable will be exposed in your terminal.
```bash
$ nodehead -c -o ./include
```

<p align="center">
    <img src="https://i.imgur.com/0HgP0Gv.png">
</p>

## API
napi-headers can be used as an API as well.

```js
const headers = require("napi-headers");

headers.napi(process.cwd()).catch(console.error)
```

### napi(dest: string, version?: string): void
Download N-API headers at the given destination. Version must be a valid Node.js release version (take a look [here](https://nodejs.org/download/release/)).

### nodeAddonApi(dest: string, version?: string): void
Download Node-addon-api headers at the given destination. Version must be a valid node-addon-api package version.

## Arguments

| argument | shortcut | description | default value |
| --- | --- | --- | --- |
| --napi | -n | Download Node.js N-API Headers | false |
| --cpp | -c | Download node-addon-api Headers | false |
| --output | -o | Ouput directory for headers | `process.cwd()/include` |

When `--cpp` is requested, `--napi` is ignored because node-addon-api already include Node.js N-API headers.

> Note: when output is undefined, the include directory will be created automatically !

### Download a given version of Node.js N-API headers
If you want to download headers for a specific version of Node.js, just write:
```bash
$ nodehead -n v11.0.0
```

### Download a given version of Node-addon-api package
If you want to download a given version of node-addon-api (for headers), just write:
```bash
$ nodehead -c 1.6.0
```

## License
MIT
