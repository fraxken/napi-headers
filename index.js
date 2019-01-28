// Node.js Dependencies
const { copyFile, readdir, mkdir, unlink } = require("fs").promises;
const { join } = require("path");

// Third-party Dependencies
const rmfr = require("rmfr");
const { downloadNodeFile, extract, constants: { File } } = require("@slimio/nodejs-downloader");
const libnpm = require("libnpm");

/**
 * @async
 * @func napi
 * @desc Download and extract NAPI Headers
 * @param {!String} dest destination directory
 * @param {String} [version] N-API Version
 * @returns {Promise<void>}
 */
async function napi(dest, version) {
    const tarFile = await downloadNodeFile(File.Headers, { dest, version });
    const headerDir = await extract(tarFile);
    await unlink(tarFile);

    const [nodeVerDir] = await readdir(headerDir);
    const nodeDir = join(headerDir, nodeVerDir, "include", "node");

    await Promise.all([
        copyFile(join(nodeDir, "node_api.h"), join(dest, "node_api.h")),
        copyFile(join(nodeDir, "node_api_types.h"), join(dest, "node_api_types.h"))
    ]);

    await rmfr(headerDir);
}

/**
 * @async
 * @func nodeAddonApi
 * @param {!String} dest destination
 * @param {String} [version] wanted version
 * @returns {Promise<void>}
 */
async function nodeAddonApi(dest, version) {
    const tempDirectory = join(dest, "nodeaddonapi");
    await mkdir(tempDirectory);

    // Find and extract node-addon-api package in temporary directory
    if (typeof version === "undefined") {
        const manifest = await libnpm.manifest("node-addon-api");
        version = manifest.version;
    }
    await libnpm.extract(`node-addon-api@${version}`, tempDirectory);

    // Copy all files we want
    await Promise.all([
        copyFile(join(tempDirectory, "napi.h"), join(dest, "napi.h")),
        copyFile(join(tempDirectory, "napi-inl.h"), join(dest, "napi-inl.h")),
        copyFile(join(tempDirectory, "src", "node_api.h"), join(dest, "node_api.h")),
        copyFile(join(tempDirectory, "src", "node_api_types.h"), join(dest, "node_api_types.h"))
    ]);

    // Remove temporary dir
    await rmfr(tempDirectory);
}

module.exports = { napi, nodeAddonApi };
