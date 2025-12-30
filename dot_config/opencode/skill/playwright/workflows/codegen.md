---
description: Generate Playwright test code by recording browser interactions. Uses playwright-codegen CLI to capture user actions and output TypeScript test files.
globs: ""
alwaysApply: false
---

# Codegen Workflow

Generate Playwright test code by recording browser interactions. The `playwright-codegen` CLI tool opens a browser where you can interact with a website, and it automatically generates TypeScript test code based on your actions.

## When to Use This Workflow

**USE this workflow when:**
- User wants to create automated tests for a website
- User needs to record interactions and generate test code
- User says "generate tests", "record interactions", "create test code"
- User wants to automate repetitive browser tasks
- User needs a starting point for Playwright tests

**DO NOT use this workflow when:**
- User just needs to interact once → Use `interact.md` workflow
- User needs screenshots → Use `screenshot.md` workflow
- User needs to scrape content → Use `scrape.md` workflow

---

## Important: CLI-Based Workflow

**This workflow uses the `playwright-codegen` CLI tool, NOT the MCP server.**

The codegen tool opens an interactive browser session where the user performs actions manually. The tool records these actions and generates test code.

---

## Basic Usage

### Start Recording

```bash
playwright-codegen https://example.com
```

This opens:
1. A browser window for interacting with the site
2. A code panel showing generated TypeScript code

### Save to File

```bash
playwright-codegen https://example.com -o tests/example.spec.ts
```

### With Custom Viewport

```bash
# Desktop viewport
playwright-codegen --viewport-size=1920,1080 https://example.com

# Mobile viewport
playwright-codegen --viewport-size=375,812 https://example.com

# Tablet viewport
playwright-codegen --viewport-size=768,1024 https://example.com
```

### With Device Emulation

```bash
# iPhone 12
playwright-codegen --device="iPhone 12" https://example.com

# Pixel 5
playwright-codegen --device="Pixel 5" https://example.com
```

---

## Recording Workflow

### Step 1: Start the Codegen Session

```bash
playwright-codegen https://example.com -o tests/my-test.spec.ts
```

### Step 2: Perform Actions in Browser

In the opened browser window:
- Click buttons and links
- Fill in form fields
- Select dropdown options
- Navigate between pages
- Perform any actions you want to test

### Step 3: Review Generated Code

Watch the code panel update in real-time as you interact. The generated code will look like:

```typescript
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://example.com/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();
});
```

### Step 4: Close Browser to Save

Close the browser window. The generated code is saved to the specified file.

### Step 5: Run the Generated Test

```bash
playwright-test tests/my-test.spec.ts
```

---

## CLI Options Reference

| Option | Description | Example |
|--------|-------------|---------|
| `-o, --output` | Save to file | `-o tests/login.spec.ts` |
| `--viewport-size` | Set viewport | `--viewport-size=1280,720` |
| `--device` | Emulate device | `--device="iPhone 12"` |
| `--color-scheme` | Dark/light mode | `--color-scheme=dark` |
| `--geolocation` | Set location | `--geolocation="37.7749,-122.4194"` |
| `--timezone` | Set timezone | `--timezone="America/New_York"` |
| `--lang` | Set language | `--lang="en-US"` |
| `--browser` | Browser type | `--browser=firefox` |

---

## Running Generated Tests

### Basic Test Run

```bash
playwright-test
```

### Run Specific Test File

```bash
playwright-test tests/login.spec.ts
```

### Run with UI Mode (Interactive)

```bash
playwright-test --ui
```

### Run Headed (Visible Browser)

```bash
playwright-test --headed
```

### Run in Debug Mode

```bash
playwright-test --debug
```

### Run Specific Test by Name

```bash
playwright-test -g "login test"
```

---

## Generated Code Patterns

### Navigation

```typescript
await page.goto('https://example.com/');
await page.goto('https://example.com/about');
```

### Clicking Elements

```typescript
// By role
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('link', { name: 'Home' }).click();

// By text
await page.getByText('Click me').click();

// By label
await page.getByLabel('Accept terms').click();
```

### Filling Forms

```typescript
// Text input
await page.getByLabel('Email').fill('user@example.com');
await page.getByPlaceholder('Enter your name').fill('John Doe');

// Password
await page.getByLabel('Password').fill('secret123');
```

### Selecting Options

```typescript
await page.getByLabel('Country').selectOption('US');
await page.getByRole('combobox').selectOption({ label: 'United States' });
```

### Assertions

```typescript
// Visibility
await expect(page.getByText('Success')).toBeVisible();

// Text content
await expect(page.getByRole('heading')).toHaveText('Welcome');

// URL
await expect(page).toHaveURL('https://example.com/dashboard');

// Element count
await expect(page.getByRole('listitem')).toHaveCount(5);
```

---

## Best Practices for Recording

### 1. Plan Your Test Scenario

Before recording, outline what you want to test:
- What page to start on
- What actions to perform
- What to verify at the end

### 2. Use Meaningful Selectors

The codegen tool generates selectors automatically, but you may want to edit them for clarity:

```typescript
// Generated (might be fragile)
await page.locator('#btn-123').click();

// Better (more readable and stable)
await page.getByRole('button', { name: 'Submit Order' }).click();
```

