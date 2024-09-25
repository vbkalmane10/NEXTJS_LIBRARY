"use client";

import { useSession } from "next-auth/react";
import {
  fetchUserRequest,
  handleCancelRequest,
  handleReturnBook,
} from "@/lib/actions";
import { Request } from "@/lib/types";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import MyBooksCard from "@/components/MyBooksCard";
import { Ban } from "lucide-react";
import { useTranslations } from "next-intl";
const MyBooksPage = () => {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const t = useTranslations("myBooks");

  useEffect(() => {
    const fetchRequests = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const userRequests = await fetchUserRequest(
            session.user.id,
            "Approved"
          );
          setRequests(userRequests);
        } catch (error) {
          console.error("Failed to fetch user books:", error);
          setError("Failed to fetch user books. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [session, status]);

  const handleReturn = async (request: Request) => {
    try {
      const result = await handleReturnBook(request);
      if (result) {
        toast({
          title: "Success",
          description: result.message,
          className: "bg-green-500 text-black",
        });
        //   setRequests((prevRequests) =>
        //     prevRequests.filter((req) => req.id !== request.id)
        //   );
        //   router.refresh();
      } else {
        toast({
          title: "Error",
          description: "Error while returning the book",
          className: "bg-red-500 text-white",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error while returning book",
        className: "bg-red-500 text-white",
      });
    }
  };

  if (loading) {
    return (
      <p className="h-full w-full flex justify-center items-center">
        Loading transactions...
      </p>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="w-full h-full bg-white flex justify-center items-center">
        <p>{t("You havent borrowed any books")} !!!</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("My Books")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request) => (
          <MyBooksCard
            key={request.id}
            request={request}
            onReturn={handleReturn}
          />
        ))}
      </div>
    </div>
  );
};

export default MyBooksPage;
