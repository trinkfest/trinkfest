# TrinkFest – Verbesserungsplan (Stand 19.11.2026, App Version 125)

Ziel: App sauber in den App Store bringen und danach wachsen lassen. Reihenfolge nach „was blockiert den Launch / was spürt jeder Spieler sofort“. Jeder Block = ein Patch mit eigener Version, Playwright-Test, Artifact-Update und kompletter ZIP (wie bisher, Regel in `code/STAND.md`).

## Entscheidungen von Timon (16.11., 14:08)
1. **Trink-Duell:** bleibt so, wie es ist (Risiko App-Store 1.4.3 trägt Timon; Hinweis steht in `APP-STORE-PRUEFUNG.md`).
2. **Anspielungen („Spicy“ bei „Wer würde eher?“):** Schalter „Spicy-Fragen“ in den Einstellungen, **Standard aus** → erledigt in Version 123; **19.11. (Version 125): Schalter auf Timons Wunsch wieder entfernt**, Kategorie immer wählbar (Risiko App-Store 1.1/1.4 liegt bei Timon; falls gewünscht, Kategorie stattdessen ganz ausblenden).
3. **Name der Vollversion:** überall **„TrinkFest Premium“** (Startseiten-Pille und Paywall-Titel kurz „Premium“, Rechtstexte „TrinkFest Premium“) → erledigt in Version 123. **Produktname in App Store Connect: „TrinkFest Premium“**, Produkt-ID bleibt `de.trinkfest.app.adfree`.
4. **Ton:** Standard an, Schalter „Ton“ direkt unter „Vibration“ → erledigt in Version 124.
5. **Duell-Fragen:** „rest so machen“ gilt hier als: alles bleibt wie es ist (Tic Tac Toe bleibt, Dreh-Pfeil nur im Duell, 2 Schlucke pro verlorenem Spiel).

## Block 0 – erledigt (16.11., nachgebessert 19.11.)
- **Lila Startbild:** Das war der **iOS-Startbildschirm** (Datei `assets/splash.png`, violetter Verlauf mit Logo), danach die App-eigene Startebene (`.beer`, lila Verlauf mit Logo-Kachel) und erst dann das dunkle Braun der Startseite. 16.11.: Splash braun mit Logo-Kachel. **19.11. (Version 125):** Timon sah weiter ein lila Bild → Startebene der App jetzt dunkelbraun ohne Kachel, `assets/splash.png` schlicht braun ohne Logo (Marker `v130`). Wirkt erst nach `npm run ios` und **App auf dem iPhone löschen und neu installieren** (iOS merkt sich den Startbildschirm). Auf dem iPhone noch nicht geprüft.
- **19.11. (Version 125, Timon):** Spicy-Schalter in den Einstellungen **entfernt** (Entscheidung 2 damit überholt: Kategorie „Spicy“ ist wieder immer wählbar). Tipp-Töne dumpfer (tiefe Sinus-Töne statt heller Ticks). Duell: Wunsch „Countdown 3-2-1“ – gibt es in allen Minispielen schon; Rückfrage an Timon, was genau fehlt.

## Block 1 – iPhone-Testrunde (Timon, ca. 1–2 Std., zuerst, damit alles Weitere auf echten Fehlern aufbaut)
Checkliste (Fehler bitte als Liste mit Spiel + was passiert + Screenshot, dann behebe ich alles in einem Patch):
- Vibration: Stärke/Abstand je Spiel; Schalter in den Einstellungen.
- Startseite, Spieler-Menü (hinzufügen, Farbe, löschen), alle Spiele je 1 Runde, Duell mit 3 Minispielen, Pferderennen, Kartensaufen.
- Online (2 Handys): Schätzfragen, Emoji-Raten, Busfahren, Kartenchaos; Verbindung abbrechen/wieder verbinden.
- Einstellungen komplett (Profil, Kartendesign, Rechtliches, Premium), Englisch.
- Start: Startbild (siehe Block 0), Kaltstart-Zeit (Stoppuhr, App komplett schließen → Symbol → bis spielbar).
- Kauf in der Sandbox und „Käufe wiederherstellen“ (erst möglich mit Entwicklerkonto + Produkt).
Ergebnis: eine Fehlerliste → **Patch „Fixes iPhone“** (1 Chat).

## Block 2 – Prüfungs-Risiken (Claude) – Spicy und Namensabgleich erledigt (Version 123, 16.11.)
- Trink-Duell nach Entscheidung 1; Spicy-Schalter nach Entscheidung 2 (Schalter in Einstellungen, Fragenfilter in `sq*`/`wr*`, Datenschutz-Liste `tf_spicy`).
- Namensabgleich Premium/Werbefrei in App, Paywall, Startseiten-Pille, Rechtstexte, `iap.js`/`config.js`-Kommentare.
- Danach `APP-STORE-PRUEFUNG.md` neu durchgehen (Skill app-store-review), Rest-Liste für Timon.

## Block 3 – Ton (Claude) – erledigt (Version 124, 16.11.; Hören auf dem iPhone steht aus)
- Kurze **selbst erzeugte** Klänge (Web Audio, keine Dateien, keine Lizenzfragen, keine Größe): Tipp, Karte ziehen, richtig/falsch, Gewinn, Countdown, Bombe (hat schon Ticks), Kauf.
- Gleiche Ereignis-Liste wie die Vibration (`code/HAPTIK.md`), ein Helfer `TFS(art)` neben `TFH`; Einstellung „Ton“ (Schalter, `tf_snd`), Lautstärke moderat, folgt dem Stumm-Schalter, startet erst nach dem ersten Tipp (iOS-Regel).
- Test: Playwright (keine Fehler, Schalter aus = nichts), Hören auf dem iPhone durch Timon. Ton und Vibration gleichzeitig im selben Frame.

