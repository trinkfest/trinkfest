# TrinkFest

Trinkspiele-App von Timon und Team.

## Aktueller Stand
- Start-Animation (Bierglas füllt sich) und Hauptmenü
- Spielbar: Circle, Pferderennen, Old Nick
- Alle anderen Spiele: "Bald verfügbar"

## Dateien
- `index.html`: die komplette App (HTML, CSS, JavaScript in einer Datei)
- `package.json`, `capacitor.config.json`, `scripts/build.js`: für den Mac und die Verpackung als iPhone-/Android-App (Capacitor)
- `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png`: für "Zum Home-Bildschirm hinzufügen"

## Arbeiten am Mac / iPhone-App
Siehe `ANLEITUNG-MAC.md`.

## Testen
Die Seite läuft über GitHub Pages (Settings > Pages). Auf dem Handy öffnen, dann "Zum Home-Bildschirm" wählen.

## Wichtig
Nie geheime Schlüssel (z. B. Server-Passwörter, "service_role"-Key) in dieses Repo legen.

## Premium / Kasse (v49)
Der Button „Premium“ öffnet das Premium-Fenster (Premium entfernt die Werbung) (Lifetime 4,99 €, Jährlich, Monatlich, Wöchentlich). Preise stehen in `PWP` in `index.html`.
Standard ist der TEST-MODUS (`demo:true`): es wird nichts abgebucht. Echte Zahlung in `config.js` einstellen, zum Beispiel:

    window.TF_PAY_CFG={demo:false,paypal:{life:'https://www.paypal.com/ncp/payment/XXXX'},stripe:{life:'https://buy.stripe.com/XXXX'}};

Wichtig: In der iOS-App verlangt Apple für digitale Freischaltungen In-App-Käufe (StoreKit). PayPal/Stripe sind nur für die Web-Version erlaubt.

**Seit v98:** Auf dem iPhone wird ein Kauf nie mehr simuliert. Solange es kein `window.TF_IAP` gibt, ist Premium in der iPhone-App komplett ausgeblendet (Knopf oben, Zeile „Mitgliedschaft“). Der echte Kauf wird über `window.TF_IAP={buy:async(k)=>true|false, restore:async()=>k|null}` angebunden (`k` = `life`, `year`, `month`, `week`), zum Beispiel mit einem StoreKit-Plugin. Danach erscheint Premium automatisch. Preise müssen dann aus StoreKit kommen und in App Store Connect angelegt sein.

## Werbung (v54)
Nach jeder dritten abgeschlossenen Runde (über alle Spiele zusammengezählt, nur ohne Premium) zeigt die App eine Anzeige. Standard ist eine TEST-Anzeige (`demo:true`).
Echte Werbung mit Google AdMob:
1. AdMob-Konto anlegen, App eintragen, App-ID und Interstitial-ID holen.
2. `npm install @capacitor-community/admob` und `npx cap sync ios`.
3. In Xcode in `Info.plist`: `GADApplicationIdentifier` (deine App-ID), `NSUserTrackingUsageDescription` und die `SKAdNetworkItems` von Google eintragen.
4. In `config.js`: `window.TF_ADS_CFG={demo:false,admob:{ios:'ca-app-pub-XXXX/YYYY'}};`
Bis dahin gilt die Google-Test-ID.

## Datenschutz
`datenschutz.html` ist dieselbe Erklärung als eigene Seite (z. B. für GitHub Pages). Die Platzhalter [Name], [Anschrift] in der Datei und in `index.html` (Impressum) musst du ausfüllen.

## Mitgliedschaft (v56)
Im Demo-Modus (`TF_PAY_CFG` nicht gesetzt) startet die App immer ohne Premium. In den Einstellungen gibt es die Zeile "Mitgliedschaft": Status, Tarif, Verlängerungsdatum und "Mitgliedschaft kündigen" mit Rückfrage. Bei echten iOS-Käufen (`demo:false`) führt der Knopf stattdessen zu den Apple-Abo-Einstellungen, weil Apple Abos nur dort kündigen lässt.

## Werbe-Diagnose
In den Einstellungen 5x schnell auf "TrinkFest · 1.0" tippen. Es erscheint, ob das AdMob-Plugin gefunden wurde und welche Meldungen AdMob zuletzt geschickt hat.

## Tick Tac Boom (v58)
Es gibt nur noch den Bomben-Ton, die Auswahl Bombe/Uhr/Piepen ist weg. Das Ticken wird bis zur Explosion immer schneller (von ca. 0,75 s auf ca. 0,11 s Abstand). Die Bombe pulsiert im selben Takt, glüht immer roter, die Lunte flackert schneller und kurz vor Schluss zittert sie.

