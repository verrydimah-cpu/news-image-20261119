// Render poster.html into entry.png at exactly 1024x1024.
//
// poster.html imports Three.js as an ES module, which Chromium will not
// load from file:// — so this script stands up a throwaway loopback HTTP
// server rooted at the repo (no network leaves the machine), opens the
// page in headless Chromium, and screenshots it once the 3D hero flags
// itself ready. The shot is taken at 2x (2048x2048) and reduced with
// PIL's Lanczos filter, which keeps the small typeset text and the hero
// legible when the image is shrunk again for judging. Playwright lives
// in ~/workspace/tools/pw on this machine and is required from there,
// since this repo intentionally carries no node_modules.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { unlinkSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire('/home/hatch/workspace/tools/pw/package.json');
const { chromium } = require('playwright');

const repoDir = dirname(fileURLToPath(import.meta.url));
const finalPath = join(repoDir, 'entry.png');
const rawPath = join(repoDir, '.entry-raw@2x.png');

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.json': 'application/json',
};

const server = createServer(async (req, res) => {
  try {
    const filePath = normalize(join(repoDir, decodeURIComponent(new URL(req.url, 'http://local').pathname)));
    if (!filePath.startsWith(repoDir)) { res.writeHead(403).end(); return; }
    const body = await readFile(filePath);
    res.writeHead(200, { 'content-type': CONTENT_TYPES[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const pageUrl = `http://127.0.0.1:${server.address().port}/poster.html`;

const browser = await chromium.launch({ args: ['--no-proxy-server'] });
try {
  const page = await browser.newPage({
    viewport: { width: 1024, height: 1024 },
    deviceScaleFactor: 2,
  });
  page.on('console', msg => console.log(`[page] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[pageerror] ${err.message}`));
  await page.goto(pageUrl, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__sceneReady === true, null, { timeout: 30000 });
  const sceneError = await page.evaluate(() => window.__sceneError ?? null);
  if (sceneError) console.log(`scene error: ${sceneError}`);
  await page.waitForTimeout(150);
  await page.screenshot({ path: rawPath, type: 'png' });
  console.log(`captured 2x render -> ${rawPath}`);
} finally {
  await browser.close();
  server.close();
}

/* 2048x2048 -> 1024x1024 with Lanczos: crisp anti-aliased final image. */
execFileSync('python3', ['-c', `
from PIL import Image
import sys
im = Image.open(sys.argv[1])
assert im.size == (2048, 2048), im.size
im = im.resize((1024, 1024), Image.LANCZOS)
im.save(sys.argv[2], optimize=True)
print('downscaled ->', sys.argv[2], im.size)
`, rawPath, finalPath], { stdio: 'inherit' });
unlinkSync(rawPath);
console.log(`wrote ${finalPath}`);
