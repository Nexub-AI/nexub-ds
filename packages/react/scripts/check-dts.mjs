// vaul is bundled, not a dependency: if the published types import it,
// consumers get `any` for Drawer/Sheet. Fail the build instead.
import { readdirSync, readFileSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const leaks = readdirSync(dist)
  .filter((f) => f.endsWith('.d.ts'))
  .filter((f) => /from ['"]vaul['"]/.test(readFileSync(new URL(f, dist), 'utf8')));
if (leaks.length) {
  console.error(`Type declarations import 'vaul', which isn't a dependency: ${leaks.join(', ')}`);
  process.exit(1);
}
