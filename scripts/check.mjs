import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
const errors = [];
const results = [];
await mkdir('test-results', { recursive: true });
try {
  for (const width of (process.env.INTERACTIONS_ONLY ? [] : [1920, 1440, 1280, 1024, 768, 430, 390])) {
    const page = await browser.newPage({ viewport: { width, height: width < 700 ? 844 : 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(`${width}: ${error.message}`));
    page.on('console', message => { if (message.type() === 'error') errors.push(`${width}: ${message.text()}`); });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('main > section').count(), 12);
    assert.equal(await page.locator('h1').count(), 1);
    for (const section of await page.locator('main > section').all()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(overflow, false, `Page overflow at ${width} in ${await section.getAttribute('id')}`);
    }
    // Visit all slides so native lazy loading is exercised before checking images.
    const imageGallery = page.getByRole('region', { name: /Галерея проектов/ });
    await imageGallery.scrollIntoViewIfNeeded();
    await imageGallery.focus();
    const slideCount = await imageGallery.locator('article').count();
    for (let i = 0; i < slideCount; i++) {
      await imageGallery.locator('article').nth(i).locator('img').evaluate(img => { img.loading = 'eager'; return img.decode(); });
      await page.keyboard.press('ArrowRight');
    }
    await page.keyboard.press('Home');
    const brokenImages = await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src));
    assert.deepEqual(brokenImages, [], `Images at ${width}`);
    await page.locator('#intro').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    await page.screenshot({ path: `test-results/hero-${width}.png` });
    if ([1440, 390].includes(width)) {
      await page.screenshot({ path: `test-results/full-${width}.png`, fullPage: true });
      for (const id of ['mission', 'technology', 'pricing', 'contact']) {
        await page.locator(`#${id}`).screenshot({ path: `test-results/${id}-${width}.png` });
      }
    }
    await page.locator('#expertise details').first().locator('summary').click();
    assert.equal(await page.locator('#expertise details').first().getAttribute('open'), '');
    await page.locator('#technology details').first().locator('summary').click();
    assert.equal(await page.locator('#technology details').first().getAttribute('open'), '');
    results.push({ width, layout: 'pass', images: 'pass', accordions: 'pass' });
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('#film video').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => { const v = document.querySelector('video'); return v && !v.paused && v.currentTime > .1; });
  assert.equal(await page.locator('video').evaluate(v => v.muted), true);
  await page.locator('#capabilities').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('video').paused);
  const nav = page.getByRole('navigation', { name: 'Разделы презентации' });
  await nav.getByRole('link', { name: 'Условия сотрудничества', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('nav a[aria-current="location"]')?.getAttribute('href') === '#pricing');

  const gallery = page.getByRole('region', { name: /Галерея проектов/ });
  await gallery.scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Следующий проект', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('[role="progressbar"]').getAttribute('aria-valuenow') === '2');
  await page.waitForTimeout(700);
  await gallery.focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() => document.querySelector('[role="progressbar"]').getAttribute('aria-valuenow') === '3');
  await page.waitForTimeout(700);
  await page.keyboard.press('Home');
  await page.waitForTimeout(800);
  let box = await gallery.boundingBox();
  await page.mouse.move(box.x + 700, box.y + 200);
  await page.mouse.down();
  await page.mouse.move(box.x + 100, box.y + 200, { steps: 15 });
  await page.mouse.up();
  await page.waitForTimeout(800);
  assert.ok(await gallery.evaluate(node => node.scrollLeft) > 500, 'Mouse drag advances gallery');
  await page.keyboard.press('Home');
  await page.waitForTimeout(800);
  await gallery.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
  box = await gallery.boundingBox();
  await page.mouse.move(box.x + 600, box.y + 200);
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(800);
  assert.ok(await gallery.evaluate(node => node.scrollLeft) > 100, 'Mouse wheel advances gallery');
  await gallery.focus();
  await page.keyboard.press('End');
  await page.waitForFunction(() => { const node = document.querySelector('[aria-roledescription="карусель"]'); return node.scrollLeft >= node.scrollWidth - node.clientWidth - 2; });
  box = await gallery.boundingBox();
  await page.mouse.move(box.x + 600, box.y + 200);
  const beforeScroll = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);
  assert.ok(await page.evaluate(() => scrollY) > beforeScroll, 'Vertical escape at gallery end');
  await gallery.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await gallery.focus();
  await page.keyboard.press('Home');
  await page.waitForFunction(() => document.querySelector('[aria-roledescription="карусель"]').scrollLeft < 2);
  box = await gallery.boundingBox();
  await page.mouse.move(box.x + 600, box.y + 200);
  await page.mouse.wheel(800, 0);
  await page.waitForTimeout(1000);
  assert.ok(await gallery.evaluate(node => node.scrollLeft) > 100, 'Horizontal trackpad advances gallery');
  await gallery.screenshot({ path: 'test-results/projects-1440.png' });
  results.push({ interaction: 'video autoplay, muted, pause offscreen, navigation, keyboard, drag, wheel, vertical escape', result: 'pass' });
  await page.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await mobile.goto(base, { waitUntil: 'networkidle' });
  const touchGallery = mobile.getByRole('region', { name: /Галерея проектов/ });
  await touchGallery.scrollIntoViewIfNeeded();
  const bounds = await touchGallery.boundingBox();
  const cdp = await mobile.context().newCDPSession(mobile);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 350, y: bounds.y + 150 }] });
  for (let x = 320; x >= 50; x -= 30) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: bounds.y + 150 }] });
    await mobile.waitForTimeout(20);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await mobile.waitForTimeout(600);
  assert.ok(await touchGallery.evaluate(node => node.scrollLeft) > 100, 'Touch swipe advances gallery');
  assert.equal(await mobile.locator('video').evaluate(v => v.paused), true, 'Reduced motion disables autoplay');
  results.push({ interaction: 'touch swipe, reduced motion', result: 'pass' });
  await mobile.close();
  assert.deepEqual(errors, [], 'Browser console and runtime errors');
  await writeFile('test-results/report.json', JSON.stringify({ results, errors }, null, 2));
  console.log(JSON.stringify({ results, errors }, null, 2));
} finally {
  await browser.close();
}
