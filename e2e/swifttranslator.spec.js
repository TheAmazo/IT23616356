const { test, expect } = require('@playwright/test');

const URL = 'https://swifttranslator.com/';
const inputBox = (page) => page.getByRole('textbox', { name: 'Input Your Singlish Text Here.' });
const hasSinhala = (s) => /[඀-෿]/.test(s);

async function translate(page, singlish) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  const input = inputBox(page);
  await expect(input).toBeVisible({ timeout: 15000 });

  await input.click();
  await input.fill(singlish);

  await expect.poll(async () => {
    const t = await page.locator('body').innerText();
    return hasSinhala(t);
  }, { timeout: 20000 }).toBeTruthy();

  // Extract likely output line (longest Sinhala-containing line)
  const bodyText = await page.locator('body').innerText();
  const lines = bodyText.split('\n').map(l => l.trim()).filter(Boolean);
  const sinhalaLines = lines.filter(l => hasSinhala(l));
  sinhalaLines.sort((a, b) => b.length - a.length);
  return sinhalaLines[0] || '';
}

// ---------------- UI TEST (1) ----------------
test('Pos_UI_0001 - Output updates automatically in real-time', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  const input = inputBox(page);
  await input.click();
  await input.type('mama oyata aDhara', { delay: 50 });

  await expect.poll(async () => {
    const t = await page.locator('body').innerText();
    return hasSinhala(t);
  }, { timeout: 30000 }).toBeTruthy();
});

// ---------------- POSITIVE FUNCTIONAL (2 sample) ----------------
test('Pos_Fun_0001 - Simple sentence', async ({ page }) => {
  const out = await translate(page, 'mama gedara yanawaa');
  expect(out).not.toBe('');
  expect(hasSinhala(out)).toBeTruthy();
});

test('Pos_Fun_0002 - Question sentence', async ({ page }) => {
  const out = await translate(page, 'oya kohomada inne?');
  expect(out).not.toBe('');
  expect(hasSinhala(out)).toBeTruthy();
});

// ---------------- NEGATIVE FUNCTIONAL (2 sample) ----------------
test('Neg_Fun_0001 - Empty input should not produce Sinhala', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  const input = inputBox(page);
  await input.fill('');

  const t = await page.locator('body').innerText();
  expect(hasSinhala(t)).toBeFalsy();
});

test('Neg_Fun_0002 - Symbols input should not crash', async ({ page }) => {
  const out = await translate(page, '@@@###$$$');
  expect(out.length).toBeGreaterThanOrEqual(0);
});
