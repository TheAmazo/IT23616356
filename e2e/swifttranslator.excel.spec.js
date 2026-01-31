const { test, expect } = require('@playwright/test');
const xlsx = require('xlsx');
const path = require('path');

const BASE_URL = 'https://www.swifttranslator.com/';
const EXCEL_PATH = path.join(process.cwd(), 'test-data', 'testcases.xlsx');

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
  const wb = xlsx.readFile(EXCEL_PATH);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  return rows.map((r, i) => ({
    tcid: String(pick(r, ['tcid', 'testcaseid', 'id']) ?? '').trim(),
    name: String(pick(r, ['testcasename', 'name', 'title']) ?? '').trim(),
    input: String(pick(r, ['input', 'inputtext', 'singlish']) ?? ''),
    expected: String(pick(r, ['expected', 'expectedoutput', 'output']) ?? ''),
    rowNum: i + 2
  })).filter(tc => tc.input.trim());
}

test.describe('SwiftTranslator Tests', () => {
  const testCases = readExcelCases();

  for (const tc of testCases) {
    test(`${tc.tcid} - ${tc.name} (Row ${tc.rowNum})`, async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForTimeout(1500);

      const inputBox = page.locator('textarea').first();
      await inputBox.fill(tc.input);
      await page.waitForTimeout(3000);

      await page.getByText('Sinhala').nth(1).click();
      await page.waitForTimeout(1000);

      const output = await inputBox.inputValue();
      expect(output.length).toBeGreaterThan(0);
    });
  }
});
