#!/usr/bin/env node
/*
 * codemap.js – schreibt docs/CODEMAP.md: kompakte Landkarte von index.html
 * (Spiele, globale Bausteine, Änderungsblöcke vNNN, Knotenpunkte aus der Code-Karte),
 * jeweils mit aktueller Zeile in index.html. So muss niemand index.html durchsuchen,
 * um sich zurechtzufinden.
 *
 * Läuft automatisch nach jedem Commit (.githooks/post-commit), nach graphify-prep.
 * Von Hand: npm run codemap
 * Neue Spiele/Bausteine: unten in GAMES bzw. CORE eintragen (nur Namen, Zeilen findet das Skript).
 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const jsDir = path.join(root, 'analyse', 'js');
if (!fs.existsSync(jsDir)) { console.error('analyse/js fehlt – zuerst npm run graphify-prep'); process.exit(1); }
const lines = JSON.parse(fs.readFileSync(path.join(root, 'analyse', 'lines.json'), 'utf8'));
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && lines[f]).sort();
const src = files.map(f => ({ f, L: fs.readFileSync(path.join(jsDir, f), 'utf8').split('\n') }));
const lineOf = idx => html.slice(0, idx).split('\n').length;

/* Wo wird NAME definiert? (alle Stellen, spätere = Überschreibungen in vNNN-Blöcken) */
function defs(name) {
  const n = name.replace(/[$]/g, '\\$');
  const re = new RegExp('(?:function\\s+' + n + '\\s*\\(|(?:^|[^\\w$.])(?:const|let|var)\\s+' + n + '\\s*=|window\\.' + n + '\\s*=|[,;]\\s*' + n + '\\s*=\\s*(?:\\(|function|[\\w$]+\\s*=>))');
  const out = [];
  for (const { f, L } of src) for (let i = 1; i < L.length; i++) if (re.test(L[i])) out.push(lines[f] + i - 1);
  return [...new Set(out)];
}
const at = name => { const d = defs(name); return d.length ? d.map(x => x).join(', ') : '–'; };
const fmt = names => names.map(n => '`' + n + '` ' + at(n)).join(' · ');

/* ---------- von Hand gepflegt: Spiele und Kernbausteine (nur Namen) ---------- */
const GAMES = [
  ['gm', 'Circle (Kingscup)', 'Kartenregeln R (Zeile ' + lineOf(html.indexOf('const R={"7"')) + '), flip, again', ['flip', 'again']],
  ['gm2', 'Pferderennen', 'r…', ['rstart', 'rdraw', 'rpay']],
  ['gm3', 'Old Nick', 'b…', ['bstart', 'bok', 'bend']],
  ['gm4', 'Ass ziehen', 'a…', ['astart', 'adraw', 'aok']],
  ['gm5', 'Zungenbrecher', 'z…', ['zstart', 'zgood', 'zbad']],
  ['gm6', 'Emoji-Raten (online)', 'em…, e…', ['estart', 'eflip', 'emHostGo', 'emJoinGo']],
  ['gm7', 'Sekundenschätzen', 's…, sk…', ['sstart']],
  ['gm8', 'Tick Tac Boom', 'bx…', ['bxstart', 'bxnext', 'bxexp', 'bxend']],
  ['gm9', 'Wer würde eher?', 'wr…', ['wrstart', 'wrnext']],
  ['gm10', 'Kartensaufen', 'ks…', ['ksstart', 'ksnext']],
  ['gm13', 'Schätzfragen (online/1 Handy)', 'sq…, h…', ['sqHostGo', 'sqJoinGo', 'sqLcGo', 'hStart', 'hNext']],
  ['gm14', 'Busfahren (online)', 'bp…', ['bpHostGo', 'bpJoinGo', 'bpStartO', 'bpBusDraw']],
  ['gm15', 'Duell (16 Minispiele in DLRUN)', 'dl…, DL…', ['dlPlay', 'dlEnd', 'dlAfterGame', 'dlFsCount', 'dlResV', 'dlT']],
  ['gm16', 'Würfelfieber', 'wf…', ['wfStart', 'wfRoll']],
  ['gm17', 'Kartenchaos (online)', 'kc…', ['kcHostGo', 'kcJoinGo', 'kcStartO', 'kcNext', 'kcTake']],
  ['gm11', 'Einstellungen', '', ['view11', 'hapToggle', 'sndToggle', 'pfSave']],
  ['gm12', 'Anmelden', 'au…, auth…', ['authEmail', 'authOAuth', 'auMode']],
];
const CORE = [
  ['Startseite / Navigation', ['hub', 'hmDraw', 'hsGo', 'pick', 'openG', 'closeG', 'hSet', 'showHelp']],
  ['Modus Party/Normal', ['setMode', 'tfSw', 'modeBanks', 'refreshText']],
  ['Sprache DE/EN', ['I18N', 'dlT']],
  ['Spieler (global)', ['PLY', 'plBtn', 'plxH', 'plxOpen', 'plxBuild', 'plxClose']],
  ['Ton / Vibration / Stimme', ['TFSnd', 'TFS', 'TFH', 'tfVoice', 'tfVoiceN', 'tfBeep']],
  ['Hilfen', ['toast', 'skEsc', 'fit']],
  ['Premium / Werbung', ['openPW', 'proDraw']],
];

