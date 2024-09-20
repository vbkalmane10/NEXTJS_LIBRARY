"use client";
import RequestCard from "@/components/RequestCard";
import { useSession } from "next-auth/react";
import { fetchUserRequest, handleCancelRequest } from "@/lib/actions";
import { getServerSession } from "next-auth";
import { Request } from "@/lib/types";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const MyRequestsPage = () => {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"Approved" | "Pending">("Pending");
  const { toast } = useToast();
  const router = useRouter();
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
  const handleCancel = async (requestId: number) => {
    try {
      const result = await handleCancelRequest(requestId);
      if (result) {
        toast({
          title: "Succcess",
          description: "Request cancelled successfully",
          className: "bg-green-500 text-black",
          duration: 1000,
        });
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
      }
  
    } catch (error) {
      toast({
        title: "Error",
        description: "Error while cancelling the request",
        className: "bg-red-500 text-white",
        duration: 1000,
      });
    }
  };
  const filteredRequests = requests.filter((request) =>
    filter === "Approved"
      ? request.status === "Approved"
      : request.status === "Pending"
  );
  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (requests.length === 0) {
    return <p>No requests found for your account.</p>;
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Book Requests</h1>

      {/* Switch/Toggle for Approved or Pending Requests */}
      <div className="mb-6 flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">
          Showing {filter === "Pending" ? "Pending" : "Approved"} Requests
        </span>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={filter === "Approved"}
            onChange={() =>
              setFilter((prevFilter) =>
                prevFilter === "Pending" ? "Approved" : "Pending"
              )
            }
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Display filtered requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onCancel={() => handleCancel(request.id)}
            />
          ))
        ) : (
          <p>No {filter} requests found.</p>
        )}
      </div>
    </div>
  );
};

export default MyRequestsPage;
