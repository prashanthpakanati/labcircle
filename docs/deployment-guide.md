# Deployment & Infrastructure Guide: LabCircle

## 1. Local Development Environment
To start the local emulators and dev servers:
1. Install global dependencies: `pnpm install`
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Launch local environment: `pnpm dev`
4. Access Firebase Emulator UI at `http://localhost:4000`

## 2. CI/CD Pipeline Configuration
We use GitHub Actions to automate checks and deployments:
- **Pull Request Checks:** Triggers unit tests, ESLint, TypeScript verification compile checks on `apps/frontend`, `apps/backend`, and `packages/types`.
- **Merge to Main:** Auto-deploys frontend to Firebase Hosting, backend services to Cloud Run/Functions, and applies Firestore rules updates.

## 3. Staging and Production Environments
LabCircle is deployed across multi-stage Firebase projects:
- **Staging Project:** `labcircle-staging`
- **Production Project:** `labcircle-prod`

### Rule Deployments
Deploy Firestore/Storage rules manually from the root:
```bash
# Set active project
firebase use labcircle-prod

# Deploy rules only
firebase deploy --only firestore:rules,storage:rules
```

### Application Deployments
Frontend and backend builds must go through isolated Docker container builds or direct Firebase hosting deploys via CI workflows.
