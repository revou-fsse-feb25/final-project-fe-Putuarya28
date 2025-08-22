import React from "react";
import "./globals.css";
import { Metadata } from "next";
import ClientHeaderWrapper from "@/components/ClientHeaderWrapper";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "Luh Suastini - Kebaya Specialists",
  description:
    "Luh Suastini is a kebaya specialist based in Bali, Indonesia, offering custom-made kebaya designs for various occasions. Our mission is to preserve the traditional art of kebaya while providing modern and elegant designs that reflect the beauty of Indonesian culture.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <SessionProviderWrapper>
          <ClientHeaderWrapper />
          <main className="min-h-screen">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
