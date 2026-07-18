# LabCircle Code Quality and Development Standards

This document establishes the official code quality and architectural standards for the **LabCircle** codebase. All engineers must adhere to these guidelines to ensure consistency, legibility, accessibility, and performance.

---

## 1. Folder Structure and Conventions

```text
web/
├── public/                 # Static assets, branding files
└── src/
    ├── app/                # Next.js App Router (Layouts, Pages, Actions)
    │   ├── (modules)/      # Business modules (billing, diagnostics, etc.)
    │   └── api/            # API Route Handlers
    ├── components/         # Reusable UI elements
    │   ├── layout/         # Grid, Sidebar, TopNav primitives
    │   └── ui/             # Atomic components (button, card, input)
    ├── hooks/              # Custom React hooks (useAuth, useLocalStorage)
    ├── lib/                # Config files and service layers (firebase, utils)
    └── types/              # Local TypeScript models and interfaces
```

---

## 2. File and Component Naming

*   **React Components:** `PascalCase` (e.g. `MetricCard.tsx`, `Sidebar.tsx`).
*   **Custom Hooks:** `camelCase` starting with "use" (e.g. `useAuth.ts`, `useAddresses.ts`).
*   **API & Route Handlers:** `route.ts`, `layout.tsx`, `page.tsx` (standard Next.js names).
*   **Helper and Utilities:** `kebab-case` (e.g. `firestore-service.ts`, `rbac-guards.ts`).
*   **Styles & Configurations:** `kebab-case` (e.g. `globals.css`, `eslint.config.mjs`).

---

## 3. TypeScript Guidelines

*   **Strict Compiler Flags:** Enforce `"strict": true` and `"noImplicitAny": true`.
*   **Type Declarations:**
    *   Use `interface` for components props and public APIs (extensible).
    *   Use `type` for unions, intersections, and mapping aliases.
*   **Avoid Any:** The use of `any` is strictly prohibited. If a type is unknown at compile-time, utilize `unknown` and perform type-narrowing using type guards or Zod validation schemas.
*   **Generic Safety:** Use generics explicitly in fetch functions (e.g. `async function fetchData<T>()`).

---

## 4. React 19 Patterns

*   **Server Actions:** Group operations within async actions under a `"use server"` boundary. Always return structured status shapes: `{ success: boolean, data?: T, error?: string }`.
*   **Refs Handling:** Avoid obsolete patterns. Directly pass `ref` to component callbacks without using deprecated wrappers.
*   **Client State:** Utilize the `useActionState` hook for managing form inputs and pending states during database writes.

---

## 5. Server vs. Client Components

*   **Default Mode:** All components are Next.js Server Components (RSC) by default to improve initial paint performance and reduce JS bundle sizes.
*   **When to use Client Components (`"use client"`):**
    *   Using React hooks (`useState`, `useEffect`, `useContext`).
    *   Interacting with Browser APIs (e.g., geolocations, window event listeners).
    *   Using interactive third-party client components.
*   **Boundary Separation:** Keep the client boundary leaf-level. Pass static structures or React children from server components into client layouts.

---

## 6. Firestore Coding Conventions

*   **Collections:** Plural, snake_case (e.g., `consent_records`, `ecg_reports`).
*   **Documents & Fields:** `camelCase` (e.g. `primaryUserUid`, `abhaAddress`).
*   **Timestamps:** Always save native Firestore `Timestamp` objects. End variable names with the suffix `At` (e.g., `createdAt`, `signedAt`). Do not use epoch integers.
*   **References:** Store references as plain string IDs (e.g. `patientId: "pat_123"`) instead of `DocumentReference` objects.

---

## 7. Error Handling & Recovery

*   **Client Boundaries:** Use Next.js `error.tsx` boundary handlers to catch runtime render crashes.
*   **Server Actions:** Wrap operations in `try-catch` blocks. Log technical errors to telemetry platforms and return clean, friendly messages to users.
*   **Form Errors:** Link error returns to individual input fields using localized validators (Zod schemas).

---

## 8. Logging and Telemetry

*   **Console Restriction:** `console.log` statements are banned in production code. Use a custom logger utility.
*   **Security Restrictions:** Never print Protected Health Information (PHI) or Personally Identifiable Information (PII) to system consoles, Cloud Run logs, or Google Cloud Operations registries to prevent data leakage.
*   **Performance Tracking:** Measure slow API transactions using Firebase Performance logs.

---

## 9. Code Styling & Import Ordering

Enforce import order using standard plugins:

1.  React and core libraries (e.g., `import React from 'react'`).
2.  Third-party packages (e.g., `import { initializeApp } from 'firebase/app'`).
3.  Absolute path aliases (`@/*` internal paths).
4.  Relative files (e.g., `import { cn } from '../utils'`).

---

## 10. Async Guidelines

*   Always use `async/await` in place of `.then()/.catch()` callbacks to improve readability.
*   Manage concurrent async requests using `Promise.all` or `Promise.allSettled` to prevent network call blocking.

---

## 11. Documentation & Comments Policy

*   **Self-documenting Code:** Prioritize writing clean, descriptive function and variable names over adding long inline comments.
*   **Rationale Comments:** Explain *why* something is implemented in a specific way, not *what* the code does.
*   **JSDoc:** Exported components and utility modules must contain basic JSDoc block comments detailing properties and expectations.

---

## 12. Testing Conventions

*   **Unit Tests:** Vitest files live alongside components using `.test.ts` or `.test.tsx` extensions.
*   **Rules Testing:** Firebase Firestore and Storage security rules are tested using local emulators and `@firebase/rules-unit-testing`.
*   **Mock Dependencies:** Avoid running integrations tests against live cloud databases; mock external API endpoints (Razorpay checkouts, ABDM sandbox validation gateways).
