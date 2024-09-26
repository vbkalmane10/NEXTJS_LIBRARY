"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, LinkIcon, XCircleIcon } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredEvents.map((event) => (
        <Card key={event.uri} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{event.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-sm">
                  {new Date(event.start_time).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-sm">
                  {new Date(event.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {event.location?.join_url && (
                <div className="flex items-center space-x-4">
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a
                      href={event.location.join_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkIcon className="mr-1 h-4 w-4 opacity-70" />
                      Join Meeting
                    </a>
                  </Button>

                  <Button
                    variant="link"
                    className="p-0 h-auto flex items-center"
                    onClick={() =>
                      router.push(
                        `/books/myevents/${encodeURIComponent(
                          event.name
                        )}?cancel_url=${encodeURIComponent(event.cancel_url)}`
                      )
                    }
                  >
                    <XCircleIcon className="mr-1 h-4 w-4 opacity-70" />
                    Cancel Meeting
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
