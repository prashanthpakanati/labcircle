import {
  signInWithEmailAndPassword,
  signOut,
  signInWithPhoneNumber,
  ApplicationVerifier,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

/**
 * Handles credentials sign-in for administrative and clinical staff.
 */
export async function loginWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

/**
 * Initiates Phone OTP verification for patients and phlebotomists.
 * Requires a verified client-side RecaptchaVerifier instance.
 */
export async function sendOtp(phoneNumber: string, appVerifier: ApplicationVerifier): Promise<ConfirmationResult> {
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  } catch (error) {
    throw error;
  }
}

/**
 * Revokes current user credentials sessions.
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
}
