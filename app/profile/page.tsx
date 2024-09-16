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
  CheckIcon,
  PencilIcon,
  LogOut,
} from "lucide-react";
import Header from "@/components/Header";
import { useEffect, useState, Suspense } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  fetchRecentlyBorrowedBooks,
  fetchRequestStatistics,
  fetchUserDetails,
} from "@/lib/actions";
import { iMember, RequestStatistics } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { handleUserUpdate } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { revalidatePath } from "next/cache";

export default function DisplayProfile() {
  const { data: session, status } = useSession();
  const [statistics, setStatistics] = useState<RequestStatistics>({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
  });
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [recentBooks, setRecentBooks] = useState([]);
  const [userInfo, setUserInfo] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    membershipStatus: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    const loadStatistics = async () => {
      if (session?.user?.id) {
        try {
          const stats = await fetchRequestStatistics(session.user.id);
          const books = await fetchRecentlyBorrowedBooks(session.user.id);
          const user = await fetchUserDetails(session?.user.id);
          if (user) {
            setUserInfo({
              id: user.id,
              firstName: user.firstName || "",  
              lastName: user.lastName || "",    
              email: user.email,
              address: user.address || "",      
              phoneNumber: user.phoneNumber || "", 
              membershipStatus: user.membershipStatus || "",
              role: user.role || "",
              password: "",  
            });
          } else {
            console.error("User not found");
          }
          setRecentBooks(recentBooks);
          setStatistics(stats);
        } catch (error) {
          console.error("Error fetching request statistics:", error);
        }
      }
    };

    loadStatistics();
  }, [session, recentBooks]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const toggleEdit = async () => {
    if (isEditing) {
      try {
        console.log("This is the userInfo", userInfo.membershipStatus);
        const response = await handleUserUpdate(session!.user.id, userInfo);
        if (!response.success) {
          toast({
            title: "Error updating user info",
            description: response.message,
            className: "bg-red-700 text-white",
          });
        } else {
          toast({
            title: "Success",
            description: response.message,
            className: "bg-green-400 text-white",
            duration: 1000,
          });
        }
      } catch (error) {
        throw new Error("Error updating user");
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-4xl mx-auto overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col md:w-1/3 bg-black text-white p-6 flex-1 justify-between">
              <div className=" flex flex-col justify-center items-center">
                <Avatar className="w-32 h-32 mb-4 border-2 border-white">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" />
                  <AvatarFallback className="text-black font-semibold border border-black text-3xl">
                    {session?.user?.name
                      ? session.user.name.substring(0, 2).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-center mb-4">
                  {session?.user.name}
                </h2>
                <Button
                  onClick={toggleEdit}
                  variant="outline"
                  className={`w-full text-black hover:bg-gray-200 ${
                    isEditing
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-white"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  ) : (
                    <>
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
              <div className="mt-auto">
                <Button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-white bg-red-500 rounded-md transition-colors duration-200 hover:bg-red-700"
                >
                  <LogOut size={20} className="mr-3" />
                  Logout
                </Button>
              </div>
            </div>
            <Suspense fallback={<p>Loading profile...</p>}>
              <div className="md:w-2/3 p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={userInfo.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={userInfo.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={userInfo.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={userInfo.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="mt-6">
                  <CardContent className="p-4 grid gap-4">
                    <h3 className="text-xl font-semibold">Transactions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="flex-1">
                        <CardContent className="flex flex-col items-center justify-center p-2">
                          <NotebookTabs className="h-6 w-6 text-primary" />
                          <div className="text-lg font-bold mt-1">
                            {statistics.totalRequests}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Total books requested
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="flex-1">
                        <CardContent className="flex flex-col items-center justify-center p-2">
                          <ShieldCheck className="h-6 w-6 text-green-500" />
                          <div className="text-lg font-bold mt-1">
                            {statistics.approvedRequests}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Approved requests
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="flex-1">
                        <CardContent className="flex flex-col items-center justify-center p-2">
                          <Clock className="h-6 w-6 text-yellow-500" />
                          <div className="text-lg font-bold mt-1">
                            {statistics.pendingRequests}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Pending requests
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
