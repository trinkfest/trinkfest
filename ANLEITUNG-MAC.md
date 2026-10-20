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
