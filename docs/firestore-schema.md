# Firestore Schema & Security Rules: LabCircle

## 1. Overview
This document outlines the schema design (collections, subcollections, fields, types) and indexing guidelines for the LabCircle Firestore database.

## 2. Collection Layout

### 2.1 `/users` Collection (Root)
Stores general user profiles and user system roles.
- `id` (Document ID) -> Matches Auth UID
- `email`: string
- `displayName`: string
- `role`: string (`patient` | `lab_staff` | `pathologist` | `admin`)
- `createdAt`: timestamp

### 2.2 `/labs` Collection (Root)
- `id` (Document ID)
- `name`: string
- `address`: string
- `licenseNumber`: string
- `contactPhone`: string

### 2.3 `/orders` Collection (Root)
- `id` (Document ID)
- `patientId`: string (Ref to `/users/{uid}`)
- `labId`: string (Ref to `/labs/{id}`)
- `status`: string (`ordered` | `collected` | `processing` | `completed`)
- `tests`: array of strings
- `createdTime`: timestamp
- `updatedTime`: timestamp

### 2.4 `/reports` Collection (Root)
- `id` (Document ID)
- `orderId`: string (Ref to `/orders/{id}`)
- `patientId`: string (Ref to `/users/{uid}`)
- `labId`: string (Ref to `/labs/{id}`)
- `results`: map
  - `hemoglobin`: number
  - `whiteBloodCells`: number
- `pathologistSignatureUrl`: string
- `pdfUrl`: string
- `approvedAt`: timestamp

## 3. Required Indexes
Firestore compound queries require composite indexes. Configure the following in `/firebase/firestore.indexes.json`:
- `orders` collection: `patientId` (Ascending) + `createdTime` (Descending)
- `reports` collection: `labId` (Ascending) + `approvedAt` (Descending)
