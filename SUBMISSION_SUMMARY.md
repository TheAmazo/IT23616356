# IT23616356 - Submission Package

## Project Summary

This is an automated testing project for the **SwiftTranslator** application (https://www.swifttranslator.com/), built using Playwright and Excel-driven test cases.

---

## 1. GitHub Repository

### Repository URL
**https://github.com/TheAmazo/IT23616356**

### Access Status
✅ **PUBLIC** - Repository is publicly accessible and can be cloned without authentication

### How to Access
```bash
git clone https://github.com/TheAmazo/IT23616356.git
cd IT23616356
```

---

## 2. Quick Start Instructions

### Prerequisites
- Node.js 16+ (https://nodejs.org/)
- npm (comes with Node.js)
- Internet connection

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/TheAmazo/IT23616356.git
cd IT23616356

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps

# 4. Run all tests
npm test

# 5. View test report
npm run report
```

**Expected Result**: 41/41 tests pass (~7 minutes)

### Alternative Commands

```bash
# Run with visible browser (headed mode)
npm run test:headed

# Run specific test
npx playwright test --grep "Pos_Fun_0001"

# Debug mode (step through)
npx playwright test --debug
```

---

## 3. Test Coverage

### Test Statistics
- **Total Tests**: 41
  - 1 Excel load verification test
  - 25 Positive function tests (Pos_Fun_XXXX)
  - 15 Negative function tests (Neg_Fun_XXXX)

### Test Types

**Positive Tests (25)** - Verify correct Sinhala translations:
- Greeting + wellbeing question
- Simple statement (today)
- Question about time
- Request/Polite expressions
- Negation
- Future plan
- Past tense
- Numbers in sentence
- Date format
- Currency
- Emphasis/exclamation
- Comma-separated list
- Quotation marks
- Mixed case
- Extra spaces
- Spelling variation
- Long paragraph
- Technical words
- Place names
- Phone numbers
- Emoji handling
- Slash/hyphen
- Short single word
- Very long input
- Conditional sentence

**Negative Tests (15)** - Edge cases and invalid inputs:
- Empty input
- Spaces only
- Only symbols
- Only numbers
- English sentence (not Singlish)
- Sinhala input already
- Very long gibberish
- SQL injection-like
- XSS-like
- URL input
- Mixed languages
- Trailing huge spaces
- Only emoji
- Unsupported characters
- Navigation safety

---

## 4. Project Files

### Repository Structure
```
IT23616356/
├── e2e/
│   └── swifttranslator.excel.spec.js    # Main test implementation
├── test-data/
│   └── testcases.xlsx                   # Excel test cases with all 40 test inputs
├── screenshots/                         # Captured test result screenshots
├── test-results/                        # Playwright HTML reports
├── playwright.config.js                 # Playwright configuration
├── package.json                         # Dependencies and scripts
├── package-lock.json                    # Locked dependency versions
├── README.md                            # Comprehensive documentation
├── REPOSITORY_LINK.txt                  # Repository URL
├── .git/                                # Git repository
└── .gitignore                          # Git ignore rules
```

### Key Files

1. **README.md** - Complete setup and usage guide
   - Prerequisites
   - Installation steps
   - Running tests (headless/headed)
   - Viewing results
   - Troubleshooting
   - Project structure

2. **e2e/swifttranslator.excel.spec.js** - Test implementation
   - Excel file reading with flexible column mapping
   - Test case filtering
   - Playwright automation logic
   - Screenshot capture
   - Helper functions

3. **test-data/testcases.xlsx** - Excel test cases
   - 40 test cases (rows 2-41)
   - Columns: TCID, Test Case Name, Input, Expected, Type
   - Positive and negative test classification

4. **playwright.config.js** - Configuration
   - Chromium browser setup
   - Timeout settings (15 seconds)
   - Screenshot settings
   - Report generation

5. **package.json** - Project metadata
   - @playwright/test v1.58.0
   - xlsx v0.18.5 (Excel support)
   - Scripts: test, test:headed, report

---

## 5. Excel Test Data

### File Location
`test-data/testcases.xlsx`

### Column Structure
| Column | Purpose | Example |
|--------|---------|---------|
| TCID | Test case ID | Pos_Fun_0001, Neg_Fun_0001 |
| Test Case Name | Description | "Greeting + wellbeing question" |
| Input | Singlish input | "ayubowan, kohomada?" |
| Expected | Expected Sinhala output | "ආයුබෝවන්, කොහොමද?" |
| Type | Positive/Negative | "Pos", "Neg" |

### Flexible Column Mapping
The test suite automatically handles:
- **Case-insensitive** column names
- **Alternative** column names (testcaseid, id, name, description, etc.)
- **Spaces and underscores** (test_case_id = testcaseid = test case id)

### Test Data Count
- **Total rows**: 41 (1 header + 40 test cases)
- **Positive tests**: 25
- **Negative tests**: 15
- **Unique identifiers**: All unique TCID values

---

## 6. Test Execution

### Running All Tests
```bash
npm test
```
- **Duration**: ~7 minutes
- **Workers**: 1 (sequential execution)
- **Output**: Console logs + HTML report

### Test Results Example
```
Running 41 tests using 1 worker

  ✓   1 Excel loaded (2ms)
  ✓   2 Pos_Fun_0001 - Greeting + wellbeing question (row 2) (11.1s)
  ✓   3 Pos_Fun_0002 - Simple statement (today) (row 3) (9.5s)
  ...
  ✓  41 Neg_Fun_0015 - Navigation safety (row 41) (9.5s)

  41 passed (6.9m)
```

### Screenshots Generated
All 40 test case screenshots saved to `./screenshots/` with naming:
```
{STATUS}_{TEST_ID}_row{EXCEL_ROW}.png
```

Status codes:
- `PASS_*` - Positive test with non-empty output
- `NEG_*` - Negative test result
- `EMPTY_*` - Test with empty output
- `NO_OUTPUT_*` - Output detection failed (rare)

Example screenshots:
- `PASS_Pos_Fun_0001_row2.png`
- `NEG_Neg_Fun_0001_row27.png`

---

## 7. Viewing Results

### HTML Report
```bash
npm run report
```
Opens interactive report showing:
- ✅ Test status (passed/failed)
- ⏱️ Execution time
- 📸 Attached screenshots
- 🎬 Test videos
- 🔍 Trace files for debugging

### Screenshots Directory
```bash
ls -la screenshots/
# PASS_Pos_Fun_*.png files (25 total)
# NEG_Neg_Fun_*.png files (15 total)
```

---

## 8. Verification Checklist

✅ **Repository**
- [x] Public GitHub repository
- [x] Git initialized with proper commits
- [x] All files included in repository
- [x] README.md with setup instructions
- [x] REPOSITORY_LINK.txt provided

✅ **Excel File**
- [x] test-data/testcases.xlsx exists
- [x] 40 test cases included
- [x] Proper column structure
- [x] Mixed positive and negative cases
- [x] Valid Singlish and Sinhala text

✅ **Test Implementation**
- [x] e2e/swifttranslator.excel.spec.js complete
- [x] Excel reading with flexible mapping
- [x] Screenshot capture working
- [x] All 41 tests passing
- [x] Proper test naming and organization

✅ **Documentation**
- [x] README.md (comprehensive guide)
- [x] Installation instructions
- [x] Running tests instructions
- [x] Troubleshooting guide
- [x] Project structure documented

✅ **Test Execution**
- [x] Tests run without errors
- [x] 41/41 tests passing
- [x] Screenshots properly labeled
- [x] HTML report generated
- [x] Cross-platform compatible

---

## 9. Support Information

### Requirements
- Node.js 16+ (https://nodejs.org/)
- npm (automatic with Node.js)
- Internet connection
- macOS/Linux/Windows compatible

### Troubleshooting
See **README.md** section "Troubleshooting" for:
- Test timeout issues
- Excel file not found
- No output found
- Browser crashes
- Memory issues

### Additional Resources
- Playwright documentation: https://playwright.dev/
- SwiftTranslator website: https://www.swifttranslator.com/
- GitHub repository: https://github.com/TheAmazo/IT23616356

---

## 10. Submission Contents

This submission includes:

1. **Complete GitHub Repository**
   - All source code
   - All configuration files
   - Git history preserved
   - Publicly accessible

2. **Comprehensive Documentation**
   - README.md (detailed guide)
   - REPOSITORY_LINK.txt (access information)
   - This submission summary

3. **Complete Excel Test Data**
   - test-data/testcases.xlsx
   - 40 test cases with all inputs/outputs
   - Ready to use as-is

4. **Working Test Implementation**
   - e2e/swifttranslator.excel.spec.js
   - All helper functions
   - Screenshot automation
   - HTML reporting

---

## Quick Access

- **Repository**: https://github.com/TheAmazo/IT23616356
- **Installation**: See README.md in repository
- **Test Cases**: test-data/testcases.xlsx
- **Test File**: e2e/swifttranslator.excel.spec.js
- **Results**: Run `npm run report` after `npm test`

---

**Project Status**: ✅ **COMPLETE AND READY FOR EVALUATION**

All requirements met. Repository is public, tests are passing, documentation is complete, and Excel test data is included.
