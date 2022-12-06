import sharp from "sharp";
import readline from "readline";
import { promises } from "fs";

export const ask = async (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
};

export const extractAll = async (filename) => {
  const image = await sharp(filename);
  return {
    width: (await image.metadata()).width,
    height: (await image.metadata()).height,
    channels: (await image.metadata()).channels,
    raw: await image.raw().toBuffer(),
  };
};

export const extractChunk = async (filename, rect) => {
  const image = await sharp(filename).extract(rect);
  return {
    channels: (await image.metadata()).channels,
    raw: await image.raw().toBuffer(),
  };
};

export const saveRaw = async (buf, filename) => {
  return await promises.writeFile(filename, buf);
};

export const openRaw = async (filename) => {
  return await promises.readFile(filename);
};

export const construct = async (buf, filename, meta) => {
  return await sharp(buf, meta).toFile(filename);
};

export const overlay = async (
  inFilename,
  outFilename,
  chunk,
  chunkMeta,
  chunkRect
) => {
  const fullImg = sharp(inFilename);
  return await fullImg
    .composite([
      {
        input: chunk,
        top: chunkRect.top,
        left: chunkRect.left,
        raw: chunkMeta,
      },
    ])
    .toFile(outFilename);
};
