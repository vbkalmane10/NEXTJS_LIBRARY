"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Navbar";
import "./globals.css";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
