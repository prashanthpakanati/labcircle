// apps/web/lib/fulfillment/repositories/FulfillmentTimelineRepository.ts

import { getFirestore, collection, doc, setDoc, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import { FulfillmentTimelineEvent } from "../models/types";

export class FulfillmentTimelineRepository {
  private readonly col = collection(getFirestore(), "fulfillment_timeline");

  /**
   * Adds an immutable write-once timeline event document.
   */
  async addEvent(event: FulfillmentTimelineEvent): Promise<void> {
    const ref = doc(this.col, event.id);
    await setDoc(ref, {
      ...event,
      timestamp: serverTimestamp(),
    });
  }

  /**
   * Retrieves chronological event history for a given fulfillment ID.
   */
  async getByFulfillmentId(fulfillmentId: string): Promise<FulfillmentTimelineEvent[]> {
    const q = query(this.col, where("fulfillmentId", "==", fulfillmentId), orderBy("timestamp", "asc"));
    const snap = await getDocs(q);
    const events: FulfillmentTimelineEvent[] = [];
    snap.forEach((d) => events.push(d.data() as FulfillmentTimelineEvent));
    return events;
  }
}
