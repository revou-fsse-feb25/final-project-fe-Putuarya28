"use client";
import React, { useState } from "react";
import Appointments from "./components/Appointments";
import OrderStatus from "./components/OrderStatus";
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
          Appointments
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "history" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Order Status
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
      {activeTab === "ongoing" && <Appointments />}
      {activeTab === "history" && <OrderStatus />}
      {activeTab === "profile" && <EditProfile />}
    </div>
  );
}
