# API Specification: LabCircle

## 1. Overview
This API specification defines the RESTful and real-time endpoints for the LabCircle backend services. All endpoints require HTTPS and validate requests using JWT Bearer tokens.

## 2. Authentication Headers
```text
Authorization: Bearer <JWT_TOKEN>
X-LabCircle-Key: <WORKSPACE_API_KEY> (For B2B clinic integrations)
```

## 3. Endpoints

### 3.1 Patient Management
- **`POST /api/v1/patients/register`**
  - Registers a new patient.
  - Body: `{ phone, name, dob, gender }`
- **`GET /api/v1/patients/profile`**
  - Retrieves patient details.

### 3.2 Orders & Tracking
- **`POST /api/v1/orders`**
  - Places a new diagnostic order.
  - Body: `{ patientId, tests: [testId], collectionDate }`
- **`GET /api/v1/orders/{orderId}/status`**
  - Retrieves live tracking updates for a specific order.

### 3.3 Lab Reporting
- **`POST /api/v1/reports/{reportId}/results`**
  - Logs results for review.
  - Body: `{ results: { testCode: value } }`
- **`POST /api/v1/reports/{reportId}/approve`**
  - Triggers final sign-off, PDF generation, and distribution.

## 4. Standard Response Formats
- **Success:**
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- **Failure:**
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_FAILED",
      "message": "The field 'phone' is invalid.",
      "details": []
    }
  }
  ```
