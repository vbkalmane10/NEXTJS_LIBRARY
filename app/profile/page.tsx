"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { NotebookTabs, ChevronRight, ShieldCheck, Clock } from "lucide-react";
import Header from "@/components/Header";
import { JSX, SVGProps, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchRequestStatistics } from "@/lib/actions";
import { RequestStatistics } from "@/lib/types";
export default function DisplayProfile() {
  const { data: session, status } = useSession();
  const [statistics, setStatistics] = useState<RequestStatistics>({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    const loadStatistics = async () => {
      if (session?.user?.id) {
        try {
          const stats = await fetchRequestStatistics(session.user.id);
          setStatistics(stats);
        } catch (error) {
          console.error("Error fetching request statistics:", error);
        }
      }
    };

    loadStatistics();
  }, [session]);
  return (
    <div>
      <Header />
      <div className="flex min-h-screen">
        <div className="flex-1 max-w-[800px] mx-auto p-6 md:p-10">
          <Card>
            <CardHeader className="bg-muted/20 p-8">
              <div className="flex items-center gap-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                  <AvatarFallback>
                    {session?.user?.name
                      ? session.user.name.substring(0, 2).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
                  <p className="text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 grid gap-6">
              <div className="grid gap-4">
                <h3 className="text-xl font-semibold">Transactions</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <NotebookTabs className="h-8 w-8 text-primary" />
                      <div className="text-2xl font-bold mt-2">
                        {statistics.totalRequests}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Total books requested
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <ShieldCheck className="h-8 w-8 text-green-500" />
                      <div className="text-2xl font-bold mt-2">
                        {statistics.approvedRequests}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Approved requests
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <Clock className="h-8 w-8 text-yellow-500" />
                      <div className="text-2xl font-bold mt-2">
                        {statistics.pendingRequests}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Pending requests
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4">
                <h3 className="text-xl font-semibold">Profile Details</h3>
                <div className="grid gap-2">
                  <Card className="flex flex-row items-center justify-between p-4">
                    <CardContent className="flex items-center gap-4">
                      <FilePenIcon className="h-7 w-7 text-primary" />
                      <div className="text-lg font-bold">
                        Edit basic details
                      </div>
                    </CardContent>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Card>
                  <Card className="flex flex-row items-center justify-between p-4">
                    <CardContent className="flex items-center gap-4">
                      <LockIcon className="h-7 w-7 text-yellow-500" />
                      <div className="text-lg font-bold">Forgot password</div>
                    </CardContent>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Card>
                  <Card className="flex flex-row items-center justify-between p-4">
                    <CardContent className="flex items-center gap-4">
                      <LogOutIcon className="h-7 w-7 text-red-500" />
                      <div className="text-lg font-bold">Logout</div>
                    </CardContent>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FilePenIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function LockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function LogOutIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
