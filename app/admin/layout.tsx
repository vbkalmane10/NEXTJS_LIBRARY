import Header from "@/components/Header";
import NavBar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const navItems = [
    { href: "/admin", text: "Books" },
    { href: "/admin/viewrequests", text: "Book Requests" },
    { href: "/admin/due-today", text: "Due Today" },
    { href: "/admin/viewmember", text: "View Members" },
    { href: "/profile", text: "View Profile" },
  ];
  return (
    <div className="flex h-screen w-full">
      <SideNav navItems={navItems} userName={session?.user.name} />

      <div className="flex flex-col flex-1">
        <div className="flex-grow overflow-y-auto md:overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
