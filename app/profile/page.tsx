"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  NotebookTabs,
  ChevronRight,
  ShieldCheck,
  Clock,
  BookOpen,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import { JSX, SVGProps, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  fetchRecentlyBorrowedBooks,
  fetchRequestStatistics,
} from "@/lib/actions";
import { RequestStatistics } from "@/lib/types";

export default function DisplayProfile() {
  const { data: session, status } = useSession();
  const [statistics, setStatistics] = useState<RequestStatistics>({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
  });
  const [recentBooks, setRecentBooks] = useState([]);
  useEffect(() => {
    console.log(session);
    const loadStatistics = async () => {
      if (session?.user?.id) {
        try {
          const stats = await fetchRequestStatistics(session.user.id);
          const books = await fetchRecentlyBorrowedBooks(session.user.id);
          setRecentBooks(books);
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
      <div className="flex min-h-screen">
        <div className="flex-1 max-w-[800px] mx-auto p-6 md:p-10">
          <Card>
            <CardHeader className="bg-muted/20 p-8">
              <div className="flex items-center gap-6">
                <Avatar className="h-16 w-16">
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
                <h3 className="text-xl font-semibold">Recent Transactions</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardContent className="flex flex-col p-4">
                      <h4 className="text-lg font-semibold">
                        Recently Borrowed
                      </h4>
                      <ul className="list-disc pl-5 mt-2">
                        {recentBooks.map((book) => (
                          <li key={book.bookId}>{book.bookTitle}</li>
                        ))}
                        {recentBooks.length === 0 && (
                          <li>No recent borrowings.</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <Separator />
              {/* <div className="grid gap-4">
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
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


