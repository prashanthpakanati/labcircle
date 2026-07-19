// Dashboard Service – aggregates data for the patient dashboard view (read‑only)
// No Firestore writes; the dashboard is a view only.

import { collection, query, where, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../src/lib/firebase/client";
import { getUserProfile, UserProfile } from "../../src/lib/firebase/firestore-service";

// ----- Types -----
export interface Booking {
  id: string;
  patientUid: string;
  scheduledAt: Date;
  status: string;
}

export interface Report {
  id: string;
  patientUid: string;
  createdAt: Date;
  title: string;
}

export interface Notification {
  id: string;
  userUid: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  href: string;
}

export interface DashboardData {
  profileCompletion?: number;
  upcomingBookings: Booking[];
  recentReports: Report[];
  notifications: Notification[];
  quickActions: QuickAction[];
}

// ----- Helper fetch functions -----
interface BookingDoc {
  scheduledAt: Timestamp;
  status: string;
}

async function fetchUpcomingBookings(uid: string): Promise<Booking[]> {
  try {
    const now = new Date();
    const q = query(
      collection(db, "bookings"),
      where("patientUid", "==", uid),
      where("scheduledAt", ">=", now),
      orderBy("scheduledAt", "asc"),
      limit(5)
    );
    const snap = await getDocs(q);
    const bookings: Booking[] = [];
    snap.forEach((doc) => {
      const data = doc.data() as BookingDoc;
      bookings.push({
        id: doc.id,
        patientUid: uid,
        scheduledAt: data.scheduledAt.toDate(),
        status: data.status ?? "",
      });
    });
    return bookings;
  } catch (e) {
    console.error("Error fetching upcoming bookings", e);
    return [];
  }
}

interface ReportDoc {
  createdAt: Timestamp;
  title: string;
}

async function fetchRecentReports(uid: string): Promise<Report[]> {
  try {
    const q = query(
      collection(db, "reports"),
      where("patientUid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const snap = await getDocs(q);
    const reports: Report[] = [];
    snap.forEach((doc) => {
      const data = doc.data() as ReportDoc;
      reports.push({
        id: doc.id,
        patientUid: uid,
        createdAt: data.createdAt.toDate(),
        title: data.title ?? "",
      });
    });
    return reports;
  } catch (e) {
    console.error("Error fetching recent reports", e);
    return [];
  }
}

interface NotificationDoc {
  message: string;
  createdAt: Timestamp;
  read: boolean;
}

async function fetchNotifications(uid: string): Promise<Notification[]> {
  try {
    const q = query(
      collection(db, "notifications"),
      where("userUid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const snap = await getDocs(q);
    const notifications: Notification[] = [];
    snap.forEach((doc) => {
      const data = doc.data() as NotificationDoc;
      notifications.push({
        id: doc.id,
        userUid: uid,
        message: data.message ?? "",
        createdAt: data.createdAt.toDate(),
        read: data.read ?? false,
      });
    });
    return notifications;
  } catch (e) {
    console.error("Error fetching notifications", e);
    return [];
  }
}

function getQuickActions(): QuickAction[] {
  return [
    { id: "book-test", title: "Book Test", href: "/bookings" },
    { id: "view-packages", title: "View Packages", href: "/packages" },
    { id: "my-reports", title: "My Reports", href: "/reports" },
    { id: "my-orders", title: "My Orders", href: "/orders" },
    { id: "family-members", title: "Family Members", href: "/family" },
  ];
}

export async function getDashboardData(uid: string): Promise<DashboardData> {
  const [profileResult, bookingsResult, reportsResult, notificationsResult] = await Promise.allSettled([
    getUserProfile(uid),
    fetchUpcomingBookings(uid),
    fetchRecentReports(uid),
    fetchNotifications(uid),
  ]);

  const profile = profileResult.status === "fulfilled" ? profileResult.value : null;
  const profileCompletion =
    profile && typeof (profile as UserProfile & { profileCompletion?: number }).profileCompletion === "number"
      ? (profile as UserProfile & { profileCompletion?: number }).profileCompletion
      : undefined;

  return {
    profileCompletion,
    upcomingBookings: bookingsResult.status === "fulfilled" ? bookingsResult.value : [],
    recentReports: reportsResult.status === "fulfilled" ? reportsResult.value : [],
    notifications: notificationsResult.status === "fulfilled" ? notificationsResult.value : [],
    quickActions: getQuickActions(),
  };
}
