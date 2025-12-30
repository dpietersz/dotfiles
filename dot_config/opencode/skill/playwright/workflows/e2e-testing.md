---
description: End-to-end testing best practices with Playwright. Project structure, Page Object Model, custom fixtures, parallel execution, CI/CD integration, debugging strategies, and test data management.
globs: ""
alwaysApply: false
---

# E2E Testing Best Practices Workflow

Implement production-ready end-to-end testing with Playwright. This workflow covers project structure, Page Object Model (POM), custom fixtures, parallel execution, CI/CD integration, and debugging strategies.

## When to Use This Workflow

**USE this workflow when:**
- User is setting up a new Playwright test suite
- User wants to improve test organization and maintainability
- User needs to implement Page Object Model pattern
- User wants to configure CI/CD for Playwright tests
- User says "e2e testing", "test structure", "page objects", "fixtures"
- User needs to debug flaky tests or improve test reliability

**DO NOT use this workflow when:**
- User needs authentication setup → Use `auth.md` workflow
- User needs visual regression testing → Use `visual-regression.md` workflow
- User wants to generate test code → Use `codegen.md` workflow

---

## Project Structure for SaaS Apps

### Recommended Directory Layout

```
project/
  playwright/
    .auth/                      # Auth state files (gitignored)
      user.json
      admin.json
  tests/
    fixtures/                   # Custom fixtures
      index.ts                  # Fixture exports
      pages.ts                  # Page object fixtures
      data.ts                   # Test data fixtures
    pages/                      # Page Object Models
      base.page.ts              # Base page class
      login.page.ts
      dashboard.page.ts
      settings.page.ts
    specs/                      # Test specifications
      auth/
        login.spec.ts
        logout.spec.ts
      dashboard/
        dashboard.spec.ts
        widgets.spec.ts
      settings/
        profile.spec.ts
        billing.spec.ts
    utils/                      # Utility functions
      test-data.ts              # Test data generators
      api-helpers.ts            # API helper functions
    auth.setup.ts               # Authentication setup
  playwright.config.ts
  .gitignore
```

---

## Page Object Model (POM)

### Base Page Class

```typescript
// tests/pages/base.page.ts
import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  // Common navigation
  async goto(path: string) {
    await this.page.goto(path);
  }
  
  // Common waits
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
  
  // Common assertions
  async expectUrl(pattern: string | RegExp) {
    await expect(this.page).toHaveURL(pattern);
  }
  
  // Common actions
  async clickAndWait(locator: Locator) {
    await locator.click();
    await this.waitForPageLoad();
  }
}
```

### Page Object Example

```typescript
// tests/pages/dashboard.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  // Locators as readonly properties
  readonly heading: Locator;
  readonly createButton: Locator;
  readonly projectList: Locator;
  readonly searchInput: Locator;
  readonly userMenu: Locator;
  readonly notificationBell: Locator;
  
  constructor(page: Page) {
    super(page);
    
    // Define locators in constructor
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.createButton = page.getByRole('button', { name: 'Create Project' });
    this.projectList = page.getByTestId('project-list');
    this.searchInput = page.getByPlaceholder('Search projects...');
    this.userMenu = page.getByTestId('user-menu');
    this.notificationBell = page.getByRole('button', { name: 'Notifications' });
  }
  
  // Navigation
  async goto() {
    await super.goto('/dashboard');
    await this.waitForDashboard();
  }
  
  // Wait methods
  async waitForDashboard() {
    await expect(this.heading).toBeVisible();
    await this.waitForPageLoad();
  }
  
  // Actions
  async createProject(name: string) {
    await this.createButton.click();
    await this.page.getByLabel('Project Name').fill(name);
    await this.page.getByRole('button', { name: 'Create' }).click();
    await this.waitForPageLoad();
  }
  
  async searchProjects(query: string) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForPageLoad();
  }
  
  async openUserMenu() {
    await this.userMenu.click();
    await expect(this.page.getByRole('menu')).toBeVisible();
  }
  
  // Getters
  async getProjectCount(): Promise<number> {
    return await this.projectList.locator('[data-testid="project-card"]').count();
  }
  
  async getProjectNames(): Promise<string[]> {
    const cards = this.projectList.locator('[data-testid="project-card"]');
    const names: string[] = [];
    const count = await cards.count();
    
    for (let i = 0; i < count; i++) {
      const name = await cards.nth(i).locator('h3').textContent();
      if (name) names.push(name);
    }
    
    return names;
  }
  
  // Assertions
  async expectProjectVisible(name: string) {
    await expect(
      this.projectList.locator(`[data-testid="project-card"]:has-text("${name}")`)
    ).toBeVisible();
  }
  
  async expectEmptyState() {
    await expect(this.page.getByText('No projects yet')).toBeVisible();
  }
}
```

