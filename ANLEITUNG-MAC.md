# TrinkFest auf dem Mac bearbeiten und als iPhone-App starten

Für iOS-Apps braucht man zwingend einen Mac mit Xcode. Einer aus dem Team reicht dafür.

## Einmalig einrichten
1. **Xcode** aus dem Mac App Store installieren (sehr groß, mehrere GB). Einmal öffnen, Lizenz bestätigen und die Zusatzkomponenten installieren lassen.
2. **Terminal** öffnen (Spotlight mit Cmd+Leertaste, "Terminal" tippen).
3. **Homebrew** installieren. Den aktuellen Befehl findest du auf brew.sh, einfach kopieren und einfügen.
4. Werkzeuge installieren:
   ```
   brew install git node
   brew install --cask visual-studio-code
   ```
5. **Projekt holen** (Benutzername und Repo anpassen):
   ```
   git clone https://github.com/DEINNAME/trinkfest.git
   cd trinkfest
   ```
   Beim ersten Mal fragt GitHub nach dem Login. Einfacher geht es mit der App "GitHub Desktop" (`brew install --cask github`).

## App am Mac ansehen (wie im Browser)
```
npm run start
```
Dann im Browser `http://localhost:3000` öffnen. Mit Cmd+Option+I und dem Handy-Symbol siehst du die Handy-Ansicht. Mit Ctrl+C im Terminal beendest du den Server.

## Als iPhone-App im Simulator starten
Einmalig:
```
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npm run build
npx cap add ios
```
Danach jedes Mal, wenn sich etwas geändert hat:
```
npm run ios
```
Das öffnet Xcode. Oben einen Simulator wählen (zum Beispiel iPhone 16) und auf den Play-Knopf drücken. Falls Xcode nach CocoaPods fragt: `brew install cocoapods` und dann nochmal `npm run ios`.

## Auf dem eigenen iPhone testen
1. iPhone per Kabel anschließen und in Xcode als Ziel wählen.
2. In Xcode links auf "App", dann "Signing & Capabilities", und unter "Team" die eigene Apple-ID auswählen.
3. Play drücken. Auf dem iPhone unter Einstellungen > Allgemein > VPN & Geräteverwaltung der eigenen Apple-ID vertrauen.
4. Mit der kostenlosen Apple-ID läuft die Test-App 7 Tage. Für TestFlight und den App Store braucht ihr das Apple Developer Program (99 $ pro Jahr).

## App-Icon setzen (iOS)
Das Icon liegt als `assets/icon-only.png` (1024 x 1024) im Projekt. Einmal ausführen:
```
npm install -D @capacitor/assets
npx capacitor-assets generate --ios
npm run ios
```
Das erzeugt alle Größen automatisch im Xcode-Projekt (Stand 02.11.2026: neues Logo mit Bayer, Hund und Katze im Fass). Der iPhone-Startbildschirm kommt aus `assets/splash.png` und wird bei `npm run ios` automatisch gesetzt. Wollt ihr ein neues Icon, ersetzt einfach `assets/icon-only.png` (1024 x 1024, quadratisch, ohne Transparenz und ohne abgerundete Ecken) und führt den zweiten Befehl nochmal aus.

## Änderungen mit dem Team teilen
```
git pull
(Dateien ändern)
git add .
git commit -m "Was habe ich geändert"
git push
```
Wenn sich `index.html` ändert, aktualisiert GitHub Pages die Testseite nach etwa einer Minute von selbst.

## Wichtig
- `appId` in `capacitor.config.json` ist `de.trinkfest.app`. Ändert sie vor dem ersten Store-Upload auf eine Kennung, die zu eurer Domain passt, danach lässt sie sich nicht mehr ändern.
- Zeigt der Finder die Datei `.gitignore` nicht, drückt Cmd+Umschalt+Punkt, dann werden versteckte Dateien sichtbar.
- Den Ordner `www` und `node_modules` nicht hochladen, sie werden automatisch neu erzeugt (steht in `.gitignore`).
- Nie geheime Schlüssel (zum Beispiel "service_role" bei Supabase) ins Repo schreiben.

## Update v45: capacitor.config.json
Diese Datei hat sich geändert (Vollbild ohne schwarzen Balken, kein Scrollen/Zoomen im WebView). Ersetze sie im Projektordner und führe aus:

    node scripts/build.js
    npx cap sync ios

Danach in Xcode neu starten (Cmd+R).


## Echte Werbung (AdMob) einbauen
1. In AdMob: Apps > App hinzufügen > iOS. Die App ist noch nicht im Store, also "Nein" wählen. Danach die **App-ID** kopieren (enthält eine Tilde ~).
2. In der App: Anzeigenblöcke > Anzeigenblock hinzufügen > **Interstitial** (Zwischenseitenanzeige). Die **Anzeigenblock-ID** kopieren (enthält einen Schrägstrich /).
3. Im Projektordner: `bash scripts/admob-ios.sh DEINE-APP-ID`. Das installiert das Plugin und trägt App-ID, Tracking-Text und SKAdNetwork in die Info.plist ein.
4. In `config.js` unten ergänzen:
   `window.TF_ADS_CFG = { demo:false, admob:{ ios:'DEINE-ANZEIGENBLOCK-ID' } };`
