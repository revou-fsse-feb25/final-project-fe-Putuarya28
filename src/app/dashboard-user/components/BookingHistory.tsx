"use client";
import React, { useEffect, useState } from "react";
import { fetchBookingHistory } from "./api";
import { useSession } from "next-auth/react";

export default function BookingHistory() {
  type Booking = {
    id: number;
    status: string;
    date: string;
    orderDetails?: Record<string, unknown>;
  };
  const [history, setHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setError("No user ID in session");
      setLoading(false);
      return;
    }
    fetchBookingHistory(session)
      .then((data: Booking[]) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load booking history");
        setLoading(false);
      });
  }, [session, status]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Booking History</h2>
      <div className="bg-white rounded shadow p-4">
        {history.length === 0 && <div>No booking history.</div>}
        {history.map((booking) => (
          <div key={booking.id} className="mb-4 p-4 border rounded">
            <div className="font-semibold">Booking #{booking.id}</div>
            <div>
              Status: <span className="text-green-600">{booking.status}</span>
            </div>
            <div>Date: {booking.date}</div>
            {booking.orderDetails && (
              <div className="mt-2">
                <div className="font-semibold">Order Details:</div>
                <ul className="list-disc ml-6">
                  {Object.entries(booking.orderDetails).map(([key, value]) => (
                    <li key={key}>
                      <span className="capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      : {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>Product Received</div>
          </div>
        ))}
      </div>
    </section>
  );
}
