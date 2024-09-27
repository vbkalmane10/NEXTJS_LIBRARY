"use client";
import { FC } from "react";
import { useSearchParams } from "next/navigation";
import CalendlyWidget from "@/components/CalendlyWidget";

interface EventPageProps {
  params: {
    eventName: string;
  };
}

const EventPage: FC<EventPageProps> = ({ params }) => {
  const searchParams = useSearchParams();
  const cancelUrl = searchParams.get("cancel_url");
  const rescheduleUrl = searchParams.get("reschedule_url");
  const { eventName } = params;
  const urlToUse = rescheduleUrl || cancelUrl;
  if (!urlToUse) {
    return <div className="text-center">No URL provided.</div>;
  }

  return <CalendlyWidget url={urlToUse} />;
};

export default EventPage;