## Tick Tac Boom: Kategorien (v59/v60)
Kategorien umbenannt und ausgemistet (zu schwere, doppelte und schiefe Aufgaben raus), dazu neu: "Party & Feiern" und "Lustig & Peinlich" sowie viele neue Aufgaben in allen Kategorien, alles auch auf Englisch. Außerdem sitzen alle Buttons jetzt bündig mit den Eingabefeldern (vorher 4 px nach rechts versetzt, wegen eines globalen Button-Randes).

## Schätzfragen auf einem Handy (v61)
Neuer Button "Auf einem Handy spielen": Namen eintragen, Fragenzahl und Kategorien wählen. Pro Frage kommt ein Übergabe-Bildschirm ("Gib das Handy an NAME / Ich bin dran"), dann tippt die Person ihre Schätzung geheim ein und gibt das Handy weiter. Danach die normale Auflösung mit Rangliste. In diesem Modus gibt es keinen Timer und keine Bots.

## Englisch (v62/v63)
Englische Texte überarbeitet und Lücken gefüllt ("Drank it", "Who's guessing?", "Guessing champ", Einheiten wie Mrd./bn, Beschriftungen im Schätzfragen-Setup). Der Untertitel unter "Spiele" im Hub ist entfernt.

## Spielfeld drehen (v64)
Alle Spiele, die auf einem Handy gespielt werden (Circle, Pferderennen, Old Nick, Ass ziehen, Kartensaufen, Tick Tac Boom, Wer würde eher, Emoji-Raten offline, Zungenbrecher, Sekundenschätzen, Schätzfragen auf einem Handy), haben oben rechts einen Dreh-Button. Er dreht das ganze Spielfeld sanft um 180°, damit das Handy nicht gedreht werden muss. Beim Verlassen des Spiels wird die Drehung zurückgesetzt. Online-Spiele (Busfahren, Online-Räume) haben den Button nicht.

## Werbung testen (v65)
In `config.js` gibt es jetzt `test:true`: Dann nutzt die App das echte AdMob-Plugin, aber Googles Test-Anzeigen. So siehst du sofort, ob die Technik läuft. Vor dem Store-Upload `test:false` setzen. Die Werbe-Diagnose (5x auf die Versionsnummer tippen) zeigt jetzt auch test=true/false und erklärt den AdMob-Fehlercode 3 ("kein Angebot").

## Datenschutz (v66)
Die Datenschutzerklärung (Deutsch und Englisch, in der App und als `datenschutz.html`) ist komplett überarbeitet: DSGVO, TDDDG (§ 25), AdMob-Einwilligung, Apple-Kauf, RevenueCat, Supabase, Betroffenenrechte, Aufsichtsbehörden. Offen sind nur die Platzhalter für Name und Anschrift in Punkt 1.
Die App lädt beim Start nichts mehr von Servern Dritter: Die Schrift Montserrat und die Supabase-Bibliothek werden beim Bauen lokal eingebunden (`npm run ios` installiert sie beim ersten Mal selbst, dafür braucht der Mac Internet). In den Einstellungen gibt es auf dem iPhone die Zeile "Werbe-Einwilligung", über die man die EU-Einwilligung für Werbung ändern kann.

## Werbe-Einwilligung beim Start (v67)
Beim ersten Start (nach dem Intro, nur auf dem iPhone, nicht im Demo-Modus und nicht mit Premium) fragt die App zuerst "Tracking" (Apple) und danach das EU-Einwilligungsfenster von Google ab. Beides merken sich die Systeme, die Frage kommt nicht bei jedem Start. Das EU-Fenster erscheint nur, wenn in AdMob unter "Datenschutz & Mitteilungen" eine Nachricht angelegt und veröffentlicht ist. Die Werbe-Diagnose (5x auf die Versionsnummer) zeigt, ob ein Formular gefunden wurde.

## v68: Duelle (neues Spiel, Index 13)
Namen (2 bis 8), Duell per Zufall (Walzen-Animation, wer am wenigsten dran war hat Vorrang) oder selbst wählen, Wetten der Nicht-Duellanten (1 bis 10 Schlücke), 20 Minispiel-Platzhalter (Zufall oder Auswahl). Die echten Minispiele werden in `DLMG` (Namen und Regeln, DE und EN) eingetragen. Verlierer: 3 Schlücke (Karten-Modus: Strafpunkte). Richtig gewettet: Einsatz verteilen, falsch: selbst trinken.

### v71: Duelle umgebaut
Ablauf jetzt automatisch: Namen, dann 10 Runden. Jede Runde: zwei Spieler per Zufall (fair: wer bisher am wenigsten dran war, kommt zuerst, möglichst neue Gegner), danach ein zufälliges Minispiel (keins doppelt in den 10 Runden). Keine Wetten mehr. Am Ende trinkt der oder die mit den wenigsten Siegen `DLEND` Schlücke (aktuell 5). Alle gleichauf: alle 1 Schluck. Konstanten `DLR` (Runden) und `DLEND` im Duelle-Block der index.html.

