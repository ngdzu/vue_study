# Lesson 7.5: Performance Testing

## Overview

Performance testing ensures your Vue application meets speed and efficiency requirements. This includes measuring load times, rendering performance, bundle size, and Core Web Vitals.

By the end of this lesson, you'll be able to:
- Measure page load performance
- Test rendering performance
- Analyze bundle size
- Optimize code based on metrics
- Use Lighthouse and Web Vitals
- Identify performance bottlenecks

---

## Why Performance Testing Matters

- **User Experience**: Fast apps feel responsive
- **SEO**: Google ranks fast sites higher
- **Conversions**: Slow sites lose users
- **Accessibility**: Slower devices matter

---

## Core Web Vitals

Google's three key metrics for user experience:

### Largest Contentful Paint (LCP)
- **What**: Time when largest content element renders
- **Target**: < 2.5 seconds
- **Measure**: Network latency, resource load time, rendering time

### First Input Delay (FID) / Interaction to Next Paint (INP)
- **What**: Time from user input to response
- **Target**: < 100ms
- **Measure**: JavaScript blocking thread

### Cumulative Layout Shift (CLS)
- **What**: Unexpected layout changes
- **Target**: < 0.1
- **Measure**: Prevent unsized images, dynamic content

---

## Performance Measurement

### Lighthouse

```bash
npm install -D @lhci/cli @lhci/core
```

Generate report:
```bash
lhci collect
lhci upload
lhci assert
```

### Bundle Analysis

```bash
npm install -D rollup-plugin-visualizer
```

In vite.config.ts:
```ts
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [vue(), visualizer()],
};
```

Build and view `dist/stats.html`

---

## Performance Best Practices

1. **Code Splitting**: Lazy load routes and components
2. **Image Optimization**: Use WebP, compress images
3. **Minification**: Enable in production builds
4. **Caching**: Set long-lived cache headers
5. **Monitoring**: Track metrics over time

---

## Key Takeaways

1. ✅ Measure Core Web Vitals
2. ✅ Use Lighthouse for audits
3. ✅ Analyze bundle size
4. ✅ Optimize load time
5. ✅ Monitor over time

---

## Next Steps

- Complete the exercises
- Build the sample project
- Take the quiz
