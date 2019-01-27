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
 * @param {String} [version] N-API Version
 * @returns {Promise<void>}
 */
async function downloadNAPIHeader(includeDir, version) {
    const tarFile = await downloadNodeFile(File.Headers, {
        dest: includeDir,
        version
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

async function getOutputDirectory(baseOuput) {
    if (typeof baseOuput === "undefined") {
        baseOuput = resolve(process.cwd(), "include");
        try {
            await mkdir(baseOuput);
        }
        catch (err) {
            // Ignore
        }
    }

    return baseOuput;
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
        .option("-n, --napi [version]", "include N-API headers")
        .option("-c, --cpp [version]", "include C++ node-addon-api headers")
        .parse(process.argv);

    // Retrieve argv
    const getNAPI = typeof commander.napi === "string" ? true : Boolean(commander.napi);
    const getNAPIVersion = typeof commander.napi === "string" ? commander.napi : void 0;
    const getNodeAddonAPI = typeof commander.cpp === "string" ? true : Boolean(commander.cpp);

    const outputDirectory = await getOutputDirectory(commander.output);
    console.log(gray(`\n > Output directory: ${yellow(outputDirectory)}`));

    if (getNodeAddonAPI) {
        console.log("\nDownload Node-addon-api package...");
        const tempDirectory = join(outputDirectory, "nodeaddonapi");
        await mkdir(tempDirectory);

        // Find and extract node-addon-api package in temporary directory
        const manifest = await libnpm.manifest("node-addon-api");
        const wantedVersion = typeof commander.cpp === "string" ? commander.cpp : manifest.version;
        console.log(`Node-addon-api version: ${yellow(wantedVersion)}`);
        await libnpm.extract(`node-addon-api@${wantedVersion}`, tempDirectory);

        // Copy all files we want
        await Promise.all([
            copyFile(join(tempDirectory, "napi.h"), join(outputDirectory, "napi.h")),
            copyFile(join(tempDirectory, "napi-inl.h"), join(outputDirectory, "napi-inl.h")),
            copyFile(join(tempDirectory, "src", "node_api.h"), join(outputDirectory, "node_api.h")),
            copyFile(join(tempDirectory, "src", "node_api_types.h"), join(outputDirectory, "node_api_types.h"))
        ]);

        // Remove temporary dir
        await rmfr(tempDirectory);
    }
    else if (getNAPI) {
        console.log(`\nDownload N-API Headers (version ${getNAPIVersion || process.version})`);
        await downloadNAPIHeader(outputDirectory, getNAPIVersion);
    }

    console.log(green("Program executed with no errors!\n"));
}
main().catch(console.error);
