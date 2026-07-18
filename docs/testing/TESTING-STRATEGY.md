# LabCircle Verification and Testing Strategy

This document establishes the official **Testing Strategy** for the **LabCircle** platform, guiding developers on unit, integration, emulator, rules, and end-to-end (E2E) verification procedures.

---

## 1. Testing Hierarchy

To maintain high development velocity and prevent regression errors, the testing pyramid is structured as follows:

```text
       /\
      /  \      E2E Tests (Playwright)         -> Critical User Journeys (10%)
     /----\
    /      \    Integration (Rules & Emulators)-> DB Operations & RBAC Rules (30%)
   /--------\
  /          \  Unit & Component (Vitest)      -> Logic, Helpers, and atomic UI (60%)
 /------------\
```

---

## 2. Unit Testing
*   **Focus:** Pure functions, date formatting utilities, conversion math, Zod schemas, and data validators.
*   **Framework:** `Vitest` and `@testing-library/react`.
*   **Location:** Spec files sit adjacent to target units (e.g., `format-date.test.ts` resides in the same directory as `format-date.ts`).
*   **Strategy:** Verify both edge cases and default configurations (e.g., test input validations with extreme values, correct parsing of empty payloads).

---

## 3. Component Testing
*   **Focus:** Core atomic UI components (Buttons, Inputs, Metric Cards, Health Display widgets).
*   **Framework:** `Vitest` with React Testing Library.
*   **Strategy:** 
    *   Verify correct render mappings of HTML elements and CSS state selectors.
    *   Assert that click handlers and input callbacks fire correctly.
    *   Test state boundaries (e.g. verifying that a loading state displays the spinner and disables buttons).
    *   Validate screen reader accessibility mappings (role and aria-label verification).

---

## 4. Integration Testing
*   **Focus:** Communication between Next.js Client modules, Server Actions, and Firestore service layers.
*   **Strategy:** Verify that database writes and reads translate correctly through the Firestore Web SDK. These tests run directly against the local Firebase emulator suite.

---

## 5. Firebase Emulator Testing
*   **Focus:** Mocking Authentication, Firestore collections, GCS storage buckets, and event-triggered Cloud Functions in an offline environment.
*   **Command:** Run the local emulator suite using `pnpm run firebase:dev`.
*   **Strategy:** Seed base diagnostic test catalogs and user profiles inside the emulator before verifying UI integrations, keeping development decoupled from production cloud instances.

---

## 6. Authentication Testing
*   **Focus:** Registration, phone OTP login simulations, custom claims mappings, and session token updates.
*   **Strategy:** Use the Firebase Auth Emulator API to mock verification verification codes, simulating successful and failed authentication outcomes.

---

## 7. Firestore Security Rules Testing
*   **Focus:** Granular verification of path-based read/write access.
*   **Framework:** `@firebase/rules-unit-testing`.
*   **Strategy:** Implement rule unit tests that assert:
    *   Patients can read only their own documents in `/patients` and `/reports`.
    *   Unauthenticated read attempts on secure collections are blocked.
    *   Pathologists can modify `/reports` only if their Custom Token Claim contains `role == 'pathologist'`.
    *   Technicians can only write to `/reports` if their branch ID maps to the target document branch ID.

---

## 8. End-to-End (E2E) Testing
*   **Focus:** Multi-role transactions mapping booking, sample collection, reporting, and patient notifications.
*   **Framework:** `Playwright`.
*   **Strategy:** Verify primary critical workflows:
    1.  *Patient Checkout:* OTP authentication, slot selection, and Razorpay checkout checkout.
    2.  *Phlebotomist Journey:* Home collection assignment checks, barcode uploads, and transit handoffs.
    3.  *Pathologist Sign-off:* Ingesting results, signing documents, compiling PDFs, and verifying patient notification delivery.

---

## 9. Pre-Release Quality Checklist

Before deploying changes to staging or production:

1.  **Branch Check:** Working branch is updated and clean (`git status`).
2.  **Lint Check:** Static analysis passes (`pnpm run lint`).
3.  **Type Check:** TypeScript type check compiles successfully (`tsc --noEmit`).
4.  **Local Unit Tests:** Run all Vitest specs (`pnpm run test`).
5.  **Rules Verification:** Ensure security rules tests pass.
6.  **Production Compile:** Next.js build compilation finishes successfully (`pnpm run build`).
7.  **Documentation Sync:** All data schema modifications are noted in `05-firestore-data-model.md`.