### v72: Duelle, neue Struktur
Namen, dann Rundenzahl wählen (mindestens halbe Spielerzahl aufgerundet, höchstens 10). Eine Runde = dieselben zwei Spieler in 3 Minispielen (Best of Three, immer alle 3). Auslosung mit Animation, fair (wer schon dran war, ist unwahrscheinlicher, jeder kommt dran). Alle anderen tippen den Rundensieger, ohne Einsatz. Am Ende (Verkündung): pro verlorenem Spiel 2 Schlücke (`DLPER`), plus Mittrinken der Schlücke des Tipps aus der jeweiligen Runde. Konstanten `DLG` (Spiele pro Runde), `DLPER` im Duelle-Block.

### v74/v75: Design und Spielerliste
- Startbildschirm: `assets/splash.png` (lila + Kartenlogo) ersetzt den iPhone-Launch-Screen. `scripts/splash.js` läuft automatisch bei `npm run ios`. In der App startet das Logo jetzt direkt in Originalgröße (nahtloser Übergang).
- Spiel-Hintergrund: Farbverlauf aus dem Cover (`GCOL`, Zuordnung Panel zu Spiel in `GMI`). Header im Spiel: kein Titel mehr, mittig ein transparentes T/F.
- Home: Regler heißt Party | Normal, Text daneben entfernt. Bot-Tests entfernt (Bus, Schätzfragen).
- Spielerliste global: Button "Spieler" mit Zahl (immer mindestens 3, leere Plätze heißen Spieler 1, 2, 3 und werden beim Hinzufügen ersetzt). Fenster mit Liste, Eingabe unten mit Plus, Merkliste "Zuletzt gespielt" (antippen zum Hinzufügen, ✕ zum Löschen). Gespeichert in `tf_ply` und `tf_plh` (localStorage). Duelle: bis 10 Spieler.
- Kategorien bei Wer würde eher und Schätzfragen ohne "Alle Kategorien", Auswahl rot umrandet (auch bei Boom).

## v76 – Duelle: 18 Minispiele (Gerüst)
- Ablauf: Namen → Runden → Auslosung (Gegner + 3 Minispiele) → je Spiel Start → Erklärung → 3,2,1,LOS → Spiel → Gewinner-Box → Trinken pro Runde → Endstand.
- Spiellogik kommt in `DLRUN[id]=function(ctx){...}` (ctx: a, b, top, bot, side(p), name(i), win(winnerIdx), game). Ohne Eintrag erscheinen zwei Gewinner-Buttons.
- 👊-Spiele (rps, flag, cap, arm, exen) werden in echt gespielt, nur der Gewinner wird getippt. Exen nur im Party-Modus.

## v77
- In jedem Spiel steht der Spielname oben mittig (statt T/F).
- Home: drei Striche und Kategorien-Menü entfernt.
- Spielerliste: Button zeigt nur die Zahl (ohne Kreis); Antippen öffnet ein Vollbild-Fenster: Spieler oben, Eingabe fett unten mit Beschriftung „NEUEN SPIELER EINTRAGEN“.

## v78
- Old Nick: Brett vertikal zentriert, „Ergebnis“ oben rechts entfernt, Texte in der Mitte gekürzt.
- Spielerfenster: keine Überschrift/Hinweiszeile mehr, kleineres Plus, rundes Zurück-Symbol unten rechts statt „Fertig“.
- Dreh-Pfeil nur noch bei Circle und Old Nick und nur im laufenden Spiel (nicht in der Spielerauswahl). Liste in `RTG`.

## v79
- „Wer spielt mit?“ (und Varianten) in allen Spielen entfernt; oben steht nur ein Satz mit der Spielerklärung (`<p class="one">`). Bei Busfahren und Emoji-Raten bleibt „Wie wollt ihr spielen?“ (Modus-Auswahl).
- Spielerfenster: unten fett „Fertig“; Zeile „Spieler 1, Spieler 2 …“ unter der Kachel entfernt; Zahl kleiner.

## v80
- Busfahren und Emoji-Raten: Überschrift „Wie wollt ihr spielen?“ entfernt (nur noch der Erklärungssatz).

