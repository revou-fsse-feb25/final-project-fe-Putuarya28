import React, { useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface Props {
  bookingId: number;
  currentTrackingCode?: string;
  onSuccess?: () => void;
}

export default function SendTrackingCode({
  bookingId,
  currentTrackingCode,
  onSuccess,
}: Props) {
  const [trackingCode, setTrackingCode] = useState(currentTrackingCode || "");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSendTrackingCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    const res = await fetchWithAuth(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/bookings/${bookingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackingCode }),
      }
    );
    setLoading(false);
    if (res.ok) {
      setFeedback("Tracking code sent!");
      setTrackingCode("");
      if (onSuccess) onSuccess();
    } else {
      setFeedback("Failed to send tracking code.");
    }
    setTimeout(() => setFeedback(""), 2000);
  }

  return (
    <form
      onSubmit={handleSendTrackingCode}
      className="space-y-2 mt-2 bg-white p-4 rounded-xl shadow"
    >
      <input
        type="text"
        value={trackingCode}
        onChange={(e) => setTrackingCode(e.target.value)}
        placeholder="Enter tracking code"
        className="border px-3 py-2 rounded w-full"
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {currentTrackingCode
          ? loading
            ? "Updating..."
            : "Update"
          : loading
          ? "Sending..."
          : "Send"}
      </button>
      {currentTrackingCode && (
        <div className="text-blue-600 mt-2">
          Current tracking code:{" "}
          <span className="font-mono">{currentTrackingCode}</span>
        </div>
      )}
      {feedback && <div className="text-green-600 mt-2">{feedback}</div>}
    </form>
  );
}
