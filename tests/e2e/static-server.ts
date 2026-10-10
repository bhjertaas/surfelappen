import { readFile } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join, normalize } from 'node:path';

/**
 * A minimal static server over `dist/` for tests that need to "deploy" a new
 * version mid-test: `overrides` replaces a file's content while running.
 */
const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

export interface TestServer {
  url: string;
  overrides: Map<string, (original: string) => string>;
  close(): Promise<void>;
}

export async function serveDist(root = 'dist'): Promise<TestServer> {
  const overrides = new Map<string, (original: string) => string>();
  const server: Server = createServer(async (req, res) => {
    const path = new URL(req.url ?? '/', 'http://x').pathname;
    const file = path === '/' ? '/index.html' : path;
    try {
      const bytes = await readFile(join(root, normalize(file)));
      const override = overrides.get(file);
      res.writeHead(200, {
        'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
        'cache-control': 'no-cache',
      });
      res.end(override ? override(bytes.toString('utf8')) : bytes);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise<void>((resolve) => server.listen(0, 'localhost', resolve));
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://localhost:${port}`,
    overrides,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}