## v81
- **Duelle: alle 17 Minispiele gebaut** (Käsekästchen entfernt): Münzen ziehen, Tauziehen, Air Hockey, Schere-Stein-Papier (First to 3), Linie nachfahren, Simon Says, Bombe weitergeben, Perfekter Stopp, Perfekter Kreis, Drei gewinnt, Tic Tac Toe, Flaggen raten, Hauptstädte raten, Wo liegt das? (Weltkarte), Armdrücken, Torte teilen, Exen-Duell. Code: `DLRUN[id]` in `index.html` (Abschnitt „Duelle: Minispiele“).
- Gemeinsamer Rahmen: Spielfläche mit Mitte (`.dmid`) und je einer Spielerseite (`.dgm`); Dinge, die beide sehen müssen, stehen doppelt in der Mitte (einmal normal, einmal um 180° gedreht).
- **Tipp-Regel geändert:** Wer auf den Richtigen tippt, trinkt nichts; wer auf den Falschen tippt, trinkt die Schlücke (Strafpunkte) des Verlierers. Hilfetexte DE/EN angepasst.
- **Kopfzeile weiter unten** (iPhone, unter der Kamera-Insel): `--fh` und Padding nutzen jetzt Safe-Area + 6 bzw. +40 px (wirkt nur auf dem Gerät).

## v82
- Duelle: Erklärungssatz auf der Startseite und Hilfetext neu: pro Runde duellieren sich zwei Spieler in 3 Minispielen, alle anderen tippen vorher, wer gewinnt; wer falsch liegt, trinkt mit dem Verlierer (Normal-Modus: Strafpunkte). DE/EN.

## v83
- Duelle, während ein Minispiel läuft: Kopfzeile und die 3 Spiel-Kästen sind ausgeblendet, es zeigt nur das Spielfeld. Beide Hälften sind exakt gleich groß (Test: 412 px / 412 px). Unten/oben gleicher Sicherheitsabstand, in der Mitte links ein kleiner „‹“-Button (Spiel beenden?).
- Simon Says: Die Farbfolge wird nur noch einmal in der Mitte gezeigt. Die Tasten des oberen Spielers sind gespiegelt, sodass beide Spieler dieselbe Farbe an derselben Stelle des Handys haben. Nichts tippen (Zeit abgelaufen) zählt wie ein Fehler („Zu langsam“). Bei beiden verloren wird die Runde wiederholt.

## v84
- Duelle: neues Cover (Boxring mit Sepp & Karl) aus dem Design-Chat, in Cards-/Beer-Modus und DE/EN ("DUELL"/"DUEL"; Beer-Variante mit goldenem Rahmen und Prost-Symbol).
- Tic Tac Toe / Drei gewinnt: gelber Rahmen und "Du bist dran" entfernt – nur der Name des Spielers am Zug wird größer.
- Tic Tac Toe: größere Felder, X und O als SVG exakt zentriert.
- Lufthockey: Absicherung gegen ungültige Canvas-Größe beim Start.

## v85
- Wo liegt das?: keine Namen mehr auf der Karte (weder Länder noch Kontinente noch Orte), nur die reine Karte.

## v86
- Duelle: Exen-Duell kommt nur noch selten dran (ca. 4 % pro Runde statt wie jedes andere Spiel).
- Home: Duelle ist jetzt die große Kachel ganz oben, Busfahren ist kleiner.

## v87
- Münzen ziehen: längere Sperre nach Fehl-Tipp (1,7 s), goldene Münzen, größeres Feld. Bei beiden im Minus gewinnt der mit dem kleineren Minus.
- Tipp-Bildschirm: weniger Text, "Name tippt auf" mit zwei farbigen Buttons (✓ bei Auswahl), Duell-Paarung groß oben.
- Auslosung und Spielstart: Namen der beiden Duellanten größer und farbig.
- Simon Says: 4 Farben, startet mit 3 und wird jede Runde um eins länger, bis einer einen Fehler macht oder nichts tippt.
- Drei gewinnt: eine einzige Button-Reihe unter dem Feld (Spalten sind auch direkt antippbar), kleiner Dreh-Knopf pro Seite wendet das Feld.
- Spiele in echt (Schere Stein Papier, Armdrücken, Exen): in der Mitte "Wer hat gewonnen?" mit den beiden Namen als Buttons.
- Linie nachfahren: komplizierte Formen 3 Sekunden mehr Zeit.
- Wo liegt das?: bis 3; alle Länder (157), 25 bekannteste Städte, 8 bekannte Bauwerke (Eiffelturm, Burj Khalifa, Weißes Haus u. a.).
- Hauptstädte raten, Flaggen raten, Torte teilen: bis 3.
- Tauziehen komplett neu (der alte Code griff auf eine ID zu, die auch im Home-Bildschirm vorkommt): Countdown nach dem Einblenden, großer Tipp-Bereich, Seil mit Knoten, kein Finger-Emoji.
- Tic Tac Toe: neues leuchtendes Feld, symmetrisch, X und O zentriert.
- Perfekter Stopp: Countdown 3-2-1 vor dem Start der Zeit.
- Torte teilen: neue unsymmetrische Formen (Ei, Kartoffel, Birne, Banane), Kekse entfernt.

