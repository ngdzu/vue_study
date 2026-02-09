# Quiz Answers: Snapshot & Visual Testing

## Question 1
**What do snapshot tests do?**

**Correct Answer**: B) Capture output and detect changes

**Explanation**: Snapshots save component output and automatically detect when output changes.

---

## Question 2
**When should you update snapshots?**

**Correct Answer**: B) Only intentional UI changes

**Explanation**: Update snapshots only when you intentionally changed the component and reviewed the changes.

---

## Question 3
**What's good for snapshot testing?**

**Correct Answer**: B) Complex component structures

**Explanation**: Snapshots are great for complex components where tracking all output manually would be tedious.

---

## Question 4
**What file stores snapshot?**

**Correct Answer**: B) .snap file

**Explanation**: Snapshot files are stored with `.snap` extension in `__snapshots__` folder.

---

## Question 5
**Should snapshots be committed to git?**

**Correct Answer**: B) Yes, review carefully

**Explanation**: Commit snapshots to git but review them carefully to catch unintended changes.

---

## Question 6
**What detects visual regressions?**

**Correct Answer**: C) Screenshot/visual testing

**Explanation**: Tools like Percy and Chromatic automatically detect visual changes by comparing screenshots.

---

## Question 7
**When should you NOT use snapshots?**

**Correct Answer**: B) Data that changes frequently

**Explanation**: Avoid snapshots for generated content (IDs, dates) or frequently changing data.

---

## Question 8
**What is visual regression?**

**Correct Answer**: B) Unintended visual changes

**Explanation**: Visual regression is when UI looks different than before, usually unintentionally.

---

## Question 9
**How do you update snapshots?**

**Correct Answer**: B) `npm run test -- -u`

**Explanation**: Pass `-u` flag to test runner to update snapshots: `npm run test -- -u`

---

## Question 10
**What's a false positive in snapshots?**

**Correct Answer**: B) Test failure on acceptable change

**Explanation**: A false positive is when a snapshot test fails on an acceptable/intentional change.
