# TrinkFest – Hinweise für Claude Code

TrinkFest ist eine deutsche Trinkspiele-App (Party-Modus mit Schlücken, Normal-Modus mit Strafpunkten), gebaut als **eine einzige HTML-Datei** und mit Capacitor als iOS-App verpackt. Entwickler: Timon (Student, kein Programmierer, schreibt per Spracheingabe). Antworten an Timon: **Deutsch, kurz, direkt**, ohne Fachjargon; sagen, was er am Mac tun muss.

## Wo steht was
- `index.html` – **die ganze App** (HTML, CSS, JavaScript, eingebettete Cover-Bilder als Base64, ca. 4,4 MB). Alle Änderungen an der App passieren hier.
- `docs/CODEMAP.md` – **Landkarte von index.html** (Spiele, Bausteine, vNNN-Blöcke, wichtigste Funktionen, je mit Zeile). Wird vor jedem Commit automatisch neu erzeugt. **Zur Orientierung immer zuerst diese Datei lesen statt index.html.**
- `docs/STAND.md` – aktueller Stand, Entscheidungen, Änderungsprotokoll (84 KB, **nicht ganz lesen**, siehe „Tokens sparen“). Kopie von `code/STAND.md` aus dem claude.ai-Projekt „TrinkFest“.
- `PLAN.md` (Verbesserungsplan), `HAPTIK.md` (Vibration und Ton), `README.md` (Versionsgeschichte), `ANLEITUNG-MAC.md`, `PRE-RELEASE.md`, `APP-STORE-PRUEFUNG.md`.
- `config.js` – Timons eigene Werte (AdMob-IDs, `test:false`, Kauf-Produkt). **Nie überschreiben.**
- `iap.js` – In-App-Kauf (StoreKit über `@capgo/native-purchases`).
- `scripts/` – `build.js` (kopiert nach `www/`), `splash.js`, `ios-config.js` (Info.plist, Hochkant, Privacy Manifest), `release-check.js`, `admob-ios.sh`, `graphify-prep.js`, `codemap.js` (schreibt CODEMAP), `tf-find.js` (Suche).
- `ios/` – Xcode-Projekt (von Capacitor erzeugt).

## Wie die App gebaut ist
- Design-Raum 280 px breit, wird auf dem Handy mit `fit()` skaliert (390×844 → Faktor ca. 1,39). Pixelwerte im CSS sind im 280-px-Raum gemeint.
- Änderungen der letzten Wochen liegen als eigene Blöcke **am Ende** von `index.html`: `<style id="vNNN">` und `<script id="vNNNjs">` (der letzte steht unten in `docs/CODEMAP.md`). Neue Änderungen genauso anhängen (nächster Marker), statt alten Code umzuschreiben; Ersetzungen im Altcode klein halten.
- Spiele: Panels `#gm…`, Duell = `#gm15` (Präfix `dl*`/`DL*`, Minispiele in `DLRUN`). Spielerliste global (`PLY`, `PLC`, Menü `plxOpen/plxBuild`). Vibration `TFH(art)`, Ton `TFSnd(art)`, Ansager `tfVoice`.
- Online-Spiele über Supabase Realtime.

## Arbeitsweise
1. `docs/CODEMAP.md` lesen; von `docs/STAND.md` nur den Kopf (`head -11`) und die letzten Einträge (`tail -n 6`), Einzelheiten gezielt suchen (`grep -o '.\{0,120\}Stichwort.\{0,200\}' docs/STAND.md`).
2. Ändern, dann testen: `npx serve .` und im Browser bei 390×844 (DE/EN, Party/Normal), keine Fehler in der Konsole. Wenn Playwright da ist: damit.
3. Eintrag unten in `docs/STAND.md` (Datum, Version, was, welche Dateien) und kurzer Abschnitt in `README.md`.
4. Timon sagen, was er tun muss (meist `npm run ios`; bei neuen Paketen `npm install …`).
5. Geheime Schlüssel nie ins Repo.

## Tokens sparen (wichtig, der Verbrauch ist hoch)
**Orientierung:** `docs/CODEMAP.md` (ca. 7 KB) statt index.html oder STAND.md durchsuchen. Darin steht, wo welches Spiel, welcher Baustein und welcher vNNN-Block liegt.

`index.html` hat sehr lange Zeilen mit Bild-, Ton- und Kartendaten. Ein falscher `grep`/`Read` darauf kostet zehntausende Tokens. Deshalb:
1. **Code suchen nur mit** `npm run -s find -- <Suchwort>` (z. B. `npm run -s find -- tfVoiceN`). Liefert kurze Ausschnitte mit der echten Zeile `index.html:NNNN`; kennt die Code-Karte die Funktion, auch „aufgerufen von“ und „ruft auf“. Optionen `--max N`, `--ctx N`.
2. **Auswirkungen prüfen** vor Änderungen an viel benutzten Funktionen: `graphify affected "<funktion>" --graph analyse/graphify-out/graph.json` (oder `graphify explain …`, `graphify path "A" "B" …`).
3. **Nie** `grep` ohne Begrenzung auf `index.html` und nie ganze Zeilen ausgeben: immer `grep -o '.\{0,80\}X.\{0,80\}'` bzw. `cut -c1-300`. `Read` auf `index.html` nur mit `offset`/`limit` und nur, wenn die Zeilen kurz sind (CSS/neue Blöcke am Ende).
4. Code lesen lieber in `analyse/js/*.js` (gleicher Code, Daten gekürzt; Zeile in index.html = Startzeile aus `analyse/lines.json` + Zeile − 2).
5. Tests headless (Playwright) mit Zahlen statt Screenshots; Screenshots nur, wenn es um Optik geht, und verkleinert.
6. Ein Thema pro Sitzung; Stand steht in `docs/STAND.md`, nicht im Verlauf.

## Graphify (Code-Karte)
Git-Hooks in `.githooks/`: **vor** jedem Commit mit geänderter index.html werden `analyse/js/` und `docs/CODEMAP.md` neu erzeugt (CODEMAP wird mit committet); **nach** jedem Commit wird die Graphify-Karte `analyse/graphify-out/` im Hintergrund erneuert (Hooks eingeschaltet über `git config core.hooksPath .githooks`, macht `npm install` über das `prepare`-Skript). Kostet keine KI-Tokens. Von Hand: `npm run graphify-prep && graphify update analyse`. Beide Ordner sind nicht im Repo (`.gitignore`). Übersicht der Karte: `analyse/graphify-out/GRAPH_REPORT.md`, Ansicht im Browser: `analyse/graphify-out/graph.html`.

## Abgleich mit den claude.ai-Chats
Timon arbeitet auch in claude.ai (Projekt „TrinkFest“). Dort ist `code/STAND.md` die zentrale Datei; die Chats schicken ihm eine komplette ZIP dieses Ordners. Gemeinsamer Stand ist dieses GitHub-Repo: nach Änderungen hier committen und pushen, damit der nächste Chat (oder Claude Code) darauf aufbaut.