## v88
- Münzen ziehen: 30 statt 45 Sekunden.
- Neue Sieg-/Niederlage-Animation nach jedem Duell-Spiel (größer, 2,6 s): Gewinner bekommt Pokal mit Strahlen, Konfetti und "GEWONNEN!", Verlierer bekommt wackelnden Bildschirm, rötliche Tönung und fallendes 😵.
- Torte teilen: neue unförmige, realistischere Objekte (Kartoffel, Pilz, Knochen, Fisch, Croissant, Birne, Blatt, Banane, Pizzastück) mit Schattierung und Details.
- Auslosung: Ergebnis (Wer gegen wen) bleibt 2 Sekunden länger stehen.
- Perfekter Stopp: zweiter Countdown klar beschriftet "ZEIT STARTET IN 3-2-1 → JETZT!", danach "▶ ZEIT LÄUFT"; Hinweistext, dass die Zeit erst bei "JETZT!" startet.
- Bombe weitergeben: eine große Bombe in der Mitte, rutscht zum Spieler, der sie hält; großer grüner "Weitergeben"-Button nur beim Halter, der andere sieht "Gerade sicher"; Thema steht bei jedem Spieler direkt über dem Button; Bombe glüht rot kurz vor dem Knall.
- Tauziehen: "Mach dich bereit" ohne Punkte.
- Tic Tac Toe: Raster per Zellenrahmen, X und O exakt in der Zellenmitte.

## v89
- Wo liegt das?: echte, realistische Weltkarte (Natural Earth 1:50m, Public Domain) in Mercator-Projektion: alle Länder mit Grenzen und Küsten, keine Beschriftungen. Zoomen bis auf Straßen-/Landesebene, Ziehen zum Verschieben.
- Länder werden jetzt als Fläche gewertet: Tipp im Zielland = "✓ im Land", sonst Abstand bis zur Landesgrenze. Sind beide im Land, gewinnt, wer näher an der Landesmitte liegt. Das Zielland leuchtet in der Auflösung türkis. Städte und Bauwerke weiter per Luftlinie.
- Duelle: gestrichelte Mittellinie entfernt.
- Drei gewinnt: Gestell mit zwei Füßen unter dem Spielfeld, damit klar ist, wo unten ist (dreht beim Wenden mit).

## v90
- Spielerliste: Namen werden direkt in den Zeilen eingetippt ("Spieler 1", "Spieler 2" … sind selbst die Eingabefelder, Weiter-Taste springt zum nächsten). Das untere Eingabefeld mit "+" ist weg. Neu: "+ Spieler hinzufügen" fügt eine weitere Zeile hinzu (bis 10), ✕ entfernt eine Zeile, "Zuletzt gespielt" füllt den nächsten freien Platz.
- Spiel-Menüs (Circle, Busfahren, Old Nick, Ass ziehen, Schätzfragen, Wer würde eher? usw.): Inhalt sitzt jetzt vertikal mittig statt oben; lange Menüs (Pferderennen, Kartensaufen) bleiben scrollbar.

## v91
- Münzen ziehen: Es zählt genau das, was im Moment des Tippens in der Mitte zu sehen ist. Das Durcheinander-Wirbeln ist weg (dort war ein Tipp nur eine Sperre). Münzen und Dynamit erscheinen jetzt nacheinander (ca. 1 Sekunde sichtbar), wer zuerst tippt, bekommt die Münze. Dynamit nicht antippen (-5). Nach dem Tippen kurz das Ergebnis, dann kurze Pause und der nächste Gegenstand. Tippen in der Pause bleibt gesperrt (1,7 s). Spielbeschreibung angepasst (DE/EN).
- Test: 19 zufällige Taps, das Ergebnis stimmte jedes Mal mit dem sichtbaren Gegenstand überein.

## v92
- Neues Logo (Bayer mit Hund und Katze im Fass): App-Icon `assets/icon-only.png` und `assets/icon-foreground.png` (1024 x 1024), Web-Icons `icon-512.png`, `icon-192.png`, `apple-touch-icon.png`.
- Neuer iPhone-Startbildschirm `assets/splash.png` (2732 x 2732): gleicher violetter Verlauf wie das Intro, Logo mittig, genauso groß wie im Intro, damit der Übergang nahtlos ist.
- Intro in der App zeigt das neue Logo (180 statt 150 Punkte groß).
- Auf dem Mac einmalig: `npx capacitor-assets generate --ios` (erzeugt das neue Icon in Xcode), danach `npm run ios`. Falls das alte Icon noch auf dem iPhone steht: App einmal löschen und neu installieren.