/* ---------- Ausgabe ---------- */
let o = '# CODEMAP – Landkarte von index.html\n\n';
o += '_Automatisch erzeugt von `scripts/codemap.js` (nach jedem Commit). Nicht von Hand bearbeiten; Spiele/Bausteine in `GAMES`/`CORE` im Skript pflegen._  \n';
o += '_Zahlen = Zeile in `index.html`. Mehrere Zahlen = später in einem vNNN-Block überschrieben (die letzte gilt). Code lesen: `npm run -s find -- <name>`; Auswirkungen: `graphify affected "<name>" --graph analyse/graphify-out/graph.json`._\n\n';

o += '## Aufbau\n- Zeilen 1–~1985: `<head>` mit CSS (alte Blöcke, ab ~1290 benannte `<style id="vNNN">`).\n';
const body = html.indexOf('<body'); o += '- Ab Zeile ' + lineOf(body) + ': `<body>`, Startseite `#s0` > `#home`, danach die Spiel-Panels.\n';
o += '- Hauptskript (alle Spiele): Block `007-main` ab Zeile ' + (lines['007-main.js'] || '?') + '. Änderungen der letzten Wochen: Blöcke `vNNN` am Dateiende (siehe unten).\n\n';

o += '## Spiele\n| Panel | Spiel | Präfix | Zeile Panel | Einstieg (Funktion Zeile) |\n|---|---|---|---|---|\n';
for (const [id, name, pre, fns] of GAMES) {
  const i = html.indexOf('id="' + id + '"');
  o += '| `#' + id + '` | ' + name + ' | ' + (pre || '') + ' | ' + (i > 0 ? lineOf(i) : '–') + ' | ' + fmt(fns) + ' |\n';
}
/* Duell-Minispiele: jede Stelle DLRUN.xyz= (spätere = Überschreibung in vNNN) */
const dlr = {}; const reD = /DLRUN\.([A-Za-z_$][\w$]*)\s*=(?!=)/g; let d;
while ((d = reD.exec(html))) (dlr[d[1]] = dlr[d[1]] || []).push(lineOf(d.index));
if (Object.keys(dlr).length) o += '\n**Duell-Minispiele (`DLRUN.<id>`, Zeile):** ' + Object.entries(dlr).map(([k, v]) => '`' + k + '` ' + v.join(', ')).join(' · ') + '\n';

o += '\n## Globale Bausteine\n';
for (const [t, names] of CORE) o += '- **' + t + ':** ' + fmt(names) + '\n';

/* vNNN-Blöcke mit erster Kommentarzeile */
o += '\n## Änderungsblöcke (vNNN, neueste unten)\n| Block | Zeile | Inhalt |\n|---|---|---|\n';
const blk = /<(style|script) id="(v\d+(?:js)?)"[^>]*>\s*(?:\/\*\s*-*\s*([^*]{0,160}))?/g; let m;
while ((m = blk.exec(html))) o += '| `' + m[2] + '` | ' + lineOf(m.index) + ' | ' + ((m[3] || '').replace(/\s+/g, ' ').replace(/[-\s]+$/, '').replace(/\|/g, '/').trim() || '–') + ' |\n';

/* Knotenpunkte aus der Code-Karte */
try {
  const g = JSON.parse(fs.readFileSync(path.join(root, 'analyse', 'graphify-out', 'graph.json'), 'utf8'));
  const cnt = {}; for (const l of g.links) if (!/contains|defines/.test(l.relation)) cnt[l.target] = (cnt[l.target] || 0) + 1;
  const byId = Object.fromEntries(g.nodes.map(n => [n.id, n]));
  const top = Object.entries(cnt).filter(([id]) => byId[id] && byId[id]._callable).sort((a, b) => b[1] - a[1]).slice(0, 15);
  o += '\n## Meistbenutzte Funktionen (vor Änderung `graphify affected` prüfen)\n';
  o += top.map(([id, c]) => { const n = byId[id]; const f = path.basename(n.source_file || ''); const ln = lines[f] ? lines[f] + parseInt((n.source_location || 'L1').slice(1)) - 2 : '?'; return '`' + n.label + '` ' + ln + ' (' + c + '×)'; }).join(' · ') + '\n';
} catch (e) { o += '\n_(Code-Karte fehlt – `graphify update analyse`)_\n'; }

fs.writeFileSync(path.join(root, 'docs', 'CODEMAP.md'), o);
console.log('docs/CODEMAP.md: ' + Math.round(o.length / 1024 * 10) / 10 + ' KB');
