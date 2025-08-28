import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import OrderDetailsForm from "./OrderDetails";
import SendTrackingCode from "./SendTrackingCode";

type Booking = {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  date: string;
  time: string;
  notes?: string;
  status: string;
  customerId?: number;
  serviceType?: string;
  measurementType?: string;
  size?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  shoulder?: string;
  sleeve?: string;
  kebayaLength?: string;
  trackingCode?: string;
  orderDetails?: {
    [key: string]: string | number | undefined;
  };
};

export default function BookingsDashboard() {
  const [orderDetailsId, setOrderDetailsId] = useState<number | null>(null);
  const handleOrderDetailsClick = (id: number) => {
    setOrderDetailsId((prev) => (prev === id ? null : id));
  };
  const handleOrderDetailsCancel = () => {
    setOrderDetailsId(null);
  };
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const handleEditClick = (booking: Booking) => {
    setEditingId(booking.id);
    setEditDate(booking.date.slice(0, 10));
    setEditTime(booking.time);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditDate("");
    setEditTime("");
  };

  const handleEditSave = async (id: number) => {
    setEditLoading(true);
    const res = await fetchWithAuth(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/bookings/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: editDate, time: editTime }),
      }
    );
    setEditLoading(false);
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, date: editDate, time: editTime } : b
        )
      );
      setFeedback("Booking rescheduled!");
      setTimeout(() => setFeedback(""), 2000);
      setEditingId(null);
    } else {
      setFeedback("Failed to reschedule booking.");
      setTimeout(() => setFeedback(""), 2000);
    }
  };
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { data: session } = useSession();
  const [showTrackingCodeId, setShowTrackingCodeId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/bookings`,
        {
          headers: {},
        }
      );
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    };
    if (session?.accessToken) {
      fetchBookings();
    }
  }, [session]);

  const confirmBooking = async (id: number) => {
    setLoading(true);
    setFeedback("");
    const res = await fetchWithAuth(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/bookings/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }),
      }
    );
    setLoading(false);
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b))
      );
      setFeedback("Booking confirmed!");
      setTimeout(() => setFeedback(""), 2000);
    } else {
      setFeedback("Failed to confirm booking.");
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-6">Booking Requests</h2>
      {feedback && (
        <div className="mb-4 text-center text-green-600 font-medium">
          {feedback}
        </div>
      )}
      <div className="overflow-x-auto">
        <table
          className="w-full border border-gray-300 rounded-lg overflow-hidden"
          style={{ tableLayout: "fixed", minWidth: "1200px" }}
        >
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left" style={{ width: "200px" }}>
                Name
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "280px" }}>
                Email
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "180px" }}>
                WhatsApp
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "200px" }}>
                Date
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "150px" }}>
                Time
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "110px" }}>
                Service Type
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "130px" }}>
                Measurement Type
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "70px" }}>
                Size
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "70px" }}>
                Bust
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "70px" }}>
                Waist
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "70px" }}>
                Hip
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "90px" }}>
                Shoulder
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "90px" }}>
                Sleeve
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "120px" }}>
                Kebaya Length
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "90px" }}>
                Status
              </th>
              <th className="px-4 py-3 text-left" style={{ width: "320px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No booking requests yet.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <React.Fragment key={b.id}>
                  <tr className="border-b border-gray-300 hover:bg-gray-50 transition">
                    <td
                      className="px-4 py-3"
                      style={{
                        width: "80px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.name}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{
                        width: "180px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.email}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{
                        width: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.whatsapp}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === b.id ? (
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="border px-2 py-1 rounded w-32"
                        />
                      ) : (
                        b.date.slice(0, 10)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === b.id ? (
                        <input
                          type="time"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="border px-2 py-1 rounded w-24"
                        />
                      ) : (
                        b.time
                      )}
                    </td>
                    <td className="px-4 py-3">{b.serviceType || "-"}</td>
                    <td className="px-4 py-3">{b.measurementType || "-"}</td>
                    <td className="px-4 py-3">{b.size || "-"}</td>
                    <td className="px-4 py-3">{b.bust || "-"}</td>
                    <td className="px-4 py-3">{b.waist || "-"}</td>
                    <td className="px-4 py-3">{b.hip || "-"}</td>
                    <td className="px-4 py-3">{b.shoulder || "-"}</td>
                    <td className="px-4 py-3">{b.sleeve || "-"}</td>
                    <td className="px-4 py-3">{b.kebayaLength || "-"}</td>
                    <td className="px-4 py-3 capitalize">
                      {b.trackingCode ? (
                        <span className="text-blue-600 font-medium">
                          Tracking Sent
                        </span>
                      ) : b.status === "confirmed" ? (
                        <span className="text-green-600 font-medium">
                          Confirmed
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {b.status === "pending" && (
                        <button
                          onClick={() => confirmBooking(b.id)}
                          className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={loading}
                        >
                          {loading ? "Confirming..." : "Confirm"}
                        </button>
                      )}
                      {b.status === "confirmed" &&
                        (editingId === b.id ? (
                          <>
                            <button
                              onClick={() => handleEditSave(b.id)}
                              className={`bg-blue-600 text-white px-3 py-1 rounded mr-2 ${
                                editLoading
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={editLoading}
                            >
                              {editLoading ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="bg-gray-400 text-white px-3 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditClick(b)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Reschedule
                          </button>
                        ))}
                      {/* Action buttons: Order Details & Send Tracking Code */}
                      {(b.status !== "pending" || b.trackingCode) && (
                        <div className="flex gap-2 mt-2">
                          <button
                            className="bg-purple-600 text-white px-3 py-1 rounded"
                            onClick={() => handleOrderDetailsClick(b.id)}
                          >
                            {orderDetailsId === b.id
                              ? "Close Order Details"
                              : "Order Details"}
                          </button>
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={() =>
                              setShowTrackingCodeId(
                                b.id === showTrackingCodeId ? null : b.id
                              )
                            }
                          >
                            {showTrackingCodeId === b.id
                              ? "Cancel"
                              : "Send Tracking Code"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {showTrackingCodeId === b.id && (
                    <tr>
                      <td colSpan={15}>
                        <SendTrackingCode
                          bookingId={b.id}
                          currentTrackingCode={b.trackingCode}
                          onSuccess={() => setShowTrackingCodeId(null)}
                        />
                      </td>
                    </tr>
                  )}
                  {orderDetailsId === b.id && (
                    <tr>
                      <td colSpan={15}>
                        <div className="bg-gray-50 p-4 rounded shadow mt-2">
                          <OrderDetailsForm
                            bookingId={b.id}
                            initialDetails={b.orderDetails || {}}
                            onSuccess={handleOrderDetailsCancel}
                            status={b.status}
                          />
                          <button
                            className="bg-gray-400 text-white px-3 py-1 rounded mt-2"
                            onClick={handleOrderDetailsCancel}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
