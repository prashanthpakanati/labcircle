# ADR-001: Firebase Platform Selection

*   **Status:** Accepted
*   **Date:** 2026-07-18
*   **Author:** AI Assistant / Senior Architect

---

## 1. Context
LabCircle is an India-first preventive healthcare platform that requires real-time updates for home collection tracking, pathologist signature pipelines, and immediate notification routing. We need a backend architecture that allows fast prototyping, handles real-time synchronization, and complies with local data residency laws (data storage inside India).

## 2. Decision
We have decided to select **Firebase** (Firestore, Authentication, Cloud Functions, Storage, and Hosting) as our core backend platform for the MVP, run from the `asia-south1` (Mumbai) region.

## 3. Consequences
*   **Pros:**
    *   Frictionless real-time data sync for phlebotomist locations and report updates.
    *   No operational database overhead, accelerating launch speed.
    *   Robust local emulator tools for offline development, reducing cloud testing costs.
    *   Built-in document-level security rules matching granular access control (RBAC).
*   **Cons:**
    *   Vendor lock-in to Google Cloud Platform.
    *   Complex relational queries (analytical reporting) must be denormalized or exported.
    *   Cold starts on Cloud Functions may occasionally add latency.
