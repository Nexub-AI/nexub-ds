// Serves the static export (apps/docs/out) the way Cloudflare Pages does, for
// Lighthouse CI: clean URLs (/components/button → components/button.html),
// brotli/gzip compression and the long-lived cache on hashed assets from
// public/_headers. The Pages Function (functions/_middleware.ts, CSP nonce)
// does not run here.
//   node apps/docs/scripts/serve-static.mjs [dir=apps/docs/out] [port=4173]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const root = resolve(process.argv[2] ?? 'apps/docs/out');
const port = Number(process.argv[3] ?? 4173);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
  '.map': 'application/json',
};
const compressible = /^(text\/|application\/(json|xml|wasm)|image\/svg)/;
// Compressed bodies are cached so compression time never shows up as server latency.
const cache = new Map();

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

// Same lookup order as Pages: exact file, <path>.html, <path>/index.html.
async function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const base = join(root, clean);
  if (!base.startsWith(root)) return null;
  const candidates = clean.endsWith('/')
    ? [join(base, 'index.html'), `${base.replace(/\/$/, '')}.html`]
    : [base, `${base}.html`, join(base, 'index.html')];
  for (const candidate of candidates) if (await isFile(candidate)) return candidate;
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  let file = await resolveFile(pathname);
  let status = 200;
  if (!file) {
    file = join(root, '404.html');
    status = 404;
  }
  let body = await readFile(file);
  const type = types[extname(file)] ?? 'application/octet-stream';
  const headers = {
    'Content-Type': type,
    'Cache-Control': pathname.startsWith('/_next/static/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=60, stale-while-revalidate=600',
    Vary: 'Accept-Encoding',
  };
  const accept = String(req.headers['accept-encoding'] ?? '');
  if (compressible.test(type) && body.length > 1024) {
    const encoding = /\bbr\b/.test(accept) ? 'br' : /\bgzip\b/.test(accept) ? 'gzip' : null;
    if (encoding) {
      const key = `${encoding}:${file}`;
      if (!cache.has(key)) cache.set(key, encoding === 'br' ? brotliCompressSync(body) : gzipSync(body));
      body = cache.get(key);
      headers['Content-Encoding'] = encoding;
    }
  }
  headers['Content-Length'] = body.length;
  res.writeHead(status, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