### 3. Add Assertions

The codegen tool records actions but may not add assertions. Add them manually:

```typescript
// After login action
await page.getByRole('button', { name: 'Login' }).click();

// Add assertion to verify login succeeded
await expect(page.getByText('Welcome back')).toBeVisible();
```

### 4. Handle Dynamic Content

For pages with loading states:

```typescript
// Wait for element to appear
await page.getByText('Data loaded').waitFor();

// Or use expect with timeout
await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 });
```

### 5. Organize Tests

Structure your test files logically:

```
tests/
  auth/
    login.spec.ts
    logout.spec.ts
    signup.spec.ts
  checkout/
    add-to-cart.spec.ts
    payment.spec.ts
  navigation/
    menu.spec.ts
    search.spec.ts
```

---

## Example Scenarios

### Scenario 1: Generate Login Test

**User request:** "Generate a test for the login flow"

**Steps:**
```bash
# 1. Start recording
playwright-codegen https://example.com/login -o tests/auth/login.spec.ts

# 2. In browser:
#    - Enter email
#    - Enter password
#    - Click login button
#    - Verify dashboard appears

# 3. Close browser to save

# 4. Run the test
playwright-test tests/auth/login.spec.ts
```

**Generated code example:**
```typescript
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

### Scenario 2: Generate E-commerce Checkout Test

**User request:** "Create a test for adding items to cart and checkout"

**Steps:**
```bash
# 1. Start recording
playwright-codegen https://shop.example.com -o tests/checkout/full-checkout.spec.ts

# 2. In browser:
#    - Search for product
#    - Click on product
#    - Select options (size, color)
#    - Add to cart
#    - Go to cart
#    - Proceed to checkout
#    - Fill shipping info
#    - Verify order summary

# 3. Close browser to save

# 4. Run the test
playwright-test tests/checkout/full-checkout.spec.ts --headed
```

### Scenario 3: Generate Form Validation Test

**User request:** "Test form validation errors"

**Steps:**
```bash
# 1. Start recording
playwright-codegen https://example.com/signup -o tests/validation/signup-errors.spec.ts

# 2. In browser:
#    - Submit empty form
#    - Verify error messages appear
#    - Fill invalid email
#    - Verify email error
#    - Fill valid data
#    - Verify form submits

# 3. Close browser to save

# 4. Edit test to add assertions for error messages
```

### Scenario 4: Generate Mobile Test

**User request:** "Create a test for mobile navigation"

**Steps:**
```bash
# 1. Start recording with mobile viewport
playwright-codegen --device="iPhone 12" https://example.com -o tests/mobile/navigation.spec.ts

# 2. In browser:
#    - Click hamburger menu
#    - Navigate through menu items
#    - Verify responsive behavior

# 3. Close browser to save

# 4. Run the test
playwright-test tests/mobile/navigation.spec.ts --headed
```

---

## Editing Generated Tests

### Add Test Description

```typescript
test('user can login with valid credentials', async ({ page }) => {
  // ... generated code
});
```

### Add Setup/Teardown

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('https://example.com');
});

test.afterEach(async ({ page }) => {
  // Clean up
});
```

### Parameterize Tests

```typescript
const testUsers = [
  { email: 'user1@example.com', password: 'pass1' },
  { email: 'user2@example.com', password: 'pass2' },
];

for (const user of testUsers) {
  test(`login with ${user.email}`, async ({ page }) => {
    await page.goto('https://example.com/login');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Login' }).click();
  });
}
```

### Add Page Object Pattern

```typescript
// pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}

// tests/login.spec.ts
test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('https://example.com/login');
  await loginPage.login('user@example.com', 'password');
});
```

---

## Troubleshooting

### Codegen Won't Start

**Symptom:** `playwright-codegen` command fails

**Solution:**
```bash
# Check if playwright is installed
playwright --version

# If not working, re-export from distrobox
distrobox enter playwright -- /usr/local/bin/setup-host-integration
```

### Browser Doesn't Open

**Symptom:** Command runs but no browser appears

**Solution:**
```bash
# Check if running in headless environment
# Codegen requires a display

# On remote/headless systems, use X forwarding or VNC
```

### Generated Code Doesn't Work

**Symptom:** Test fails when run

**Solution:**
```bash
# Run in debug mode to see what's happening
playwright-test --debug tests/my-test.spec.ts

# Check if selectors are still valid
# Page may have changed since recording
```

### Selectors Are Fragile

**Symptom:** Tests break when page changes slightly

**Solution:**
- Edit generated selectors to use more stable attributes
- Prefer `getByRole`, `getByLabel`, `getByText` over CSS selectors
- Add `data-testid` attributes to your application

---

## Quick Reference

| Task | Command |
|------|---------|
| Start recording | `playwright-codegen URL` |
| Save to file | `playwright-codegen URL -o file.spec.ts` |
| Mobile viewport | `playwright-codegen --device="iPhone 12" URL` |
| Custom size | `playwright-codegen --viewport-size=1280,720 URL` |
| Run tests | `playwright-test` |
| Run specific test | `playwright-test tests/file.spec.ts` |
| Run headed | `playwright-test --headed` |
| Run with UI | `playwright-test --ui` |
| Debug mode | `playwright-test --debug` |
