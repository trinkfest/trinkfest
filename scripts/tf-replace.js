/* Sichere Ersetzungen in index.html (oder --file X): jede alte Stelle muss GENAU einmal vorkommen,
   sonst wird nichts geschrieben. Eingabe: JSON-Datei mit [["alt","neu"], ...].
   npm run -s replace -- patch.json [--file index.html] [--dry]
   Am Ende einfügen: ["@END", "<style id=\"v140\">…"] fügt vor </body></html> ein. */
const fs = require('fs'), path = require('path'), { args, ROOT } = require('./tf-pw');
const a = args(), list = JSON.parse(fs.readFileSync(a._[0], 'utf8'));
const F = path.resolve(ROOT, a.file || 'index.html');
let s = fs.readFileSync(F, 'utf8'); const out = [];
for (const [o, n] of list) {
  if (o == '@END') { const e = '</body></html>'; if (s.split(e).length != 2) { console.log('Ende nicht gefunden'); process.exit(1) } s = s.replace(e, () => n.trimEnd() + '\n' + e); out.push('angehängt (' + n.length + ' Zeichen)'); continue }
  const c = s.split(o).length - 1;
  if (c != 1) { console.log(`ABBRUCH: ${c}× gefunden: ${o.slice(0, 80)}`); process.exit(1) }
  const line = s.slice(0, s.indexOf(o)).split('\n').length;
  s = s.replace(o, () => n); out.push('Zeile ' + line + ': ' + o.slice(0, 50).replace(/\n/g, ' '));
}
if (!a.dry) fs.writeFileSync(F, s);
console.log((a.dry ? '(Probelauf) ' : '') + out.length + ' Änderungen\n' + out.join('\n'));
