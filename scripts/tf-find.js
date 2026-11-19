#!/usr/bin/env node
/*
 * tf-find.js – sparsame Code-Suche fuer TrinkFest (spart Tokens fuer Claude).
 *
 * Sucht in analyse/js/ (Code aus index.html ohne Bild-/Ton-/Kartendaten) und gibt nur
 * kurze Ausschnitte mit der echten Zeilennummer in index.html aus. Kennt die Code-Karte
 * (Graphify) die Funktion, stehen dazu, wer sie aufruft und was sie aufruft.
 *
 * Aufruf:  npm run -s find -- <Suchwort> [--max N] [--ctx N]
 * Beispiel: npm run -s find -- tfVoiceN
 *           npm run -s find -- "Seven Heaven" --max 5
 * Vorher (falls analyse/ fehlt): npm run graphify-prep
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dir = path.join(root, 'analyse', 'js');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = +args[i + 1]; args.splice(i, 2); return v || d; };
const MAX = opt('--max', 20), CTX = opt('--ctx', 70);
const q = args.join(' ');
if (!q) { console.log('Aufruf: npm run -s find -- <Suchwort> [--max N] [--ctx N]'); process.exit(1); }
if (!fs.existsSync(dir)) { console.log('analyse/ fehlt – zuerst: npm run graphify-prep'); process.exit(1); }

let lines = {};
try { lines = JSON.parse(fs.readFileSync(path.join(root, 'analyse', 'lines.json'), 'utf8')); } catch (e) {}
const where = (file, ln) => lines[file] ? 'index.html:' + (lines[file] + ln - 2) : file + ':' + ln;

/* 1) Code-Karte: Funktion mit diesem Namen? */
try {
  const g = JSON.parse(fs.readFileSync(path.join(root, 'analyse', 'graphify-out', 'graph.json'), 'utf8'));
  const name = q.replace(/\(\)$/, '').toLowerCase();
  const nodes = g.nodes.filter(n => (n.norm_label || '').replace(/\(\)$/, '') === name);
  const byId = Object.fromEntries(g.nodes.map(n => [n.id, n]));
  const loc = n => { const f = path.basename(n.source_file || ''); const l = parseInt((n.source_location || 'L0').slice(1)); return where(f, l); };
  for (const n of nodes) {
    const rel = r => !/contains|defines/.test(r.relation);
    const callers = g.links.filter(l => l.target === n.id && rel(l)).map(l => byId[l.source]).filter(Boolean);
    const calls = g.links.filter(l => l.source === n.id && rel(l)).map(l => byId[l.target]).filter(Boolean);
    const fmt = a => a.slice(0, 12).map(x => x.label + ' (' + loc(x) + ')').join(', ') + (a.length > 12 ? ' … +' + (a.length - 12) : '');
    console.log('KARTE ' + n.label + ' – ' + loc(n));
    if (callers.length) console.log('  aufgerufen von: ' + fmt(callers));
    if (calls.length) console.log('  ruft auf:       ' + fmt(calls));
  }
} catch (e) {}

/* 2) Text-Suche mit kurzen Ausschnitten */
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort();
let hits = 0, more = 0;
for (const f of files) {
  const L = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
  for (let i = 0; i < L.length; i++) {
    const idx = L[i].indexOf(q);
    if (idx < 0) continue;
    const n = L[i].split(q).length - 1;
    if (hits >= MAX) { more++; } else {
      const a = Math.max(0, idx - CTX), b = Math.min(L[i].length, idx + q.length + CTX);
      console.log(where(f, i + 1) + '  [' + f.replace(/\.js$/, '') + ']  ' + (a ? '…' : '') + L[i].slice(a, b).replace(/\s+/g, ' ') + (b < L[i].length ? '…' : '') + (n > 1 ? '  (+' + (n - 1) + ' mehr in der Zeile)' : ''));
    }
    hits++;
  }
}
if (!hits) console.log('Kein Treffer im Code. (Texte in HTML/CSS ausserhalb von <script> sucht dieses Werkzeug nicht.)');
else if (more) console.log('… ' + more + ' weitere Zeilen mit Treffern (mehr mit --max N)');