## v93 – Duelle komplett überarbeitet (02.11.2026)
- **Spielerfarben:** 10 kräftige Farben (Rot, Orange, Gelb, Grün, Türkis, Hellblau, Blau, Lila, Pink, Weiß) pro Spieler in der Spielerliste wählbar; ohne Auswahl werden sie automatisch verteilt. Die Farben erscheinen in den Duellen (Namen „… ist dran“, Marker, Tasten). Der Spielhintergrund wird so gewählt, dass beide Duell-Farben gut erkennbar bleiben (z. B. Rot gegen Lila → kein lila Hintergrund).
- **Minispiele-Übersicht** vor dem Start: kleine Kacheln mit eigenen Grafiken (alle Emojis ersetzt), Antippen öffnet ein kleines Popup mit Erklärung (X oder Tippen daneben schließt). Nichts öffnet mehr im Vollbild. In jedem Spiel gibt es einen kleinen Zurück-Pfeil genau in der Mitte.
- **Sieg/Niederlage:** Gewinner „Gewonnen“ mit Pokal, Verlierer „Verloren“ mit Regenwolke (statt 😵); der Spielinhalt bleibt dabei sichtbar.
- **Münzen ziehen:** Auswahldauer zufällig gemischt (2,5 / 3 / 3,5 / 4 / 4,5 / 5 s), 3 s Pause, wechselnde Symbole flackern sichtbar, Tipp zählt das gezeigte Symbol.
- **Tauziehen:** kürzer und weniger extrem; Spiel endet, sobald der Tipp-Vorsprung ein Viertel aller Tipps erreicht (mindestens 24 Tipps, nach 25 s gewinnt, wer mehr getippt hat).
- **Air Hockey:** gestrichelte Sperrlinie zwischen Zahl und Mitte (kein Campen an der Mittellinie), dezenter 60-s-Countdown, Golden Goal bei Gleichstand, durchsichtiger Tisch.
- **Schere, Stein, Papier:** Hinweis „bis 3“, danach nur noch einmal den Sieger antippen.
- **Linie nachfahren:** zeigt klar, wer den höheren Prozentwert hatte und die Runde gewonnen hat.
- **Simon Says:** „Länge N“ weg, Folge exakt mittig.
- **Boom** (vorher „Bombe weitergeben“): Explosion über den ganzen Bildschirm, Bombe mittig und ohne Überdeckung, konkretere Themen (z. B. „Länder, die mit R anfangen“).
- **Zeitgefühl** (vorher „Zeit stoppen“): neuer Stopp-Button.
- **Drei gewinnt:** man sieht, wie der Stein einfällt. **Tic Tac Toe:** Feld exakt zentriert.
- **Flaggen / Hauptstädte:** „Ich wusste es“ → Lösung wird gezeigt → Spieler tippt richtig (Punkt) oder falsch (Gegner bekommt den Punkt).
- **Wo liegt das?:** neue Weltkarte von Pol zu Pol mit Nord- und Südpol, endlos rundherum scrollbar, Entfernung in echten Kilometern auf der Kugel (kürzester Weg, z. B. über den Atlantik). Ohne Zoom-Knöpfe und ohne Hinweistext. Beide im selben Land = Gleichstand (kein Punkt). Bei Ländern zählt nur das Festland (Kolonien/Überseegebiete wie Mallorca zählen nicht).
- **Armdrücken / Exen:** nur Animation und Text („5 Sekunden duelliert euch jetzt im Armdrücken“), danach „Wer hat gewonnen?“ mit zwei Spielern ohne gespiegelten Splitscreen. Exen: beide drücken „Bereit“, dann Vollbild-Countdown 5-4-3-2-1 und „EXEN!!!“.
- **Torte teilen** entfernt (16 Minispiele).
- Alles mittig geprüft (Abweichung 0 px), alle Touch-Ziele getestet.

## v93b – Nachprüfung der Duelle (03.11.2026)
- Zusammengeführt mit den neuen Spielen Würfelfieber und Kartenchaos (anderer Chat); Spielerliste startet mit 2 Plätzen.
- Air Hockey: seltener Fehler in den ersten Bildern behoben (Schläger konnte ungültige Position bekommen); Spielernamen standen doppelt.
- Münzen ziehen/Boom: Knöpfe verdecken die Spielernamen nicht mehr (mehr Abstand unten).
- Tauziehen: Seilknoten läuft nicht mehr über „TIPPEN!“.
- Drei gewinnt: Lochraster saß 6 px aus der Mitte, jetzt exakt zentriert.
- Zeitgefühl: Stopp-Knöpfe kleiner, verdecken die Zielzeit nicht mehr.
- Armdrücken: Grafik kleiner, liegt nicht mehr unter dem Zurück-Pfeil.

