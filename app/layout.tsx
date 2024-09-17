"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}

