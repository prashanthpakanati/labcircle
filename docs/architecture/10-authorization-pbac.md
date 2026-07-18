# Centralized Permission-Based Authorization (PBAC) Specification

This document details the **Permission-Based Access Control (PBAC)** architecture for the **LabCircle** platform. It defines how authorizations are decoupled from static user roles, allowing granular permission checks across all frontend components and backend services.

---

## 1. Design Philosophy

To ensure scalability and maintainability, application modules must **never** check user roles directly:

*   **Avoid:** `if (user.role === 'admin')`
*   **Enforce:** `if (can(user, 'users.manage'))`

By checking *what a user is allowed to do* (permissions) rather than *who they are* (roles), we centralize authorization rules in a single mapping. If permission rules change tomorrow, we update the central mapping rather than refactoring multiple components.

---

## 2. API Reference & Utilities

All authorization utilities are imported from `@/lib/auth/pbac`:

### `can(user, permission)`
Returns `true` if the user is authorized for the given permission.
```typescript
import { can } from "@/lib/auth/pbac";

if (can(user, "booking.create")) {
  // Allow checkout
}
```

### `hasRole(user, role)`
Specifically checks if the user possesses a role (reserved only for low-level system layouts or user administration forms).
```typescript
import { hasRole } from "@/lib/auth/pbac";

if (hasRole(user, "admin")) {
  // Render admin dashboard shell links
}
```

### `hasAnyPermission(user, [permission1, permission2])`
Returns `true` if the user has **at least one** of the listed permissions.
```typescript
import { hasAnyPermission } from "@/lib/auth/pbac";

const canInteract = hasAnyPermission(user, ["sample.collect", "sample.manage"]);
```

### `hasAllPermissions(user, [permission1, permission2])`
Returns `true` if the user holds **all** of the listed permissions.
```typescript
import { hasAllPermissions } from "@/lib/auth/pbac";

const isAuthorized = hasAllPermissions(user, ["reports.review", "reports.sign"]);
```

---

## 3. Integration Examples

### 3.1 Client-Side Component Guard
```tsx
"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { can } from "@/lib/auth/pbac";
import { Button } from "@/components/ui/button";

export function UploadReportButton() {
  const { user } = useAuth();

  // Decoupled from direct role checks
  if (!can(user, "reports.upload")) {
    return null;
  }

  return <Button onClick={handleUpload}>Upload Diagnostic PDF</Button>;
}
```

### 3.2 Next.js Server Action Protection
```typescript
"use server";

import { adminAuth } from "@/lib/firebase/server";
import { can } from "@/lib/auth/pbac";

export async function signDiagnosticReport(idToken: string, reportId: string) {
  // 1. Verify user token
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  
  // 2. Wrap token payload in PBAC structure
  const actor = { role: decodedToken.role || "patient" };

  // 3. Assert permission
  if (!can(actor, "reports.sign")) {
    throw new Error("Access Denied: Insufficient authorization to sign diagnostic reports.");
  }

  // 4. Perform database write operations...
}
```

---

## 4. Scaling the Permission Model

Adding new modules or business rules is straightforward:

1.  **Register Permission:** Open [permissions.ts](file:///c:/Projects/LabCircle/apps/web/src/lib/auth/permissions.ts) and add the key to `PERMISSIONS` (e.g., `MEMBERSHIP_MANAGE: "membership.manage"`).
2.  **Update Role Mapping:** Open [pbac.ts](file:///c:/Projects/LabCircle/apps/web/src/lib/auth/pbac.ts) and add the string literal to target roles under `ROLE_PERMISSIONS` (e.g., add `"membership.manage"` to `admin`).
3.  **Consume:** Query `can(user, "membership.manage")` directly inside your new component code.
