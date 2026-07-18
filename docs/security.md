# Security & Compliance Specification: LabCircle

## 1. Security Architecture
LabCircle operates in a highly regulated healthcare domain. The platform is designed with security-first patterns to ensure the confidentiality, integrity, and availability of all electronic Protected Health Information (ePHI) and Personal Data.

## 2. Compliance Frameworks

### 2.1 HIPAA (Health Insurance Portability and Accountability Act - US)
- **PHI Access Control:** Access to Patient Health Information (PHI) is limited strictly to authorized users based on role-based authentication (RBAC).
- **Audit Trails:** Logs all create, read, update, and delete actions on PHI records. Audit records cannot be modified or cleared by standard administrative roles.
- **Data Encryption:** Enforces TLS 1.3 in transit and AES-256 at rest (utilizing Firebase Cloud Storage/Firestore server-side encryption).

### 2.2 GDPR (General Data Protection Regulation - EU)
- **Consent Management:** Patients must explicitly consent to diagnostic reporting.
- **Right to Erasure (Right to be Forgotten):** Procedures to scrub patient identifiers while maintaining anonymous diagnostic records for lab auditing.
- **Data Portability:** Patient portal provides export options in standard JSON/PDF formats.

### 2.3 DPDP Act (Digital Personal Data Protection Act - India)
- **Data Fiduciary Responsibility:** LabCircle acting as/supporting Data Fiduciaries must process personal data only for lawful purposes with explicit, unambiguous consent.
- **Consent Manager Integration:** Facilitates consent revocation mechanisms and user access control dashboards.
- **Bilingual Consent Notice:** Support for clear notices outlining what data is collected and for what specific processing purpose.

## 3. Key Security Implementation Checklists
- [ ] Implement Row-Level/Document-Level security filters (e.g. Firestore Security Rules checking auth token role/uid).
- [ ] Enforce Multi-Factor Authentication (MFA) for administrative and medical staff roles.
- [ ] Schedule regular automated external penetration testing.
- [ ] Sanitize and encrypt PDF payloads during mail distribution pipelines.
