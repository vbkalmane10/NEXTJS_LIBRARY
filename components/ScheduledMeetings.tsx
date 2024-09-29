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

export default function ScheduledMeetingsList({
  events,
}: ScheduledMeetingsListProps) {
  const router = useRouter();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 sm:p-4">
    {filteredEvents.map((event) => (
      <Card
        key={event.uri}
        className="hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col"
      >
        <CardHeader className="flex flex-col space-y-2 bg-gradient-to-r from-primary to-primary-foreground p-3 sm:p-4 rounded-t-lg">
          <CardTitle className="text-lg sm:text-xl font-bold text-white line-clamp-2">
            {event.name}
          </CardTitle>
          <div className="flex items-center text-white/80">
            <User className="mr-2 h-4 w-4" />
            <span className="text-xs sm:text-sm truncate">
              {event.event_memberships[0].user_name}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium line-clamp-1">
                {new Date(event.start_time).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                {new Date(event.start_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          {event.location?.join_url && (
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
              <Button variant="link" className="p-0 h-auto text-xs sm:text-sm" asChild>
                <a
                  href={event.location.join_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <LinkIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4 opacity-70" />
                  Join Meeting
                </a>
              </Button>
              <Button
                variant="link"
                className="p-0 h-auto text-xs sm:text-sm flex items-center"
                onClick={() =>
                  router.push(
                    `/books/myevents/${encodeURIComponent(event.name)}?cancel_url=${encodeURIComponent(
                      event.cancel_url
                    )}`
                  )
                }
              >
                <XCircleIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4 opacity-70" />
                Cancel Meeting
              </Button>
              <Button
                variant="link"
                className="p-0 h-auto text-xs sm:text-sm flex items-center"
                onClick={() =>
                  router.push(
                    `/books/myevents/${encodeURIComponent(event.name)}?reschedule_url=${encodeURIComponent(
                      event.reschedule_url
                    )}`
                  )
                }
              >
                <CalendarCheck2 className="mr-1 h-3 w-3 sm:h-4 sm:w-4 opacity-70" />
                Reschedule Meeting
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
  );
}
