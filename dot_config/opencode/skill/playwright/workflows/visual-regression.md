---
description: Visual regression testing with Playwright. Use toHaveScreenshot() for pixel-perfect comparisons, mask dynamic content, configure thresholds, and manage baselines across CI/CD pipelines.
globs: ""
alwaysApply: false
---

# Visual Regression Testing Workflow

Implement visual regression testing with Playwright's built-in screenshot comparison. Detect unintended visual changes, mask dynamic content, configure thresholds, and manage baselines across environments.

## When to Use This Workflow

**USE this workflow when:**
- User wants to detect visual changes in their application
- User needs to compare screenshots across builds
- User says "visual regression", "screenshot comparison", "visual testing"
- User wants to catch CSS/layout regressions
- User needs to verify UI consistency across browsers
- User wants to set up baseline screenshots

**DO NOT use this workflow when:**
- User just needs a one-time screenshot → Use `screenshot.md` workflow
- User needs to test functionality → Use `e2e-testing.md` workflow
- User wants to generate test code → Use `codegen.md` workflow

---

## Core Concept: toHaveScreenshot()

Playwright's `toHaveScreenshot()` assertion compares the current page/element against a stored baseline image.

**How it works:**
1. First run: Creates baseline screenshot in `tests/__snapshots__/`
2. Subsequent runs: Compares current screenshot against baseline
3. If different: Test fails with diff image showing changes
4. Update baseline: Run with `--update-snapshots` flag

---

## Basic Usage

### Simple Page Screenshot Comparison

```typescript
import { test, expect } from '@playwright/test';

test('homepage visual regression', async ({ page }) => {
  await page.goto('/');
  
  // Compare entire page against baseline
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### Element Screenshot Comparison

```typescript
test('header visual regression', async ({ page }) => {
  await page.goto('/');
  
  // Compare specific element
  const header = page.locator('header');
  await expect(header).toHaveScreenshot('header.png');
});
```

### Full Page Screenshot

```typescript
test('full page visual regression', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toHaveScreenshot('homepage-full.png', {
    fullPage: true,
  });
});
```

---

## Masking Dynamic Content

Dynamic content (timestamps, avatars, ads) causes false positives. Mask them.

### Mask Multiple Elements

```typescript
test('dashboard visual regression', async ({ page }) => {
  await page.goto('/dashboard');
  
  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
      page.locator('.timestamp'),
      page.locator('.user-avatar'),
      page.locator('.live-counter'),
      page.locator('[data-testid="ad-banner"]'),
    ],
  });
});
```

### Mask with Custom Color

```typescript
test('dashboard with pink masks', async ({ page }) => {
  await page.goto('/dashboard');
  
  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [page.locator('.dynamic-content')],
    maskColor: '#FF00FF',  // Pink mask for visibility
  });
});
```

### Common Elements to Mask

| Element Type | Selector Example |
|--------------|------------------|
| Timestamps | `.timestamp`, `time`, `[data-testid="date"]` |
| Avatars | `.avatar`, `.user-image`, `img[alt*="avatar"]` |
| Ads | `.ad-banner`, `[data-ad]`, `iframe[src*="ads"]` |
| Live counters | `.live-count`, `.online-users` |
| Random content | `.random-quote`, `.daily-tip` |
| Loading spinners | `.spinner`, `.loading` |
| Carousels | `.carousel`, `.slider` |

---

## Disabling Animations

Animations cause flaky tests. Disable them.

### In Screenshot Options

```typescript
test('page without animations', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toHaveScreenshot('homepage.png', {
    animations: 'disabled',
  });
});
```

### Globally in Config

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Disable animations for all tests
    screenshot: {
      animations: 'disabled',
    },
  },
});
```

### Via CSS (Alternative)

```typescript
test('disable animations via CSS', async ({ page }) => {
  await page.goto('/');
  
  // Inject CSS to disable all animations
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
  
  await expect(page).toHaveScreenshot('homepage.png');
});
```

---

## Threshold Configuration

Configure how much difference is acceptable.

### Pixel-Based Threshold

```typescript
test('allow small differences', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toHaveScreenshot('homepage.png', {
    // Allow up to 100 different pixels
    maxDiffPixels: 100,
  });
});
```

### Ratio-Based Threshold (Recommended)

