# Product Requirements Document (PRD): LabCircle

## 1. Goal & Context
To design and build a multi-tenant laboratory workspace web app and patient portal that enables seamless test ordering, tracking, verification, and PDF/online reporting.

## 2. Target Audience
- **Lab Admin / Pathologist:** High control panel access for creating tests, templates, and signing reports.
- **Lab Technician:** Operational view for recording results, logging sample receipts, and updating queues.
- **Patient:** Read-only portal for downloading reports, booking tests, and viewing trends.

## 3. Product Features & Requirements
### Epic 1: Lab Management Panel
- Lab profile configuration (branches, services, doctor names).
- Test catalog management (ranges, units, pricing).

### Epic 2: Order & Sample Tracking
- Barcode/QR generation for sample collection tubes.
- Live status pipeline: `Ordered` -> `Collected` -> `In-Lab` -> `Processing` -> `Report-Draft` -> `Signed-Off`.

### Epic 3: Smart Reporting
- Dynamic form templates matching specific test configurations.
- Automatic PDF generator with digitized signatures of pathologists.

### Epic 4: Patient Dashboard
- Authenticated portal showing past and pending tests.
- Longitudinal graphing of biomarkers (e.g., Hemoglobin levels over time).

## 4. Non-Functional Requirements
- **Data Latency:** Data sync between laboratory inputs and patient app must be near real-time.
- **Regulatory Integrity:** End-to-end encryption for all patient medical data in transit and at rest.
