"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BookingForm from "@/components/BookingForm";

const Booking = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?redirect=/booking");
    }
  }, [status, router]);

  if (status === "loading") return null; // or a loading spinner

  return <BookingForm />;
};

export default Booking;
