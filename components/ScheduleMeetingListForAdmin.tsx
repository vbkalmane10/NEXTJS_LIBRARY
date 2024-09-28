"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarCheck2,
  CalendarIcon,
  ClockIcon,
  LinkIcon,
  User,
  XCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Event {
  uri: string;
  name: string;
  start_time: string;
  location: {
    join_url?: string;
  };
  cancel_url: string;
  status: string;
  reschedule_url: string;
  event_memberships: any[];
}

interface ScheduledMeetingsListProps {
  events: Event[];
}

export default function ScheduledMeetingsListForAdmin({
  events,
}: ScheduledMeetingsListProps) {
  const router = useRouter();
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const toggleCardExpansion = (uri: string) => {
    setExpandedCard(expandedCard === uri ? null : uri)
  }
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.start_time);
    return eventDate >= today && event.status === "active";
  });

  if (filteredEvents.length === 0) {
    return (
      <div className="flex justify-center items-center">
        No upcoming meetings.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
    {filteredEvents.map((event) => (
      <Card 
        key={event.uri} 
        className="hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
      >
        <CardHeader className="flex flex-col space-y-2 bg-gradient-to-r from-primary to-primary-foreground p-4 rounded-t-lg">
          <CardTitle className="text-xl font-bold text-white">{event.name}</CardTitle>
         
          <div className="flex items-center text-white/80">
            <User className="mr-2 h-4 w-4" />
            <span className="text-sm">{event.event_memberships[0].user_name}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                {new Date(event.start_time).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                {new Date(event.start_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {/* {event.location?.join_url && (
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex items-center" asChild>
                  <a href={event.location.join_url} target="_blank" rel="noopener noreferrer">
                    <LinkIcon className="mr-1 h-4 w-4" />
                    Join Meeting
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => router.push(`/admin/myevents/${encodeURIComponent(event.name)}?cancel_url=${encodeURIComponent(event.cancel_url || '')}`)}
                >
                  <XCircleIcon className="mr-1 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => router.push(`/admin/myevents/${encodeURIComponent(event.name)}?reschedule_url=${encodeURIComponent(event.reschedule_url || '')}`)}
                >
                  <CalendarCheck2 className="mr-1 h-4 w-4" />
                  Reschedule
                </Button>
              </div>
            )} */}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
  );
}
