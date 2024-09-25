import { fetchScheduledEvents } from "@/lib/Calendly";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/MemberRepository/repository";
import { getTranslations } from "next-intl/server";

interface Event {
  uri: string;
  name: string;
  start_time: string;
  location: {
    join_url?: string;
  };
}

async function ScheduledMeetingsList() {
  let scheduledEvents: Event[] = [];
  const session = await getServerSession(authOptions);
  const userEmail = await getUserById(session.user?.id);

  try {
    scheduledEvents = await fetchScheduledEvents(userEmail?.email);
  } catch (error) {
    console.error("Error fetching scheduled events:", error);
    return (
      <div className="text-center text-red-500">
        Error loading scheduled meetings. Please try again later.
      </div>
    );
  }

  if (scheduledEvents.length === 0) {
    return <div className="text-center">No scheduled meetings found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {scheduledEvents.map((event) => (
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
                <div className="flex items-center">
                  <LinkIcon className="mr-2 h-4 w-4 opacity-70" />
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a
                      href={event.location.join_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Meeting
                    </a>
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

export default async function ScheduledMeetingsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Scheduled Meetings</h1>
      <Suspense
        fallback={
          <div className="text-center">Loading scheduled meetings...</div>
        }
      >
        <ScheduledMeetingsList />
      </Suspense>
    </div>
  );
}
