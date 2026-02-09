# Lesson 7.6: Snapshot & Visual Testing

## Overview

Snapshot testing captures component output and compares against future test runs. Visual testing detects unintended UI changes. These detect regressions automatically.

By the end of this lesson, you'll be able to:
- Write snapshot tests for components
- Manage snapshot updates
- Use visual regression testing
- Detect unintended UI changes
- Best practices for snapshot testing

---

## Snapshot Testing

Snapshot tests save component output and fail if it changes.

### Creating Snapshots

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from './Button.vue';

describe('Button', () => {
  it('should match snapshot', () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
```

First run creates `Button.vue.snap` file with saved output.

### Updating Snapshots

When you intentionally change UI:

```bash
npm run test -- -u  # Update snapshots
```

Review changes carefully before updating!

---

## When to Use Snapshots

### ✅ Good Use Cases
- Complex component structures
- Forms with many fields
- Detecting accidental changes
- Regression detection

### ❌ Avoid For
- Testing logic (use regular assertions)
- Data that changes frequently
- Large rendered outputs
- Generated content (IDs, dates)

---

## Visual Regression Testing

Test tools like Percy or Chromatic capture screenshots and detect visual changes.

```bash
# Example with Percy
npm install -D @percy/cli @percy/cypress
```

---

## Best Practices

1. Review snapshot changes carefully
2. Commit snapshots to git
3. Use alongside other tests
4. Don't snapshot everything
5. Keep snapshots focused

---

## Key Takeaways

1. ✅ Snapshots detect unintended changes
2. ✅ Review changes before updating
3. ✅ Use for complex components
4. ✅ Combine with other testing types
5. ✅ Commit snapshots to version control

---

## Next Steps

- Complete the exercises
- Build the sample project
- Take the quiz
