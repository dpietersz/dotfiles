---
description: Set up authentication for Playwright tests. Configure globalSetup for session reuse, storageState for cookie/token persistence, multi-role testing, and OAuth/SSO handling strategies.
globs: ""
alwaysApply: false
---

# Authentication Workflow

Set up robust authentication for Playwright tests. This workflow covers session reuse with `storageState`, multi-role testing patterns, API vs UI authentication, and OAuth/SSO handling strategies.

## When to Use This Workflow

**USE this workflow when:**
- User needs to set up authentication for Playwright tests
- User wants to reuse login sessions across tests
- User needs to test with multiple user roles (admin, user, readonly)
- User wants to speed up tests by avoiding repeated logins
- User says "authentication", "login setup", "session reuse", "storageState"
- User needs to handle OAuth or SSO in tests

**DO NOT use this workflow when:**
- User just needs a one-time login interaction → Use `interact.md` workflow
- User wants to generate login test code → Use `codegen.md` workflow
- User needs to test login form validation → Use `e2e-testing.md` workflow

---

## Core Concept: storageState

Playwright's `storageState` saves cookies, localStorage, and sessionStorage to a JSON file. Tests can reuse this state to skip login flows.

**Benefits:**
- Tests run faster (no repeated logins)
- Less flaky (fewer network requests)
- Cleaner test code (no login boilerplate)

**File location convention:**
```
playwright/
  .auth/
    user.json
    admin.json
    readonly.json
```

**IMPORTANT:** Add `playwright/.auth/` to `.gitignore` to avoid committing credentials.

---

## Method 1: Setup Project (Recommended)

Use a dedicated setup project that runs before all tests.

### Step 1: Create Auth Setup File

```typescript
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate as user', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');
  
  // Fill login form
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Wait for successful login
  await page.waitForURL('/dashboard');
  
  // Verify login succeeded
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
});
```

### Step 2: Configure playwright.config.ts

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // Setup project - runs first
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    
    // Main tests - depend on setup
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
  ],
});
```

### Step 3: Create .gitignore Entry

```bash
# Add to .gitignore
echo "playwright/.auth/" >> .gitignore
```

### Step 4: Create Auth Directory

```bash
mkdir -p playwright/.auth
```

---

## Method 2: Global Setup

Use `globalSetup` for authentication that runs once before all tests.

### Step 1: Create Global Setup File

```typescript
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  await page.waitForURL('/dashboard');
  
  // Save storage state
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
  
  await browser.close();
}

export default globalSetup;
```

### Step 2: Configure playwright.config.ts

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  
  use: {
    storageState: 'playwright/.auth/user.json',
  },
});
```

---

## Multi-Role Testing

Test with different user roles (admin, user, readonly) using separate auth files.

### Step 1: Create Multiple Setup Files

```typescript
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

// Regular user authentication
setup('authenticate as user', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('userpass');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});

// Admin authentication
setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('adminpass');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/admin/dashboard');
  await page.context().storageState({ path: 'playwright/.auth/admin.json' });
});

// Readonly user authentication
setup('authenticate as readonly', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('readonly@example.com');
  await page.getByLabel('Password').fill('readonlypass');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: 'playwright/.auth/readonly.json' });
});
```

### Step 2: Configure Projects for Each Role

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // Setup project
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    
    // Regular user tests
    {
      name: 'user-tests',
      testDir: './tests/user',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    
    // Admin tests
    {
      name: 'admin-tests',
      testDir: './tests/admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
    },
    
    // Readonly tests
    {
      name: 'readonly-tests',
      testDir: './tests/readonly',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/readonly.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

### Step 3: Override Storage State in Individual Tests

```typescript
// tests/admin/admin-panel.spec.ts
import { test, expect } from '@playwright/test';

// Use admin auth for this test file
test.use({ storageState: 'playwright/.auth/admin.json' });

test('admin can access admin panel', async ({ page }) => {
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible();
});
```

---

## API Authentication (Faster)

Use API calls instead of UI for faster, more reliable authentication.

### Step 1: Create API Auth Setup

```typescript
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

setup('authenticate via API', async ({ request, context }) => {
  // Call login API directly
  const response = await request.post('/api/auth/login', {
    data: {
      email: 'user@example.com',
      password: 'password123',
    },
  });
  
  expect(response.ok()).toBeTruthy();
  
  // Get auth token from response
  const { token } = await response.json();
  
  // Set token in storage
  await context.addCookies([
    {
      name: 'auth-token',
      value: token,
      domain: 'localhost',
      path: '/',
    },
  ]);
  
  // Save state
  await context.storageState({ path: 'playwright/.auth/user.json' });
});
```

### Alternative: Set Token Directly

```typescript
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate via API', async ({ page }) => {
  // Navigate to set the origin
  await page.goto('/');
  
  // Set auth token directly in localStorage
  await page.evaluate(() => {
    localStorage.setItem('auth-token', 'your-test-token');
  });
  
  // Save state
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```

---

## OAuth/SSO Handling

Strategies for handling OAuth and SSO authentication.

### Strategy 1: Mock OAuth Provider

```typescript
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate with mocked OAuth', async ({ page }) => {
  // Your app should have a test mode that accepts mock tokens
  await page.goto('/login?test_mode=true');
  
  // Set mock OAuth token
  await page.evaluate(() => {
    localStorage.setItem('oauth-token', 'mock-oauth-token-for-testing');
    localStorage.setItem('user', JSON.stringify({
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    }));
  });
  
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```

### Strategy 2: Bypass OAuth in Test Environment

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: process.env.CI 
      ? 'https://test.example.com'  // Test env with OAuth bypass
      : 'http://localhost:3000',
  },
});
```

### Strategy 3: Automate OAuth Flow

```typescript
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

