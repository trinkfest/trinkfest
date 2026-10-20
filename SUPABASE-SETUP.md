# Supabase einrichten (Online-Spiele)

Für Schätzfragen und Emoji-Raten braucht ihr nur **Supabase Realtime (Broadcast)**. Es werden keine Tabellen benötigt.

## Schon erledigt
- Projekt angelegt, Project URL und publishable key stehen in `config.js`.
- Die Variablennamen `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` aus dem Supabase-Dashboard sind für Vite-Projekte gedacht. TrinkFest nutzt dafür `config.js`.

## Auf dem Mac
```
cd <Projektordner>
npm install @supabase/supabase-js
git add .
git commit -m "Supabase verbunden"
git push
npm run ios
```
`npm install @supabase/supabase-js` legt die Bibliothek ins Projekt. `npm run ios` kopiert sie dann in die App. Ohne diesen Schritt lädt die App sie beim Start aus dem Internet, das geht auch.

## Testen
Zwei Geräte oder Simulatoren starten. Auf dem ersten: Emoji-Raten oder Schätzfragen, "Online-Raum erstellen". Auf dem zweiten: "Raum beitreten" und den Code eingeben.

Falls "Verbindung fehlgeschlagen" erscheint: In Supabase unter **Realtime > Settings** prüfen, dass "Allow public access" aktiv ist.

## Hinweise
- Es gibt keinen eigenen Server und keine Datenbank. Das Handy des Raum-Erstellers (Host) verwaltet den Raum, Supabase leitet nur die Nachrichten weiter.
- Schließt der Host die App, ist der Raum beendet.
- Der kostenlose Tarif hat Grenzen für gleichzeitige Verbindungen und Nachrichten pro Sekunde. Für den Start reicht das.
- Den **secret key** niemals in die App, ins Repo oder in einen Chat schreiben.
- Für Konten (Anmeldung mit Apple oder E-Mail) richten wir später noch Authentication ein.