### Login Page Object

```typescript
// tests/pages/login.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;
  
  constructor(page: Page) {
    super(page);
    
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
  }
  
  async goto() {
    await super.goto('/login');
    await expect(this.emailInput).toBeVisible();
  }
  
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
  
  async loginAndWait(email: string, password: string) {
    await this.login(email, password);
    await this.page.waitForURL('/dashboard');
  }
  
  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
  
  async expectValidationError(field: 'email' | 'password') {
    const input = field === 'email' ? this.emailInput : this.passwordInput;
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  }
}
```

---

## Custom Fixtures

### Page Object Fixtures

```typescript
// tests/fixtures/pages.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { SettingsPage } from '../pages/settings.page';

// Extend base test with page objects
export const test = base.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  settingsPage: SettingsPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
});

export { expect } from '@playwright/test';
```

### Test Data Fixtures

```typescript
// tests/fixtures/data.ts
import { test as base } from '@playwright/test';

interface TestUser {
  email: string;
  password: string;
  name: string;
}

interface TestProject {
  name: string;
  description: string;
}

export const test = base.extend<{
  testUser: TestUser;
  testProject: TestProject;
  uniqueId: string;
}>({
  testUser: async ({}, use) => {
    await use({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });
  },
  
  testProject: async ({ uniqueId }, use) => {
    await use({
      name: `Test Project ${uniqueId}`,
      description: 'Created by automated test',
    });
  },
  
  uniqueId: async ({}, use) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await use(id);
  },
});
```

### Combined Fixtures

```typescript
// tests/fixtures/index.ts
import { mergeTests } from '@playwright/test';
import { test as pageFixtures } from './pages';
import { test as dataFixtures } from './data';

// Merge all fixtures
export const test = mergeTests(pageFixtures, dataFixtures);
export { expect } from '@playwright/test';
```

### Using Fixtures in Tests

```typescript
// tests/specs/dashboard/dashboard.spec.ts
import { test, expect } from '../../fixtures';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });
  
  test('displays user projects', async ({ dashboardPage }) => {
    await dashboardPage.waitForDashboard();
    const count = await dashboardPage.getProjectCount();
    expect(count).toBeGreaterThan(0);
  });
  
  test('can create new project', async ({ dashboardPage, testProject }) => {
    await dashboardPage.createProject(testProject.name);
    await dashboardPage.expectProjectVisible(testProject.name);
  });
  
  test('can search projects', async ({ dashboardPage }) => {
    await dashboardPage.searchProjects('important');
    // Verify search results
  });
});
```

---

## Parallel Execution

