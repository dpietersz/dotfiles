---
description: Interact with web pages using Playwright MCP. Fill forms, click buttons, select options, handle dialogs, and perform multi-step workflows with verification.
globs: ""
alwaysApply: false
---

# Interact Workflow

Perform complex interactions with web pages using Playwright browser automation. Fill forms, click buttons, select dropdown options, upload files, and execute multi-step workflows with verification.

## When to Use This Workflow

**USE this workflow when:**
- User needs to fill out a form
- User wants to click buttons or links
- User needs to log into a website
- User wants to submit data to a form
- User needs multi-step interactions (checkout, signup, etc.)
- User says "fill", "submit", "click", "enter data", "log in"

**DO NOT use this workflow when:**
- User just needs to read content → Use `scrape.md` workflow
- User just needs a screenshot → Use `screenshot.md` workflow
- User wants to generate test code → Use `codegen.md` workflow

---

## Core Concept: Element References

Before interacting with any element, you must get its reference using `browser_snapshot()`:

```yaml
- generic [ref=e1]:
  - textbox "Email" [ref=e3]
  - textbox "Password" [ref=e5]
  - button "Login" [ref=e7]
```

**Use refs for precise targeting:**
- `browser_click(ref: "e7")` - Click the Login button
- `browser_type(ref: "e3", text: "user@example.com")` - Type in Email field

---

## Basic Interaction Workflow

### Step 1: Navigate to the Page

```
browser_navigate(url: "https://example.com/form")
```

### Step 2: Get Element References

```
browser_snapshot()
```

### Step 3: Perform Interactions

```
browser_type(element: "Email", text: "user@example.com", ref: "e3")
browser_click(element: "Submit", ref: "e7")
```

### Step 4: Verify Results

```
browser_wait(time: 2000)
browser_snapshot()  # Check for success message or new page
```

### Step 5: Clean Up

```
browser_close()
```

---

## Interaction Tools Reference

### Clicking Elements

```
browser_click(element: "Button text", ref: "eN")
```

**Use for:**
- Buttons
- Links
- Checkboxes
- Radio buttons
- Any clickable element

### Typing Text

```
browser_type(element: "Field name", text: "value to type", ref: "eN")
```

**Use for:**
- Text inputs
- Email fields
- Password fields
- Textareas
- Search boxes

**Note:** This clears existing content before typing. For appending, use `browser_press_key` with individual characters.

### Selecting Dropdown Options

```
browser_select_option(element: "Dropdown name", values: ["Option value"])
```

**Use for:**
- `<select>` dropdowns
- Can select multiple values: `values: ["Option1", "Option2"]`

### Hovering

```
browser_hover(element: "Menu item", ref: "eN")
```

**Use for:**
- Revealing dropdown menus
- Triggering tooltips
- Hover states

### Pressing Keys

```
browser_press_key(key: "Enter")
```

**Common keys:**
- `Enter` - Submit forms, confirm
- `Tab` - Move to next field
- `Escape` - Close dialogs
- `ArrowDown`, `ArrowUp` - Navigate lists
- `Backspace` - Delete characters

### File Upload

```
browser_file_upload(paths: ["/path/to/file.pdf"])
```

**Use for:**
- File input fields
- Multiple files: `paths: ["/file1.pdf", "/file2.pdf"]`

### Handling Dialogs

```
browser_handle_dialog(accept: true)
```

**Use for:**
- Alert dialogs
- Confirm dialogs
- Prompt dialogs
- Set `accept: false` to cancel/dismiss

---

## Common Interaction Patterns

### Pattern 1: Login Form

```
1. browser_navigate(url: "https://example.com/login")
2. browser_snapshot()  # Get form element refs

3. browser_type(element: "Email", text: "user@example.com", ref: "e3")
4. browser_type(element: "Password", text: "password123", ref: "e5")
5. browser_click(element: "Login", ref: "e7")

6. browser_wait(time: 3000)
7. browser_snapshot()  # Verify login success
```

### Pattern 2: Search Form

```
1. browser_navigate(url: "https://example.com")
2. browser_snapshot()

3. browser_type(element: "Search", text: "search query", ref: "e3")
4. browser_press_key(key: "Enter")  # Or click search button

5. browser_wait(time: 2000)
6. browser_snapshot()  # Get search results
```

### Pattern 3: Multi-Step Form (Wizard)

