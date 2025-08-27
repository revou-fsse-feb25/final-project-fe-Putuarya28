"use client";
import React, { useEffect, useState } from "react";
import { fetchOrderStatus } from "./api";
import { useSession } from "next-auth/react";

export default function OrderStatus() {
  type Booking = {
    id: number;
    date: string;
    status: string;
    orderStatus?: string;
    trackingCode?: string;
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
    fetchOrderStatus(session)
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load order history");
        setLoading(false);
      });
  }, [session, status]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Order Status</h2>
      <div className="bg-white rounded shadow p-4">
        {history.length === 0 && <div>No order history.</div>}
        {history.map((booking) => (
          <div key={booking.id} className="mb-4 p-4 border rounded">
            <div className="font-semibold">Order #{booking.id}</div>
            <div>Date: {new Date(booking.date).toLocaleDateString()}</div>
            <div>
              Status:{" "}
              <span className="text-green-600">
                {booking.status === "delivering"
                  ? "Your order is on its way"
                  : booking.orderStatus || "We are crafting your kebaya"}
              </span>
            </div>
            {booking.status === "delivering" && booking.trackingCode && (
              <div className="mt-2 text-blue-700">
                <span className="font-semibold">Tracking Code:</span>{" "}
                <span className="font-mono">{booking.trackingCode}</span>
                <div className="text-sm text-gray-600 mt-1">
                  Use this code to track your shipment on the courier&apos;s
                  website.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
