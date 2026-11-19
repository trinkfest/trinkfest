# TrinkFest – Hinweise für Claude Code

TrinkFest ist eine deutsche Trinkspiele-App (Party-Modus mit Schlücken, Normal-Modus mit Strafpunkten), gebaut als **eine einzige HTML-Datei** und mit Capacitor als iOS-App verpackt. Entwickler: Timon (Student, kein Programmierer, schreibt per Spracheingabe). Antworten an Timon: **Deutsch, kurz, direkt**, ohne Fachjargon; sagen, was er am Mac tun muss.

## Wo steht was
- `index.html` – **die ganze App** (HTML, CSS, JavaScript, eingebettete Cover-Bilder als Base64, ca. 4,4 MB). Alle Änderungen an der App passieren hier.
- `docs/STAND.md` – **aktueller Stand, Entscheidungen, Änderungsprotokoll.** Vor jeder Arbeit lesen. Kopie von `code/STAND.md` aus dem claude.ai-Projekt „TrinkFest“.
- `PLAN.md` (Verbesserungsplan), `HAPTIK.md` (Vibration und Ton), `README.md` (Versionsgeschichte), `ANLEITUNG-MAC.md`, `PRE-RELEASE.md`, `APP-STORE-PRUEFUNG.md`.
- `config.js` – Timons eigene Werte (AdMob-IDs, `test:false`, Kauf-Produkt). **Nie überschreiben.**
- `iap.js` – In-App-Kauf (StoreKit über `@capgo/native-purchases`).
- `scripts/` – `build.js` (kopiert nach `www/`), `splash.js`, `ios-config.js` (Info.plist, Hochkant, Privacy Manifest), `release-check.js`, `admob-ios.sh`, `graphify-prep.js`.
- `ios/` – Xcode-Projekt (von Capacitor erzeugt).

## Wie die App gebaut ist
- Design-Raum 280 px breit, wird auf dem Handy mit `fit()` skaliert (390×844 → Faktor ca. 1,39). Pixelwerte im CSS sind im 280-px-Raum gemeint.
- Änderungen der letzten Wochen liegen als eigene Blöcke **am Ende** von `index.html`: `<style id="vNNN">` und `<script id="vNNNjs">` (zuletzt v132). Neue Änderungen genauso anhängen (nächster Marker), statt alten Code umzuschreiben; Ersetzungen im Altcode klein halten.
- Spiele: Panels `#gm…`, Duell = `#gm15` (Präfix `dl*`/`DL*`, Minispiele in `DLRUN`). Spielerliste global (`PLY`, `PLC`, Menü `plxOpen/plxBuild`). Vibration `TFH(art)`, Ton `TFSnd(art)`, Ansager `tfVoice`.
- Online-Spiele über Supabase Realtime.

## Arbeitsweise
1. `docs/STAND.md` lesen.
2. Ändern, dann testen: `npx serve .` und im Browser bei 390×844 (DE/EN, Party/Normal), keine Fehler in der Konsole. Wenn Playwright da ist: damit.
3. Eintrag unten in `docs/STAND.md` (Datum, Version, was, welche Dateien) und kurzer Abschnitt in `README.md`.
4. Timon sagen, was er tun muss (meist `npm run ios`; bei neuen Paketen `npm install …`).
5. Geheime Schlüssel nie ins Repo.

## Graphify (Code-Karte)
Graphify liest `.html` nur als Text. Deshalb zuerst den Code herausziehen:
```
npm run graphify-prep      # schreibt analyse/js/*.js aus index.html (index.html bleibt unverändert)
```
dann in Claude Code `/graphify analyse` (nur Code) oder `/graphify .` (Code + Doku; `.graphifyignore` schließt die Riesen-Datei und Build-Ordner aus). Ergebnis in `graphify-out/` (`graph.html`, `GRAPH_REPORT.md`, `graph.json`). Nach größeren Änderungen `npm run graphify-prep` und `/graphify analyse --update` erneut.

## Abgleich mit den claude.ai-Chats
Timon arbeitet auch in claude.ai (Projekt „TrinkFest“). Dort ist `code/STAND.md` die zentrale Datei; die Chats schicken ihm eine komplette ZIP dieses Ordners. Gemeinsamer Stand ist dieses GitHub-Repo: nach Änderungen hier committen und pushen, damit der nächste Chat (oder Claude Code) darauf aufbaut.
