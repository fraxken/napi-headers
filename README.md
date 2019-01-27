# napi-headers
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![V1.0](https://img.shields.io/badge/version-0.1.0-blue.svg)

npm CLI to download Node.js [N-API](https://nodejs.org/api/n-api.html) headers and/or [node-addon-api](https://github.com/nodejs/node-addon-api) headers (for C++).

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm install napi-headers -g
# or
$ npx napi-headers
```

## Usage example

When installed globally the `napihead` executable will be exposed in your terminal.
```bash
napihead -c -o ./include
```

<p align="center">
    <img src="https://i.imgur.com/iTLZlpR.png">
</p>

## Arguments

| argument | shortcut | description | default value |
| --- | --- | --- | --- |
| --napi | -n | Download Node.js N-API Headers | false |
| --cpp | -c | Download node-addon-api Headers | false |
| --output | -o | Ouput directory for headers | `process.cwd()/include` |

When `--cpp` is requested, `--napi` is ignored because node-addon-api already include Node.js N-API headers.

> Note: when output is undefined, the include directory will be created automatically !

## Licence
MIT
