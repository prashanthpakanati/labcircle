// apps/web/lib/order/models/enums.ts

export enum OrderStatus {
  Pending = "Pending",
  Processing = "Processing",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum PaymentStatus {
  Unpaid = "Unpaid",
  Partial = "Partial",
  Paid = "Paid",
  Refunded = "Refunded",
}

export enum OrderCollectionType {
  Home = "Home",
  Lab = "Lab",
}
