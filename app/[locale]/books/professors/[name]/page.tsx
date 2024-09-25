"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { InlineWidget } from "react-calendly";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import CalendlyWidget from "@/components/CalendlyWidget";
import { useSession } from "next-auth/react";
import { fetchUserDetails } from "@/lib/MemberRepository/actions";

export default function BookAppointmentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [prefill, setPrefill] = useState<{ email: string; name: string }>({
    email: "",
    name: "",
  });

  useEffect(() => {
    async function fetchData() {
      // Get Calendly URL from search params
      const url = searchParams.get("calendlyUrl");
      if (url) {
        setCalendlyUrl(decodeURIComponent(url));
      } else {
        router.push("/books/professors"); // Redirect if no Calendly URL
      }

      // Fetch user details if session exists
      if (session?.user?.email) {
        try {
          const userDetails = await fetchUserDetails(session!.user?.id);
          setPrefill({
            email: userDetails!.email,
            name: userDetails!.firstName,
          });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        setPrefill({
          email: "guest@example.com",
          name: "Guest User",
        });
      }

      setIsLoading(false);
    }

    fetchData();
  }, [searchParams, session, router]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader2 className="animate-spin" />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  if (!calendlyUrl) {
    return <div>Error: No Calendly link found for this professor.</div>;
  }

  return (
    <div className="h-full w-full">
    
      <CalendlyWidget url={calendlyUrl} prefill={prefill} />
    </div>
  );
}
