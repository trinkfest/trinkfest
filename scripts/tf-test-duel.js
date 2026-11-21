/* Ein Duell-Minispiel headless testen, Zeit wird vorgespult.
   npm run -s test-duel -- <id> [--sek 20] [--lang en] [--mode normal] [--js "code"] [--shot datei.png]
   <id> = react tug hockey rps trace simon bomb stop circle four ttt flag cap where arm exen
   Ausgabe: Zahlen statt Bilder (Ergebnis, offene Fenster, Fehler). --js wird nach dem Vorspulen ausgewertet.
   Beispiel: npm run -s test-duel -- hockey --sek 68   (45 s + 15 s Verlängerung → Münzwurf) */
const { open, args } = require('./tf-pw');
(async () => {
  const a = args(), id = a._[0];
  if (!id) { console.log('Bitte Minispiel angeben, z. B.: npm run -s test-duel -- hockey'); process.exit(1) }
  const t = await open({ clock: true, lang: a.lang, mode: a.mode });
  const ok = await t.page.evaluate(id => {
    if (!DLM.find(g => g.id == id)) return 'unbekannt: ' + id + ' (gibt es: ' + DLM.map(g => g.id).join(' ') + ')';
    N = ['Anna', 'Ben']; openD(); DLP = ['Anna', 'Ben']; dlStart(); DLS.gl = [id, 'ttt', 'tug']; DLS.gi = 0; dlPlay(); return 'ok';
  }, id);
  if (ok != 'ok') { console.log(ok); await t.close(); process.exit(1) }
  const sek = +(a.sek || 20);
  for (let s = 0; s < sek; s++) await t.run(1000);
  const st = await t.page.evaluate(js => {
    const o = {
      ansicht: gm15.dataset.v, ergebnis: DLS.res.map(i => DLS.pl[i]),
      muenzwurf: !!document.querySelector('.tfov.coin'),
      text: (document.querySelector('#d-pl .dar') || {}).innerText?.replace(/\s+/g, ' ').slice(0, 160)
    };
    if (js) try { o.js = eval(js) } catch (e) { o.js = 'Fehler: ' + e.message }
    return o;
  }, a.js || '');
  console.log(JSON.stringify(st, null, 1));
  if (a.shot) { await t.page.screenshot({ path: a.shot, scale: 'css' }); console.log('Bild:', a.shot) }
  console.log(t.errs.length ? 'FEHLER: ' + t.errs.slice(0, 5).join(' | ') : 'keine Fehler');
  await t.close();
})();
