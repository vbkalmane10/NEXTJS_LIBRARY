import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/MemberRepository/repository";
import { fetchScheduledEventsForAdmin } from "@/lib/Calendly";
import ScheduledMeetingsListForAdmin from "@/components/ScheduleMeetingListForAdmin";

export default async function ScheduledMeetingsPage() {
  const session = await getServerSession(authOptions);
  const userEmail = await getUserById(session?.user?.id);

  let scheduledEvents = [];

  try {
    if (userEmail?.email) {
      scheduledEvents = await fetchScheduledEventsForAdmin(userEmail.email);
      
    }
  } catch (error) {
    console.error("Error fetching scheduled events:", error);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Scheduled Meetings</h1>
      {scheduledEvents.length > 0 ? (
        <ScheduledMeetingsListForAdmin events={scheduledEvents} />
      ) : (
        <div className="text-center">No scheduled meetings found.</div>
      )}
    </div>
  );
}
