// Sperrt die iPhone-App auf Hochkant (und iPad auf Hochkant im Vollbild) in ios/App/App/Info.plist.
// Läuft automatisch bei "npm run sync" bzw. "npm run ios". Ohne ios-Ordner (oder nicht auf dem Mac) passiert nichts.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const pl = path.join(__dirname, '..', 'ios', 'App', 'App', 'Info.plist');
const PB = '/usr/libexec/PlistBuddy';
if (!fs.existsSync(pl)) { console.log('Hochkant-Sperre: übersprungen (kein ios-Ordner)'); process.exit(0); }
if (!fs.existsSync(PB)) { console.log('Hochkant-Sperre: übersprungen (PlistBuddy gibt es nur auf dem Mac)'); process.exit(0); }
const pb = c => { try { return execFileSync(PB, ['-c', c, pl], { stdio: ['ignore', 'pipe', 'pipe'] }).toString(); } catch (e) { return null; } };
// patch145 (App-Store-Prüfung): Datenschutz-Texte, Export-Compliance und Privacy Manifest
(function () {
  const setS = (k, v) => { pb('Delete :' + k); pb('Add :' + k + ' string "' + v + '"'); };
  setS('NSUserTrackingUsageDescription', 'Mit deiner Erlaubnis zeigen wir dir Werbung, die besser zu dir passt. Ohne Erlaubnis siehst du trotzdem Werbung, nur weniger passend. / With your permission we show you ads that suit you better. Without it you still see ads, just less relevant ones.');
  setS('NSCameraUsageDescription', 'TrinkFest nutzt die Kamera nur, wenn du ein eigenes Foto als Kartenrücken aufnehmen möchtest. / TrinkFest uses the camera only if you want to take your own photo for the card back.');
  setS('NSPhotoLibraryUsageDescription', 'TrinkFest greift nur auf das Foto zu, das du als Kartenrücken auswählst. / TrinkFest only accesses the photo you choose for the card back.');
  pb('Delete :ITSAppUsesNonExemptEncryption'); pb('Add :ITSAppUsesNonExemptEncryption bool false'); // nur HTTPS, keine eigene Verschlüsselung
  console.log('Info.plist: Kamera-/Foto-Text, zweisprachiger Tracking-Text und Export-Compliance gesetzt');
  // Privacy Manifest (ios/App/App/PrivacyInfo.xcprivacy): anlegen oder ergänzen
  const pm = path.join(path.dirname(pl), 'PrivacyInfo.xcprivacy'), tpl = path.join(__dirname, 'PrivacyInfo.xcprivacy');
  try {
    if (!fs.existsSync(tpl)) { console.log('Privacy Manifest: Vorlage scripts/PrivacyInfo.xcprivacy fehlt'); return; }
    const t = fs.readFileSync(tpl, 'utf8');
    if (!fs.existsSync(pm)) { fs.copyFileSync(tpl, pm); console.log('Privacy Manifest: neu angelegt (ios/App/App/PrivacyInfo.xcprivacy)'); }
    else {
      let x = fs.readFileSync(pm, 'utf8'); const o = x;
      const part = k => { const m = t.match(new RegExp('\\t<key>' + k + '</key>\\n\\t<array>[\\s\\S]*?\\n\\t</array>')); return m ? m[0] : ''; };
      if (/<key>NSPrivacyTracking<\/key>/.test(x)) x = x.replace(/(<key>NSPrivacyTracking<\/key>\s*)<false\s*\/>/, '$1<true/>');
      else x = x.replace(/<dict>/, '<dict>\n\t<key>NSPrivacyTracking</key>\n\t<true/>');
      if (!/NSPrivacyAccessedAPICategoryUserDefaults/.test(x)) {
        const e = '\n\t\t<dict>\n\t\t\t<key>NSPrivacyAccessedAPIType</key>\n\t\t\t<string>NSPrivacyAccessedAPICategoryUserDefaults</string>\n\t\t\t<key>NSPrivacyAccessedAPITypeReasons</key>\n\t\t\t<array>\n\t\t\t\t<string>CA92.1</string>\n\t\t\t</array>\n\t\t</dict>';
        if (/<key>NSPrivacyAccessedAPITypes<\/key>\s*<array\s*\/>/.test(x)) x = x.replace(/(<key>NSPrivacyAccessedAPITypes<\/key>\s*)<array\s*\/>/, '$1<array>' + e + '\n\t</array>');
        else if (/<key>NSPrivacyAccessedAPITypes<\/key>\s*<array>/.test(x)) x = x.replace(/(<key>NSPrivacyAccessedAPITypes<\/key>\s*<array>)/, '$1' + e);
        else x = x.replace(/<\/dict>\s*<\/plist>/, '\t<key>NSPrivacyAccessedAPITypes</key>\n\t<array>' + e + '\n\t</array>\n</dict>\n</plist>');
      }
      if (/<key>NSPrivacyCollectedDataTypes<\/key>\s*<array\s*\/>/.test(x)) x = x.replace(/<key>NSPrivacyCollectedDataTypes<\/key>\s*<array\s*\/>/, part('NSPrivacyCollectedDataTypes').trim());
      else if (!/<key>NSPrivacyCollectedDataTypes<\/key>/.test(x)) x = x.replace(/<\/dict>\s*<\/plist>/, part('NSPrivacyCollectedDataTypes') + '\n</dict>\n</plist>');
      if (!/<key>NSPrivacyTrackingDomains<\/key>/.test(x)) x = x.replace(/<\/dict>\s*<\/plist>/, '\t<key>NSPrivacyTrackingDomains</key>\n\t<array/>\n</dict>\n</plist>');
      if (x !== o) { fs.writeFileSync(pm, x); console.log('Privacy Manifest: vorhandene Datei ergänzt (Tracking, UserDefaults, Datenarten)'); }
      else console.log('Privacy Manifest: vorhanden und vollständig');
    }
    const proj = path.join(path.dirname(pl), '..', 'App.xcodeproj', 'project.pbxproj');
    if (fs.existsSync(proj) && !/PrivacyInfo\.xcprivacy/.test(fs.readFileSync(proj, 'utf8'))) console.log('WICHTIG: PrivacyInfo.xcprivacy ist noch nicht im Xcode-Projekt. In Xcode: Datei ios/App/App/PrivacyInfo.xcprivacy in die Gruppe "App" ziehen, Häkchen bei Target "App" setzen.');
  } catch (e) { console.log('Privacy Manifest: Fehler ' + e.message); }
})();
for (const k of ['UISupportedInterfaceOrientations', 'UISupportedInterfaceOrientations~ipad']) {
  pb('Delete :' + k);
  pb('Add :' + k + ' array');
  pb('Add :' + k + ':0 string UIInterfaceOrientationPortrait');
}
pb('Delete :UIRequiresFullScreen');   // iPad: nur Hochkant ist nur im Vollbild-Modus erlaubt
pb('Add :UIRequiresFullScreen bool true');
const ok = (pb('Print :UISupportedInterfaceOrientations') || '').includes('UIInterfaceOrientationPortrait') && !/Landscape/.test(pb('Print :UISupportedInterfaceOrientations') || '');
console.log(ok ? 'Hochkant-Sperre: gesetzt (iPhone und iPad nur hochkant)' : 'Hochkant-Sperre: konnte nicht geprüft werden, bitte in Xcode unter Deployment Info nur "Portrait" anhaken');
