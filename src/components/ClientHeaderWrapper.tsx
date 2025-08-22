"use client";
import { SessionProvider } from "next-auth/react";
import Header from "./common/Header";

export default function ClientHeaderWrapper() {
  return (
    <SessionProvider>
      <Header />
    </SessionProvider>
  );
}
