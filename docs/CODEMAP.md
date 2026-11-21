# CODEMAP – Landkarte von index.html

_Automatisch erzeugt von `scripts/codemap.js` (nach jedem Commit). Nicht von Hand bearbeiten; Spiele/Bausteine in `GAMES`/`CORE` im Skript pflegen._  
_Zahlen = Zeile in `index.html`. Mehrere Zahlen = später in einem vNNN-Block überschrieben (die letzte gilt). Code lesen: `npm run -s find -- <name>`; Auswirkungen: `graphify affected "<name>" --graph analyse/graphify-out/graph.json`._

## Aufbau
- Zeilen 1–~1985: `<head>` mit CSS (alte Blöcke, ab ~1290 benannte `<style id="vNNN">`).
- Ab Zeile 1987: `<body>`, Startseite `#s0` > `#home`, danach die Spiel-Panels.
- Hauptskript (alle Spiele): Block `007-main` ab Zeile 2162. Änderungen der letzten Wochen: Blöcke `vNNN` am Dateiende (siehe unten).

## Spiele
| Panel | Spiel | Präfix | Zeile Panel | Einstieg (Funktion Zeile) |
|---|---|---|---|---|
| `#gm` | Circle (Kingscup) | Kartenregeln R (Zeile 2354), flip, again | 1991 | `flip` 3511 · `again` 3517 |
| `#gm2` | Pferderennen | r… | 1996 | `rstart` 3531, 6676, 6735 · `rdraw` 3536, 6682 · `rpay` 3527 |
| `#gm3` | Old Nick | b… | 2001 | `bstart` 3557 · `bok` 3578, 6484 · `bend` 3581 |
| `#gm4` | Ass ziehen | a… | 2006 | `astart` 2383 · `adraw` 2384, 6486 · `aok` 2388 |
| `#gm5` | Zungenbrecher | z… | 2011 | `zstart` 2399 · `zgood` 2400 · `zbad` 2401 |
| `#gm6` | Emoji-Raten (online) | em…, e… | 2032 | `estart` 2415 · `eflip` 2414 · `emHostGo` 2436 · `emJoinGo` 2438 |
| `#gm7` | Sekundenschätzen | s…, sk… | 2046 | `sstart` 2532, 6026 |
| `#gm8` | Tick Tac Boom | bx… | 2049 | `bxstart` 2564 · `bxnext` 2565 · `bxexp` 2593 · `bxend` 2600 |
| `#gm9` | Wer würde eher? | wr… | 2060 | `wrstart` 2614 · `wrnext` 2615 |
| `#gm10` | Kartensaufen | ks… | 2064 | `ksstart` 2630 · `ksnext` 2631 |
| `#gm13` | Schätzfragen (online/1 Handy) | sq…, h… | 2124 | `sqHostGo` 3029 · `sqJoinGo` 3032 · `sqLcGo` 3003 · `hStart` 3075 · `hNext` 3088 |
| `#gm14` | Busfahren (online) | bp… | 2136 | `bpHostGo` 3164 · `bpJoinGo` 3167 · `bpStartO` 3213 · `bpBusDraw` 3351, 6560 |
| `#gm15` | Duell (16 Minispiele in DLRUN) | dl…, DL… | 2151 | `dlPlay` 4034, 6275 · `dlEnd` 4042 · `dlAfterGame` 4122 · `dlFsCount` 4050 · `dlResV` 1869, 6441 · `dlT` 4067 |
| `#gm16` | Würfelfieber | wf… | 2015 | `wfStart` 4881 · `wfRoll` 4906 |
| `#gm17` | Kartenchaos (online) | kc… | 2023 | `kcHostGo` 4949 · `kcJoinGo` 4951 · `kcStartO` 4990 · `kcNext` 4988 · `kcTake` 4986 |
| `#gm11` | Einstellungen |  | 2069 | `view11` 2642 · `hapToggle` 5317 · `sndToggle` 5422 · `pfSave` 3858 |
| `#gm12` | Anmelden | au…, auth… | 2109 | `authEmail` 2670 · `authOAuth` 2666 · `auMode` 2664 |

**Duell-Minispiele (`DLRUN.<id>`, Zeile):** `react` 4155 · `tug` 4193 · `hockey` 4211 · `trace` 4324 · `simon` 4354 · `bomb` 4413, 6278 · `stop` 4432, 6291 · `circle` 4457, 6276 · `four` 4474, 6358 · `ttt` 4496 · `flag` 4679 · `cap` 4680 · `rps` 4688 · `arm` 4689, 6377 · `exen` 4693, 6419 · `where` 4783