setup('authenticate with Google OAuth', async ({ page }) => {
  await page.goto('/login');
  
  // Click OAuth button
  await page.getByRole('button', { name: 'Sign in with Google' }).click();
  
  // Handle Google login page
  await page.waitForURL(/accounts\.google\.com/);
  await page.getByLabel('Email or phone').fill('test@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Enter your password').fill('password');
  await page.getByRole('button', { name: 'Next' }).click();
  
  // Wait for redirect back to app
  await page.waitForURL('/dashboard');
  
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```

**Note:** Automating real OAuth providers is fragile. Prefer mocking or test environment bypass.

---

## One Account Per Worker Pattern

For tests that modify server-side state, use separate accounts per worker.

### Step 1: Create Worker-Specific Auth

```typescript
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

// Get worker index for unique account
const workerIndex = process.env.TEST_PARALLEL_INDEX || '0';

setup('authenticate worker account', async ({ page }) => {
  await page.goto('/login');
  
  // Use worker-specific account
  await page.getByLabel('Email').fill(`worker${workerIndex}@example.com`);
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  await page.waitForURL('/dashboard');
  await page.context().storageState({ 
    path: `playwright/.auth/worker-${workerIndex}.json` 
  });
});
```

### Step 2: Configure Worker-Specific Storage

```typescript
// playwright.config.ts
export default defineConfig({
  workers: 4,
  
  use: {
    storageState: ({ workerIndex }) => 
      `playwright/.auth/worker-${workerIndex}.json`,
  },
});
```

---

## Session Expiry Handling

Handle token expiration gracefully.

### Check Session Before Tests

```typescript
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import fs from 'fs';

const authFile = 'playwright/.auth/user.json';

setup('ensure valid session', async ({ page }) => {
  // Check if auth file exists and is recent
  if (fs.existsSync(authFile)) {
    const stats = fs.statSync(authFile);
    const ageInMinutes = (Date.now() - stats.mtimeMs) / 1000 / 60;
    
    // If less than 30 minutes old, verify session is still valid
    if (ageInMinutes < 30) {
      await page.goto('/dashboard');
      
      // If we're not redirected to login, session is valid
      if (!page.url().includes('/login')) {
        return; // Session still valid, skip re-auth
      }
    }
  }
  
  // Re-authenticate
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: authFile });
});
```

---

## Project Structure

```
project/
  playwright/
    .auth/                    # Auth state files (gitignored)
      user.json
      admin.json
      readonly.json
  tests/
    auth.setup.ts             # Authentication setup
    user/                     # User role tests
      dashboard.spec.ts
      profile.spec.ts
    admin/                    # Admin role tests
      admin-panel.spec.ts
      user-management.spec.ts
    readonly/                 # Readonly role tests
      view-only.spec.ts
  playwright.config.ts
  .gitignore                  # Include playwright/.auth/
```

---

## Best Practices

### 1. Always Use storageState for Authenticated Tests

```typescript
// Good - reuses session
test.use({ storageState: 'playwright/.auth/user.json' });

// Bad - logs in every test
test('dashboard test', async ({ page }) => {
  await page.goto('/login');
  await page.fill('email', 'user@example.com');
  // ... login code in every test
});
```

### 2. Prefer API Authentication Over UI

```typescript
// Faster - API call
const response = await request.post('/api/auth/login', { data: credentials });

// Slower - UI interaction
await page.goto('/login');
await page.fill('email', 'user@example.com');
await page.fill('password', 'password');
await page.click('button[type="submit"]');
```

### 3. Use Separate Auth Files Per Role

```typescript
// Clear separation of concerns
storageState: 'playwright/.auth/admin.json'
storageState: 'playwright/.auth/user.json'
storageState: 'playwright/.auth/readonly.json'
```

### 4. Never Commit Auth Files

```bash
# .gitignore
playwright/.auth/
```

### 5. Use Test Accounts, Not Real Accounts

```typescript
// Use dedicated test accounts
await page.getByLabel('Email').fill('playwright-test@example.com');

// Never use real user credentials
```

---

## Troubleshooting

### Auth State Not Persisting

**Symptom:** Tests fail with "not logged in" errors

**Solution:**
```typescript
// Ensure you're waiting for login to complete
await page.waitForURL('/dashboard');
await expect(page.getByText('Welcome')).toBeVisible();

// Then save state
await page.context().storageState({ path: authFile });
```

### Setup Project Not Running

**Symptom:** Tests run without authentication

**Solution:**
```typescript
// Ensure dependencies are set correctly
{
  name: 'chromium',
  dependencies: ['setup'],  // Must match setup project name
}
```

### Session Expired During Test Run

**Symptom:** Tests fail midway with auth errors

**Solution:**
```typescript
// Use shorter session timeout in test environment
// Or implement session refresh in globalSetup
```

### Different Auth State Per Browser

**Symptom:** Firefox tests fail but Chrome passes

**Solution:**
```typescript
// Create separate auth files per browser if needed
{
  name: 'firefox',
  use: {
    storageState: 'playwright/.auth/user-firefox.json',
  },
}
```

---

## Quick Reference

| Task | Code |
|------|------|
| Save auth state | `await page.context().storageState({ path: 'file.json' })` |
| Use auth state | `test.use({ storageState: 'file.json' })` |
| API login | `await request.post('/api/auth/login', { data })` |
| Set cookie | `await context.addCookies([{ name, value, domain, path }])` |
| Set localStorage | `await page.evaluate(() => localStorage.setItem(key, value))` |
| Check session | `await page.goto('/dashboard'); if (page.url().includes('/login'))...` |
