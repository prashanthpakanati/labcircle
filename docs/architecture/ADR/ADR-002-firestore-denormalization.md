# ADR-002: Firestore Data Denormalization Strategy

*   **Status:** Accepted
*   **Date:** 2026-07-18
*   **Author:** AI Assistant / Senior Architect

---

## 1. Context
Firestore is a NoSQL document database. Performing joins across multiple root collections (e.g. querying an order, fetching the patient details, and loading the lab branch name) at runtime can result in high read amplification, increasing API latency and billing costs.

## 2. Decision
We have decided to selectively denormalize static or semi-static fields (e.g., patient name, lab branch title, and test descriptions) directly on the transaction documents (`/orders`, `/bookings`).

## 3. Consequences
*   **Pros:**
    *   Optimizes query performance by reducing the number of document reads to a single fetch (O(1) read).
    *   Simplifies client-side list views (e.g., lab technician dashboards can render names without secondary queries).
*   **Cons:**
    *   Data updates to primary records (e.g., a patient changes their name) require background Cloud Functions to sync the changes across historical orders.
    *   Slightly increased storage footprint in Firestore, though storage costs are negligible compared to document read operations.
