import { ReactNode } from "react";
import { notFound } from "next/navigation";
import ClientLayout from "./ClientLayout";
import "../globals.css";

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (locale !== 'en' && locale !== 'kn') {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <ClientLayout locale={locale} messages={messages}>
      {children}
    </ClientLayout>
  );
}