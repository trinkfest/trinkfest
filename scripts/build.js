// Kopiert die Web-Dateien in den Ordner "www", den Capacitor in die App packt.
// Die Supabase-Bibliothek und die Schrift Montserrat werden lokal mitgeliefert, damit die App beim Start
// keine Server Dritter (CDN, Google Fonts) kontaktiert. Das ist aus Datenschutzgründen wichtig (IP-Adresse).
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const root = path.join(__dirname, '..');
const out = path.join(root, 'www');
const files = ['index.html', 'config.js', 'iap.js', 'manifest.webmanifest', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'];
const SB = path.join(root, 'node_modules', '@supabase', 'supabase-js', 'dist', 'umd', 'supabase.js');
const FD = path.join(root, 'node_modules', '@fontsource', 'montserrat', 'files');
const WEIGHTS = [600, 700, 800, 900];
const fontFile = w => path.join(FD, 'montserrat-latin-' + w + '-normal.woff2');
const have = () => fs.existsSync(SB) && WEIGHTS.every(w => fs.existsSync(fontFile(w)));

if (!have()) {
  console.log('Einmalig: Supabase und Schrift werden lokal installiert ...');
  try { execSync('npm install @supabase/supabase-js @fontsource/montserrat', { cwd: root, stdio: 'inherit' }); } catch (e) {}
}
if (!have()) {
  console.error('\nFEHLER: Supabase-Bibliothek oder Schrift fehlen. Bitte mit Internet im Projektordner ausführen:');
  console.error('  npm install @supabase/supabase-js @fontsource/montserrat');
  console.error('Danach noch einmal: npm run ios');
  process.exit(1);
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of files) fs.copyFileSync(path.join(root, f), path.join(out, f));
fs.copyFileSync(SB, path.join(out, 'supabase.js'));
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });
for (const w of WEIGHTS) fs.copyFileSync(fontFile(w), path.join(out, 'fonts', 'montserrat-latin-' + w + '-normal.woff2'));
console.log('www/ aktualisiert: ' + files.length + ' Dateien, supabase.js und ' + WEIGHTS.length + ' Schriftdateien lokal eingebunden');

// Lizenztexte der mitgelieferten Software und Schrift (Pflicht bei MIT und SIL OFL) nach www/licenses
const LIC = [['@fontsource/montserrat', 'montserrat'], ['@supabase/supabase-js', 'supabase-js'], ['@capacitor/core', 'capacitor'], ['@capacitor-community/admob', 'admob'], ['@capgo/native-purchases', 'native-purchases']];
fs.mkdirSync(path.join(out, 'licenses'), { recursive: true });
let licN = 0;
for (const [pkg, name] of LIC) {
  const dir = path.join(root, 'node_modules', ...pkg.split('/'));
  const f = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'license', 'OFL.txt'].map(x => path.join(dir, x)).find(x => fs.existsSync(x));
  if (f) { fs.copyFileSync(f, path.join(out, 'licenses', name + '-LICENSE.txt')); licN++; }
  else console.warn('Hinweis: keine Lizenzdatei für ' + pkg + ' gefunden (npm install nötig?)');
}
// Lizenzen von Dateien, die fest im Repo liegen (z. B. die eingebettete Schrift Lilita One)
try { const ex = path.join(root, 'licenses-extra'); if (fs.existsSync(ex)) for (const f of fs.readdirSync(ex)) { fs.copyFileSync(path.join(ex, f), path.join(out, 'licenses', f)); licN++; } } catch (e) { console.warn('licenses-extra: ' + e.message); }
console.log('www/licenses: ' + licN + ' Lizenzdateien');
// Prüft, ob noch Platzhalter, Testschalter oder fehlende IDs übrig sind (nur Hinweis, der Build läuft weiter)
try { require('./release-check.js').run({ soft: true }); } catch (e) { console.warn('release-check konnte nicht laufen: ' + e.message); }
