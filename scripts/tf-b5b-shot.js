/* Block 5b: Bilder von Trink-Duell (Bereit), Wo liegt das (Karte), Rundenende. node scripts/tf-b5b-shot.js <ordner> */
const { open } = require('./tf-pw');
(async () => {
  const dir = process.argv[2] || '.';
  const t = await open({ clock: true });
  const go = id => t.page.evaluate(id => { N = ['Anna', 'Ben', 'Cem']; openD(); DLP = ['Anna', 'Ben', 'Cem']; dlStart(); DLS.gl = [id, 'ttt', 'tug']; DLS.gi = 0; dlPlay() }, id);
  await go('exen'); await t.run(1000); await t.page.waitForTimeout(1200);
  await t.page.screenshot({ path: dir + '/exen.png', scale: 'css' });
  await go('where'); await t.run(4000); await t.page.waitForTimeout(600);
  await t.page.evaluate(() => document.querySelector('[id^=wo]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  await t.run(500); await t.page.waitForTimeout(600);
  await t.page.evaluate(() => { const m = document.querySelector('.dmap canvas'); const r = m.getBoundingClientRect(); const f = (x, y) => { for (const ty of ['pointerdown', 'pointerup']) m.dispatchEvent(new PointerEvent(ty, { bubbles: true, clientX: r.left + x, clientY: r.top + y, pointerId: 1 })) }; f(r.width * .4, r.height * .4) });
  await t.page.waitForTimeout(600);
  await t.page.screenshot({ path: dir + '/where.png', scale: 'css' });
  await t.page.evaluate(() => { DLS.rr = { lc: { 0: 2, 1: 1 }, rw: 1 }; DLS.res = [0, 1, 0]; DLS.a = 0; DLS.b = 1; DLS.tipRes = [{ i: 2, h: 0, n: 3, ok: false }]; DLS.rnd = 1; dlV('rs') });
  await t.page.waitForTimeout(500);
  await t.page.screenshot({ path: dir + '/rs.png', scale: 'css' });
  const errs = await t.errors?.() ; console.log('fertig', JSON.stringify(errs || ''));
  await t.close();
})();
