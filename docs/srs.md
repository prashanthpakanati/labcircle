# Software Requirements Specification (SRS): LabCircle

## 1. Introduction
This document defines the functional and non-functional system requirements for the LabCircle platform.

## 2. System Architecture
LabCircle is a hybrid Cloud platform using a monorepo structure.
- **Frontend:** Single Page Application (SPA) built with Next.js/React.
- **Backend:** Node.js/Express or NestJS API microservice layer.
- **Database & Hosting:** Firebase (Firestore NoSQL, Cloud Storage, Authentication, Cloud Functions).

## 3. Functional Requirements
### RF-1: Authentication & Authorization
- Users must login via Phone OTP or Email/Password.
- Roles: `patient`, `technician`, `pathologist`, `admin`, `doctor`.
- RBAC (Role-Based Access Control) enforced at API and DB layers.

### RF-2: Catalog Management
- Admins can manage a catalog of tests: Test Name, Code (e.g. LOINC), Normal Ranges (age/gender dependent).

### RF-3: Report Generation
- Pathologists can sign off on reports, triggering PDF compilation.
- PDFs are stored in secured Firebase Storage buckets.

## 4. External Interface Requirements
- **Hardware Integration:** Barcode scanner inputs for sample registration.
- **Email/SMS Gateway:** Twilio/SendGrid integration for alerts on test completions.

## 5. Security & Reliability
- Enforced HTTPS-only connections.
- AES-256 encryption at rest (native cloud mechanisms).
- Database backup schedules (daily automated snapshotting).
