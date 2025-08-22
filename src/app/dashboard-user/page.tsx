"use client";
import React, { useState } from "react";
import OngoingBookings from "./components/OngoingBookings";
import BookingHistory from "./components/BookingHistory";
import EditProfile from "./components/EditProfile";

export default function DashboardUserPage() {
  const [activeTab, setActiveTab] = useState("ongoing");

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "ongoing" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("ongoing")}
        >
          Ongoing Bookings
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "history" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Booking History
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "profile" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Edit Profile
        </button>
      </div>
      {activeTab === "ongoing" && <OngoingBookings />}
      {activeTab === "history" && <BookingHistory />}
      {activeTab === "profile" && <EditProfile />}
    </div>
  );
}
