// TrinkFest: In-App-Kauf "Werbefrei" (Einmalkauf, kein Abo). Nur in der iOS-App.
// Nutzt Apples StoreKit 2 über das Capacitor-Plugin @capgo/native-purchases (npm install @capgo/native-purchases).
// Die App (index.html) erwartet window.TF_IAP = { buy(), restore(), price() }.
(function () {
  try {
    var C = window.Capacitor;
    if (!(C && C.getPlatform && C.getPlatform() === 'ios')) return;
    var ID = (window.TF_IAP_CFG && window.TF_IAP_CFG.productId) || 'de.trinkfest.app.adfree';
    var plugin = function () { return (C.Plugins && C.Plugins.NativePurchases) || null; };
    var need = function () { var p = plugin(); if (!p) throw new Error('Plugin @capgo/native-purchases fehlt'); return p; };
    var cancelled = function (e) { return /cancel|abgebrochen/i.test(String((e && (e.message || e.code)) || e)); };
    var owned = async function (p) {
      var r = await p.getPurchases({ productType: 'inapp' });
      return ((r && r.purchases) || []).some(function (t) { return t && t.productIdentifier === ID; });
    };
    window.TF_IAP = {
      // true = gekauft, false = abgebrochen, Fehler = nicht möglich
      buy: async function () {
        var p = need();
        try { await p.purchaseProduct({ productIdentifier: ID, productType: 'inapp', quantity: 1 }); return true; }
        catch (e) { if (cancelled(e)) return false; throw e; }
      },
      // 'life' = Kauf gefunden, null = kein Kauf
      restore: async function () {
        var p = need();
        try { await p.restorePurchases(); } catch (e) { if (!cancelled(e)) throw e; }
        return (await owned(p)) ? 'life' : null;
      },
      // lokalisierter Preis aus dem App Store, z. B. "4,99 €"
      price: async function () {
        var p = need();
        var r = await p.getProducts({ productIdentifiers: [ID], productType: 'inapp' });
        var x = r && r.products && r.products[0];
        return (x && x.priceString) || null;
      }
    };
    // Kauf, der später abgeschlossen wird (z. B. "Ask to Buy"): beim nächsten Start ist Werbefrei aktiv
    var p0 = plugin();
    if (p0 && p0.addListener) p0.addListener('transactionUpdated', function (t) {
      try { if (t && t.productIdentifier === ID) localStorage.setItem('tf_pro', JSON.stringify({ k: 'life', ts: Date.now() })); } catch (e) {}
    });
  } catch (e) {}
})();
