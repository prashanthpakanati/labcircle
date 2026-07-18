# Authentication & Authorization Architecture Specification

This document details the official **Authentication and Authorization Architecture** of the **LabCircle** preventive healthcare platform, specifying the mechanisms for identity verification, session handling, and Role-Based Access Control (RBAC).

---

## 1. Authentication Strategy

LabCircle uses a hybrid authentication model designed for Indian mobile-first users:

*   **Primary Channel (Patients & Phlebotomists):** Firebase Authentication Phone OTP. 
    *   Frictionless mobile sign-up and login using SMS OTP codes.
    *   Acts as a verified verification of customer identity, satisfying DPDP verification rules.
*   **Secondary Channel (Lab Technicians, Pathologists, Admins):** Email and Password with mandatory Multi-Factor Authentication (MFA) via SMS/Authenticator.
    *   MFA is enforced using Firebase Auth MFA triggers for all administrative/clinical access points.

---

## 2. Role-Based Access Control (RBAC) Infrastructure

User access boundaries are secured at the authentication layer using Firebase Custom Claims.

### 2.1 Claims Structure
When a user signs in, their ID Token contains claims mapped directly to their system role:

```json
{
  "role": "patient | phlebotomist | lab_technician | pathologist | admin",
  "associationId": "branch_123_uuid"
}
```

*   `role`: Direct access level mapping.
*   `associationId`: Links staff to specific branches (e.g. restricts a lab technician to query orders for their physical branch only).

### 2.2 Claims Injection Trigger (Cloud Functions)
Claims are set by a secure 2nd Gen Cloud Function:
*   Fires when a user record is registered or modified by an admin.
*   Interacts with the Admin SDK `adminAuth.setCustomUserClaims(uid, { role, associationId })`.
*   Forces client token re-auth when roles change.

---

## 3. Client-Side Integration

Client-side session monitoring and token tracking are handled through React Context.

```text
  [ Firebase Auth State Changed ]
                 │
                 ▼
     [ Fetch ID Token Result ] ──► Extracts Custom Claims
                 │
                 ▼
        [ Update useAuth() ] ──► User UID, Phone, Email, Role, associationId
```

*   **`AuthProvider`:** A client wrapper surrounding the Next.js root layout. Listens to `onAuthStateChanged` and resolves custom role claims using `getIdTokenResult(user, true)`.
*   **`useAuth()`:** A custom React Hook to query current session states.
*   **`ProtectedRoute`:** Guard components enclosing restricted modules, redirecting users if authorization criteria are not met.

---

## 4. Server-Side Integration

To secure Next.js Server Actions and Route Handlers, the Firebase Admin SDK verifies session validity before executing database transactions.

### 4.1 Token Verification Workflow
1.  The client sends the ID Token inside the `Authorization: Bearer <token>` header or as a secure HTTP-Only cookie.
2.  The Server Action calls `adminAuth.verifyIdToken(token)`.
3.  The decoded token contains the custom claims which are evaluated to determine access.

### 4.2 Server Action Guards Template
```typescript
import { adminAuth } from "@/lib/firebase/server";

export async function verifyServerAccess(idToken: string, allowedRoles: string[]) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userRole = decodedToken.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new Error("Unauthorized: Insufficient permissions.");
    }
    return decodedToken;
  } catch (error) {
    throw new Error("Authentication failed.");
  }
}
```

---

## 5. Security and Session Lifecycle

*   **Token Refresh:** Firebase ID tokens expire automatically after 1 hour. The Firebase Web SDK handles token refreshes automatically in the background.
*   **Token Revocation:** If a device is reported lost or a staff member is terminated:
    1.  Call `adminAuth.revokeRefreshTokens(uid)`.
    2.  This updates `tokensValidAfterTime` on the user profile, causing subsequent API token verification checks on the server to fail.
*   **Audit Logging:** All successful and failed authentication attempts are logged directly to the `/audit_logs` database collection.
