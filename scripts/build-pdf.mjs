// Builds Tim-Daly-CV.pdf from index.html using headless Chromium (Playwright).
//
//   npm install
//   npx playwright install chromium   # first time only
//   npm run pdf
//
// The page's own @media print rules (style.css) control the PDF layout,
// so the website and the PDF always come from the same content.
// CDN requests for Bootstrap are served from node_modules when available,
// which keeps the build working offline and pinned to the same versions.

import { chromium } from 'playwright';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'Tim-Daly-CV.pdf');

const browser = await chromium.launch({
  // Use a system Chrome if you set CHROME_PATH, otherwise Playwright's Chromium
  executablePath: process.env.CHROME_PATH || undefined,
});
const page = await browser.newPage();

// Map https://cdn.jsdelivr.net/npm/<pkg>@<ver>/<path>  ->  node_modules/<pkg>/<path>
await page.route('https://cdn.jsdelivr.net/npm/**', async (route) => {
  const m = new URL(route.request().url()).pathname.match(/^\/npm\/([^@/]+)@[^/]+\/(.+)$/);
  const local = m && join(root, 'node_modules', m[1], m[2]);
  if (local && existsSync(local)) {
    const type = local.endsWith('.css') ? 'text/css'
      : local.endsWith('.js') ? 'application/javascript'
      : local.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream';
    return route.fulfill({ body: readFileSync(local), contentType: type,
      headers: { 'Access-Control-Allow-Origin': '*' } });
  }
  return route.continue();
});

await page.goto(pathToFileURL(join(root, 'index.html')).href, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.evaluate(() => document.fonts.ready);

await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: `<div style="font-size:8px;color:#64748b;width:100%;padding:0 14mm;display:flex;justify-content:space-between;font-family:system-ui,Arial,sans-serif">
    <span>Timothy Daly · 0414 265 050 · thetimdaly@gmail.com · linkedin.com/in/thetimdaly</span>
    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`,
});

await browser.close();
console.log(`PDF written to ${out}`);