### Configure Parallelism

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Run tests in parallel
  fullyParallel: true,
  
  // Number of parallel workers
  workers: process.env.CI ? 4 : undefined,  // Auto-detect locally
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 0,
  
  // Reporter configuration
  reporter: process.env.CI 
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html']],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  
  projects: [
    // Setup project
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    
    // Browser projects
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

### Test Isolation

Each test runs in its own browser context:

```typescript
test('test 1', async ({ page }) => {
  // Fresh browser context
  await page.goto('/');
});

test('test 2', async ({ page }) => {
  // Different browser context, isolated from test 1
  await page.goto('/');
});
```

### Serial Execution When Needed

```typescript
// Force serial execution for dependent tests
test.describe.serial('checkout flow', () => {
  test('add to cart', async ({ page }) => {
    // ...
  });
  
  test('proceed to checkout', async ({ page }) => {
    // Depends on previous test
  });
  
  test('complete payment', async ({ page }) => {
    // Depends on previous test
  });
});
```

---

## Test Data Management

### API-Based Data Seeding

```typescript
// tests/utils/api-helpers.ts
import { APIRequestContext } from '@playwright/test';

export class ApiHelpers {
  constructor(private request: APIRequestContext) {}
  
  async createProject(name: string, token: string) {
    const response = await this.request.post('/api/projects', {
      headers: { Authorization: `Bearer ${token}` },
      data: { name, description: 'Test project' },
    });
    return response.json();
  }
  
  async deleteProject(id: string, token: string) {
    await this.request.delete(`/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  
  async seedTestData(token: string) {
    // Create test data via API
    const project = await this.createProject('Test Project', token);
    return { project };
  }
  
  async cleanupTestData(token: string) {
    // Clean up via API
    await this.request.post('/api/test/cleanup', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
```

### Fixture-Based Data Setup

```typescript
// tests/fixtures/data.ts
import { test as base } from '@playwright/test';
import { ApiHelpers } from '../utils/api-helpers';

export const test = base.extend<{
  apiHelpers: ApiHelpers;
  seededProject: { id: string; name: string };
}>({
  apiHelpers: async ({ request }, use) => {
    await use(new ApiHelpers(request));
  },
  
  seededProject: async ({ apiHelpers }, use) => {
    // Setup: Create project before test
    const project = await apiHelpers.createProject(
      `Test-${Date.now()}`,
      process.env.TEST_API_TOKEN!
    );
    
    // Provide to test
    await use(project);
    
    // Teardown: Delete project after test
    await apiHelpers.deleteProject(project.id, process.env.TEST_API_TOKEN!);
  },
});
```

### Database Seeding Script

```typescript
// tests/utils/seed-database.ts
import { execSync } from 'child_process';

export function seedDatabase() {
  execSync('npm run db:seed:test', { stdio: 'inherit' });
}

export function resetDatabase() {
  execSync('npm run db:reset:test', { stdio: 'inherit' });
}
```

---

## CI/CD Configuration

### GitHub Actions

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Setup database
        run: npm run db:migrate && npm run db:seed:test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
      
      - name: Start application
        run: npm run start:test &
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
          NODE_ENV: test
      
      - name: Wait for app
        run: npx wait-on http://localhost:3000 --timeout 60000
      
      - name: Run Playwright tests
        run: npx playwright test
        env:
          BASE_URL: http://localhost:3000
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
      
      - name: Upload traces
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-traces
          path: test-results/
          retention-days: 7
```

### Sharding for Large Test Suites

```yaml
# .github/workflows/e2e-tests.yml
jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    
    steps:
      # ... setup steps ...
      
      - name: Run Playwright tests (shard ${{ matrix.shard }}/4)
        run: npx playwright test --shard=${{ matrix.shard }}/4
      
      - name: Upload shard results
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.shard }}
          path: playwright-report/
  
  merge-reports:
    needs: e2e-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Download all shard reports
        uses: actions/download-artifact@v4
        with:
          pattern: playwright-report-*
          path: all-reports
      
      - name: Merge reports
        run: npx playwright merge-reports --reporter html ./all-reports
      
      - name: Upload merged report
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-merged
          path: playwright-report/
```

---

## Artifact Management

### Configure Artifacts in playwright.config.ts

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Capture trace on first retry
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on first retry
    video: 'on-first-retry',
  },
  
  // Output directory for artifacts
  outputDir: 'test-results/',
  
  // Reporter with HTML report
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
});
```

### Artifact Types

| Artifact | When Created | Use Case |
|----------|--------------|----------|
| **Trace** | On retry/failure | Debug test execution step-by-step |
| **Screenshot** | On failure | Quick visual of failure state |
| **Video** | On retry/failure | Watch test execution |
| **HTML Report** | Always | Browse all test results |

### Viewing Traces

```bash
# View trace file
npx playwright show-trace test-results/test-name/trace.zip

# View from HTML report
npx playwright show-report
```

---

## Debugging Strategies

### UI Mode (Interactive Debugging)

```bash
# Run tests in UI mode
npx playwright test --ui

