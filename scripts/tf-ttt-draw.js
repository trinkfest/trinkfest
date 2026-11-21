/* Tic Tac Toe: dreimal Unentschieden -> Münzwurf? */
const { open } = require('./tf-pw');
(async () => {
  const t = await open({ clock: true });
  await t.page.evaluate(() => { N = ['Anna', 'Ben']; openD(); DLP = ['Anna', 'Ben']; dlStart(); DLS.gl = ['ttt', 'tug', 'four']; DLS.gi = 0; dlPlay() });
  for (let s = 0; s < 5; s++) await t.run(1000);
  for (let r = 0; r < 3; r++) {
    await t.page.evaluate(() => [0, 1, 2, 4, 3, 5, 7, 6, 8].forEach(i => { const e = document.querySelector('.dxc[data-i="' + i + '"]'); e && e.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })) }));
    console.log('Runde', r + 1, await t.page.evaluate(() => (document.querySelector('.d4m') || {}).innerText));
    await t.run(2000);
  }
  console.log('Münzwurf:', await t.page.evaluate(() => !!document.querySelector('.tfov.coin')));
  console.log(t.errs.join('|') || 'keine Fehler'); await t.close();
})();
