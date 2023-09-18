#!/usr/bin/env node

const fs = require("fs");
const prettyBytes = require("pretty-bytes");
const sharp = require("sharp");

if (process.argv.length !== 4 && process.argv.length !== 5) {
  console.error("usage: bespoke file.jpg name (prefix)");
  process.exit(0);
}

const inputBuffer = fs.readFileSync(process.argv[2]);
const name = process.argv[3];
const customPrefix = process.argv[4];
const today = new Date();

const prefix = customPrefix
  ? customPrefix
  : `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

fs.renameSync(process.argv[2], `${prefix}-${name}_original.jpg`);

(async function () {
  for (let res of [128, 640, 1280, 2880]) {
    const jpgOutputFilename = `${prefix}-${name}_${res}.jpg`;
    const webpOutputFilename = `${prefix}-${name}_${res}.webp`;

    await sharp(inputBuffer).resize(res).toFile(jpgOutputFilename);

    await sharp(inputBuffer).resize(res).toFile(webpOutputFilename);

    console.log(
      `${res}x webp ${prettyBytes(
        fs.readFileSync(webpOutputFilename).byteLength
      )}`
    );

    console.log(
      `${res}x jpg ${prettyBytes(
        fs.readFileSync(jpgOutputFilename).byteLength
      )}`
    );
  }
})();
