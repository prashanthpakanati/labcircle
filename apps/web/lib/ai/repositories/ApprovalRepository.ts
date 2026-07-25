// apps/web/lib/ai/repositories/ApprovalRepository.ts

import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ApprovalRequest, ApprovalDecision } from "../models/types";

export class ApprovalRepository {
  private readonly reqCol = collection(getFirestore(), "approval_requests");
  private readonly decCol = collection(getFirestore(), "approval_decisions");

  async createRequest(req: ApprovalRequest): Promise<void> {
    const ref = doc(this.reqCol, req.id);
    await setDoc(ref, {
      ...req,
      requestedAt: serverTimestamp(),
    });
  }

  async getRequestById(id: string): Promise<ApprovalRequest | null> {
    const snap = await getDoc(doc(this.reqCol, id));
    if (!snap.exists()) return null;
    return snap.data() as ApprovalRequest;
  }

  async recordDecision(reqId: string, decision: ApprovalDecision): Promise<void> {
    const decRef = doc(this.decCol, decision.id);
    await setDoc(decRef, {
      ...decision,
      decidedAt: serverTimestamp(),
    });

    const reqRef = doc(this.reqCol, reqId);
    await updateDoc(reqRef, { status: decision.decision });
  }
}
