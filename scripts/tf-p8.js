/* Block-8-Spiele messen: boom|wer|zunge, Ansicht su|pl|who|en.
   npm run -s p8 -- boom su [--shot x.png] [--lang en] [--mode normal] [--js "code"] [--h 667 --w 375] [--n 6] */
const { open, args } = require('./tf-pw');
(async () => {
  const a = args(), g = a._[0] || 'boom', v = a._[1] || 'su';
  const t = await open({ lang: a.lang, mode: a.mode });
  const p = t.page;
  if (a.h) { await p.setViewportSize({ width: +a.w || 390, height: +a.h }); await p.evaluate(() => dispatchEvent(new Event('resize'))); await p.waitForTimeout(600) }
  await p.evaluate(([g, v, n]) => {
    const names = ['Timon', 'Lea', 'Max', 'Anna', 'Jonas', 'Sophie', 'Paul', 'Mia', 'Ben', 'Lara'].slice(0, +n || 3);
    if (typeof PLY !== 'undefined') { try { PLY.length = 0; names.forEach(x => PLY.push(x)) } catch (e) {} }
    if (g == 'boom') { N = names.slice(); openT(); if (v != 'su') { if (!bxSel.size) BXC.forEach(c => bxSel.add(c.k)); bxstart(); if (v == 'who') { bxexp(); bxPh = 'who'; bxnm.innerHTML = BXP.map((n, i) => `<button onclick="bxwho(${i})">${skEsc(n)}</button>`).join(''); view8('who') } if (v == 'en') { bxTal = bxTal.map((x, i) => i * 3); bxend() } } }
    if (g == 'wer') { N = names.slice(); openW(); if (v != 'su') { if (!wrSel.size) WRQ.forEach(c => wrSel.add(c.k)); wrstart() } }
    if (g == 'zunge') { N = names.slice(); openZ(); if (v != 'su') zstart() }
  }, [g, v, a.n]);
  await p.waitForTimeout(600);
  if (a.js) console.log(await p.evaluate(a.js));
  const id = { boom: 'gm8', wer: 'gm9', zunge: 'gm5' }[g];
  const info = await p.evaluate(id => { const gm = document.getElementById(id), on = gm.querySelector(':scope>.vw.on'); return { view: on && on.id, scroll: on ? on.scrollHeight - on.clientHeight : -1, h: on && on.clientHeight } }, id);
  console.log(JSON.stringify(info), 'Fehler:', t.errs.length, t.errs.slice(0, 3));
  if (a.shot) await p.screenshot({ path: a.shot, scale: 'css' });
  await t.close();
})();
