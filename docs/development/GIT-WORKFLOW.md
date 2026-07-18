# LabCircle Git Workflow and Branching Strategy

This document outlines the branching strategy, commit message standards, Pull Request (PR) templates, merge policies, and release workflows for **LabCircle**.

---

## 1. Branch Strategy

LabCircle uses a trunk-based development strategy with short-lived feature branches:

*   **Trunk Branch (`main`):** The source of truth. The code in `main` is always production-ready, passes all CI checks, and is automatically deployed to staging/production on merge.
*   **Feature/Bugfix Branches:** Branched off `main`. Short-lived (1-3 days maximum).
    *   *Naming Convention:*
        *   Features: `feat/issue-number-short-description` (e.g. `feat/lc-42-patient-auth`)
        *   Bugfixes: `fix/issue-number-short-description` (e.g. `fix/lc-99-otp-timeout`)
        *   Refactoring: `refactor/short-description` (e.g. `refactor/design-system-button`)
        *   Documentation: `docs/short-description` (e.g. `docs/git-workflow`)

---

## 2. Commit Message Conventions

We adhere strictly to **Conventional Commits 1.0.0**. Every commit must be structured with a type, scope, and description:

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 2.1 Commit Types
*   **`feat`:** A new business feature (e.g., `feat(auth): implement phone OTP verification`).
*   **`fix`:** A bug fix (e.g., `fix(ui): adjust metric card padding on mobile viewports`).
*   **`docs`:** Documentation changes only (e.g., `docs(dev): write coding standards specifications`).
*   **`style`:** Changes that do not affect the meaning of the code (formatting, white-space, formatting check).
*   **`refactor`:** A code change that neither fixes a bug nor adds a feature (e.g., `refactor(ui): extract card sub-elements`).
*   **`perf`:** A code change that improves performance (e.g., `perf(firestore): add query index configurations`).
*   **`test`:** Adding missing tests or correcting existing tests (e.g., `test(rules): add rules unit tests for reports`).
*   **`chore`:** Updates to build pipelines, auxiliary tools, and libraries (e.g., `chore(deps): update next version`).

---

## 3. Pull Request Template

When creating a PR to merge into `main`, copy the following template into the description:

```markdown
## Description
<!-- Provide a clear description of the changes introduced by this PR and the ticket ID reference. -->
Resolves: #LC-

## Definition of Done (DoD) Checklist
- [ ] Code builds successfully (`pnpm run build`)
- [ ] No ESLint warnings or errors (`pnpm run lint`)
- [ ] Typecheck passes successfully (`tsc --noEmit`)
- [ ] Documentation has been updated (schemas, contracts, etc.)
- [ ] UI is responsive across viewport sizes down to 320px
- [ ] Accessibility check completed (WCAG AA labels and semantic tags)
- [ ] Security review passed (No PII/PHI logged)

## Verification Steps
<!-- Describe the steps to verify these changes locally or in emulator environments. -->
1. Run local emulator: `pnpm run firebase:dev`
2. Launch client app: `pnpm run dev`
3. Verify steps...
```

---

## 4. Merge Policy

*   **Branch Protection:** Direct commits to `main` are blocked. All additions must arrive via a Pull Request.
*   **Approval Gates:** At least one peer engineering approval is required.
*   **CI Pipeline:** All GitHub Actions checks (build, lint, typecheck, rules unit tests) must pass before a merge can be completed.
*   **Merge Method:** **Squash and Merge**. This keeps the git history of the `main` branch flat and clean, squashing feature commits into a single conventional commit on the trunk.

---

## 5. Release Process

1.  **Trunk Deployment:** Merging a PR into `main` triggers the CD release pipeline to build client assets and deploy to `labcircle-prod`.
2.  **Versioning:** Releases are tagged using Semantic Versioning (SemVer) (e.g., `v1.2.0`) triggered by GitHub Release tags.

---

## 6. Hotfix Process

When a critical bug is detected in production:
1.  Branch directly off the latest stable release tag: `hotfix/vX.Y.Z-issue-description`.
2.  Implement the fix locally, test it using the Firebase Emulator, and verify against the Definition of Done.
3.  Open a PR targeting the `main` branch.
4.  Once merged and verified on staging, the code is deployed immediately to production, and a new minor tag is minted (e.g., `v1.2.1`).
