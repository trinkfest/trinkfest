// Verbindung zu Supabase (Online-Spiele). Diese Datei bleibt bei Updates von index.html unverändert.
// Der "publishable key" ist für die Öffentlichkeit gedacht und darf hier stehen.
// NIEMALS den "secret key" oder "service_role key" hier eintragen.
window.TF_CONFIG = {
  url: 'https://gihjofpzobvxrtknfycz.supabase.co',
  key: 'sb_publishable_f1FU8BrPS7RszIrfmOGJnQ_M1pZ-BYi'
};

// Werbung (Google AdMob). Das sind keine Geheimnisse, die IDs stehen auch in der fertigen App.
// demo:true  = nur das Platzhalter-Fenster, keine echte Werbung.
// test:true  = echtes AdMob-Plugin, aber mit Googles Test-Anzeigen (zeigt sofort etwas, ideal zum Prüfen).
// test:false = deine echte Anzeigenblock-ID (neue IDs liefern oft Stunden bis Tage nichts, vor allem solange die App nicht im Store ist).
// Vor dem App-Store-Upload: test:false setzen.
window.TF_ADS_CFG = {
  demo: false,
  test: true,
  admob: { ios: 'ca-app-pub-6905262120753416/7164142243' }
};

// In-App-Kauf "Werbefrei" (Einmalkauf, 2,99 €, lebenslang). Die Produkt-ID muss exakt so in App Store Connect angelegt sein
// (Typ: Nicht verbrauchbar / Non-Consumable). Der Preis kommt aus dem App Store, hier steht kein Preis.
window.TF_IAP_CFG = {
  productId: 'de.trinkfest.app.adfree'
};