## Block 4 – Erste Benutzung (Claude, 1 Chat)
- Nach dem 18+-Hinweis 3 kurze Karten („Modus wählen“, „Spieler eintragen“, „Spiel antippen“), Überspringen immer möglich, nur beim ersten Start, in den Einstellungen „Einführung ansehen“.
- DE/EN, Playwright-Test mit leerem Speicher.

## Block 5 – Barrierefreiheit (Claude, 1 Chat; Timon prüft mit VoiceOver)
- Beschriftungen (`aria-label`) für alle Symbol-Knöpfe (Herz, Zahnrad, Pfeil, Würfel halten …), Lesereihenfolge, Fokus nach Fenster auf/zu, Kontrast, große Schrift (Dynamic Type): Text darf nicht abgeschnitten werden.
- Test: Playwright-Accessibility-Baum + Kontrastmessung, danach VoiceOver auf dem iPhone (Timon).

## Block 6 – Ladezeit (erst messen, dann entscheiden)
- Messen auf dem iPhone (Block 1): Kaltstart bis spielbar. Unter ca. 2 s: nichts tun. Darüber: Cover-Bilder aus `index.html` in Dateien (`www/img/…webp`) auslagern und nachladen. Das Artifact bleibt eine einzelne Datei, deshalb zwei Varianten im Patch-Skript.
- Risiko mittel (Bilder sind an vielen Stellen verknüpft) → nur wenn nötig.

## Block 7 – Wisch-Geste (optional, zuletzt)
- Vom linken Rand wischen = zurück, nur auf Menüs/Startseiten der Spiele; **in laufenden Spielen** mit Rückfrage „Spiel beenden?“. Risiko: kollidiert mit Spielgesten (Duell, Pferderennen). Erst nach Block 1 entscheiden.

## Block 8 – Launch-Paket (läuft parallel, sobald das Entwicklerkonto da ist)
- Timon: Apple-Konto (GbR), Paid-Apps-Vertrag, Produkt `de.trinkfest.app.adfree`, AdMob-App-ID + `test:false`, `TF_APP.id`, Supabase Pro, Altersfreigabe 18+, Datenschutz-Angaben, DSA-Händlerstatus.
- Claude: Texte für App Store (Titel, Untertitel, Beschreibung DE/EN, Schlüsselwörter), Notizen für die Prüfung („keine Konten, 18+“), Rechtsseiten als GitHub-Pages-Ordner, Screenshots (6,9″ und 6,5″) aus der App, Vorschauvideo aus „Die Partyshow“.
- Zusammen: TestFlight mit dem 4er-Team, 3 Tage Testlauf, dann einreichen.

## Block 9 – nach dem Launch
- „Bewerte uns“ (Apples eigene Abfrage, ca. nach dem 3. Spielabend) und „Freunde einladen“-Link in den Spielen.
- Neue Inhalte als Grund für Premium/Abo: Fragenpakete, Aufgabenkarten.
- Einzelvideos pro Spiel für Social Media (Skill trinkfest-werbevideo).
- Rückmeldungen aus dem Store sammeln, wöchentlich ein kleiner Patch.

## Reihenfolge und Aufwand
| Schritt | Wer | Aufwand | Hängt ab von |
|---|---|---|---|
| Block 0 Startbild | Claude | erledigt (19.11. nachgebessert; Test auf iPhone offen) | – |
| Entscheidungen 1–5 | Timon | erledigt 16.11. | – |
| Block 1 iPhone-Test | Timon | 1–2 Std | ZIP von heute, `npm install @capacitor/haptics` |
| Fixes iPhone | Claude | 1 Chat | Block 1 |
| Block 2 Risiken | Claude | Spicy + Name erledigt; Rest (Prüfung neu durchgehen) nach iPhone-Test | Entscheidungen |
| Block 3 Ton | Claude | erledigt (Hörtest Timon offen) | Entscheidung 4 |
| Block 4 Einführung | Claude | 1 Chat | – |
| Block 5 Barrierefreiheit | Claude + Timon | 1 Chat + 30 Min | – |
| Block 6 Ladezeit | Claude | 0–1 Chat | Messung |
| Block 7 Wisch-Geste | Claude | 1 Chat | Entscheidung nach Block 1 |
| Block 8 Launch-Paket | Timon + Claude | parallel | Entwicklerkonto |
| Block 9 nach Launch | Claude | laufend | Store-Freigabe |

## Arbeitsregeln (damit nichts kaputtgeht)
- Ein Thema = ein Patch (`patchNNN.py`, idempotent), danach Playwright auf `index.html` (390×844 und 375×667, DE/EN, Party/Karten), Duell-Test mit 16 Minispielen, keine JS-Fehler.
- Nach jedem Patch: Artifact (gleicher Link) + Duell-Test, STAND/README/Patch ins Projekt, komplette ZIP an Timon, ein Satz „was neu, was am Mac zu tun“.
- Ehrlich markieren, was nur auf dem echten iPhone prüfbar ist (Ton, Haptik, Kauf, Kaltstart).
