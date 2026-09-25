import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const findings = [];
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(process.env.TEST_URL || 'http://127.0.0.1:3000', { waitUntil: 'networkidle' });
    const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    findings.push({ width, violations: report.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
    await context.close();
  }
  await mkdir('test-results', { recursive: true });
  await writeFile('test-results/accessibility.json', JSON.stringify(findings, null, 2));
  console.log(JSON.stringify(findings.map(f => ({ width: f.width, violations: f.violations.map(v => ({ id: v.id, count: v.nodes.length, examples: v.nodes.slice(0, 5) })) })), null, 2));
  assert.ok(findings.every(f => f.violations.length === 0), 'Accessibility checks');
} finally { await browser.close(); }
