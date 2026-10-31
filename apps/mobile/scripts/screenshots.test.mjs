import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { ANIMATED_TOLERANCE, BASE_WIDTH, TOLERANCE, diff, limitFor, normalise } from './screenshots.mjs';

// A 1080×2340 "screen": white with a dark card, like a preview example.
async function screen({ cardColor = '#202020', statusBar = '#ffffff', dot = false } = {}) {
  const w = 1080;
  const h = 2340;
  const overlays = [
    { input: { create: { width: w, height: 120, channels: 3, background: statusBar } }, top: 0, left: 0 },
    { input: { create: { width: 800, height: 400, channels: 3, background: cardColor } }, top: 900, left: 140 },
  ];
  if (dot) overlays.push({ input: { create: { width: 6, height: 6, channels: 3, background: '#ff0000' } }, top: 2000, left: 500 });
  return sharp({ create: { width: w, height: h, channels: 3, background: '#ffffff' } }).composite(overlays).png().toBuffer();
}

test('normalise downscales to the baseline width', async () => {
  const meta = await sharp(await normalise(await screen())).metadata();
  assert.equal(meta.width, BASE_WIDTH);
});

test('identical screens do not differ', async () => {
  const a = await normalise(await screen());
  const { ratio } = await diff(a, await normalise(await screen()), 'ios');
  assert.equal(ratio, 0);
});

test('a changed card is caught on both platforms', async () => {
  const a = await normalise(await screen());
  const b = await normalise(await screen({ cardColor: '#2060ff' }));
  for (const platform of ['ios', 'android']) {
    const { ratio, image } = await diff(a, b, platform);
    assert.ok(ratio > TOLERANCE[platform], `${platform}: ${ratio}`);
    assert.ok(image.length > 0);
  }
});

test('the status bar is masked', async () => {
  const a = await normalise(await screen());
  const b = await normalise(await screen({ statusBar: '#000000' }));
  assert.equal((await diff(a, b, 'ios')).ratio, 0);
});

test('a speck of noise passes on Android, not a size change', async () => {
  const a = await normalise(await screen());
  assert.ok((await diff(a, await normalise(await screen({ dot: true })), 'android')).ratio <= TOLERANCE.android);
  const smaller = await sharp(a).resize({ width: BASE_WIDTH, height: 600, fit: 'fill' }).png().toBuffer();
  assert.equal((await diff(a, smaller, 'android')).ratio, 1);
});

test('animated examples get the looser limit', () => {
  assert.equal(limitFor('loading-indicator--0--ios.png', 'ios'), ANIMATED_TOLERANCE);
  assert.equal(limitFor('button--1--android.png', 'android'), ANIMATED_TOLERANCE);
  assert.equal(limitFor('button--0--ios.png', 'ios'), TOLERANCE.ios);
});
