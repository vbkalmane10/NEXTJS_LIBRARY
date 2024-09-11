import { useEffect, useState } from "react";
import RequestCard from "@/components/RequestCard";
import { useSession } from "next-auth/react";
import { fetchUserRequest } from "@/lib/actions";
import { getServerSession } from "next-auth";
import { Request } from "@/lib/types";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const MyRequestsPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let requests: Request[] = [];
  let loading = false;

  if (userId) {
    try {
      requests = await fetchUserRequest(userId);
    } catch (error) {
      console.error("Failed to fetch user requests:", error);
    }
  } else {
    loading = false;
  }

  if (loading) {
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
