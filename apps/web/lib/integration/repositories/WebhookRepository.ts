// apps/web/lib/integration/repositories/WebhookRepository.ts

import { getFirestore, collection, doc, setDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { WebhookSubscription, WebhookDelivery } from "../models/types";

export class WebhookRepository {
  private readonly subCol = collection(getFirestore(), "webhook_subscriptions");
  private readonly delCol = collection(getFirestore(), "webhook_deliveries");

  async createSubscription(sub: WebhookSubscription): Promise<void> {
    const ref = doc(this.subCol, sub.id);
    await setDoc(ref, {
      ...sub,
      createdAt: serverTimestamp(),
    });
  }

  async recordDelivery(delivery: WebhookDelivery): Promise<void> {
    const ref = doc(this.delCol, delivery.id);
    await setDoc(ref, delivery);
  }

  async getSubscriptionsForEvent(eventType: string): Promise<WebhookSubscription[]> {
    const q = query(this.subCol, where("events", "array-contains", eventType));
    const snap = await getDocs(q);
    const subs: WebhookSubscription[] = [];
    snap.forEach((d) => subs.push(d.data() as WebhookSubscription));
    return subs;
  }
}
