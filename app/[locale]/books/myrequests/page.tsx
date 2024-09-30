"use client";
import RequestCard from "@/components/RequestCard";
import { useSession } from "next-auth/react";
import {
  fetchUserRequest,
  handleCancelRequest,
  handleReturnBook,
} from "@/lib/actions";
import { getServerSession } from "next-auth";
import { Request } from "@/lib/types";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

const MyRequestsPage = () => {
  const { data: session, status } = useSession();

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"Approved" | "Pending" | "Returned">(
    "Pending"
  );
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("myrequests");

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

  const filteredRequests = requests.filter((request) => {
    if (filter === "Approved") {
      return request.status === "Approved";
    } else if (filter === "Pending") {
      return request.status === "Pending";
    } else if (filter === "Returned") {
      return request.status === "Returned";
    }
    return true;
  });

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader2 className="animate-spin" />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <p className="h-full w-full flex justify-center items-center">
        {t("No transactions found for your account")}
      </p>
    );
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("My Book Transactions")}</h1>

      <div className="mb-6">
        <label
          htmlFor="request-filter"
          className="text-sm font-medium text-gray-700"
        >
          {t("Filter transactions by status:")}
        </label>
        <select
          id="request-filter"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "Approved" | "Pending" | "Returned")
          }
          className="ml-2 px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="Pending">{t("Pending")}</option>
          <option value="Approved">{t("Approved")}</option>
          <option value="Returned">{t("Returned")}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onCancel={() => handleCancel(request.id)}
              // onReturn={() => handleReturn(request)}
            />
          ))
        ) : (
          <p>{t("No transactions found")}</p>
        )}
      </div>
    </div>
  );
};

export default MyRequestsPage;
