// lib/booking/services/BookingService.ts

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  Timestamp,
  runTransaction,
  UpdateData,
} from "firebase/firestore";
import { Appointment } from "../models/types";
import { BookingStatus } from "../models/enums";
import { COLLECTIONS } from "../models/constants";
import {
  BookingNotFoundError,
  InvalidStatusTransitionError,
  ValidationError,
} from "../models/errors";
import { WorkflowValidator } from "./WorkflowValidator";

/**
 * BookingService implements the full lifecycle of a booking (appointment).
 * All methods are strongly typed, use Firestore transactions where needed,
 * and validate status transitions via WorkflowValidator.
 */
export class BookingService {
  private db = getFirestore();
  private validator = new WorkflowValidator();

  /** Create a new booking. */
  async createBooking(data: {
    patientId: string;
    orderId: string;
    scheduledAt: Date;
    location?: string;
    virtualLink?: string;
  }): Promise<Appointment> {
    // Basic validation
    if (!data.patientId) throw new ValidationError("patientId is required");
    if (!data.orderId) throw new ValidationError("orderId is required");
    if (!(data.scheduledAt instanceof Date) || isNaN(data.scheduledAt.getTime()))
      throw new ValidationError("scheduledAt must be a valid Date");

    const bookingRef = doc(collection(this.db, COLLECTIONS.bookings));
    const booking: Appointment = {
      id: bookingRef.id,
      patientId: data.patientId,
      orderId: data.orderId,
      status: BookingStatus.Pending,
      scheduledAt: data.scheduledAt.toISOString(),
      location: data.location,
      virtualLink: data.virtualLink,
    };
    await setDoc(bookingRef, booking);
    return booking;
  }

  /** Retrieve a single booking by ID. */
  async getBooking(id: string): Promise<Appointment> {
    const snap = await getDoc(doc(this.db, COLLECTIONS.bookings, id));
    if (!snap.exists()) throw new BookingNotFoundError(id);
    return snap.data() as Appointment;
  }

  /** List all bookings for a given patient. */
  async listBookingsByPatient(patientId: string): Promise<Appointment[]> {
    const colRef = collection(this.db, COLLECTIONS.bookings);
    const q = query(colRef, where("patientId", "==", patientId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Appointment);
  }

  /** Internal helper to update status with validation inside a transaction. */
  private async updateStatusInternal(id: string, newStatus: BookingStatus): Promise<void> {
    const bookingRef = doc(this.db, COLLECTIONS.bookings, id);
    await runTransaction(this.db, async (tx) => {
      const snap = await tx.get(bookingRef);
      if (!snap.exists()) throw new BookingNotFoundError(id);
      const booking = snap.data() as Appointment;
      this.validator.assertTransition(booking.status, newStatus);
      const update: UpdateData<{ status: BookingStatus; updatedAt: Timestamp }> = { status: newStatus, updatedAt: Timestamp.now() };
      tx.update(bookingRef, update);
    });
  }

  async confirmBooking(id: string): Promise<void> {
    await this.updateStatusInternal(id, BookingStatus.Confirmed);
  }

  async rescheduleBooking(id: string, newDate: Date): Promise<void> {
    if (!(newDate instanceof Date) || isNaN(newDate.getTime()))
      throw new ValidationError("newDate must be a valid Date");
    const bookingRef = doc(this.db, COLLECTIONS.bookings, id);
    await runTransaction(this.db, async (tx) => {
      const snap = await tx.get(bookingRef);
      if (!snap.exists()) throw new BookingNotFoundError(id);
      const booking = snap.data() as Appointment;
      // Allow reschedule only while pending or confirmed
      if (![BookingStatus.Pending, BookingStatus.Confirmed].includes(booking.status)) {
        throw new InvalidStatusTransitionError(booking.status, "RESCHEDULE");
      }
      const update: UpdateData<{ scheduledAt: string; updatedAt: Timestamp }> = {
        scheduledAt: newDate.toISOString(),
        updatedAt: Timestamp.now(),
      };
      tx.update(bookingRef, update);
    });
  }

  async cancelBooking(id: string): Promise<void> {
    await this.updateStatusInternal(id, BookingStatus.Cancelled);
  }

  async completeBooking(id: string): Promise<void> {
    await this.updateStatusInternal(id, BookingStatus.Completed);
  }

  async updateStatus(id: string, status: BookingStatus): Promise<void> {
    await this.updateStatusInternal(id, status);
  }
}