```
# Step 1: Personal Info
1. browser_navigate(url: "https://example.com/signup")
2. browser_snapshot()
3. browser_type(element: "First Name", text: "John", ref: "e3")
4. browser_type(element: "Last Name", text: "Doe", ref: "e5")
5. browser_click(element: "Next", ref: "e7")

# Step 2: Contact Info
6. browser_wait(time: 1000)
7. browser_snapshot()
8. browser_type(element: "Email", text: "john@example.com", ref: "e10")
9. browser_type(element: "Phone", text: "555-1234", ref: "e12")
10. browser_click(element: "Next", ref: "e14")

# Step 3: Confirmation
11. browser_wait(time: 1000)
12. browser_snapshot()
13. browser_click(element: "Submit", ref: "e20")

14. browser_wait(time: 2000)
15. browser_snapshot()  # Verify success
```

### Pattern 4: Dropdown Selection

```
1. browser_navigate(url: "https://example.com/form")
2. browser_snapshot()

3. browser_select_option(element: "Country", values: ["United States"])
4. browser_select_option(element: "State", values: ["California"])

5. browser_snapshot()  # Verify selections
```

### Pattern 5: Checkbox and Radio Buttons

```
1. browser_navigate(url: "https://example.com/preferences")
2. browser_snapshot()

# Click checkboxes (toggles state)
3. browser_click(element: "Receive newsletter", ref: "e5")
4. browser_click(element: "Accept terms", ref: "e7")

# Click radio button (selects option)
5. browser_click(element: "Premium plan", ref: "e10")

6. browser_snapshot()  # Verify selections
```

### Pattern 6: File Upload

```
1. browser_navigate(url: "https://example.com/upload")
2. browser_snapshot()

3. browser_file_upload(paths: ["/home/user/document.pdf"])
4. browser_wait(time: 2000)  # Wait for upload

5. browser_click(element: "Submit", ref: "e10")
6. browser_wait(time: 3000)
7. browser_snapshot()  # Verify upload success
```

### Pattern 7: Hover Menu Navigation

```
1. browser_navigate(url: "https://example.com")
2. browser_snapshot()

3. browser_hover(element: "Products", ref: "e5")  # Reveal dropdown
4. browser_wait(time: 500)  # Wait for menu animation
5. browser_snapshot()  # Get menu item refs

6. browser_click(element: "Category A", ref: "e12")
```

---

## Verification Strategies

### After Form Submission

```
browser_click(element: "Submit", ref: "e10")
browser_wait(time: 3000)
browser_snapshot()

# Look for in snapshot:
# - Success message ("Thank you", "Submitted", etc.)
# - Redirect to new page
# - Confirmation number
# - Error messages (if failed)
```

### After Login

```
browser_click(element: "Login", ref: "e7")
browser_wait(time: 3000)
browser_snapshot()

# Look for in snapshot:
# - Dashboard elements
# - User name/avatar
# - Logout button
# - Error message (if failed)
```

### Visual Verification

```
browser_take_screenshot(filename: "after-submit.png")
```

### Check Network Activity

```
browser_network_requests()  # See if form submission request succeeded
```

### Check Console for Errors

```
browser_console_messages()  # Look for JavaScript errors
```

---

## Error Handling

### Element Not Found

**Symptom:** Click or type fails because element ref is invalid

**Solution:**
```
1. Re-run browser_snapshot() to get fresh refs
2. Refs change after page updates
3. Verify element is visible and not hidden
4. Check if element is inside an iframe
```

### Form Validation Errors

**Symptom:** Form doesn't submit, shows validation errors

**Solution:**
```
1. browser_snapshot() to see error messages
2. Fix invalid fields
3. Re-submit
```

### Page Navigation After Submit

**Symptom:** Page redirects, losing context

**Solution:**
```
1. browser_wait(time: 3000) after submit
2. browser_snapshot() to see new page
3. Continue workflow on new page
```

### Dialog Blocking Interaction

**Symptom:** Can't interact because dialog is open

**Solution:**
```
1. browser_handle_dialog(accept: true)  # Or false to dismiss
2. Continue with interactions
```

### CAPTCHA Encountered

**Symptom:** CAPTCHA blocks form submission

**Solution:**
```
1. Playwright cannot solve CAPTCHAs automatically
2. Consider using BrightData MCP for CAPTCHA bypass
3. Or notify user that manual intervention needed
```

---

## Best Practices

### 1. Always Snapshot Before Interacting

```
browser_snapshot()  # Get current refs
browser_click(ref: "e5")  # Use fresh ref
```

### 2. Wait After Actions That Change Page

