
"use client"
import React from "react";
import useFetchScheduledEvents from "@/hooks/useFetchScheduled";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react"
const ScheduledMeetings: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const { events, loading, error } = useFetchScheduledEvents(userEmail);

  if (loading) {
    return <div>Loading scheduled meetings...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (events.length === 0) {
    return <div>No meetings scheduled yet.</div>;
  }

  return (
    <div className="container mx-auto p-4">
    <h2 className="text-2xl font-bold mb-6">My Scheduled Meetings</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-shadow">
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
                <span className="text-sm">{event.duration} minutes</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-sm">
                  {event.location.details || "Online"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
  );
};

export default ScheduledMeetings;
