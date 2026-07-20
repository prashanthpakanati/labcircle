// lib/patient/validation/validatePatient.ts

import { PatientFormData } from "../models/form";
import { validatePhone, validateEmail } from "../../shared/validation/generic";
import { validateDOB } from "./validateDOB";

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof PatientFormData, string>>;
}

/**
 * Runs all field‑level validators and returns a consolidated result.
 */
export function validatePatient(data: PatientFormData): ValidationResult {
  const errors: Partial<Record<keyof PatientFormData, string>> = {};

  if (!data.firstName?.trim()) errors.firstName = "First name is required";
  if (!data.lastName?.trim()) errors.lastName = "Last name is required";
  if (!data.gender) errors.gender = "Gender is required";
  if (!data.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
  else {
    const dobError = validateDOB(data.dateOfBirth);
    if (dobError) errors.dateOfBirth = dobError;
  }
  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  if (!data.address?.trim()) errors.address = "Address is required";
  if (!data.city?.trim()) errors.city = "City is required";
  if (!data.state?.trim()) errors.state = "State is required";
  if (!data.pinCode?.trim()) errors.pinCode = "PIN code is required";
  if (!data.bloodGroup?.trim()) errors.bloodGroup = "Blood group is required";
  if (!data.emergencyContact?.trim()) errors.emergencyContact = "Emergency contact is required";
  const emergencyPhoneError = validatePhone(data.emergencyPhone);
  if (emergencyPhoneError) errors.emergencyPhone = emergencyPhoneError;
  if (!data.preferredCollectionType) errors.preferredCollectionType = "Collection type is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
