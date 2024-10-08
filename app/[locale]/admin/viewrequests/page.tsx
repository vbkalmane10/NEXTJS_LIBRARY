"use client";
import React, { useEffect, useState } from "react";
import RequestTable from "@/components/Requests";
import {
  getRequests,
  handleApproveRequest,
  handleRejectRequest,
} from "@/lib/actions";
import { Request } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import Header from "@/components/Header";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
const ViewRequestPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const t = useTranslations("viewrequests");
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  useEffect(() => {
    const fetchRequests = async (page: number) => {
      try {
        const fetchedRequests = await getRequests(page);
        setRequests(fetchedRequests.data);

        setTotalPages(fetchedRequests.totalPages);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRequests(currentPage);
  }, [currentPage]);

  const handleApprove = async (request: Request) => {
    try {
      const result = await handleApproveRequest(request);
      if (result) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === request.id ? { ...req, status: "Approved" } : req
          )
        );
        revalidatePath("/books/viewrequests");
      }
    } catch (error) {
      console.log("Error");
    }
  };

  const handleReject = async (request: Request) => {
    try {
      const result = await handleRejectRequest(request);
      if (result) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === request.id ? { ...req, status: "Rejected" } : req
          )
        );
        revalidatePath("/books/viewrequests");
      }
    } catch (error) {
      console.log("Error while rejecting");
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader2 className="animate-spin" /> {/* Loading spinner */}
        <p className="ml-2">Loading...</p>
      </div>
    );
  }
  if (error)
    return (
      <p>
        {t("error")} {error}
      </p>
    );

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">{t("viewRequests")}</h1>
        {requests.length === 0 ? (
          <p>{t("noRequestsFound")}</p>
        ) : (
          <RequestTable
            requests={requests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default ViewRequestPage;
