import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface AvailableDate {
  date: string;
}

export default function AdminAvailability() {
  const [dates, setDates] = useState<string[]>([]);
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchWithAuth("/api/available-dates")
      .then((res) => res.json())
      .then((data: AvailableDate[]) =>
        setDates(data.map((d) => d.date.slice(0, 10)))
      );
  }, []);

  const addDate = async () => {
    if (!newDate) return;
    setLoading(true);
    setFeedback("");
    const isoDate = new Date(newDate).toISOString();
    const res = await fetchWithAuth("/api/available-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: isoDate }),
    });
    setLoading(false);
    if (res.ok) {
      setDates([...dates, newDate]);
      setNewDate("");
      setFeedback("Date added!");
      setTimeout(() => setFeedback(""), 2000);
    } else {
      setFeedback("Failed to add date");
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-4">Set Available Dates</h2>
      {feedback && (
        <div className="mb-4 text-center text-green-600 font-medium">
          {feedback}
        </div>
      )}
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={addDate}
          className={`bg-blue-600 text-white px-4 py-2 rounded transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
      <ul className="space-y-2">
        {dates.map((date) => (
          <li key={date} className="bg-gray-100 rounded px-3 py-2">
            {date}
          </li>
        ))}
      </ul>
    </div>
  );
}