## Globale Bausteine
- **Startseite / Navigation:** `hub` 2320 · `hmDraw` 2181 · `hsGo` 2339 · `pick` 2356, 3078, 5502 · `openG` 3502 · `closeG` 3503 · `hSet` 2325 · `showHelp` 3384
- **Modus Party/Normal:** `setMode` 2184 · `tfSw` 5434 · `modeBanks` 3814 · `refreshText` 3844
- **Sprache DE/EN:** `I18N` 3593 · `dlT` 4067
- **Spieler (global):** `PLY` 4830 · `plBtn` 4838 · `plxH` 5222 · `plxOpen` 5235 · `plxBuild` 5225, 5721 · `plxClose` 5243
- **Ton / Vibration / Stimme:** `TFSnd` 5410 · `TFS` 5419 · `TFH` 5312 · `tfVoice` 5456 · `tfVoiceN` 5457, 5602 · `tfBeep` 5601
- **Hilfen:** `toast` 2352 · `skEsc` 2523 · `fit` 1596, 3585, 5153, 6728
- **Premium / Werbung:** `openPW` 3398 · `proDraw` 3396, 5850

## Änderungsblöcke (vNNN, neueste unten)
| Block | Zeile | Inhalt |
|---|---|---|
| `v97` | 1220 | – |
| `v98` | 1220 | – |
| `v101` | 1243 | Startseiten: Inhalt vertikal mittig, etwas tiefer; Beschreibung gross |
| `v102` | 1274 | – |
| `v103` | 1278 | – |
| `v106` | 1278 | – |
| `v109` | 1287 | – |
| `v110` | 1312 | – |
| `v111` | 1353 | Kacheln: Feedback beim Antippen sofort (100 ms), beim Loslassen kritisch gedämpfte Rückkehr |
| `v112` | 1395 | Seiten (Spiele, Einstellungen, Anmelden): iOS-Kurve, Ausfahren etwas schneller als Einfahren |
| `v113` | 1422 | Einstellungen / Rechtliches: Zeilen mit sofortigem Druck, weicher Rückkehr; Gruppen mit Tiefe; Typografie |
| `v114` | 1464 | Knöpfe in allen Spielen: Druck sofort (100 ms), weiche Rückkehr; Tiefe durch Lichtkante |
| `v115` | 1496 | Ansichtswechsel (Anleitung, Runden, Auslosung, Tipp, Karte, Gewinner, Endstand): sanftes Einblenden, nur Opacity |
| `v116` | 1510 | Raumcode: Ziffern tabellarisch, ruhiger Glanz; Beschriftung leicht gesperrt (kleine Schrift) |
| `v117` | 1522 | Start: bis die Startseite steht, laufen keine Animationen und Übergänge |
| `v117js` | 1536 | – |
| `v118` | 1542 | – |
| `v119` | 1549 | 1 Duell: keine Bewegung im Hintergrund (Deko-Schicht aus) |
| `v119js` | 1579 | – |
| `v120` | 1582 | lange Namen: Kopfzeilen und Namensfelder |
| `v120js` | 1592 | – |
| `v121` | 1648 | (4) lange Wörter umbrechen |
| `v121js` | 1663 | – |
| `v122` | 1705 | (1) Paywall |
| `v123` | 1722 | Vollbild-Ergebnis im Duell (ueber dem Spiel, undurchsichtig) |
| `v123js` | 1801 | – |
| `v124` | 1891 | – |
| `v125` | 1894 | ===== (1) Spielerliste auf der Startseite ===== |
| `v126` | 1950 | – |
| `v127` | 1954 | – |
| `v128` | 1961 | – |
| `v129` | 1965 | – |
| `v130` | 1969 | – |
| `v131` | 1975 | – |
| `v132` | 1980 | – |
| `v98js` | 5097 | ===== v98: Rechtliches, Meine Daten, Hinweis ab 18, Barrierefreiheit ===== |
| `v103js` | 5153 | – |
| `v109js` | 5154 | – |
| `v110js` | 5181 | – |
| `v111js` | 5191 | – |
| `v113js` | 5197 | – |
| `v125js` | 5202 | – |
| `v127js` | 5274 | – |
| `v128js` | 5359 | – |
| `v129js` | 5371 | – |
| `v131js` | 5428 | Regler Party/Normal: erst der Schieber, dann (nach der Bewegung) der eigentliche Moduswechsel |
| `v132js` | 5446 | Ansager-Stimme fuer den Duell-Countdown (Kokoro-82M, Apache 2.0) |
| `v133` | 5462 | Start-Animation beim Öffnen (Prototyp vom 19.11.): Bühne 390×844, per JS eingepasst |
| `v133js` | 5490 | Start-Animation: nur beim Kaltstart (einmal je Laden der Seite), ca. 3 s, Tippen überspringt |
| `v134js` | 5586 | Duell-Countdown: statt Ansager "Three, two, one, go" drei gleiche Piepser bei 3-2-1, bei LOS kein Ton (Timon 19.11.) |
| `v135` | 5605 | Circle: Königs-Zähler „👑 0/4“ über dem Kartenkreis statt oben rechts im Kopf (Platz im Kopf bleibt, damit nichts verrutscht) |
| `v135js` | 5611 | – |
| `v136` | 5620 | v136 (Block 1, 20.11.): Scroll-Balken weg, Dreh-Knopf mittig und unter dem Fragezeichen, Suche weg, Zurueck-Abfrage, Muenzwurf, Siegerpodest |
| `v136js` | 5696 | – |
| `v137` | 5809 | ===== v137 (Block 2, 20.11.): Gratis-Woche sichtbar machen ===== |
| `v137js` | 5815 | ===== v137 (Block 2, 20.11.): Werbefrei 2,99 EUR, erste Woche gratis, etwas mehr Werbung ===== |
| `v138` | 5874 | v138 (Block 3, 21.11.): Schaetzfragen, Sekundenschaetzen, Emoji-Raten |
| `v138js` | 5926 | ===== v138 (Block 3, 21.11.): Schaetzfragen (Rang statt Abstand, krass daneben, Tastatur), Sekundenschaetzen (neue Regeln + online), Emoji-Raten (auch Trinkspie |
| `v139` | 6166 | v139 (Block 4, 21.11.): Duelle Teil 1 – kurze Erklärungen mit Schlagwörtern, kein Scrollen, größere Zeichenfelder, Boom wie im normalen Boom, Zeitgefühl neu |
| `v139js` | 6232 | ===== v139 (Block 4, 21.11.): Duelle Teil 1 ===== |
| `v140` | 6332 | v140 (Block 5a, 21.11.): Duelle Teil 2 – Drei gewinnt (blau/rot, direkt tippen, Boden), Flaggen/Hauptstädte (feste Anordnung), Armdrücken (Bereit + Countdown) |
| `v140js` | 6354 | ===== v140 (Block 5a, 21.11.): Duelle Teil 2 ===== |
| `v141` | 6389 | v141 (Block 5b, 21.11.): Wo liegt das (Karte), Trink-Duell (Bereit-Screen, Rundenende, Wetten, Überspringen) |
| `v141js` | 6412 | ===== v141 (Block 5b, 21.11.): Duelle Teil 2, zweite Hälfte ===== |
| `v142` | 6444 | v142 (Block 6a, 21.11.): Old Nick + Ass ziehen |
| `v142js` | 6475 | ===== v142 (Block 6a, 21.11.): Old Nick + Ass ziehen ===== |
| `v143` | 6489 | v143 (Block 6b, 21.11.): Busfahren |
| `v143js` | 6518 | ===== v143 (Block 6b, 21.11.): Busfahren ===== |
| `v144` | 6587 | v144 (Block 7, 21.11.): Pferderennen im Rennbahn-Look |
| `v144js` | 6648 | ===== v144 (Block 7, 21.11.): Pferderennen – Rennbahn-Look, Pferde, Tafel oben, kein Cooldown ===== |
| `v145` | 6704 | v145 (Block 7 Nachtrag, 21.11.): Pferderennen ohne Scrollen |
| `v145js` | 6723 | ===== v145 (Block 7 Nachtrag, 21.11.): Pferderennen ohne Scrollen – kompaktes Setup, Rennen passt sich der Höhe an ===== |
| `v146` | 6742 | v146 (Block 7 Nachtrag 2, 21.11.): Karte mittig unter der Bahn, Namen immer einzeilig |
| `v146js` | 6750 | ===== v146: Namen im Pferderennen passen die Schrift an, statt umzubrechen ===== |

## Meistbenutzte Funktionen (vor Änderung `graphify affected` prüfen)
`skEsc()` 2523 (47×) · `dlT()` 4067 (45×) · `toast()` 2352 (27×) · `xL()` 4868 (21×) · `c()` 5449 (20×) · `bpL()` 3146 (19×) · `dlLater()` 4141 (17×) · `bpBc()` 3202 (15×) · `dlBuzz()` 4139 (14×) · `plBtn()` 4838 (12×) · `plNames()` 4837 (12×) · `sqSet()` 2979 (12×) · `tfRound()` 3468 (11×) · `sqNetInit()` 3013 (11×) · `hBc()` 3071 (11×)
