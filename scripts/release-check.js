// Release-Check: findet alles, was vor dem App-Store-Upload noch offen ist.
// Aufruf: npm run release-check   (Exit-Code 1, wenn etwas offen ist)
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = f => { try { return fs.readFileSync(path.join(root, f), 'utf8'); } catch (e) { return null; } };

function run(opts) {
  opts = opts || {};
  const fails = [], warns = [];
  const idx = read('index.html') || '', cfg = (read('config.js') || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  // 1. Platzhalter in Impressum / Datenschutz / Nutzungsbedingungen
  const ph = new Set();
  for (const f of ['index.html', 'datenschutz.html', 'impressum.html', 'nutzungsbedingungen.html']) {
    const t = read(f); if (!t) continue;
    for (const m of t.matchAll(/\[(Vor- und Nachname|Straße und Hausnummer|PLZ Ort|Name der Gesellschaft[^\]]*|Telefonnummer|First and last name|Street and number|Postcode City|Company name[^\]]*|Phone number|Phonenummer|Name folgt|Anschrift folgt)\]/g)) ph.add(m[0]);
  }
  if (ph.size) fails.push('Platzhalter in Impressum/Datenschutz noch nicht ausgefüllt: ' + [...ph].join(', '));

  // 2. Werbung
  if (/demo\s*:\s*true/.test((cfg.match(/TF_ADS_CFG[^;]*/) || [''])[0])) fails.push('config.js: TF_ADS_CFG hat demo:true (nur Platzhalter-Werbung).');
  if (/test\s*:\s*true/.test(cfg)) fails.push('config.js: test:true ist noch an (Googles Testanzeigen). Vor dem Upload test:false setzen.');
  const ad = (cfg.match(/admob\s*:\s*\{[^}]*ios\s*:\s*'([^']*)'/) || [])[1];
  if (!ad) fails.push('config.js: keine AdMob-Anzeigenblock-ID (admob.ios).');
  else if (/3940256099942544/.test(ad)) fails.push('config.js: AdMob-ID ist Googles Test-ID.');

  // 3. App-Store-ID
  if (/const TF_APP=\{[^}]*id:''/.test(idx)) fails.push('index.html: TF_APP.id ist leer (Bewerten/Einladen braucht die App-Store-ID).');

  // 4. In-App-Kauf "TrinkFest Premium" (Einmalkauf, StoreKit über @capgo/native-purchases)
  if (!/TF_IAP\s*=/.test(read('iap.js') || '') || !/src="iap\.js"/.test(idx)) fails.push('iap.js fehlt oder ist nicht in index.html eingebunden (ohne Kauf bleibt "TrinkFest Premium" auf dem iPhone unsichtbar).');
  if (!/productId\s*:\s*'[^']+'/.test(cfg)) warns.push('config.js: TF_IAP_CFG.productId fehlt (Standard: de.trinkfest.app.adfree).');
  if (!fs.existsSync(path.join(root, 'node_modules', '@capgo', 'native-purchases'))) warns.push('Kauf-Plugin nicht installiert: "npm install @capgo/native-purchases" und danach "npx cap sync ios". Außerdem in Xcode die Capability "In-App Purchase" hinzufügen und in App Store Connect das Produkt de.trinkfest.app.adfree (Nicht verbrauchbar, 4,99 €) anlegen.');

  if (!fs.existsSync(path.join(root, 'node_modules', '@capacitor', 'haptics'))) warns.push('Vibrations-Plugin nicht installiert (die App vibriert sonst nicht auf dem iPhone): "npm install @capacitor/haptics" und danach "npm run ios".');

  // 5. Xcode-Projekt (falls vorhanden)
  const plist = read('ios/App/App/Info.plist');
  if (plist) {
    const gad = (plist.match(/<key>GADApplicationIdentifier<\/key>\s*<string>([^<]*)<\/string>/) || [])[1];
    if (!gad) fails.push('Info.plist: GADApplicationIdentifier fehlt (App stürzt sonst beim Start ab).');
    else if (/3940256099942544/.test(gad)) fails.push('Info.plist: GADApplicationIdentifier ist Googles Test-App-ID. Eigene AdMob-App-ID eintragen.');
    if (!/NSUserTrackingUsageDescription/.test(plist)) fails.push('Info.plist: NSUserTrackingUsageDescription fehlt.');
    if (/UIInterfaceOrientationLandscape/.test((plist.match(/<key>UISupportedInterfaceOrientations<\/key>\s*<array>[\s\S]*?<\/array>/) || [''])[0])) warns.push('Info.plist: App ist nicht auf Hochkant gesperrt ("npm run ios" setzt das automatisch, sonst scripts/ios-config.js ausführen).');
    const pmf = read('ios/App/App/PrivacyInfo.xcprivacy');   // patch145
    if (!pmf) fails.push('ios/App/App/PrivacyInfo.xcprivacy fehlt (Apple verlangt ein Privacy Manifest für Apps mit AdMob/Tracking). "npm run ios" legt die Datei an, danach in Xcode zum Target "App" hinzufügen.');
    else if (!/<key>NSPrivacyTracking<\/key>\s*<true\s*\/>/.test(pmf)) fails.push('PrivacyInfo.xcprivacy: NSPrivacyTracking muss true sein (die App nutzt AdMob mit Tracking).');
    const pbx = read('ios/App/App.xcodeproj/project.pbxproj');
    if (pbx && !/PrivacyInfo\.xcprivacy/.test(pbx)) warns.push('PrivacyInfo.xcprivacy liegt im Ordner, ist aber nicht im Xcode-Projekt. In Xcode in die Gruppe "App" ziehen und Target "App" ankreuzen.');
    if (!/NSCameraUsageDescription/.test(plist)) fails.push('Info.plist: NSCameraUsageDescription fehlt (Foto aufnehmen für den Kartenrücken würde die App abstürzen lassen). "npm run ios" setzt den Text.');
    if (!/NSPhotoLibraryUsageDescription/.test(plist)) warns.push('Info.plist: NSPhotoLibraryUsageDescription fehlt ("npm run ios" setzt den Text).');
    if (!/ITSAppUsesNonExemptEncryption/.test(plist)) warns.push('Info.plist: ITSAppUsesNonExemptEncryption fehlt (sonst fragt App Store Connect bei jedem Upload nach der Verschlüsselung). "npm run ios" setzt es auf false.');
  } else warns.push('Kein ios-Ordner gefunden (Info.plist-Prüfung übersprungen).');

  // 6. Geheimnisse
  for (const f of ['index.html', 'config.js']) {
    const t = read(f) || '';
    if (/sb_secret_|service_role\s*['":]\s*['"]?ey|sk_live_|AIza[0-9A-Za-z_-]{30,}/.test(t)) fails.push(f + ': enthält etwas, das wie ein geheimer Schlüssel aussieht.');
  }

  // 7. Dateien
  for (const f of ['assets/icon-only.png', 'assets/splash.png', 'datenschutz.html', 'nutzungsbedingungen.html', 'impressum.html', 'support.html']) if (!fs.existsSync(path.join(root, f))) fails.push('Datei fehlt: ' + f);

  if (fails.length || warns.length) {
    console.log('\n=== RELEASE-CHECK ===');
    fails.forEach(x => console.log('OFFEN:   ' + x));
    warns.forEach(x => console.log('PRÜFEN:  ' + x));
    console.log(fails.length ? '\n' + fails.length + ' Punkt(e) offen. Erst beheben, dann hochladen.\n' : '\nKeine harten Fehler, bitte die Hinweise prüfen.\n');
  } else console.log('Release-Check: alles in Ordnung.');
  if (!opts.soft && fails.length) process.exit(1);
  return { fails, warns };
}
module.exports = { run };
if (require.main === module) run();
