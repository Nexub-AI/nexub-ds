// Zero-dependency static server for storybook-static/ (vite preview needs
// platform-native esbuild, which breaks when the repo is mounted into the
// Linux Playwright container from macOS). SERVE_ROOT serves another directory,
// e.g. the docs static export, where /foundations/colors is foundations/colors.html.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root =
  process.env.SERVE_ROOT ?? fileURLToPath(new URL('../storybook-static/', import.meta.url));
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  let file = join(root, path.endsWith('/') ? `${path}index.html` : path);
  try {
    const body = await readFile(file).catch(() => readFile((file += '.html')));
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
}).listen(Number(process.env.PORT ?? 6007));
