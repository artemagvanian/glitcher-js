import {
  ask,
  extractAll,
  extractChunk,
  saveRaw,
  openRaw,
  construct,
  overlay,
} from "./util.js";

const processChunk = async (chunkRect, filenames) => {
  const { channels, raw } = await extractChunk(filenames.original, chunkRect);
  await saveRaw(raw, filenames.raw);
  // wait until we finish meddling with the picture
  await ask("Press Enter to recombine...");
  const buf = await openRaw(filenames.raw);
  await overlay(
    filenames.original,
    filenames.final,
    buf,
    { width: chunkRect.width, height: chunkRect.height, channels },
    chunkRect
  );
};

const processAll = async (filenames) => {
  const { width, height, channels, raw } = await extractAll(filenames.original);
  await saveRaw(raw, filenames.raw);
  // wait until we finish meddling with the picture
  await ask("Press Enter to recombine...");
  const buf = await openRaw(filenames.raw);
  await construct(buf, filenames.final, { raw: { width, height, channels } });
};

const filenames = (filename, ext = "jpg") => {
  return {
    original: `./data/processing/${filename}.${ext}`,
    raw: `./data/temp/${filename}.raw`,
    final: `./data/result/${filename}.${ext}`,
  };
};

// Examples of using the functions above

// const chunkRect = {
//   left: 600,
//   top: 600,
//   width: 400,
//   height: 400,
// };

// processChunk(chunkRect, filenames("input"));
// processAll(filenames("input", "png"));
