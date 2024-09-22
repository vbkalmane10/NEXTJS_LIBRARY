"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";

export default function ClientLayout({
  children,
  locale,
  messages
}: {
  children: React.ReactNode;
  locale: string;
  messages: any;
}) {
  return (
    <html lang={locale}>
      <body>
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}