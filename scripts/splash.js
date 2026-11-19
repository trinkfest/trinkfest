// Setzt den iPhone-Startbildschirm (Launch Screen) und das App-Icon auf das neue Logo.
// Läuft automatisch nach "npx cap sync". Ohne ios-Ordner passiert nichts.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
// App-Icon: das neue Logo (assets/icon-only.png) in den Xcode-Ordner kopieren, damit nie wieder ein altes Icon stehen bleibt.
// Ersetzt nur Dateien, die 1024 x 1024 groß sind (das Icon der aktuellen Xcode-Vorlage); kleinere Größen bleiben unberührt.
(function () {
  const icon = path.join(root, 'assets', 'icon-only.png');
  const set = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
  if (!fs.existsSync(icon) || !fs.existsSync(set)) { console.log('Icon: übersprungen (kein ios-Ordner)'); return; }
  const wide = f => { try { const b = fs.readFileSync(f); return b.length > 24 && b.readUInt32BE(16); } catch (e) { return 0; } };
  let names = [];
  try { names = JSON.parse(fs.readFileSync(path.join(set, 'Contents.json'), 'utf8')).images.map(i => i.filename).filter(Boolean); } catch (e) {}
  if (!names.length) names = ['AppIcon-512@2x.png'];
  let n = 0;
  names.forEach(f => { const t = path.join(set, f); if (!fs.existsSync(t) || wide(t) === 1024) { fs.copyFileSync(icon, t); n++; } });
  console.log('Icon: neues Logo gesetzt (' + n + ' Datei' + (n === 1 ? '' : 'en') + ')');
})();
require('./ios-config.js'); // App auf Hochkant sperren (Info.plist), gleich mit
const src = path.join(root, 'assets', 'splash.png');
const dir = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'Splash.imageset');
if (!fs.existsSync(src) || !fs.existsSync(dir)) { console.log('Splash: übersprungen (kein ios-Ordner)'); process.exit(0); }
let names = [];
try { names = JSON.parse(fs.readFileSync(path.join(dir, 'Contents.json'), 'utf8')).images.map(i => i.filename).filter(Boolean); } catch (e) {}
if (!names.length) names = ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png'];
names.forEach(n => fs.copyFileSync(src, path.join(dir, n)));
console.log('Splash: neues Logo gesetzt (' + names.length + ' Dateien)');
