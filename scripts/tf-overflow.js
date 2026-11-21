/* Prüft, ob man im Duell scrollen muss: alle Seiten, DE/EN, Party/Normal, 2/4/10 Spieler.
   npm run -s overflow            → nur Probleme (Seite: Pixel zu viel)
   npm run -s overflow -- --all   → alle Werte */
const { open, args } = require('./tf-pw');
const NAMES = ['Anna', 'Benedikt', 'Carla', 'Dennis', 'Emil', 'Franziska', 'Gustav', 'Hannah', 'Ida', 'Jonas'];
(async () => {
  const a = args(); let bad = 0;
  for (const lang of ['de', 'en']) for (const mode of ['party', 'normal']) {
    const t = await open({ lang, mode });
    for (const n of [2, 4, 10]) {
      const r = await t.page.evaluate(async nm => {
        const sl = ms => new Promise(r => setTimeout(r, ms)), o = {};
        const m = (v, k) => { const e = dlEl(v); o[k || v] = e.scrollHeight - e.clientHeight };
        N = nm.slice(); openD(); await sl(250); m('su');
        DLP = nm.slice(); dlToRn(); await sl(150); m('rn');
        dlStart(); await sl(50);
        if (dlBettors().length) { dlV('tp'); await sl(150); m('tp') }
        for (const g of dlList()) { DLS.gl[0] = g.id; DLS.gi = 0; dlV('gs'); await sl(20); m('gs', 'gs:' + g.id) }
        DLS.res = [DLS.a, DLS.a, DLS.b]; DLS.rr = { lc: { [DLS.a]: 1, [DLS.b]: 2 }, rw: DLS.a };
        DLS.tipRes = dlBettors().map(i => ({ i, h: DLS.a, n: 2, ok: false })); DLS.rnd = 1; dlV('rs'); await sl(150); m('rs');
        dlV('en'); await sl(150); m('en'); closeD(); return o;
      }, NAMES.slice(0, n));
      const probs = Object.entries(r).filter(([, v]) => v > 1);
      bad += probs.length;
      if (a.all) console.log(lang, mode, n + ' Spieler', JSON.stringify(r));
      else if (probs.length) console.log(lang, mode, n + ' Spieler: ' + probs.map(([k, v]) => k + ' +' + v + 'px').join(', '));
    }
    if (t.errs.length) console.log(lang, mode, 'FEHLER:', t.errs.slice(0, 3).join(' | '));
    await t.close();
  }
  console.log(bad ? bad + ' Seiten zu lang' : 'kein Scrollen nötig');
})();
