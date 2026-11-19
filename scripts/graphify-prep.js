#!/usr/bin/env node
/*
 * graphify-prep.js – bereitet index.html fuer Graphify vor.
 *
 * Graphify liest .html-Dateien nur als Text-Dokument. Die ganze App-Logik steckt aber
 * als JavaScript in index.html. Dieses Skript zieht jeden <script>-Block in eine eigene
 * .js-Datei unter analyse/js/ und ersetzt eingebettete Bilder, Schriften und Ton
 * (lange Base64-Zeichenketten) durch einen kurzen Platzhalter.
 * index.html selbst wird NICHT veraendert. analyse/ ist nur zum Ansehen/Analysieren.
 *
 * Aufruf:   npm run graphify-prep      (oder: node scripts/graphify-prep.js)
 * Danach in Claude Code:   /graphify analyse
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'index.html');
const out = path.join(root, 'analyse');
const jsDir = path.join(out, 'js');

if (!fs.existsSync(src)) {
  console.error('index.html nicht gefunden (' + src + ')');
  process.exit(1);
}
const html = fs.readFileSync(src, 'utf8');

/* lange Base64-Daten (Bilder, Schriften, Ton) kuerzen, damit Graphify nur Code sieht */
function strip(code) {
  return code
    .replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]{200,}/gi, 'data:…;base64,/*gekuerzt*/')
    .replace(/(["'`])[A-Za-z0-9+/=]{400,}\1/g, '$1/*base64 gekuerzt*/$1')
    /* kodierte Kartenformen o. Ae. (z. B. WMC im Weltkarten-Spiel) */
    .replace(/(["'`])[A-Za-z0-9_+/=|-]{300,}\1/g, '$1/*daten gekuerzt*/$1')
    /* window.xyz=function(...) bekommt einen Namen, damit Graphify die Funktion als Knoten erkennt */
    .replace(/(window\.([A-Za-z_$][\w$]*)\s*=\s*function)\s*\(/g, '$1 $2(');
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(jsDir, { recursive: true });

const re = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let m, n = 0, total = 0;
const list = [];
const map = {};  /* Datei -> Startzeile in index.html (fuer scripts/tf-find.js) */
while ((m = re.exec(html))) {
  const attrs = m[1] || '';
  if (/\bsrc\s*=/.test(attrs)) continue;              /* externe Skripte (config.js, iap.js) liegen schon als Datei vor */
  if (/type\s*=\s*["']?(application\/ld\+json|text\/template)/i.test(attrs)) continue;
  const body = strip(m[2]);
  if (!body.trim()) continue;
  const id = (attrs.match(/\bid\s*=\s*["']?([\w-]+)/) || [])[1] || 'main';
  const line = html.slice(0, m.index).split('\n').length;
  const name = String(++n).padStart(3, '0') + '-' + id + '.js';
  const head = '/* Aus index.html, Zeile ' + line + (id !== 'main' ? ', <script id="' + id + '">' : '') +
    '. Nur zur Analyse – Aenderungen bitte in index.html machen. */\n';
  fs.writeFileSync(path.join(jsDir, name), head + body);
  total += body.length;
  map[name] = line;
  list.push(name + '  (' + Math.round(body.length / 1024) + ' KB, Zeile ' + line + ')');
}

/* Begleitdateien mit eigener Logik dazulegen (Kopien) */
for (const f of ['config.js', 'iap.js']) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(jsDir, f));
}

fs.writeFileSync(path.join(out, 'README.md'),
  '# analyse/ (automatisch erzeugt)\n\n' +
  'Erzeugt von `scripts/graphify-prep.js` aus `index.html`. Jeder `<script>`-Block liegt als eigene Datei in `js/`, ' +
  'eingebettete Bilder/Schriften/Ton sind gekuerzt. **Nicht von Hand bearbeiten** – die App ist weiterhin nur `index.html`.\n\n' +
  'Neu erzeugen: `npm run graphify-prep`. Graph bauen: in Claude Code `/graphify analyse`.\n\n' +
  '## Dateien\n\n' + list.map(x => '- ' + x).join('\n') + '\n');

fs.writeFileSync(path.join(out, 'lines.json'), JSON.stringify(map));

console.log('analyse/js: ' + n + ' Skript-Bloecke, zusammen ' + Math.round(total / 1024) + ' KB Code');
console.log('Graph aktualisieren:  graphify update analyse   (laeuft nach jedem Commit automatisch)');
