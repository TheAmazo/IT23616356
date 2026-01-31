# IT23616356 – Excel-Driven Playwright Test Suite

## Project Overview

This is an automated testing project for the **SwiftTranslator** application (https://www.swifttranslator.com/). It uses Playwright to read test cases from an Excel file and automatically execute them against the live translator.

### Key Features

- **Excel-driven test cases**: Read test inputs and expected outputs from `test-data/testcases.xlsx`
- **Flexible column mapping**: Works with various Excel column names (tcid, testcaseid, name, description, input, expected output, etc.)
- **Screenshot capture**: All test results are captured with descriptive screenshots saved to `./screenshots/`
- **HTML reporting**: Comprehensive test report with videos and traces
- **Positive & Negative tests**: Supports both functional tests and edge cases
- **Automatic filtering**: Excludes empty rows and UI-only tests

### Test Coverage

- **25 Positive Function Tests** (Pos_Fun_XXXX): Verify correct Sinhala translations
- **15 Negative Function Tests** (Neg_Fun_XXXX): Test edge cases and invalid inputs
- **Automatic categorization**: Tests are auto-categorized as positive or negative based on Excel data
- **Unique naming**: All test cases have unique identifiers with row numbers for traceability

---

## Prerequisites

Before running the tests, ensure you have:
- **Node.js 16+** installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Internet connection** (tests run against live website)
- **macOS/Linux/Windows** (cross-platform compatible)

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/TheAmazo/IT23616356.git
cd IT23616356
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Playwright Browsers
```bash
npx playwright install --with-deps
```

This downloads Chromium, Firefox, and WebKit browsers needed by Playwright.

---

## Running Tests

### Run All Tests (Headless Mode)
```bash
npm test
```
- Tests run in the background without visible browser window
- Fastest execution
- Results: ~7 minutes for all 41 tests

### Run Tests with Visible Browser (Headed Mode)
```bash
npm run test:headed
```
- Browser window visible during test execution
- Useful for debugging and observation
- One test runs at a time (workers=1)
- Results: ~7 minutes for all 41 tests

### Run Specific Test
```bash
npx playwright test --grep "Pos_Fun_0001"
```
- Runs only tests matching the pattern
- Useful for debugging individual cases

---

## Viewing Test Results

### View HTML Report
```bash
npm run report
```
Opens the Playwright HTML report showing:
- Test status (passed/failed)
- Execution time
- Attached screenshots
- Test videos
- Trace files for detailed debugging

### Screenshots
Screenshots are automatically saved to `./screenshots/` with naming format:
```
{STATUS}_{TEST_ID}_row{EXCEL_ROW}.png
```

Status codes:
- **PASS_*** : Positive test with non-empty output
- **NEG_*** : Negative test result
- **EMPTY_*** : Test with empty output
- **NO_OUTPUT_*** : Output could not be detected

Example: `PASS_Pos_Fun_0001_row2.png`

---

## Test Data Format

Test cases are stored in `test-data/testcases.xlsx` with the following columns:

| Column | Alternative Names | Description |
|--------|-------------------|-------------|
| TCID | testcaseid, id, caseid | Unique test case identifier |
| Test Case Name | name, title, description | Human-readable test description |
| Input | inputtext, singlish, sentence, text | Singlish input to translate |
| Expected | expectedoutput, output, sinhala | Expected Sinhala output |
| Type | category, status, posneg, kind | Test type (Pos/Neg) |

### Flexible Column Mapping
The test suite automatically matches column headers using flexible mapping:
- **Case-insensitive**: "TCID", "tcid", "Tcid" all work
- **Space/underscore tolerant**: "test case id" = "test_case_id" = "testcaseid"
- **Fallback names**: If primary column not found, searches alternatives

### Adding New Test Cases
1. Open `test-data/testcases.xlsx` in Excel
2. Add new rows with test data
3. Use format: `Pos_Fun_XXXX` or `Neg_Fun_XXXX` for TCID
4. Save file (keep Excel format)
5. Re-run tests—new cases are automatically detected

---

## Project Structure

```
IT23616356/
├── e2e/
│   └── swifttranslator.excel.spec.js  # Main test file
├── test-data/
│   └── testcases.xlsx                  # Excel test cases
├── screenshots/                        # Test result screenshots
├── test-results/                       # Playwright reports
├── playwright.config.js                # Playwright configuration
├── package.json                        # Dependencies & scripts
├── README.md                           # This file
└── .git/                              # Git repository
```

---

## Troubleshooting

### Tests Timeout
**Issue**: Tests hang or take very long
- **Solution**: Check internet connection, website status
- The live website may be slow; default timeout is 15 seconds

### "Excel file not found"
**Issue**: `Error: Excel file not found at: {path}`
- **Solution**: Ensure `test-data/testcases.xlsx` exists
- File must be in Excel 97-2003 (.xls) or modern format (.xlsx)

### "No output found"
**Issue**: Screenshots show "NO_OUTPUT" for translations
- **Solution**: Website may be unresponsive; check https://www.swifttranslator.com/
- Try running tests again after website is responsive

### Browser Crashes
**Issue**: "Browser closed with exit code 1"
- **Solution**: Run `npx playwright install --with-deps` again
- Ensure sufficient disk space and system resources

### Out of Memory
**Issue**: Tests fail with memory errors
- **Solution**: Run with single worker: `npx playwright test --workers=1`

---

## Continuous Integration

This project can be integrated with CI/CD pipelines (GitHub Actions, GitLab CI, etc.):

```yaml
- name: Install dependencies
  run: npm install

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run tests
  run: npm test

- name: Upload results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

---

## Additional Commands

### Update Playwright
```bash
npm update @playwright/test
npx playwright install --with-deps
```

### Debug Mode
```bash
npx playwright test --debug
```
Opens Playwright Inspector for step-through debugging

### Generate Test Report Trace
Traces are automatically generated and available in the HTML report.

---

## Support & Issues

For issues or questions:
1. Check the [GitHub Repository](https://github.com/TheAmazo/IT23616356)
2. Review Playwright docs: https://playwright.dev/
3. Check website status: https://www.swifttranslator.com/

---

## License

ISC License - See package.json for details

---

## Project Info

- **Repository**: https://github.com/TheAmazo/IT23616356
- **Target Website**: https://www.swifttranslator.com/
- **Test Framework**: Playwright (@playwright/test v1.58.0)
- **Test Data Format**: Excel XLSX
- **Last Updated**: January 2026
