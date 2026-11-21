/* Old Nick + Ass ziehen: Maße und optional Bild.  npm run -s cards -- nick|ass [--shot x.png] [--lang en] */
const { open, args } = require('./tf-pw');
(async () => {
  const a = args(), g = a._[0] || 'nick';
  const t = await open({ lang: a.lang, mode: a.mode });
  const p = t.page;
  await p.evaluate(g => { if (g == 'nick') { openB(); bstart() } else { openA(); astart() } }, g);
  await p.waitForTimeout(800);
  if (a.js) console.log(await p.evaluate(a.js));
  const info = await p.evaluate(g => {
    const q = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] };
    return g == 'nick' ? { rt: q('#gm3 .rt'), qm: q('#gm3 .qm'), res: q('#bres'), ctr: q('#brm') } : { pk: q('#apk'), dc: q('#adc'), tn: q('#atn'), rm: q('#arm') };
  }, g);
  console.log(JSON.stringify(info), 'Fehler:', t.errs.length, t.errs.slice(0, 3));
  if (a.shot) await p.screenshot({ path: a.shot });
  await t.close();
})();
