"use client";
import Header from "@/components/Header";

import SideNav from "@/components/SideNav";

import { getUserById } from "@/lib/repository";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
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
    { href: "/books", text: "Books" },
    {
      href: "/books/myrequests",

      text: "My Requests",
    },

    { href: "/profile", text: "My Profile" },
  ];
  return (
    <div className="flex h-screen w-full">
      <SideNav navItems={navItems} userName={userName} />

      <div className="flex flex-col flex-1">
        <Header />

        <div className="flex-grow overflow-y-auto md:overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
