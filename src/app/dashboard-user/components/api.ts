
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchOngoingBookings(session: any) {
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user ID in session");
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/bookings/customer/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch ongoing bookings");
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchBookingHistory(session: any) {
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user ID in session");
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/bookings/customer/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch booking history");
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchUserProfile(session: any) {
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user ID in session");
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

export async function updateUserProfile(
  data: { name: string; profilePic?: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any
) {
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user ID in session");
  // Only send fields that exist in the User model
  const allowedFields = ["email", "password", "role", "name", "profilePic"];
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/users/${userId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(filteredData),
    }
  );
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export async function updateBooking(
  bookingId: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any
) {
  if (!bookingId) throw new Error("No booking ID provided");
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/bookings/${bookingId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error("Failed to update booking");
  return res.json();
}
