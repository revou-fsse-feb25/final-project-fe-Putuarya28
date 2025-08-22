"use client";
"use client";
import React from "react";
import { useUserProfile } from "./UserProfileContext";
import Image from "next/image";

export default function ProfileSidebar() {
  const { profile } = useUserProfile();
  const displayName = profile?.name?.trim()
    ? profile.name
    : profile?.email || "User Name";
  return (
    <aside className="w-64 bg-white shadow p-6 flex flex-col">
      <div className="mb-8 flex flex-col items-center">
        {profile?.profilePic ? (
          <Image
            src={profile.profilePic}
            alt="Profile"
            width={80}
            height={80}
            style={{ width: 80, height: 80, objectFit: "cover" }}
            className="mb-2 rounded-full"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 mb-2" />
        )}
        <div className="font-bold">{displayName}</div>
        <div className="text-sm text-gray-500">
          {profile?.email || "user@email.com"}
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        <span className="font-semibold">Dashboard</span>
        {/* Navigation handled in main page */}
      </nav>
    </aside>
  );
}
