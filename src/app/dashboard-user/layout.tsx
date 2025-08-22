import React from "react";
import ProfileSidebar from "./components/ProfileSidebar";
import { UserProfileProvider } from "./components/UserProfileContext";

export default function DashboardUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProfileProvider>
      <div className="flex min-h-screen bg-gray-50">
        <ProfileSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </UserProfileProvider>
  );
}
