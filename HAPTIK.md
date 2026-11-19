# TrinkFest – Vibrationen (Haptik), Konzept und Stand (Version 121, `patch157.py`)

## Technik
- Paket: `@capacitor/haptics` (^8, `npm install @capacitor/haptics`, dann `npm run ios`). Die App ruft es ohne Importe über `window.Capacitor.Plugins.Haptics` auf (wie AdMob und Kauf). Fehlt das Paket, passiert nichts (kein Fehler).
- Zentrale Funktion `TFH(art)` am Dateiende (Skript `v127js`). Im Browser/Android-Chrome ersatzweise `navigator.vibrate`; iOS-Safari kann das nicht.
- Arten: `sel` (Auswahl-Tick, `selectionChanged`), `light`, `med`, `heavy` (`impact`), `ok`, `warn`, `err` (`notification` Erfolg/Warnung/Fehler), `boom` (Bombe: Heavy, Heavy nach 110 ms, Fehler-Schlag nach 260 ms).
- Einstellung: Einstellungen › Mehr › **Vibration** (Schalter, Standard an, `localStorage tf_hap`). Aus = keinerlei Vibration, auch nicht die alten `navigator.vibrate`-Aufrufe (Duell, Boom, Würfelfieber, Kartenchaos); die laufen jetzt über denselben Helfer und werden auf iOS in Heavy/Medium/Light übersetzt (≤5 ms ignoriert, ≤15 Light, ≤35 Medium, sonst Heavy; Muster ab 90 ms Heavy, ab 280 ms Bombe).
- Schutz gegen Doppel-Vibrieren: höchstens alle 30 ms eine Vibration (Fehler und Bombe immer); Tipps auf Knöpfe lösen nur dann einen Standard-Tick aus, wenn die Stelle nicht selbst vibriert hat.
- Grundsatz (Apple): Vibration nur bei bedeutsamen Momenten, nie dauernd; passend zum Ereignis (Bestätigung = Erfolg, Hinweis = Warnung, Fehler = Fehler) und im selben Moment wie Bild und Ton.

## Wann welche Vibration
| Moment | Art |
|---|---|
| Normaler Knopf, Kachel, Pfeil, Zeile, Tab | light |
| Auswahl-Zeile in Einstellungen, Farbe/Chip/Spieler-Menü | sel |
| Großer Aktionsknopf (Spiel starten, Weiter, Kaufen) | med |
| Party/Normal wechseln | med |
| Favorit an / aus | med / light |
| Einstellung Vibration einschalten | med (Probe) |
| Hinweis-Meldung (z. B. „Maximal 10 Spieler“, „Nur leuchtende Karten“) | warn |
| Meldung „kopiert/gespeichert“ | ok |
| Kauf erfolgreich (Premium) | ok |
| Ergebnis-Bildschirm eines Spiels erscheint | ok |
| Ass ziehen: Karte ziehen / Ass gezogen | med / warn |
| Circle/Kingscup: Karte aufdecken / König / 4. König | med / warn / err |
| Pferderennen: Karte ziehen / Rennen gewonnen | med / ok |
| Old Nick: Antippen / richtig / falsch | light / ok / err |
| Zungenbrecher: geschafft / nicht geschafft | ok / err |
| Emoji-Raten: jemand war zuerst | ok |
| Sekundenschätzen: Start / Stopp (Punktlandung / daneben) | med / ok / warn |
| Boom: Start / Tick (hoher Ton) / Tick / Explosion / „Wer war's“ | med / med / light / boom / warn |
| Kartensaufen: nächste Karte / Gewinner | med / ok |
| Würfelfieber: Würfeln (Landung) / Würfel halten / Kategorie / Ende | light + med / sel / med / ok |
| Busfahren: du musst trinken | warn |
| Kartenchaos: du bist dran | med |
| Duell: Countdown 3, 2 / 1 und LOS | light / heavy |
| Duell: VS-Aufprall / Spielende / Tor, Treffer | heavy / med / heavy |
| Duell-Minispiele: Tippen im Feld (ab 6 ms) | light |
| Duell: falsch (Simon) / Minus-Treffer / Bombe geplatzt | med / heavy / boom |

## Bewusst nicht vibrieren
- Beim Tippen auf Eingabefelder, beim Scrollen, bei Hintergrund-Animationen, bei Online-Meldungen anderer Spieler (außer „du bist dran“), bei sehr schnellen Treffern (Hockey-Puck unter 6 ms).

## Offen / Test
- Nur auf einem echten iPhone fühlbar (Simulator und Mac vibrieren nicht). Stärke und Abstand bitte auf dem Gerät prüfen; die Werte stehen als Liste `WEB` und in den `W('…')`-Zeilen im Skript `v127js`.
- iPhone-Einstellung „Systemhaptik“ (Töne & Haptik) muss an sein; im Stromsparmodus kann iOS Haptik dämpfen.

## Ton (Version 124, patch160; Klang sel/light/med seit Version 125, patch161 dumpfer)
Der Ton hängt am selben Ereignis wie die Vibration: Jede Stelle, die `TFH(art)` bzw. intern `fire(art)` ruft, spielt auch den Klang (`window.TFSnd(art)`), im selben Moment, auch bei ausgeschalteter Vibration. Eigene Schalter: Vibration (`tf_hap`) und Ton (`tf_snd`, Standard an), beide unter Einstellungen › Mehr.

| Art | Klang (Web Audio, selbst erzeugt) | Pegel |
|---|---|---|
| sel | kurzer dumpfer Tick (Sinus 300→230 Hz) | sehr leise |
| light | weiches dumpfes Tick (230→140 Hz) | leise |
| med | dumpfer Pop (Sinus fällt 190→90 Hz) | mittel |
| heavy | dumpfer Bums + kurzes Rauschen | mittel |
| ok | aufsteigender Dreiklang C–E–G | mittel |
| warn | zwei Pieptöne | mittel |
| err | fallender Brummton | mittel |
| boom | Rauschen + Bass, ca. 0,7 s | laut (Spitze ca. 0,5) |

Technik: eigener `AudioContext` (Kompressor, Hauptlautstärke 0,55), wird bei der ersten Berührung entsperrt (iOS-Regel); `navigator.audioSession.type='ambient'` (mischt sich mit Musik, folgt dem Stumm-Schalter, iOS 16.4+). Mindestabstand 45 ms zwischen Klängen (Bombe/Fehler ausgenommen). Tick Tac Boom hat eigene Tick-Töne (`bxtick`, setzt `audioSession` auf `playback`, hört also auch im Stumm-Modus); `bxtickB` löst deshalb keinen zweiten Klang aus. Der Schalter „Ton“ steuert auch diese Boom-Ticks (`setSnd`). Neue Ereignisse: einfach `TFH` aufrufen, der Klang kommt mit.

**19.11. (Version 125, patch161):** Timon fand den Tipp-Ton zu hell („Wenn man auf ein Spiel drückt soll ein dumpferer Sound kommen“). sel/light/med sind jetzt tiefe Sinus-Töne mit fallender Tonhöhe (Rezepte `tone(c,d,t,300,230,.04,'sine',.12,700)`, `…230,140,.08,'sine',.3,600)`, `…190,90,.12,'sine',.4,500)`); ok/warn/err/boom/heavy unverändert. Auf dem iPhone noch nicht gehört (Lautsprecher geben sehr tiefe Töne leiser wieder; falls zu leise, Pegel in den drei Rezepten anheben).
