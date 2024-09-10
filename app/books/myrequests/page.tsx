// src/app/books/myrequests/page.tsx
"use client";

import { useEffect, useState } from "react";
import RequestCard from "@/components/RequestCard";
import { useSession } from "next-auth/react";
import { fetchUserRequest } from "@/lib/actions";

import { Request } from "@/lib/types";

const MyRequestsPage = () => {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const userRequests = await fetchUserRequest(session.user.id);
        setRequests(userRequests);
      } catch (error) {
        console.error("Failed to fetch user requests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [session]);

  if (status === "loading" || loading) {
    return <p>Loading requests...</p>;
  }

  if (requests.length === 0) {
    return <p>No requests found for your account.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">My Book Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
};

export default MyRequestsPage;
