/* Pferderennen: Ansicht (su|pay|pl|en) messen und optional Bild.
   npm run -s horse -- pl [--draw N] [--shot x.png] [--lang en] [--mode normal] [--js "code"] [--h 667 --w 375] [--sab 24 (dazu Notch oben)] [--n 8] */
const { open, args } = require('./tf-pw');
(async () => {
  const a = args(), v = a._[0] || 'pl';
  const t = await open({ lang: a.lang, mode: a.mode });
  const p = t.page;
  if (a.h) { await p.setViewportSize({ width: +a.w || 390, height: +a.h }); await p.evaluate(() => dispatchEvent(new Event('resize'))); await p.waitForTimeout(600) }
  if (a.sab || a.n) await p.evaluate(([sab, n]) => { if (sab) { const ph = document.querySelector('.ph'); ph.style.setProperty('--sab', sab + 'px'); ph.style.setProperty('--sat', Math.round(sab * 1.4) + 'px') }; if (n) { PLY = Array.from({ length: n }, (_, i) => ['Timon', 'Lea', 'Maximilian', 'Jo', 'Sophie', 'Ben', 'Alexandra', 'Tom', 'Mia', 'Paul'][i] || '') } }, [+a.sab || 0, +a.n || 0]);
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
