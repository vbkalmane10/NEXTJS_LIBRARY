import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";
import { getUserById } from "./MemberRepository/repository";

const ACCESS_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;

export async function fetchScheduledEvents(email: string | undefined) {
  const userOrganization = await fetchUserOrganization();

  const res = await fetch(
    `https://api.calendly.com/scheduled_events?organization=${userOrganization}&invitee_email=${email}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch scheduled events from Calendly.");
  }
  const data = await res.json();

  const updatedEvents = await Promise.all(
    data.collection.map(async (event: any) => {
      const [inviteeDetails] = await fetchInviteeDetails(
        event.uri.split("/").pop()!,
        email
      );

      return {
        ...event,
        cancel_url: inviteeDetails.cancel_url,
        reschedule_url: inviteeDetails.reschedule_url,
      };
    })
  );

  return updatedEvents;
}

const fetchUserOrganization = async () => {
  const response = await fetch("https://api.calendly.com/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PERSONAL_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return data.resource.current_organization;
};
export async function fetchInviteeDetails(
  eventId: string,
  email: string | undefined
) {
  const url = `https://api.calendly.com/scheduled_events/${eventId}/invitees?invitee_email=${email}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(
        ` Failed to fetch invitee details for event ${eventId}:,response.statusText`
      );
      return {};
    }
    const data = await response.json();
    const currentInviteeDetails = data.collection;

    return currentInviteeDetails || {};
  } catch (error) {
    console.error("Error fetching invitee details:", error);
    return {};
  }
}
