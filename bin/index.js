#!/usr/bin/env node
require("make-promises-safe");

// Require Node.js Dependencies
const { copyFile, readdir, mkdir, unlink } = require("fs").promises;
const { resolve, join } = require("path");

// Require Third-party Dependencies
const rmfr = require("rmfr");
const { downloadNodeFile, extract, constants: { File } } = require("@slimio/nodejs-downloader");
const commander = require("commander");
const libnpm = require("libnpm");
const { gray, yellow, green } = require("kleur");

/**
 * @async
 * @func downloadNAPIHeader
 * @desc Download and extract NAPI Headers
 * @param {!String} includeDir include directory absolute path
 * @returns {Promise<void>}
 */
async function downloadNAPIHeader(includeDir) {
    const tarFile = await downloadNodeFile(File.Headers, {
        dest: includeDir
    });
    const headerDir = await extract(tarFile);
    await unlink(tarFile);

    const [nodeVerDir] = await readdir(headerDir);
    const nodeDir = join(headerDir, nodeVerDir, "include", "node");

    await Promise.all([
        copyFile(join(nodeDir, "node_api.h"), join(includeDir, "node_api.h")),
        copyFile(join(nodeDir, "node_api_types.h"), join(includeDir, "node_api_types.h"))
    ]);

    await rmfr(headerDir);
}

/**
 * @async
 * @func main
 * @returns {Promise<void>}
 */
async function main() {
    commander
        .version("0.1.0")
        .option("-o, --output <directory>", "output directory")
        .option("-n, --napi", "include N-API headers")
        .option("-c, --cpp", "include C++ node-addon-api headers")
        .parse(process.argv);

    const getNAPI = Boolean(commander.napi);
    const getNodeAddonAPI = Boolean(commander.cpp);
    let outputDirectory = commander.output;
    if (typeof outputDirectory === "undefined") {
        outputDirectory = resolve(process.cwd(), "include");
        try {
            await mkdir(outputDirectory);
        }
        catch (err) {
            // Ignore
        }
    }
    console.log(gray(`\n > Output directory configured as: ${yellow(outputDirectory)}`));

    if (getNodeAddonAPI) {
        console.log("\nDownload N-API & node-addon-api Headers...");
        const dir = join(outputDirectory, "nodeaddonapi");
        await mkdir(dir);
        await libnpm.extract("node-addon-api", dir);
        const src = join(dir, "src");

        await Promise.all([
            copyFile(join(dir, "napi.h"), join(outputDirectory, "napi.h")),
            copyFile(join(dir, "napi-inl.h"), join(outputDirectory, "napi-inl.h")),
            copyFile(join(src, "node_api.h"), join(outputDirectory, "node_api.h")),
            copyFile(join(src, "node_api_types.h"), join(outputDirectory, "node_api_types.h"))
        ]);
        await rmfr(dir);
    }
    else if (getNAPI) {
        console.log("\nDownload N-API Headers...");
        await downloadNAPIHeader(outputDirectory);
    }
    console.log(green("Program executed with no errors!\n"));
}
main().catch(console.error);
