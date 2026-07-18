# ADR-003: Mobile Phone OTP Authentication Strategy

*   **Status:** Accepted
*   **Date:** 2026-07-18
*   **Author:** AI Assistant / Senior Architect

---

## 1. Context
Preventive healthcare platforms in India serve mobile-first users. Requiring standard email-password signups introduces friction, reducing signups. Furthermore, phlebotomists in the field require fast, single-handed authorization on mobile interfaces.

## 2. Decision
We have decided to enforce **Firebase Auth Phone Number OTP** as the primary authentication strategy for patients and field collection executives. Emails and passwords will be reserved for lab technicians, pathologists, and administrators, with mandatory multi-factor authentication (MFA).

## 3. Consequences
*   **Pros:**
    *   Frictionless registration and login path on mobile interfaces.
    *   Authenticates active phone numbers natively, ensuring reliable contact details for home care collections.
    *   Significantly higher conversion rates for customer test bookings.
*   **Cons:**
    *   OTP verification incurs messaging fees (SMS routing costs under DLT guidelines).
    *   Requires fallbacks for network blackouts (offline emulation during development).
