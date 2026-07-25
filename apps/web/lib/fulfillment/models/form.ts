// apps/web/lib/fulfillment/models/form.ts

import { SpecimenType, ContainerType, FulfillmentPriority } from "./enums";

export interface CreateFulfillmentFormData {
  bookingId: string;
  serviceCategory: string;
  priority: FulfillmentPriority;
  pincode?: string;
}

export interface CollectionVerificationFormData {
  fulfillmentId: string;
  attemptOtp: string;
}

export interface CreateSampleFormData {
  fulfillmentId: string;
  barcode: string;
  specimenType: SpecimenType;
  containerType: ContainerType;
}

export interface UpdateTechnicianLocationFormData {
  technicianId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  batteryLevel?: number;
  accuracy?: number;
}
