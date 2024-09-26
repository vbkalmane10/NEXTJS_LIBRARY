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
  const { eventName } = params;

  if (!cancelUrl) {
    return <div className="text-center">Cancel URL not provided.</div>;
  }

  return <CalendlyWidget url={cancelUrl} />;
};

export default EventPage;
