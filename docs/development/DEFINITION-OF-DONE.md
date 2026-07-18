# LabCircle Definition of Done (DoD)

This document establishes the official **Definition of Done (DoD)** and quality gates for the **LabCircle** codebase. Every task, ticket, or pull request (PR) must meet these verification criteria before being merged into the `main` branch.

---

## 1. Engineering Quality Gates Checklist

Before submitting a PR for review or marking a ticket as complete, verify the following gates:

### ✓ 1. Code Compilation and Builds
*   The application builds successfully without errors or warnings.
*   **Command:** Run `pnpm run build` from the monorepo root.

### ✓ 2. Linter Compliance (ESLint)
*   The codebase passes all static code analyzer checks. No bypass overrides (`eslint-disable` comments) are allowed unless explicitly justified.
*   **Command:** Run `pnpm run lint` from the monorepo root.

### ✓ 3. TypeScript Type Safety
*   The TypeScript compiler completes without type errors or unresolved compiler warnings.
*   The use of `any` is prohibited. All typings must be strict.
*   **Command:** Run `pnpm --filter web exec tsc --noEmit` to verify type safety.

### ✓ 4. Documentation Updated
*   Any schema modifications must be updated in the [05-firestore-data-model.md](file:///c:/Projects/LabCircle/docs/architecture/05-firestore-data-model.md).
*   API payload updates must be recorded in [07-api-contracts.md](file:///c:/Projects/LabCircle/docs/architecture/07-api-contracts.md).
*   Any newly introduced UX guidelines must be captured in the design system document.

### ✓ 5. Architectural Compliance
*   Database modifications follow denormalization and referencing rules defined in the Firebase Architecture Contract.
*   Next.js App Router folders use correct grouping layouts (e.g. `(modules)/` segments).
*   Separation of layout primitives and UI components is preserved.

### ✓ 6. No Console Errors or Warnings
*   Client and server consoles are clear of exceptions, react key warnings, and validation failures during execution.
*   Ensure that no debug `console.log` statements are leaked to the codebase.

### ✓ 7. Clean and Tree-shaken Code (No Unused Code)
*   Dead code, unused imports, empty methods, and abandoned variable declarations are removed.
*   Ensure that no temporary files or mock modules are committed to main directories.

### ✓ 8. Responsive UI Layouts
*   All UI screens must be verified against mobile viewport boundaries (down to 320px width) to guarantee mobile-first compliance.
*   Responsive grid margins adapt correctly to tablets and desktop monitors.

### ✓ 9. Accessibility Verification (WCAG AA)
*   Every interactive component incorporates proper semantic tags and aria-labels.
*   Form inputs carry clear `htmlFor` identifiers linked to input `id` attributes.
*   Color combinations are verified against AA contrast ratios (> 4.5:1).

### ✓ 10. Security and Compliance Review
*   Ensure that no clinical PHI or user PII is logged in consoles or plain text.
*   Ensure that database operations validate user consent fields (`consent_records`).
*   Ensure database read/write actions enforce custom role claims verification.
