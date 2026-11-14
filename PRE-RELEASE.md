# TrinkFest: Checkliste vor der Veröffentlichung (Stand 14.11.2026, v110)

Die Prüfung gegen Apples Richtlinien (25 Punkte, Risiko, Lösung, wer) steht in `APP-STORE-PRUEFUNG.md` (Version 110). Allgemeine Orientierung, keine Rechtsberatung. Nicht jeder Punkt gilt für jede App. `npm run release-check` prüft einen Teil davon automatisch.

## Die 20 Punkte

| # | Punkt | Stand | Was noch fehlt (nur ihr) |
|---|-------|-------|---------------------------|
| 1 | Impressum | Seite in den Einstellungen und als `impressum.html`, Struktur nach § 5 DDG | Erledigt am 14.11.2026 aus der Gewerbeanmeldung (3 Gesellschafter, Loreleiring 21, 65197 Wiesbaden, Telefon). Offen: E-Mail bestätigen (App nutzt app.trinkfest@gmail.com, Gewerbeanmeldung nennt trinkfest.app@gmail.com), Impressum juristisch prüfen lassen |
| 2 | Datenschutzerklärung | in der App (DE/EN) und als `datenschutz.html`, Stand 13.11.2026 | Verantwortlicher (GbR) ist eingetragen. Offen: öffentliche URL (GitHub Pages) für App Store Connect |
| 3 | Vertragsbedingungen | Nutzungsbedingungen in der App und als `nutzungsbedingungen.html` | Prüfen lassen (Jurist) oder in App Store Connect Apples Standard-EULA wählen |
| 4 | Widerruf und Erstattung | Nutzungsbedingungen Punkt 6: Abwicklung über Apple (reportaproblem.apple.com) | Juristische Prüfung der Formulierung |
| 5 | Klare Preise, Abo-Bedingungen | Nur noch ein Produkt: Einmalkauf „Werbefrei“ (4,99 €, kein Abo). Paywall: Preis aus dem App Store (seit v110 ohne Festpreis-Ersatz auf dem iPhone), inkl. MwSt., Links zu Bedingungen/Datenschutz, Käufe wiederherstellen | Kauf einrichten (siehe ANLEITUNG-MAC.md, „Werbefrei einrichten“): Plugin installieren, Xcode-Capability, Produkt `de.trinkfest.app.adfree` in App Store Connect, Test mit Sandbox-Konto |
| 6 | Einwilligung für Tracking | ATT-Abfrage + EU-Einwilligungsfenster (UMP) vor der ersten Werbung, Widerruf unter Einstellungen > Werbe-Einwilligung | Echte AdMob-App-ID, `test:false`, Datenschutz-Angaben in App Store Connect (Tracking: ja, IDFA). Seit v110 fragt die App ATT/EU-Einwilligung erst nach dem 18+-Hinweis |
| 7 | Formulare ohne Tricks | Keine Konten, keine Formulare. Login-Code ist toter Code (nicht erreichbar). Hinweis ab 18: ein klarer Knopf | nichts |
| 8 | Nur notwendige Daten | Alles lokal, Online-Räume nur Name/Avatar/Spielzüge live, nichts gespeichert | nichts |
| 9 | Externe Dienste und Tracker | Supabase Realtime (nur Online-Räume), Google AdMob. Schrift und Bibliotheken lokal. Alle in der Datenschutzerklärung genannt | `npm run ios` legt `ios/App/App/PrivacyInfo.xcprivacy` an (Vorlage `scripts/PrivacyInfo.xcprivacy`); in Xcode zum Target „App“ hinzufügen, Privacy Report prüfen (siehe `release-check`) |
| 10 | Schlüssel und Nutzerdaten schützen | Repo geprüft: nur der öffentliche Supabase-Key (publishable) und AdMob-IDs. Kein secret/service_role | Supabase: Realtime-Zugriff und Limits im Dashboard prüfen |
| 11 | Datenauskunft | Datenschutz Punkt 14: Daten liegen nur lokal auf dem Gerät, Auskunft per E-Mail (die Seite „Meine Daten“ wurde am 14.11. entfernt, es gibt keine Konten) | Postfach app.trinkfest@gmail.com beobachten, Antwort binnen 1 Monat |
| 12 | Löschanfragen | Lokale Daten löscht man durch Löschen der App, sonst Löschung per E-Mail (Datenschutz Punkt 14) | wie 11 |
| 13 | Newsletter-Abmeldung | Es gibt keinen Newsletter. Nicht zutreffend | falls später einer kommt: Abmeldelink in jeder Mail |
| 14 | Keine erfundenen Bewertungen | Keine Bewertungen oder Zahlen in der App | in der Store-Beschreibung nichts erfinden |
| 15 | Keine unbelegten Versprechen | „Alle Spiele freischalten“, „Bestes Angebot“, „Sichere Zahlung“ entfernt. „Werbefrei“ = keine Werbung, sonst nichts | Store-Texte entsprechend schreiben |
| 16 | Keine manipulativen Buttons | Weinendes Emoji beim Kündigen entfernt, Kündigen und Behalten gleichwertig, kein Zeitdruck | nichts |
| 17 | Bildbeschreibungen | Dekorative Bilder mit leerem alt (Text steht daneben), Logo mit alt, Symbole für Screenreader versteckt, alle Knöpfe und Felder mit Namen | nichts |
| 18 | Lesbare Farbkontraste | Alle Texte auf allen Seiten gemessen (WCAG AA 4,5:1), Schwachstellen behoben. Ausnahme: PayPal-Logo (nur Web) | nichts |
| 19 | Bedienbar mit der Tastatur | Alle Knöpfe per Tab erreichbar, Enter/Leertaste, Esc schließt Fenster, sichtbarer Fokus | Auf dem iPhone mit VoiceOver kurz testen |
| 20 | Lizenzen: Bilder, Icons, Schriften | Seite „Lizenzen & Quellen“, Lizenzdateien werden nach `www/licenses` kopiert (Montserrat OFL, Supabase MIT, Capacitor MIT, AdMob-Plugin MIT) | Herkunft/Rechte der Cover-Bilder, des Logos und des Icons bestätigen (selbst erstellt? KI-Tool? dessen Nutzungsbedingungen prüfen) |

