#!/usr/bin/env node
require("make-promises-safe");

// Require Node.js Dependencies
const { mkdir } = require("fs").promises;
const { resolve } = require("path");

// Require Third-party Dependencies
const commander = require("commander");
const { gray, yellow, green } = require("kleur");
const ora = require("ora");

// Internal
const { napi, nodeAddonApi } = require("../index");

/**
 * @async
 * @func getOutputDirectory
 * @param {!String} baseOuput baseOuput
 * @returns {Promise<String>}
 */
async function getOutputDirectory(baseOuput) {
    if (typeof baseOuput === "undefined") {
        baseOuput = resolve(process.cwd(), "include");
        // eslint-disable-next-line
        await mkdir(baseOuput).catch((err) => void 0);
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
    const getNodeAddonAPI = typeof commander.cpp === "string" ? true : Boolean(commander.cpp);
    const outputDirectory = await getOutputDirectory(commander.output);
    console.log(gray(`\n > Output directory: ${yellow(outputDirectory)}\n`));

    if (getNodeAddonAPI) {
        const spin = ora("\nDownload Node-addon-api package...").start();
        const wantedVersion = typeof commander.cpp === "string" ? commander.cpp : void 0;
        await nodeAddonApi(outputDirectory, wantedVersion);
        spin.succeed();
    }
    else if (getNAPI) {
        const wantedVersion = typeof commander.napi === "string" ? commander.napi : void 0;

        const spin = ora(`Download N-API Headers (version ${wantedVersion || process.version})`).start();
        await napi(outputDirectory, wantedVersion);
        spin.succeed();
    }

    console.log(green("\nProgram executed with no errors!\n"));
}
main().catch(console.error);