```typescript
test('allow 1% difference', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toHaveScreenshot('homepage.png', {
    // Allow up to 1% of pixels to differ
    maxDiffPixelRatio: 0.01,
  });
});
```

### Threshold Guidelines

| Threshold | Use Case |
|-----------|----------|
| `0.01` (1%) | Strict - catch most regressions |
| `0.02` (2%) | Moderate - allow minor anti-aliasing differences |
| `0.05` (5%) | Lenient - only catch major changes |

**Start strict (1%) and loosen only if needed.**

---

## Complete Example

```typescript
import { test, expect } from '@playwright/test';

test('dashboard visual regression', async ({ page }) => {
  // Navigate to page
  await page.goto('/dashboard');
  
  // Wait for content to load
  await page.waitForLoadState('networkidle');
  
  // Wait for specific element to ensure page is ready
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  
  // Take screenshot with all best practices
  await expect(page).toHaveScreenshot('dashboard.png', {
    fullPage: true,
    animations: 'disabled',
    mask: [
      page.locator('.timestamp'),
      page.locator('.user-avatar'),
      page.locator('.notification-badge'),
    ],
    maxDiffPixelRatio: 0.01,
  });
});
```

---

## CI/CD Integration

### GitHub Actions Configuration

```yaml
# .github/workflows/visual-tests.yml
name: Visual Regression Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
        
      - name: Run visual tests
        run: npx playwright test --project=visual
        
      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: visual-test-results
          path: |
            test-results/
            playwright-report/
          retention-days: 7
```

### Docker for Consistent Rendering

```dockerfile
# Dockerfile.playwright
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npx", "playwright", "test"]
```

```yaml
# docker-compose.yml
services:
  playwright:
    build:
      context: .
      dockerfile: Dockerfile.playwright
    volumes:
      - ./tests:/app/tests
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
```

### Lock Browser Versions

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'visual',
      use: {
        // Use specific browser version for consistency
        channel: 'chrome',  // Or pin Playwright version in package.json
      },
    },
  ],
});
```

---

## Baseline Management

### Creating Initial Baselines

```bash
# Run tests to create baselines
npx playwright test

# Baselines are saved to tests/__snapshots__/
```

### Updating Baselines

```bash
# Update all baselines
npx playwright test --update-snapshots

# Update specific test file baselines
npx playwright test tests/visual/homepage.spec.ts --update-snapshots
```

### Baseline File Structure

```
tests/
  __snapshots__/
    homepage.spec.ts-snapshots/
      homepage-chromium-linux.png
      homepage-firefox-linux.png
      homepage-webkit-linux.png
    dashboard.spec.ts-snapshots/
      dashboard-chromium-linux.png
```

### Commit Baselines to Git

```bash
# Add baselines to version control
git add tests/__snapshots__/
git commit -m "Update visual regression baselines"
```

### Review Baseline Changes in PR

```yaml
# .github/workflows/visual-tests.yml
- name: Upload baseline diffs
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: baseline-diffs
    path: test-results/**/*-diff.png
```

---

## Handling Flaky Tests

### Font Rendering Differences

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Use consistent fonts
    launchOptions: {
      args: ['--font-render-hinting=none'],
    },
  },
});
```

### Wait for Fonts to Load

