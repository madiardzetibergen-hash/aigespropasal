import { chromium } from '@playwright/test';

const browser = await chromium.launch();
for (const width of [1920, 1440, 768, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width < 700 ? 844 : 900 } });
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
  const gallery = page.locator('#projects');
  await gallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await gallery.screenshot({ path: `test-results/projects-snap-${width}.png` });
  await page.close();
}
await browser.close();
console.log('Project screenshots saved.');
