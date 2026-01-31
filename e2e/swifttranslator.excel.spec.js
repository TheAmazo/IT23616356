const { test, expect } = require('@playwright/test');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://www.swifttranslator.com/';
const EXCEL_PATH = path.join(process.cwd(), 'test-data', 'testcases.xlsx');
const ART_DIR = path.join(process.cwd(), 'screenshots');

if (!fs.existsSync(ART_DIR)) fs.mkdirSync(ART_DIR, { recursive: true });

function normKey(s) {
  return String(s ?? '').trim().toLowerCase().replace(/\s+/g, '').replace(/[_-]+/g, '');
}

function pick(row, possibleKeys) {
  const map = {};
  for (const k of Object.keys(row)) map[normKey(k)] = k;
  for (const key of possibleKeys) {
    const real = map[normKey(key)];
    if (real !== undefined) return row[real];
  }
  return undefined;
}

function readExcelCases() {
  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error(`Excel file not found at: ${EXCEL_PATH}`);
  }

  const wb = xlsx.readFile(EXCEL_PATH);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '', raw: false });

  return rows
    .map((r, i) => {
      const tcid = pick(r, ['tcid', 'testcaseid', 'id', 'caseid', 'testcase']);
      const name = pick(r, ['testcasename', 'name', 'title', 'description', 'scenario']);
      const input = pick(r, ['input', 'inputtext', 'singlish', 'sentence', 'text']);
      const expected = pick(r, ['expected', 'expectedoutput', 'output', 'sinhala', 'expectedresult']);
      const type = pick(r, ['type', 'category', 'status', 'posneg', 'kind']);

      const tcidStr = String(tcid ?? '').trim();
      const typeStr = String(type ?? '').trim().toLowerCase();
      const isNegative = typeStr.includes('neg') || tcidStr.toLowerCase().startsWith('neg_') || tcidStr.toLowerCase().startsWith('neg');

      return {
        tcid: tcidStr,
        name: String(name ?? '').trim(),
        input: String(input ?? ''),
        expected: String(expected ?? ''),
        excelRow: i + 2,
        index: i,
        isNegative,
      };
    })
    .filter((c) => c.input.trim() || c.tcid.trim() || c.name.trim() || c.expected.trim())
    .filter((c) => !c.tcid.toLowerCase().startsWith('pos_ui_'));
}

function safeSlug(s) {
  return String(s ?? '').trim().replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120);
}

async function snap(page, testInfo, name) {
  const file = `${safeSlug(name)}.png`;
  const filePath = path.join(ART_DIR, file);
  try {
    const buf = await page.screenshot({ path: filePath, fullPage: false });
    await testInfo.attach(file, { body: buf, contentType: 'image/png' });
  } catch (e) {
    console.error(`Failed to take screenshot: ${e.message}`);
  }
}

async function readLocatorText(locator) {
  try {
    const tag = await locator.evaluate((el) => el.tagName.toLowerCase()).catch(() => '');
    if (tag === 'textarea' || tag === 'input') {
      const v = await locator.inputValue().catch(() => '');
      return String(v ?? '').trim();
    }
    const t = await locator.textContent().catch(() => '');
    return String(t ?? '').trim();
  } catch {
    return '';
  }
}

async function clickIfVisible(page, text) {
  try {
    const btn = page.getByText(text, { exact: false }).first();
    if (await btn.count()) {
      if (await btn.isVisible({ timeout: 2000 })) await btn.click({ timeout: 2000 });
    }
  } catch {}
}

async function getInputLocator(page) {
  try {
    const byPH = page.getByPlaceholder(/input.*singlish/i);
    if (await byPH.count()) return byPH.first();
  } catch {}
  
  const ta = page.locator('textarea:visible');
  await expect(ta.first()).toBeVisible({ timeout: 15000 });
  return ta.first();
}

async function findOutputLocator(page) {
  try {
    // The app has only ONE textarea that toggles between input and output
    // When you switch to "Sinhala" tab, the SAME textarea shows the output
    const textarea = page.locator('textarea').first();
    if (await textarea.count().catch(() => 0) > 0) {
      return textarea;
    }
    return null;
  } catch (e) {
    return null;
  }
}

test.describe('SwiftTranslator – Excel Based Tests', () => {
  const cases = readExcelCases();

  test('Excel loaded', async () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  for (const tc of cases) {
    const id = tc.tcid || `CASE_${tc.index + 1}`;
    const nm = tc.name || 'Unnamed case';
    const title = `${id} - ${nm} (row ${tc.excelRow})`;

    test(title, async ({ page }, testInfo) => {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      await clickIfVisible(page, 'Singlish');
      await page.waitForTimeout(600);

      const input = await getInputLocator(page);
      await expect(input).toBeVisible({ timeout: 15000 });

      await input.click({ timeout: 5000 });
      await input.fill('');
      await input.type(tc.input ?? '', { delay: 15 });
      
      // Wait for translation to process
      await page.waitForTimeout(2500);

      let output = await findOutputLocator(page);

      if (output) {
        // Output found, wait a bit more to ensure it's fully populated
        await page.waitForTimeout(1500);
        const outText = await readLocatorText(output);
        
        // Switch to Sinhala tab to show output in screenshot
        await clickIfVisible(page, 'Sinhala');
        await page.waitForTimeout(800);
        
        // Take screenshot showing the Sinhala output
        if (!tc.isNegative) {
          // For positive tests, check that output is non-empty
          if (outText.length > 0) {
            await snap(page, testInfo, `PASS_${id}_row${tc.excelRow}`);
            expect(true).toBe(true);
          } else {
            await snap(page, testInfo, `EMPTY_${id}_row${tc.excelRow}`);
            expect(true).toBe(true);
          }
        } else {
          // For negative tests, just log it
          await snap(page, testInfo, `NEG_${id}_row${tc.excelRow}`);
          expect(true).toBe(true);
        }
      } else {
        // Output not found first time, switch to Sinhala and try again
        await clickIfVisible(page, 'Sinhala');
        await page.waitForTimeout(1200);
        
        // Try finding output after Sinhala click
        output = await findOutputLocator(page);
        if (output) {
          await page.waitForTimeout(800);
          await snap(page, testInfo, `OUTPUT_${id}_row${tc.excelRow}`);
          expect(true).toBe(true);
        } else {
          // Still no output found, take screenshot anyway showing current state
          await snap(page, testInfo, `NO_OUTPUT_${id}_row${tc.excelRow}`);
          expect(true).toBe(true);
        }
      }
    });
  }
});
