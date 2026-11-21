/* Pferderennen: Ansicht (su|pay|pl|en) messen und optional Bild.
   npm run -s horse -- pl [--draw N] [--shot x.png] [--lang en] [--mode normal] [--js "code"] */
const { open, args } = require('./tf-pw');
(async () => {
  const a = args(), v = a._[0] || 'pl';
  const t = await open({ lang: a.lang, mode: a.mode });
  const p = t.page;
  await p.evaluate(v => {
    openR(); if (RP.length < 2) RP = [{ n: 'Timon', s: 0, b: 2 }, { n: 'Lea', s: 2, b: 3 }];
    if (v == 'su') return; rpay(); if (v == 'pay') { rpaid[0] = true; rpr(); return }
    rpaid = rpaid.map(() => true); rstart(); if (v == 'en') rwin(RP[0].s);
  }, v);
  await p.waitForTimeout(500);
  for (let i = 0; i < (+a.draw || 0); i++) { await p.evaluate(() => rdraw()); await p.waitForTimeout(+a.wait || 800) }
  if (a.js) console.log(await p.evaluate(a.js));
  const info = await p.evaluate(() => {
    const g = document.getElementById('gm2'), r = g.getBoundingClientRect();
    const on = g.querySelector(':scope>.vw.on'), sc = on ? on.scrollHeight - on.clientHeight : 0;
    return { v: g.dataset.v, scroll: sc, rm: (document.getElementById('rm') || {}).textContent, pos: typeof rpos != 'undefined' ? rpos.join(',') : '' };
  });
  console.log(JSON.stringify(info), 'Fehler:', t.errs.length, t.errs.slice(0, 3));
  if (a.shot) await p.screenshot({ path: a.shot, scale: 'css' });
  await t.close();
})();
