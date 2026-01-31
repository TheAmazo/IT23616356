# IT23616356 – Excel-driven Playwright tests

## What this does
- Reads test cases from `test-data/testcases.xlsx`
- Runs each row as a Playwright test against `https://www.swifttranslator.com/`
- Saves artifacts under `test-results/excel-artifacts`

## Setup
```bash
npm i
npx playwright install --with-deps
```

## Run
```bash
npm run test:headed
```

## Report
```bash
npm run report
```
