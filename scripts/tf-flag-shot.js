/* Flaggen/Hauptstädte: Bildschirm in den Phasen Frage, Lösung zeigen, Prüfen. npm run -s node scripts/tf-flag-shot.js <id> <ordner> */
const { open } = require('./tf-pw');
(async () => {
  const id = process.argv[2] || 'flag', dir = process.argv[3] || '.';
  const t = await open({ clock: true });
  await t.page.evaluate(id => { N = ['Anna', 'Ben']; openD(); DLP = ['Anna', 'Ben']; dlStart(); DLS.gl = [id, 'ttt', 'tug']; DLS.gi = 0; dlPlay() }, id);
  for (let s = 0; s < 1; s++) await t.run(1000);
  const click = q => t.page.evaluate(q => { const e = document.querySelector(q); if (e) e.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); return !!e }, q);
  await click('[data-q=rdy][data-p="0"]'); await click('[data-q=rdy][data-p="1"]');
  for (let s = 0; s < 4; s++) await t.run(1000);
  await t.page.screenshot({ path: dir + '/q1.png', scale: 'css' });
  await click('[data-q=peek]'); await t.run(300);
  await t.page.screenshot({ path: dir + '/q2.png', scale: 'css' });
  await click('[data-q=know]'); await t.run(300);
  await t.page.screenshot({ path: dir + '/q3.png', scale: 'css' });
  console.log(t.errs.join('|') || 'ok'); await t.close();
})();
