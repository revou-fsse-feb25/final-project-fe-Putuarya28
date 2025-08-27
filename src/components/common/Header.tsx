"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 left-0 w-full bg-[#0b0b0bd8] px-6 py-4 flex items-center justify-between z-50">
      <Link href="/" className="text-xl font-semibold text-white">
        Luh Suastini
      </Link>

      <div className="flex items-center gap-6 text-white">
        <nav className="flex gap-12 text-md font-medium mr-10">
          <Link href="/design">Design</Link>
          <Link href="/fabrics">Fabrics</Link>
          <Link href="/measurement">Measurement</Link>
          <Link href="/about-us">About Us</Link>
        </nav>

        {/* PROFILE BUTTON & DROPDOWN */}
        <div className="relative" id="profile-dropdown">
          {session?.user?.id ? (
            <>
              <button
                className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                onClick={() => setProfileOpen((open) => !open)}
              >
                {session.user.name || session.user.email || "Profile"}
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow z-50">
                  {session?.user?.role === "admin" ? (
                    <button
                      onClick={() =>
                        (window.location.href = "/dashboard-admin")
                      }
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => (window.location.href = "/dashboard-user")}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={() =>
                      signOut({ callbackUrl: "/login" }).then(() =>
                        window.location.reload()
                      )
                    }
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
