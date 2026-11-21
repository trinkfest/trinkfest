/* Gemeinsamer Test-Helfer (Playwright, headless, 390x844).
   Startet einen eigenen kleinen Webserver für den Projektordner, öffnet index.html
   mit „18+ bestätigt“, schließt Startfenster und sammelt Konsolenfehler.
   Browser fehlt? Einmal: npx playwright-core install chromium-headless-shell */
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright-core');
const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((q, r) => {
      const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end() }
      r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
    }).listen(0, () => res(srv));
  });
}

/* o.clock = true: Zeit läuft nur mit runFor (Spiele vorspulen) */
async function open(o = {}) {
  const srv = await serve(), port = srv.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() == 'error' && !/Failed to load resource|navigator\.vibrate/.test(m.text())) errs.push(m.text()) });
  if (o.clock) await page.clock.install();
  await page.addInitScript(() => { try { localStorage.setItem('tf_age', '1'); localStorage.setItem('tf18', '1') } catch (e) { } });
  await page.goto(`http://localhost:${port}/index.html`);
  if (o.clock) await page.clock.runFor(5000); else await page.waitForTimeout(4500);
  await page.evaluate(([lang, mode]) => {
    document.querySelectorAll('.tfov,.md.on').forEach(x => x.remove());
    if (lang) LANG = lang; if (mode) MODE = mode == 'normal' ? 'cards' : 'party';
  }, [o.lang, o.mode]);
  const run = ms => o.clock ? page.clock.runFor(ms) : page.waitForTimeout(ms);
  const close = async () => { await browser.close(); srv.close() };
  return { page, errs, run, close };
}

/* einfache Argumente: --name wert / --flag */
function args(argv = process.argv.slice(2)) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) { const n = argv[i + 1]; if (n == null || n.startsWith('--')) a[k.slice(2)] = true; else { a[k.slice(2)] = n; i++ } }
    else a._.push(k);
  }
  return a;
}
module.exports = { open, args, ROOT };