## v94 – Duelle: Liste vom 03.11.2026 (Abend)
- **Zurück-Pfeil** in den Minispielen: eigenes SVG-Symbol, exakt im Kreis zentriert.
- **Air Hockey:** Tore deutlich sichtbar (farbige Torzone mit gestrichelter Linie, dicker Balken und weiße Pfosten in der Farbe des Verteidigers); Zeitanzeige mehr als doppelt so groß und kräftiger.
- **Perfekter Kreis:** Das Zeichenfeld jedes Spielers steht von Anfang an da (Rahmen und Fläche in Spielerfarbe, Mittelpunkt), etwas schmaler, damit der Zurück-Pfeil nichts verdeckt.
- **Hauptstädte raten:** Land größer geschrieben (34 px); vor jedem Land beide „Bereit“ → kleiner 3-2-1-Countdown → erst dann erscheint das Land.
- **Flaggen raten:** derselbe Ablauf (Bereit → kleiner Countdown → Flagge) vor jeder Runde.
- **Armdrücken:** Überschrift „5 Sekunden“ entfernt (Text: „Duelliert euch jetzt im Armdrücken!“).
- **Wo liegt das?:** Gemessen wird immer zum Festland (Hauptland); Übersee-Gebiete und kleine Inseln zählen nicht (Ringe mit Präfix p). Bei Bauwerken/Städten ist es die Luftlinie vom Marker zum Ort. Geprüft: USA (Alaska + Festland), Portugal ohne Azoren/Madeira, Chile ohne Osterinsel, Frankreich ohne Übersee, Japan 4 Hauptinseln.
- **Zeitgefühl:** kein Anfangs-Countdown mehr; beide tippen „Bereit“, erst dann zählt „ZEIT STARTET IN 3-2-1 JETZT!“ herunter.
- **Münzen ziehen** (wieder wie ursprünglich): 3-2-1 am Anfang, dann wechseln Münzen (1/3/5) und Dynamit blitzschnell durch, nach 2,5–5 s (gemischt) bleibt es stehen. Nur jetzt (ca. 1,5 s) zählt das erste Tippen. Tippen während des Durchlaufens sperrt den eigenen Knopf 3 s (grau). Dynamit = −5. 45 s Gesamtzeit.
- **Tauziehen:** „Mach dich bereit“ entfernt; fetter Vollbild-Countdown über allem, danach blinkt „TIPPEN!“. Kein zusätzlicher 3-2-1 beim Betreten (Spiele mit eigenem Countdown: `nocd:1` in `DLM`).
- Neue Helfer: `dlBk`, `dlFsCount` (Vollbild-Countdown), `dlReady` (beide Bereit → Countdown).

## v95 – Duelle: Bugs aus dem Testmodus (03.11.2026)
- **Tauziehen:** kürzer – 8 Tipps Vorsprung reichen (vorher mind. 24 Tipps und 25 % Vorsprung); nach 15 s gewinnt, wer mehr getippt hat.
- **Linie nachfahren:** Zeichenfelder wie bei Perfekter Kreis (Rahmen in Spielerfarbe, Mittelpunkt, Abstand zum Spielstand).
- **Flaggen/Hauptstädte:** neuer Button „Lösung zeigen“ (zeigt die Lösung, danach geht „Ich wusste es“ weiter); „Keiner weiß es“ zeigt die Lösung, vergibt keinen Punkt („Kein Punkt“) und startet nach 2,6 s die nächste Runde.
- **Exen-Duell:** kein generischer 3-2-1-Countdown am Anfang mehr (`nocd:1`), direkt „Bereit“.
- **Duell-Test:** Bewertungen und Notizen werden automatisch an Claude übertragen (`db`-Dokument `dtest/report`).

## v96 – Duelle: Erklärungen überarbeitet (05.11.2026)
- **Minispiel-Karte vor dem Start** (und Popup in der Minispiel-Übersicht): 1. Zeile = Ziel (fett), danach 1–2 kurze Ablaufzeilen, DE und EN. Neuer Helfer `dlDesc`; Texte in `DLM` (`d`/`den`, Zeilen mit `|` getrennt). Start-Knopf bleibt unten sichtbar (sticky), Icon etwas kleiner.
- Alle 16 Spiele neu formuliert, passend zum aktuellen Ablauf: Münzen ziehen (nur tippen, wenn das Bild stehen bleibt, 3 s Sperre), Tauziehen (8 Tipps Vorsprung), Hockey, Linie nachfahren (5 s merken, 5 s zeichnen), Simon, Boom, Zeitgefühl (Bereit → Countdown → STOPP), Kreis, Drei gewinnt, Tic Tac Toe, Flaggen/Hauptstädte („Ich wusste es“, kein Punkt wenn keiner es weiß), Wo liegt das? (nacheinander, Handy weiterreichen), Armdrücken, Exen.
- **Duelle-Hilfe („?“)**: Party- und Karten-Version, DE und EN, auf 5 kurze Schritte gekürzt (Auslosung, Tipp, Spielen, Trinken/Strafpunkte, Ende).


