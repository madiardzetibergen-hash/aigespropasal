import { chromium } from '@playwright/test';

const browser = await chromium.launch();
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width < 700 ? 844 : 900 } });
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
  const gallery = page.locator('#projects');
  await gallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const articles = await page.locator('article[aria-roledescription="слайд"]').all();
  for (let i = 0; i < articles.length; i++) {
    await page.evaluate((idx) => {
      const track = document.querySelector('[aria-roledescription="карусель"]');
      const target = track.children[idx];
      track.scrollTo({ left: target.offsetLeft - track.children[0].offsetLeft, behavior: 'instant' });
    }, i);
    await page.waitForTimeout(300);
    await gallery.screenshot({ path: `test-results/project-slide-${i + 1}-${width}.png` });
  }
  await page.close();
}
await browser.close();
console.log('All slides captured successfully.');
