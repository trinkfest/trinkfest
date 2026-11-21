/* Busfahren (solo mit Bots): Phase anspringen, Maße/Text + Bild.  npm run -s bus -- lobby|peek|pyr|bd|bus|end [--shot x.png] [--lang en] [--js "code"] */
const { open, args } = require('./tf-pw');
(async () => {
  const a = args(), ph = a._[0] || 'peek';
  const t = await open({ lang: a.lang, mode: a.mode });
  const p = t.page;
  await p.evaluate(() => { openBus(); bnNm.value = 'Timon'; bpSolo() });
  await p.waitForTimeout(400);
  const steps = {
    peek: () => bpStartO(),
    pyr: () => { bpStartO(); BPH.pl.forEach(x => x.rdy = true); bpPyStart(); bpNextCard(); bpNextCard() },
    bd: () => { bpStartO(); BPH.pl.forEach(x => x.rdy = true); bpPyStart(); BPH.pn = 10; bpNextCard() },
    bus: () => { bpStartO(); BPH.pl.forEach(x => x.rdy = true); bpPyStart(); BPH.pn = 10; bpNextCard(); BPH.bd.p = BPH.host; bpBusGo(); bpBusAns(0) },
    end: () => { bpStartO(); BPH.pl.forEach(x => x.rdy = true); bpPyStart(); BPH.pn = 10; bpNextCard(); BPH.bd.p = BPH.host; bpBusGo(); BPH.ph = 'end'; BPH.pl.forEach((x, i) => x.d = 3 + i * 4); BPH.bus.sips = 5; bpBc() },
  };
  if (steps[ph]) await p.evaluate(steps[ph]);
  await p.waitForTimeout(700);
  if (a.js) console.log(await p.evaluate(a.js));
  console.log(await p.evaluate(() => gm14.dataset.v + ' | ' + gm14.querySelector('.vw.on, .vw[style*=block]')?.innerText.replace(/\n+/g, ' / ').slice(0, 400)));
  console.log('Fehler:', t.errs.length, t.errs.slice(0, 3));
  if (a.shot) await p.screenshot({ path: a.shot });
  await t.close();
})();
