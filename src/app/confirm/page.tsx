"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ConfirmPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams?.get("token");
    if (token) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      window.location.href = `${apiUrl}/auth/confirm?token=${token}`;
    } else {
      setStatus("error");
      setMessage("Invalid confirmation link.");
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-[#fff5ddee] p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl text-[#8b6200] font-bold mb-6 text-center">
          Account Confirmation
        </h1>
        <div
          className={`mb-4 text-center ${
            status === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
        {status === "success" && (
          <button
            className="w-full py-2 text-white font-semibold rounded bg-[#c48900] hover:bg-[#b37d00]"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmPageInner />
    </Suspense>
  );
}
