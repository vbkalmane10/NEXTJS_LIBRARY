import { error } from "console";

const ACCESS_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;

export async function fetchScheduledEvents(email: string | undefined) {
  const userOrganization = await fetchUserOrganization();
  console.log(userOrganization);
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
export async function fetchScheduledEventsForAdmin(email: string | undefined) {
  const userOrganization = await fetchUserOrganization();
  console.log(userOrganization);
  const res = await fetch(
    `https://api.calendly.com/scheduled_events?organization=${userOrganization}`,
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
export const fetchUserOrganization = async () => {
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

export const sendInvitations = async (
  email: string,
  userOrganization: string
) => {
  try {
    const response = await fetch(
      `https://api.calendly.com/organizations/${userOrganization}/invitations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send Calendly invite.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Calendly Signup Error:", error);

    return null;
  }
};
export async function checkInvitationStatus(
  email: string,
  userOrganization: string
) {
  const response = await fetch(
    `https://api.calendly.com/organizations/${userOrganization}/invitations`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  const invitation = data.collection.find((inv: any) => inv.email === email);

  if (invitation && invitation.status === "accepted") {
    return { accepted: true, userUri: invitation.user };
  }

  return { accepted: false };
}
export async function fetchUserDetails(userUri: string) {
  const response = await fetch(userUri, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data.resource;
}
