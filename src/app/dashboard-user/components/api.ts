import { fetchWithAuth } from "../../../lib/api";
import { getSession } from "next-auth/react";

import type { Session } from "next-auth";

export async function fetchOngoingAppointments(session: Session) {
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user ID in session");
  const res = await fetchWithAuth(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/bookings/customer/${userId}`
  );
  if (!res.ok) throw new Error("Failed to fetch ongoing appointments");
  return res.json();
}

export async function fetchOrderStatus(session: Session) {
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user ID in session");
  const res = await fetchWithAuth(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/bookings/customer/${userId}`
  );
  if (!res.ok) throw new Error("Failed to fetch order status");
  return res.json();
}

export async function fetchUserProfile(session: Session) {
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user ID in session");
  const res = await fetchWithAuth(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/users/${userId}`
  );
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(
      `Failed to fetch user profile. Status: ${res.status}. Body: ${errorBody}`
    );
  }
  return res.json();
}

export async function updateUserProfile(data: {
  name: string;
  profilePic?: string;
}) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user ID in session");
  const allowedFields = ["email", "password", "role", "name", "profilePic"];
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );
  const res = await fetchWithAuth(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/users/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filteredData),
    }
  );
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export async function updateBooking(
  bookingId: number,
  data: Record<string, unknown>
) {
  if (!bookingId) throw new Error("No booking ID provided");
  const res = await fetchWithAuth(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/bookings/${bookingId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error("Failed to update booking");
  return res.json();
}

export const fetchBookingHistory = async (session: Session) => {
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User ID not found in session.");
  }
  const response = await fetchWithAuth(`/api/bookings?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch booking history.");
  }
  return response.json();
};
