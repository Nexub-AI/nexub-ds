// Copies the mobile screenshot baselines (apps/mobile/.maestro/baselines/<platform>/,
// recorded by the Mobile workflow on a real iOS simulator and Android emulator)
// into public/device-shots/ for the "On device" row of native component pages.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const docs = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(docs, '../mobile/.maestro/baselines');
const to = join(docs, 'public/device-shots');

rmSync(to, { recursive: true, force: true });
mkdirSync(to, { recursive: true });
for (const platform of ['ios', 'android']) {
  if (existsSync(join(from, platform))) cpSync(join(from, platform), join(to, platform), { recursive: true });
}
