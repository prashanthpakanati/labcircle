# Technical Debt & Architecture Roadmap: Provider Offering Domain

This document outlines known limitations, architectural trade-offs, and future design strategies for the Provider Offering domain within LabCircle.

---

## 1. Uniqueness Strategy & Firestore Concurrency

### Current Implementation
- Uniqueness for `(providerLocationId + diagnosticServiceId)` is enforced via a pre-creation `getDocs()` query in `ProviderOfferingRepository.existsDuplicate()`.
- Soft-deleted (`deletedAt != null`) and `Archived` offerings are ignored, allowing an offering to be re-created if a prior instance was archived or deleted.

### Known Limitations
- Client-side Firestore transactions only accept `DocumentReference` objects (i.e. `getDoc`), and **cannot execute collection queries (`getDocs`) atomically within a transaction**.
- Under high concurrent creation requests for the exact same location and service pair, a race condition could theoretically permit duplicate active documents.

### Future Uniqueness Strategy
1. **Deterministic Document ID**: Change the Firestore document ID from auto-generated UUIDs to a deterministic composite key: `${providerLocationId}_${diagnosticServiceId}`.
   - Enables direct transactional `getDoc(docRef)` checks inside `runTransaction()`.
2. **Backend API / Cloud Function Guards**: Move creation endpoints to a transactional server-side API (e.g. Firebase Admin SDK / Next.js Server Action) where Firestore admin transactions support atomic uniqueness guarantees.

---

## 2. Service Catalog & Service Picker Integration

### Current Implementation
- `NewOfferingPage` uses a temporary `PLACEHOLDER_SERVICE_ID` for testing and development.
- Denormalized snapshot fields (`serviceName`, `serviceCode`, `categoryId`) are supplied manually or via placeholder values.

### Future Strategy
- Create a dedicated modal/combobox component to browse and search the Diagnostic Service Catalog (`/imaging/services` and blood collection test master).
- Selecting a service will auto-populate `diagnosticServiceId` along with the parent snapshot (`serviceName`, `serviceCode`, `categoryId`) before form submission.

---

## 3. Denormalized Metadata Synchronization

### Current Implementation
- Parent entity attributes (`providerBrandName`, `providerName`, `providerCode`, `serviceName`, `serviceCode`, `categoryId`) are denormalized and stored directly on the `ProviderOffering` document to support fast single-collection queries.

### Future Strategy
- Implement event-driven background sync (via Firestore Cloud Functions / Event Bus):
  - When a `Provider` updates `brandName` or `legalName`, publish a batch update to all associated `provider_offerings`.
  - When a `DiagnosticService` updates its `name` or `code`, sync the changes down to related offerings and regenerate their `searchKeywords`.

---

## 4. Metadata Bag Usage (`metadata?: Record<string, unknown>`)

### Current Implementation
- The `ProviderOffering` interface reserves a generic `metadata` field, but it is currently unpopulated in UI forms and standard repositories.

### Future Strategy
- Use `metadata` to store domain-specific extension parameters without altering the core schema, such as:
  - Special preparation instructions (e.g. 12-hour fasting requirement).
  - Machine specs or scanner model information (e.g. 3.0 Tesla MRI scanner).
  - External LIS/RIS integration codes.

---

## 5. Pricing Engine Expansion

### Current Implementation
- Offers a `PriceConfiguration` object supporting `mrp`, `sellingPrice`, optional `memberPrice`, and `offerPrice`.

### Future Strategy
- Expand into a full dynamic pricing engine supporting:
  - Corporate contract rate cards (`corporatePricing: Record<corporateId, number>`).
  - Tiered membership pricing based on user subscription levels.
  - Time-windowed promotional discounts with valid-from and valid-to timestamps.

---

## 6. Firestore Index Optimization

### Current & Recommended Indexes
1. `providerLocationId` + `status` + `displayOrder` (Optimizes admin listing & reordering views).
2. `providerLocationId` + `diagnosticServiceId` + `status` (Optimizes duplicate prevention checks).
3. `searchKeywords` (Array-contains-any index for catalog keyword searching).
4. `priceConfiguration.sellingPrice` (Enables range filtering for patient marketplace).

All composite index definitions should be added to `firestore.indexes.json` prior to deployment.
