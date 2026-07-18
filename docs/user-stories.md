# User Stories & Acceptance Criteria: LabCircle

## US-101: Account Setup (Patient)
**As a** Patient,  
**I want to** register with my mobile number and confirm via OTP,  
**So that** I can access my diagnostics record securely.

### Acceptance Criteria:
- Must prompt for name, date of birth, biological sex, and contact details.
- OTP verification must expire after 5 minutes.
- Existing profiles with the same phone number should merge/restore history after validation.

---

## US-202: Recording Lab Results (Technician)
**As a** Lab Technician,  
**I want to** enter values for ordered tests in a template,  
**So that** the pathologist can review and sign them off.

### Acceptance Criteria:
- Data input fields must match the test configuration (e.g. numeric fields with unit suffixes).
- System must flag out-of-range values in red dynamically.
- Draft reports must be auto-saved every 30 seconds.

---

## US-303: Report Approval (Pathologist)
**As a** Pathologist,  
**I want to** review completed test values and click 'Approve & Sign',  
**So that** a secure PDF is generated and made visible to the patient.

### Acceptance Criteria:
- Signature image must be rendered on the generated PDF.
- A notification (SMS & Push) must fire immediately upon sign-off.
- The report status must toggle to `Completed` and lock from subsequent editing.
