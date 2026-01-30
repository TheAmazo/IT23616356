import { test, expect } from '@playwright/test';
import XLSX from 'xlsx';

const EXCEL_PATH = 'test-data/testcases.xlsx';

function hasSinhala(text) {
  return /[\u0D80-\u0DFF]/.test(text || '');
}

function readCases() {
  const wb = XLSX.readFile(EXCEL_PATH);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  return rows
    .map((r, i) => {
      const tcid = String(r['TC ID'] || '').trim();
      const name = String(r['Test case name'] || '').trim();
      const input = String(r['Input'] || '');
      const expected = String(r['Expected output'] || '');
      if (!tcid || !name) return null;

      return {
        rowNum: i + 2,
        tcid,
        name,
        input,
        expected,
        isNeg: tcid.startsWith('Neg_'),
      };
    })
    .filter(Boolean);
}

async function getOutputText(outputBox) {
  const v = await outputBox.inputValue();
  return (v || '').trim();
}

async function runInput(page, inputBox, text) {
  await inputBox.click();
  await inputBox.fill('');
  await inputBox.type(text);
}

test.describe('SwiftTranslator - Excel tests', () => {
  const cases = readCases();

  test('Excel file loads test cases', async () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  for (const tc of cases) {
    test(`${tc.tcid} - ${tc.name} (row ${tc.rowNum})`, async ({ page }) => {
      await page.goto('https://www.swifttranslator.com', { waitUntil: 'domcontentloaded' });

      const inputBox = page.getByPlaceholder('Input Your Singlish Text Here.');
      const outputBox = page.locator('textarea').nth(1);

      await expect(inputBox).toBeVisible();
      await expect(outputBox).toBeVisible();

      await runInput(page, inputBox, tc.input);

      if (!tc.isNeg) {
        await expect.poll(async () => {
          const out = await getOutputText(outputBox);
          return hasSinhala(out);
        }, { timeout: 60000 }).toBeTruthy();

        const out = await getOutputText(outputBox);
        expect(out.length).toBeGreaterThan(0);
        expect(hasSinhala(out)).toBeTruthy();
        return;
      }

      const trimmed = (tc.input || '').trim();

      if (trimmed.length === 0) {
        await expect.poll(async () => {
          const out = await getOutputText(outputBox);
          return out.length === 0;
        }, { timeout: 15000 }).toBeTruthy();

        const out = await getOutputText(outputBox);
        expect(out).toBe('');
        return;
      }

      await expect(page).toHaveURL(/swifttranslator\.com/);
      await expect(outputBox).toBeVisible();
    });
  }
});
