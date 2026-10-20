// Kopiert die Web-Dateien in den Ordner "www", den Capacitor in die App packt.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'www');
const files = ['index.html', 'config.js', 'manifest.webmanifest', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'];
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of files) {
  fs.copyFileSync(path.join(root, f), path.join(out, f));
}
// Supabase-Bibliothek lokal mitliefern, damit die App sie nicht aus dem Internet laden muss (falls installiert).
const sb = path.join(root, 'node_modules', '@supabase', 'supabase-js', 'dist', 'umd', 'supabase.js');
if (fs.existsSync(sb)) { fs.copyFileSync(sb, path.join(out, 'supabase.js')); console.log('supabase.js lokal eingebunden'); }
else { console.log('Hinweis: supabase.js nicht gefunden, die App lädt die Bibliothek aus dem Internet (npm install @supabase/supabase-js zum Einbinden)'); }
console.log('www/ aktualisiert mit', files.length, 'Dateien');
