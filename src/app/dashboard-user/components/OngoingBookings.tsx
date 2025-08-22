"use client";
import React, { useEffect, useState } from "react";
import { fetchOngoingBookings, updateBooking } from "./api";
import { useSession } from "next-auth/react";

export default function OngoingBookings() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editData, setEditData] = useState<any>({});
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setError("No user ID in session");
      setLoading(false);
      return;
    }
    fetchOngoingBookings(session)
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load bookings: " + (err?.message || err));
        setLoading(false);
      });
  }, [session, status]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleEdit(id: number, booking: any) {
    setEditId(id);
    setEditData(booking);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    if (!editId) return;
    try {
      await updateBooking(
        editId,
        {
          date: editData.date,
          time: editData.time,
          whatsapp: editData.whatsapp,
        },
        session
      );
      // Refresh bookings after update
      const updated = await fetchOngoingBookings(session);
      setBookings(updated);
      setEditId(null);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError("Failed to update booking: " + ((err as any)?.message || err));
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Ongoing Bookings</h2>
      <div className="bg-white rounded shadow p-4">
        {bookings.length === 0 && <div>No ongoing bookings.</div>}
        {bookings.map((booking) => (
          <div key={booking.id} className="mb-4 p-4 border rounded">
            {session?.user?.role === "admin" && (
              <div className="font-semibold">Booking #{booking.id}</div>
            )}
            <div>
              Status: <span className="text-yellow-600">{booking.status}</span>
            </div>
            {editId === booking.id ? (
              <div className="space-y-2">
                <input
                  name="date"
                  type="date"
                  value={
                    editData.date
                      ? new Date(editData.date).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={handleChange}
                  className="border px-2 py-1 rounded w-full"
                />
                <input
                  name="time"
                  value={editData.time}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded w-full"
                />
                <input
                  name="whatsapp"
                  value={editData.whatsapp}
                  onChange={handleChange}
                  className="border px-2 py-1 rounded w-full"
                />
                <button
                  className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="mt-2 px-3 py-1 bg-gray-400 text-white rounded"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div>
                  Date:{" "}
                  {booking.date
                    ? new Date(booking.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </div>
                <div>Time: {booking.time}</div>
                <div>WhatsApp: {booking.whatsapp}</div>
                <button
                  className="mt-2 px-3 py-1 bg-purple-600 text-white rounded"
                  onClick={() => handleEdit(booking.id, booking)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