## Vor dem Store-Upload (v98)
`npm run release-check` listet alles, was noch offen ist (Platzhalter in Impressum und Datenschutz, `test:true`, Google-Test-IDs, leere App-Store-ID, fehlende Info.plist-Einträge). Die Datei `PRE-RELEASE.md` enthält die ganze Checkliste mit dem Stand jedes Punktes.

## Rechtstexte (v98)
Impressum, Datenschutz, Nutzungsbedingungen, und Lizenzen sind in den Einstellungen („Meine Daten“ wurde in v107 entfernt). Als eigene Webseiten (für App Store Connect, z. B. über GitHub Pages): `datenschutz.html`, `nutzungsbedingungen.html`, `impressum.html`, `support.html`. Platzhalter in eckigen Klammern ausfüllen, in `index.html` und in den HTML-Dateien. Die Texte sind ein Entwurf und keine Rechtsberatung.

## v105 (14.11.2026): Einmalkauf „Werbefrei"
Premium besteht nur noch aus einem Einmalkauf „Werbefrei" (4,99 €, kein Abo, Produkt-ID `de.trinkfest.app.adfree`). Wochen-, Monats- und Jahresabo sind entfernt. Der Kauf läuft über `iap.js` (StoreKit 2 mit `@capgo/native-purchases`), Einrichtung siehe ANLEITUNG-MAC.md. Der Preis in der Paywall kommt aus dem App Store. Nutzungsbedingungen (Punkt 4/5) und Datenschutz (Punkt 6) sind angepasst.

## v107 (14.11.2026)
Die Einstellungen-Seite „Meine Daten“ ist entfernt (keine Konten, alles nur lokal). Auskunft und Löschung stehen weiter in der Datenschutzerklärung (Punkt 14, E-Mail).

## v119 – Wünsche vom 14.11.2026 (Version 106)
- Das Spiel heißt jetzt **Duell** (EN: **Duel**), überall in der App und in der Hilfe. Im Duell läuft im Hintergrund keine Bewegung mehr (die schwebenden Emojis sind dort aus, in den anderen Spielen bleiben sie).
- Duell, Gegner-Auswahl neu: Namen ohne Rahmen, großes gelbes **VS** in der Mitte, Namen werden passend verkleinert. Die VS-Zeile in Tipp und Spielkarte ist größer.
- Duell, Minispiele streichen: das Fenster springt nicht mehr (der Platz für „Alle wieder aktivieren“ bleibt reserviert).
- Pferderennen: neue Farben (Königsblau + Gold) und neues Cover (DE, EN, Party/Normal).
- Schätzfragen: die Kategorie „Essen & Alltag“ ist entfernt.
- Circle und Old Nick: Karten etwas größer, heller Rand; der Kingscup steht genau in der Kreismitte.


## v120 – Reihenfolge (Version 107)
Old Nick und Pferderennen haben auf der Startseite die Plätze getauscht (`HBO`/`HALLA`).


## v121 – Duell-Cover (Version 108)
Duell-Cover überarbeitet: Handschuhe auf Armhöhe (vor der Brust statt am Kopf), Tisch etwas tiefer, Seile laufen vor den Handschuhen (`CV/CVE/CVB/CVBE[13]`).


## v122 – Duell-Hintergrund (Version 109)
Die Hintergrund-Animation im Duell läuft wieder in Startseite, Auslosung, Tipp, Ergebnis usw.; nur während eines Minispiels (View `d-pl`) ist sie aus.

## v123 – App-Store-Prüfung (Version 110)
Bericht mit allen Punkten, Risiko, Lösung und Zuständigkeit: `APP-STORE-PRUEFUNG.md`. Änderungen in dieser Version: ATT-Abfrage und EU-Einwilligung kommen erst nach dem 18+-Hinweis; der Kauf zeigt auf dem iPhone nur den Preis aus dem App Store (bis er geladen ist: „…“); `scripts/ios-config.js` setzt Kamera-/Fototext, zweisprachigen Tracking-Text und die Export-Compliance in der Info.plist und legt `PrivacyInfo.xcprivacy` an (Vorlage `scripts/PrivacyInfo.xcprivacy`); `release-check` prüft das alles. Spiele, Regeln und Texte der Spiele sind unverändert.
