"use client";
import React, { useEffect, useState } from "react";
import { fetchOngoingAppointments, updateBooking } from "./api";
import type { Session } from "next-auth";
type Booking = {
  id: number;
  date: string;
  time: string;
  whatsapp: string;
  status: string;
  orderDetails?: Record<string, unknown>;
  [key: string]: unknown;
};
import { useSession } from "next-auth/react";

export default function Appointments() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Booking>>({});

  useEffect(() => {
    if (status === "authenticated" && session) {
      fetchOngoingAppointments(session as Session)
        .then((data: Booking[]) => {
          setBookings(data);
          setLoading(false);
        })
        .catch((err: unknown) => {
          setError(
            "Failed to load appointments: " +
              ((err as Error)?.message || String(err))
          );
          setLoading(false);
        });
    }
  }, [session, status]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session)
    return (
      <div className="text-red-600">
        Please log in as admin to access appointments.
      </div>
    );

  function handleEdit(id: number, booking: Booking) {
    setEditId(id);
    setEditData(booking);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    if (!editId) return;
    if (!session) {
      setError("No user session available.");
      return;
    }
    try {
      await updateBooking(editId, {
        date: editData.date!,
        time: editData.time!,
        whatsapp: editData.whatsapp!,
      });
      // Refresh bookings after update
      const updated = await fetchOngoingAppointments(session as Session);
      setBookings(updated);
      setEditId(null);
    } catch (err) {
      setError(
        "Failed to update appointment: " +
          ((err as Error)?.message || String(err))
      );
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const statusDescriptions: { [key: string]: string } = {
    pending:
      "Our taylor is checking your booking details. Please wait for confirmation.",
    confirmed:
      "Your booking is confirmed. Our taylor will contact you via WhatsApp.",
    "processing order":
      "Video call session done, our team is processing your order. Please check the order status to get information about the progress.",
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Appointments</h2>
      <div className="bg-white rounded shadow p-4">
        {bookings.length === 0 && <div>No appointments.</div>}
        {bookings.map((booking) => (
          <div key={booking.id} className="mb-4 p-4 border rounded">
            <div className="font-semibold">Appointment #{booking.id}</div>
            <div>
              Status: <span className="text-yellow-600">{booking.status}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {statusDescriptions[booking.status]}
            </p>
            {booking.status === "processing order" && booking.orderDetails && (
              <div className="mt-2">
                <div className="font-semibold">Order Details:</div>
                <ul className="list-disc ml-6">
                  {(() => {
                    const od = booking.orderDetails as Record<string, unknown>;
                    const type = od.measurementType;
                    const showFields =
                      type === "manual"
                        ? [
                            "bust",
                            "waist",
                            "hips",
                            "shoulder",
                            "sleeve",
                            "length",
                          ]
                        : type === "size"
                        ? ["size"]
                        : [];
                    return Object.entries(od)
                      .filter(([key, value]) => {
                        if (
                          [
                            "name",
                            "whatsapp",
                            "design",
                            "notes",
                            "measurementType",
                            "imageUrl",
                          ].includes(key)
                        )
                          return false;
                        if (showFields.length > 0 && !showFields.includes(key))
                          return false;
                        return value !== undefined && value !== "";
                      })
                      .map(([key, value]) => (
                        <li key={key}>
                          <span className="capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>
                          : {String(value)}
                        </li>
                      ));
                  })()}
                </ul>
                {/* Show general info */}
                <ul className="list-disc ml-6 mt-2">
                  {(() => {
                    const od = booking.orderDetails as Record<string, unknown>;
                    return ["name", "whatsapp", "design", "notes"].map((key) =>
                      od[key] ? (
                        <li key={key}>
                          <span className="capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>
                          : {String(od[key])}
                        </li>
                      ) : null
                    );
                  })()}
                </ul>
              </div>
            )}
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
                {booking.status !== "processing order" &&
                  booking.status !== "delivering" && (
                    <button
                      className="mt-2 px-3 py-1 bg-purple-600 text-white rounded"
                      onClick={() => handleEdit(booking.id, booking)}
                    >
                      Edit
                    </button>
                  )}
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