```typescript
test('wait for fonts', async ({ page }) => {
  await page.goto('/');
  
  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
  
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### Wait for Images to Load

```typescript
test('wait for images', async ({ page }) => {
  await page.goto('/');
  
  // Wait for all images to load
  await page.waitForFunction(() => {
    const images = document.querySelectorAll('img');
    return Array.from(images).every(img => img.complete);
  });
  
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### Scroll Position Reset

```typescript
test('reset scroll position', async ({ page }) => {
  await page.goto('/');
  
  // Ensure consistent scroll position
  await page.evaluate(() => window.scrollTo(0, 0));
  
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### Hide Cursor

```typescript
test('hide cursor', async ({ page }) => {
  await page.goto('/');
  
  // Hide cursor to prevent flakiness
  await page.addStyleTag({
    content: '* { cursor: none !important; }',
  });
  
  await expect(page).toHaveScreenshot('homepage.png');
});
```

---

## Multi-Browser Visual Testing

### Configure Multiple Browsers

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'chromium-visual',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*visual.*\.spec\.ts/,
    },
    {
      name: 'firefox-visual',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /.*visual.*\.spec\.ts/,
    },
    {
      name: 'webkit-visual',
      use: { ...devices['Desktop Safari'] },
      testMatch: /.*visual.*\.spec\.ts/,
    },
  ],
});
```

### Browser-Specific Baselines

Playwright automatically creates separate baselines per browser:

```
tests/__snapshots__/
  homepage.spec.ts-snapshots/
    homepage-chromium-linux.png
    homepage-firefox-linux.png
    homepage-webkit-linux.png
```

---

## Responsive Visual Testing

### Test Multiple Viewports

```typescript
const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

for (const viewport of viewports) {
  test(`homepage visual - ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ 
      width: viewport.width, 
      height: viewport.height 
    });
    
    await page.goto('/');
    
    await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
      fullPage: true,
      animations: 'disabled',
    });
  });
}
```

### Device Emulation

```typescript
import { devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test('mobile visual regression', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage-iphone12.png');
});
```

---

## Project Structure

```
project/
  tests/
    visual/
      homepage.visual.spec.ts
      dashboard.visual.spec.ts
      components.visual.spec.ts
    __snapshots__/
      homepage.visual.spec.ts-snapshots/
        homepage-chromium-linux.png
        homepage-firefox-linux.png
      dashboard.visual.spec.ts-snapshots/
        dashboard-chromium-linux.png
  playwright.config.ts
```

---

## Best Practices

### 1. Start with Tight Thresholds

```typescript
// Start strict, loosen only if needed
maxDiffPixelRatio: 0.01  // 1%
```

### 2. Always Mask Dynamic Content

```typescript
mask: [
  page.locator('.timestamp'),
  page.locator('.avatar'),
  page.locator('.ad'),
]
```

### 3. Disable Animations

```typescript
animations: 'disabled'
```

### 4. Wait for Page Stability

```typescript
await page.waitForLoadState('networkidle');
await expect(page.locator('.main-content')).toBeVisible();
```

### 5. Use Consistent Environment

```bash
# Use Docker for CI
docker run -v $(pwd):/app mcr.microsoft.com/playwright:latest npx playwright test
```

### 6. Review Baseline Changes Carefully

```bash
# Always review diffs before updating
npx playwright show-report

# Then update if changes are intentional
npx playwright test --update-snapshots
```

### 7. Separate Visual Tests from Functional Tests

```typescript
// playwright.config.ts
projects: [
  { name: 'functional', testMatch: /.*\.spec\.ts/ },
  { name: 'visual', testMatch: /.*\.visual\.spec\.ts/ },
]
```

---

## Troubleshooting

### Different Results on CI vs Local

**Symptom:** Tests pass locally but fail on CI

**Solution:**
```bash
# Use Docker locally to match CI environment
docker run -v $(pwd):/app mcr.microsoft.com/playwright:latest npx playwright test

# Or update baselines from CI artifacts
```

### Anti-aliasing Differences

**Symptom:** Slight pixel differences around text/edges

**Solution:**
```typescript
// Increase threshold slightly
maxDiffPixelRatio: 0.02

// Or use pixel count
maxDiffPixels: 50
```

### Baseline Not Found

**Symptom:** Test fails with "missing baseline"

**Solution:**
```bash
# Create baseline by running test
npx playwright test tests/visual/homepage.spec.ts

# Commit the new baseline
git add tests/__snapshots__/
```

### Too Many False Positives

**Symptom:** Tests fail frequently without real changes

**Solution:**
```typescript
// 1. Mask more dynamic elements
mask: [page.locator('.dynamic')]

// 2. Disable animations
animations: 'disabled'

// 3. Wait for stability
await page.waitForLoadState('networkidle')

// 4. Increase threshold (last resort)
maxDiffPixelRatio: 0.02
```

---

## Quick Reference

| Task | Code |
|------|------|
| Basic screenshot | `await expect(page).toHaveScreenshot('name.png')` |
| Full page | `await expect(page).toHaveScreenshot('name.png', { fullPage: true })` |
| Element screenshot | `await expect(locator).toHaveScreenshot('name.png')` |
| Mask elements | `mask: [page.locator('.dynamic')]` |
| Disable animations | `animations: 'disabled'` |
| Set threshold | `maxDiffPixelRatio: 0.01` |
| Update baselines | `npx playwright test --update-snapshots` |
| View report | `npx playwright show-report` |
