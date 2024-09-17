import Header from "@/components/Header";
import NavBar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import * as LucideIcons from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { BookOpenText, Library, Users, User } from "lucide-react";
import { getUserById } from "@/lib/repository";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState<string>("");
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const user = await getUserById(session.user.id);
          setUserName(user?.firstName || "User");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session]);
  const navItems = [
    { href: "/admin", text: "Books" },
    { href: "/admin/viewrequests", text: "Book Requests" },

    { href: "/admin/viewmember", text: "View Members" },
    { href: "/profile", text: "View Profile" },
  ];
  return (
    <div className="flex h-screen w-full">
      <SideNav navItems={navItems} userName={userName} />

      <div className="flex flex-col flex-1">
        <div className="flex-grow overflow-y-auto md:overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
