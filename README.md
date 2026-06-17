# ProteinHunt Playwright Automation Framework

## Overview
This framework uses Playwright Test Runner with JavaScript and Page Object Model (POM) to automate the ProteinHunt test site.

## Folder Structure
- `pages/` - page object classes
- `tests/` - Playwright test files
- `utils/` - reusable helper methods
- `fixtures/` - custom Playwright fixtures
- `test-data/` - test data and credentials
- `screenshots/` - captured failure screenshots
- `reports/` - generated HTML and JUnit reports

## Setup
1. Install dependencies:
   ```bash
   npm install
   npx playwright install
   ```

2. Run the default test suite:
   ```bash
   npm test
   ```

3. Run tagged suites:
   ```bash
   npm run test:smoke
   npm run test:regression
   npm run test:sanity
   ```

4. Run cross-browser tests:
   ```bash
   npm run test:browser
   ```

5. Open the generated HTML report:
   ```bash
   npm run test:report
   ```

## Test Environment
- Base URL: `https://testsub.proteinhunt.in`
- Admin credentials: `hemanthnalla1@gmail.com` / `Rgukt@123`
- Subscriber credentials: `bhavyasri` / `ProteinHunt@123`
- Chef credentials: `chef` / `ProteinHunt@123`

## Notes
- The framework uses async/await and Playwright's built-in assertions.
- Screenshots and traces are retained only on failure.
- Use tags `@smoke`, `@regression`, and `@sanity` for selective execution.