5. `npm run ios`, dann in Xcode Cmd+R.
Zum Testen vorher die Google-Test-ID lassen (`ca-app-pub-3940256099942544/4411468910`). Nie auf eigene echte Anzeigen tippen, das kann das AdMob-Konto sperren.

## Neu: Schrift und Supabase lokal (Datenschutz)
Beim nächsten `npm run ios` installiert das Build-Skript einmalig `@supabase/supabase-js` und `@fontsource/montserrat` und packt sie in die App. Der Mac braucht dafür Internet. Kommt die Meldung "FEHLER: Supabase-Bibliothek oder Schrift fehlen", führe aus: `npm install @supabase/supabase-js @fontsource/montserrat` und danach noch einmal `npm run ios`.

Hinweis v68: Neues Spiel "Duelle". Nach dem Update wie immer `npm run ios`, dann in Xcode Cmd+R.

## TrinkFest Premium einrichten (In-App-Kauf, Einmalkauf 4,99 €)
Die App verkauft genau ein Produkt: „TrinkFest Premium“ (einmalig, kein Abo). Auf dem iPhone erscheint der Kauf erst, wenn alles unten erledigt ist.
1. Im Projektordner: `npm install @capgo/native-purchases` und danach `npm run ios` (die Datei `iap.js` bindet den Kauf an, das Build-Skript kopiert sie mit).
2. In Xcode: Projekt „App“ > Signing & Capabilities > **+ Capability** > **In-App Purchase**.
3. In App Store Connect: Vereinbarungen, Steuern und Bank ausfüllen (Paid Apps). Dann in der App unter **Monetarisierung > In-App-Käufe** ein Produkt anlegen: Typ **Nicht verbrauchbar**, Produkt-ID `de.trinkfest.app.adfree` (muss mit `config.js` übereinstimmen), Preis 4,99 €, Anzeigename „TrinkFest Premium“, Beschreibung „Entfernt die Werbung in TrinkFest dauerhaft.“, Screenshot der Kaufseite.
4. Testen: in App Store Connect unter Benutzer und Zugriff einen **Sandbox-Tester** anlegen, auf dem iPhone mit diesem Konto kaufen (Einstellungen > App Store > Sandbox-Konto). Danach „Käufe wiederherstellen“ testen (App löschen, neu installieren, wiederherstellen).
5. Beim Einreichen der App-Version das Produkt mit auswählen (es wird zusammen mit der App geprüft).
Hinweis: Produkte brauchen nach dem Anlegen oft mehrere Stunden, bis sie in der App erscheinen. Bis dahin zeigt die Paywall den Festpreis aus der App, der Kauf schlägt aber fehl.

## Vibration (seit Version 121)
Die App vibriert an passenden Stellen (Tipps, Karten, Gewinn/Fehler, Bombe, Duell). Dafür braucht sie das Capacitor-Paket für Haptik. Einmalig im Projektordner: `npm install @capacitor/haptics`, danach `npm run ios` und in Xcode Cmd+R. Test nur auf einem echten iPhone (Simulator und Mac vibrieren nicht). Ein/Aus: Einstellungen > Mehr > Vibration. Ohne das Paket läuft die App normal, nur ohne Vibration. Details: `HAPTIK.md`.

## Nur Hochkant
Die App ist auf Hochkant gesperrt. `npm run ios` setzt das automatisch in `ios/App/App/Info.plist` (iPhone und iPad, `scripts/ios-config.js`). Prüfen: In Xcode links auf "App", Reiter "General", Abschnitt "Deployment Info", dort darf nur "Portrait" angehakt sein. Im Browser/als Web-App erscheint im Querformat ein Hinweis "Bitte das Handy hochkant halten".

## Datenschutz-Dateien für Apple (seit Version 110)
`npm run ios` setzt in `ios/App/App/Info.plist` jetzt auch: Kamera- und Fototext (für „Eigenes Foto als Kartenrücken“; ohne den Kameratext stürzt „Foto aufnehmen“ ab), den zweisprachigen Tracking-Text und `ITSAppUsesNonExemptEncryption=false`. Außerdem legt es `ios/App/App/PrivacyInfo.xcprivacy` an (oder ergänzt eine vorhandene Datei).
1. Nach dem Lauf in Xcode links die Datei `PrivacyInfo.xcprivacy` suchen. Steht sie nicht im Navigator: Datei aus `ios/App/App/` in die Gruppe „App“ ziehen, „Copy items if needed“ aus, Häkchen bei Target „App“.
2. Vor dem Upload: Product > Archive, im Organizer Rechtsklick auf das Archiv > **Generate Privacy Report** und prüfen, dass Tracking und die Werbe-Datenarten drinstehen. Meldet Apple beim Upload eine fehlende „Required Reason API“, den genannten Eintrag in der Datei ergänzen.
3. `npm run release-check` meldet, was noch fehlt.