```
browser_click(element: "Submit", ref: "e10")
browser_wait(time: 2000)  # Wait for response
browser_snapshot()  # Then check result
```

### 3. Verify After Important Actions

```
browser_type(element: "Email", text: "user@example.com", ref: "e3")
browser_snapshot()  # Verify text was entered correctly
```

### 4. Handle Dynamic Content

```
# If element appears after delay
browser_wait(time: 2000)
browser_snapshot()  # Now element should be present
```

### 5. Use Descriptive Element Names

```
# Good - clear what you're clicking
browser_click(element: "Submit Order", ref: "e15")

# Less clear
browser_click(ref: "e15")
```

### 6. Clean Up When Done

```
browser_close()  # Free resources
```

---

## Example Scenarios

### Scenario 1: Complete Signup Form

**User request:** "Sign up for an account on example.com"

```
1. browser_navigate(url: "https://example.com/signup")
2. browser_snapshot()

3. browser_type(element: "Full Name", text: "John Doe", ref: "e3")
4. browser_type(element: "Email", text: "john@example.com", ref: "e5")
5. browser_type(element: "Password", text: "SecurePass123!", ref: "e7")
6. browser_type(element: "Confirm Password", text: "SecurePass123!", ref: "e9")

7. browser_click(element: "I agree to terms", ref: "e11")
8. browser_click(element: "Create Account", ref: "e13")

9. browser_wait(time: 3000)
10. browser_snapshot()  # Verify account created

11. browser_close()
```

### Scenario 2: Submit Contact Form

**User request:** "Send a message through the contact form"

```
1. browser_navigate(url: "https://example.com/contact")
2. browser_snapshot()

3. browser_type(element: "Name", text: "John Doe", ref: "e3")
4. browser_type(element: "Email", text: "john@example.com", ref: "e5")
5. browser_select_option(element: "Subject", values: ["General Inquiry"])
6. browser_type(element: "Message", text: "Hello, I have a question about...", ref: "e9")

7. browser_click(element: "Send Message", ref: "e11")

8. browser_wait(time: 2000)
9. browser_snapshot()  # Look for "Message sent" confirmation

10. browser_close()
```

### Scenario 3: E-commerce Checkout

**User request:** "Add item to cart and proceed to checkout"

```
1. browser_navigate(url: "https://shop.example.com/product/123")
2. browser_snapshot()

3. browser_select_option(element: "Size", values: ["Medium"])
4. browser_click(element: "Add to Cart", ref: "e10")

5. browser_wait(time: 2000)
6. browser_snapshot()

7. browser_click(element: "Checkout", ref: "e15")

8. browser_wait(time: 2000)
9. browser_snapshot()  # Checkout form

10. browser_type(element: "Email", text: "john@example.com", ref: "e20")
11. browser_type(element: "Address", text: "123 Main St", ref: "e22")
12. browser_type(element: "City", text: "San Francisco", ref: "e24")
13. browser_select_option(element: "State", values: ["California"])
14. browser_type(element: "ZIP", text: "94102", ref: "e28")

15. browser_click(element: "Continue to Payment", ref: "e30")

16. browser_wait(time: 2000)
17. browser_snapshot()  # Payment page

18. browser_close()
```

### Scenario 4: Search and Filter Results

**User request:** "Search for laptops and filter by price"

```
1. browser_navigate(url: "https://shop.example.com")
2. browser_snapshot()

3. browser_type(element: "Search", text: "laptop", ref: "e3")
4. browser_press_key(key: "Enter")

5. browser_wait(time: 2000)
6. browser_snapshot()

7. browser_click(element: "Price: Low to High", ref: "e15")
8. browser_wait(time: 1000)

9. browser_click(element: "$500 - $1000", ref: "e20")
10. browser_wait(time: 1000)

11. browser_snapshot()  # Filtered results

12. browser_close()
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Navigate | `browser_navigate(url: "URL")` |
| Get refs | `browser_snapshot()` |
| Click | `browser_click(element: "Name", ref: "eN")` |
| Type | `browser_type(element: "Name", text: "value", ref: "eN")` |
| Select | `browser_select_option(element: "Name", values: ["value"])` |
| Hover | `browser_hover(element: "Name", ref: "eN")` |
| Press key | `browser_press_key(key: "Enter")` |
| Upload | `browser_file_upload(paths: ["/path/to/file"])` |
| Dialog | `browser_handle_dialog(accept: true)` |
| Wait | `browser_wait(time: 2000)` |
| Screenshot | `browser_take_screenshot(filename: "name.png")` |
| Close | `browser_close()` |
