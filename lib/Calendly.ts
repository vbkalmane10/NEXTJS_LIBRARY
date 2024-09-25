import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";
import { getUserById } from "./MemberRepository/repository";

const ACCESS_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;

export async function fetchScheduledEvents(email: string | undefined) {
  const userOrganization = await fetchUserId();
  console.log(userOrganization);
  console.log(`https://api.calendly.com/scheduled_events?organization=${userOrganization}&invitee_email=${email}`)
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

  return data.collection;
}
const fetchUserId = async () => {
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
