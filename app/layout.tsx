"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import Header from "@/components/Header";
import ForbiddenPage from "@/components/ui/Prohibited";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
function SessionWrapper({ children }: { children: ReactNode }) {
  const { status } = useSession({ required: true });

 

  if (status !== "authenticated") {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}
