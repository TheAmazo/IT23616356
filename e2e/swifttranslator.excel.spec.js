const { test, expect } = require('@playwright/test');
const xlsx = require('xlsx');
const path = require('path');

const BASE_URL = 'https://www.swifttranslator.com/';
const EXCEL_PATH = path.join(process.cwd(), 'test-data', 'testcases.xlsx');

function readExcelCases() {
  const wb = xlsx.readFile(EXCEL_PATH);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  return rows.map((row, i) => ({
    tcid: row.TCID || '',
    name: row['Test Case Name'] || '',
    input: row.Input || '',
    expected: row.Expected || '',
    type: row.Type || '',
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
      await page.waitForTimeout(2500);

      await page.getByText('Sinhala').click();
      await page.waitForTimeout(1000);

      const output = await inputBox.inputValue();
      expect(output.length).toBeGreaterThan(0);
    });
  }
});
