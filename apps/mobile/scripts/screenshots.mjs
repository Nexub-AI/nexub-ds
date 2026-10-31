// Screenshot baselines for the Maestro preview flow (one image per docs example).
//
//   node scripts/screenshots.mjs record  <ios|android> <dir>
//   node scripts/screenshots.mjs compare <ios|android> <dir> [--out <diff-dir>]
//
// <dir> holds the flow's screenshots, named <slug>--<example>--<platform>.png
// (patterns: pattern-<name>--<platform>.png). Baselines live in
// .maestro/baselines/<platform>/, downscaled to BASE_WIDTH so they stay small
// (never upscaled) and comparisons ignore sub-pixel rendering noise. The docs show the same
// files as "on device" shots.
//
// compare fails when a screenshot differs from its baseline by more than the
// platform's tolerance, when a baseline is missing, or when a baseline has no
// screenshot any more. The status bar is masked (CI pins it to 9:41, but its
// icons can still shift). Diff images (changed pixels in magenta) go to --out.
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const BASE_WIDTH = 360;
// Share of the image height covered by the status bar, masked in comparisons.
const STATUS_BAR = { ios: 0.07, android: 0.045 };
// Share of pixels allowed to differ. iOS renders deterministically; the
// Android emulator's software GPU adds a little anti-aliasing noise.
export const TOLERANCE = { ios: 0.001, android: 0.005 };
// Examples that never stand still: the native spinner (UIActivityIndicatorView
// spins regardless of Reduce Motion; the Android emulator has animations off)
// and the Skeleton pulse are caught at a different frame each run. They get a
// looser limit instead of the platform's.
export const ANIMATED = new Set(['loading-indicator--0', 'button--1', 'skeleton--0']);
export const ANIMATED_TOLERANCE = 0.01;
export const limitFor = (file, platform) =>
  ANIMATED.has(basename(file).replace(/--(ios|android)\.png$/, '')) ? ANIMATED_TOLERANCE : TOLERANCE[platform];
// A pixel differs when any channel moves by more than this (0–255).
const CHANNEL_DELTA = 32;

export const baselineDir = (platform) => join(root, '.maestro/baselines', platform);

const shotsIn = (dir, platform) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(`--${platform}.png`)).sort() : [];

/** Downscale to the baseline width; palette PNG keeps each file to a few tens of KB. */
export async function normalise(input) {
  return sharp(input).resize({ width: BASE_WIDTH, withoutEnlargement: true }).png({ palette: true, quality: 90, compressionLevel: 9 }).toBuffer();
}

async function raw(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/** Share of differing pixels below the masked status bar, plus a diff image. */
export async function diff(aBuf, bBuf, platform) {
  const a = await raw(aBuf);
  const b = await raw(bBuf);
  if (a.width !== b.width || a.height !== b.height) {
    return { ratio: 1, reason: `size ${b.width}×${b.height} vs baseline ${a.width}×${a.height}` };
  }
  const top = Math.ceil(a.height * STATUS_BAR[platform]);
  const out = Buffer.from(b.data);
  let changed = 0;
  for (let y = top; y < a.height; y++) {
    for (let x = 0; x < a.width; x++) {
      const i = (y * a.width + x) * 4;
      const d = Math.max(
        Math.abs(a.data[i] - b.data[i]),
        Math.abs(a.data[i + 1] - b.data[i + 1]),
        Math.abs(a.data[i + 2] - b.data[i + 2]),
      );
      if (d > CHANNEL_DELTA) {
        changed++;
        out[i] = 255;
        out[i + 1] = 0;
        out[i + 2] = 255;
        out[i + 3] = 255;
      }
    }
  }
  const image = await sharp(out, { raw: { width: a.width, height: a.height, channels: 4 } }).png().toBuffer();
  return { ratio: changed / (a.width * (a.height - top)), image };
}

async function record(platform, dir) {
  const shots = shotsIn(dir, platform);
  if (shots.length === 0) throw new Error(`No *--${platform}.png screenshots in ${dir}`);
  const target = baselineDir(platform);
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  for (const f of shots) writeFileSync(join(target, f), await normalise(join(dir, f)));
  console.log(`Recorded ${shots.length} ${platform} baselines in ${target}`);
}

async function compare(platform, dir, outDir) {
  const shots = new Set(shotsIn(dir, platform));
  const base = new Set(shotsIn(baselineDir(platform), platform));
  const failures = [];
  for (const f of shots) {
    if (!base.has(f)) {
      failures.push(`${f}: no baseline (new example? record baselines)`);
      continue;
    }
    const { ratio, reason, image } = await diff(join(baselineDir(platform), f), await normalise(join(dir, f)), platform);
    const limit = limitFor(f, platform);
    if (ratio > limit) {
      failures.push(`${f}: ${reason ?? `${(ratio * 100).toFixed(2)}% of pixels differ (limit ${(limit * 100).toFixed(1)}%)`}`);
      if (outDir && image) {
        mkdirSync(outDir, { recursive: true });
        writeFileSync(join(outDir, basename(f, '.png') + '--diff.png'), image);
      }
    }
  }
  for (const f of base) if (!shots.has(f)) failures.push(`${f}: baseline has no screenshot (example removed? re-record)`);
  console.log(`Compared ${shots.size} ${platform} screenshots with ${base.size} baselines.`);
  if (failures.length) {
    console.error(`${failures.length} differ:\n  ${failures.join('\n  ')}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [mode, platform, dir, ...rest] = process.argv.slice(2);
  if (!['record', 'compare'].includes(mode) || !(platform in TOLERANCE) || !dir) {
    console.error('Usage: screenshots.mjs <record|compare> <ios|android> <dir> [--out <diff-dir>]');
    process.exit(2);
  }
  const out = rest[0] === '--out' ? rest[1] : undefined;
  await (mode === 'record' ? record(platform, dir) : compare(platform, dir, out));
}
