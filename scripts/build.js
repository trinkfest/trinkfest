// Kopiert die Web-Dateien in den Ordner "www", den Capacitor in die App packt.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'www');
const files = ['index.html', 'manifest.webmanifest', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'];
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of files) {
  fs.copyFileSync(path.join(root, f), path.join(out, f));
}
console.log('www/ aktualisiert mit', files.length, 'Dateien');