## Weitere Punkte für den App Store
- Altersfreigabe in App Store Connect: wegen Alkohol-Bezug die höchste Stufe (17+/18+) wählen.
- App-Datenschutz („Privacy Nutrition Labels“): Werbedaten/Geräte-ID (Tracking), sonst nichts.
- Privacy-Policy-URL und Support-URL: `datenschutz.html` und `support.html` über GitHub Pages veröffentlichen.
- Werbefrei (In-App-Kauf): Produkt in App Store Connect anlegen (Nicht verbrauchbar, ID `de.trinkfest.app.adfree`, Preis 4,99 €, Name „Werbefrei“, Beschreibung, Screenshot der Paywall für die Prüfung) und mit der App-Version zur Prüfung einreichen. Vorher „Vereinbarungen, Steuern, Bankverbindung“ (Paid Apps Agreement) ausfüllen. Small Business Program (15 % Provision) beantragen.
- Info.plist (setzt `npm run ios` seit v110): Kamera-/Fototext für das Kartenrücken-Foto, zweisprachiger Tracking-Text, `ITSAppUsesNonExemptEncryption=false`.
- Offen nur ihr (Details in `APP-STORE-PRUEFUNG.md`): Supabase aktiv halten (Free-Projekte pausieren nach 7 Tagen), EU-Händlerstatus (DSA), Altersfreigabe-Fragebogen (Ziel 18+), Entscheidung zu „auf Ex austrinken“-Texten, `TF_APP.id`, Prüfhinweise.
