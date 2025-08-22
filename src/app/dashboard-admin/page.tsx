import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminTabs from "./components/AdminTabs";

// --- Main Dashboard Page ---
export default async function DashboardAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?redirect=/dashboard-admin");
  }
  if (session.user.role !== "admin") {
    redirect("/");
  }

  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, Admin {session.user.name}
          </h1>
          <p className="text-gray-600">
            This is the admin dashboard where you can manage bookings,
            availability, and design images.
          </p>
        </div>
        <AdminTabs />
      </div>
    </div>
  );
}
