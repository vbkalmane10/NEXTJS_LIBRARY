"use client ";
import RequestCard from "@/components/RequestCard";
import { useSession } from "next-auth/react";
import { fetchUserRequest } from "@/lib/actions";
import { getServerSession } from "next-auth";
import { Request } from "@/lib/types";

import { useEffect, useState } from "react";

const MyRequestsPage = async () => {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const userRequests = await fetchUserRequest(session.user.id);
          setRequests(userRequests);
        } catch (error) {
          console.error("Failed to fetch user requests:", error);
          setError("Failed to fetch user requests. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [session, status]);

  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (requests.length === 0) {
    return <p>No requests found for your account.</p>;
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Book Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
};

export default MyRequestsPage;
