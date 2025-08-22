"use client";
import React, { useState } from "react";
import BookingsDashboard from "./BookingsDashboard";
import AdminAvailability from "./AdminAvailability";
import AdminDesignIdeas from "./AdminDesignIdeas";

export default function AdminTabs() {
  const [tab, setTab] = useState("bookings");
  return (
    <>
      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={() => setTab("bookings")}
          className={`px-4 py-2 rounded-full font-semibold transition ${
            tab === "bookings"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-blue-100"
          }`}
        >
          Booking Requests
        </button>
        <button
          onClick={() => setTab("availability")}
          className={`px-4 py-2 rounded-full font-semibold transition ${
            tab === "availability"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-green-100"
          }`}
        >
          Availability
        </button>
        <button
          onClick={() => setTab("design")}
          className={`px-4 py-2 rounded-full font-semibold transition ${
            tab === "design"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-purple-100"
          }`}
        >
          Design Images
        </button>
      </div>
      <div>
        {tab === "bookings" && <BookingsDashboard />}
        {tab === "availability" && <AdminAvailability />}
        {tab === "design" && <AdminDesignIdeas />}
      </div>
    </>
  );
}
