# LabCircle Healthcare Platform

Welcome to the **LabCircle** monorepo. LabCircle is a production-grade healthcare platform designed to streamline diagnostic workflows, facilitate seamless communication between laboratories, clinic systems, and patients, and provide secure, reliable medical reporting.

## Project Structure

This project is organized as a monorepo managed with `pnpm` workspaces:

```text
LabCircle/
├── apps/                        # Main deployable applications
│   ├── backend/                 # Backend API services
│   └── frontend/                # Frontend client web application (Next.js/React)
├── assets/                      # Static assets, branding logos, design templates
├── docs/                        # Platform documentation (Product Vision, BRD, PRD, SRS, etc.)
├── firebase/                    # Firebase Cloud Configuration (Firestore, Storage, Rules)
├── packages/                    # Shared internal packages
│   ├── config-eslint/           # Shared ESLint styling rules
│   ├── config-typescript/       # Standard TypeScript configurations
│   └── types/                   # Shared TypeScript models and Zod validations
└── scripts/                     # Automation, seeding, and local tools
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (v8 or higher recommended)
- [Firebase CLI](https://firebase.google.com/docs/cli) (for deployment and local emulator testing)

### Installation

Clone the repository and install all dependencies:

```bash
pnpm install
```

### Running Locally

To start the local development environments (both frontend and backend) in parallel:

```bash
pnpm dev
```

To run the Firebase local emulator:

```bash
pnpm firebase:dev
```

## Compliance & Security

LabCircle is a healthcare application and is designed to adhere to:
- **HIPAA** (Health Insurance Portability and Accountability Act) for PHI protection.
- **GDPR** (General Data Protection Regulation) for user data privacy.
- **DPDP Act** (Digital Personal Data Protection Act, India) for compliance with Indian privacy laws.

For details, refer to the [docs/security.md](file:///c:/Projects/LabCircle/docs/security.md) documentation.

## Documentation Reference

All core architectural and product documents are located under the `docs/` folder:
- [Product Vision](file:///c:/Projects/LabCircle/docs/product-vision.md)
- [Business Requirements Document (BRD)](file:///c:/Projects/LabCircle/docs/brd.md)
- [Product Requirements Document (PRD)](file:///c:/Projects/LabCircle/docs/prd.md)
- [Software Requirements Specification (SRS)](file:///c:/Projects/LabCircle/docs/srs.md)
- [User Stories & Acceptance Criteria](file:///c:/Projects/LabCircle/docs/user-stories.md)
- [Database Design](file:///c:/Projects/LabCircle/docs/database-design.md)
- [API Specification](file:///c:/Projects/LabCircle/docs/api-specification.md)
- [Firestore Schema Specifications](file:///c:/Projects/LabCircle/docs/firestore-schema.md)
- [UI/UX Specification](file:///c:/Projects/LabCircle/docs/ui-ux-specification.md)
- [Security & Compliance Specification](file:///c:/Projects/LabCircle/docs/security.md)
- [Deployment & Operations Guide](file:///c:/Projects/LabCircle/docs/deployment-guide.md)
