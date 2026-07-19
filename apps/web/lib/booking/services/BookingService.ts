// lib/booking/services/BookingService.ts

import { Appointment } from "../models/types";
import { BookingStatus } from "../models/enums";
import { COLLECTIONS } from "../models/constants";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

/** Minimal BookingService skeleton. Business logic will be added later. */
export class BookingService {
  private db = getFirestore();

  /** Get a single appointment (booking) by its ID */
  async getBooking(id: string): Promise<Appointment | null> {
    const colRef = collection(this.db, COLLECTIONS.bookings);
    const q = query(colRef, where("id", "==", id));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const data = snap.docs[0].data() as Appointment;
    return data;
  }

  /** List bookings for a given patient */
  async listBookingsByPatient(patientId: string): Promise<Appointment[]> {
    const colRef = collection(this.db, COLLECTIONS.bookings);
    const q = query(colRef, where("patientId", "==", patientId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Appointment);
  }

  /** Update booking status */
  async updateStatus(_id: string, _status: BookingStatus): Promise<void> {
    // TODO: implement Firestore update for booking status
    void _id;
    void _status;
  }
}