# Features:
# - Watch mode
# - Time travel debugging
# - Pick locators
# - View traces
```

### Debug Mode

```bash
# Run with debugger
npx playwright test --debug

# Debug specific test
npx playwright test tests/login.spec.ts --debug
```

### page.pause() for Breakpoints

```typescript
test('debug this test', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Pause here - opens Playwright Inspector
  await page.pause();
  
  // Continue with test
  await page.click('button');
});
```

### Trace Viewer

```bash
# Generate trace for all tests
npx playwright test --trace on

# View trace
npx playwright show-trace test-results/test-name/trace.zip
```

### Console Logging

```typescript
test('with logging', async ({ page }) => {
  // Log page console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  // Log network requests
  page.on('request', req => console.log('REQUEST:', req.url()));
  
  await page.goto('/dashboard');
});
```

### Headed Mode

```bash
# Run with visible browser
npx playwright test --headed

# Slow down execution
npx playwright test --headed --slow-mo=1000
```

---

## Selector Best Practices

### Prefer data-testid

```typescript
// Best - explicit test attribute
page.getByTestId('submit-button')

// HTML
<button data-testid="submit-button">Submit</button>
```

### Use Role Selectors

```typescript
// Good - semantic and accessible
page.getByRole('button', { name: 'Submit' })
page.getByRole('heading', { name: 'Dashboard' })
page.getByRole('link', { name: 'Settings' })
```

### Use Label Selectors for Forms

```typescript
// Good - matches user experience
page.getByLabel('Email')
page.getByLabel('Password')
page.getByPlaceholder('Search...')
```

### Avoid Fragile Selectors

```typescript
// Bad - fragile CSS selectors
page.locator('.btn-primary')
page.locator('#submit')
page.locator('div > button:nth-child(2)')

// Good - stable selectors
page.getByRole('button', { name: 'Submit' })
page.getByTestId('submit-button')
```

### Selector Priority

1. `getByRole()` - Semantic, accessible
2. `getByLabel()` - Form inputs
3. `getByPlaceholder()` - Inputs without labels
4. `getByText()` - Unique text content
5. `getByTestId()` - Explicit test attributes
6. `locator()` - CSS/XPath (last resort)

---

## Best Practices Summary

### 1. Keep Tests Independent

```typescript
// Each test should work in isolation
test('test A', async ({ page }) => {
  // Don't depend on test B running first
});
```

### 2. Keep Tests Short

```typescript
// Good - focused test
test('user can create project', async ({ dashboardPage }) => {
  await dashboardPage.goto();
  await dashboardPage.createProject('New Project');
  await dashboardPage.expectProjectVisible('New Project');
});

// Bad - too many assertions
test('everything works', async ({ page }) => {
  // 50 lines of assertions...
});
```

### 3. Use Page Objects

```typescript
// Good - encapsulated logic
await dashboardPage.createProject('Test');

// Bad - raw selectors in tests
await page.click('[data-testid="create-btn"]');
await page.fill('[name="project-name"]', 'Test');
```

### 4. Use Fixtures for Setup

```typescript
// Good - fixture handles setup/teardown
test('with seeded data', async ({ seededProject }) => {
  // Project already exists
});

// Bad - setup in test
test('manual setup', async ({ page }) => {
  // 20 lines of setup...
});
```

### 5. Use data-testid for Stability

```html
<!-- Add to your application -->
<button data-testid="submit-order">Submit Order</button>
```

### 6. Handle Flaky Tests

```typescript
// Retry flaky tests
test.describe.configure({ retries: 2 });

// Or fix the flakiness
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible();
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Run all tests | `npx playwright test` |
| Run specific file | `npx playwright test tests/login.spec.ts` |
| Run by name | `npx playwright test -g "login"` |
| UI mode | `npx playwright test --ui` |
| Debug mode | `npx playwright test --debug` |
| Headed | `npx playwright test --headed` |
| Specific browser | `npx playwright test --project=chromium` |
| Show report | `npx playwright show-report` |
| View trace | `npx playwright show-trace trace.zip` |
| Update snapshots | `npx playwright test --update-snapshots` |
| Shard tests | `npx playwright test --shard=1/4` |
