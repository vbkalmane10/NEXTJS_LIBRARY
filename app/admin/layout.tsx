import Header from "@/components/Header";
import NavBar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
export const experimental_ppr = true;
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const navItems = [
    { href: "/admin", icon: "Home", text: "Books" },
    { href: "/admin/viewrequests", icon: "Settings", text: "Book Requests" },
    { href: "/admin/due-today", icon: "HelpCircle", text: "Due Today" },
    { href: "/admin/viewmember", icon: "Bookmark", text: "View Members" },
    { href: "/profile", icon: "Bookmark", text: "View Profile" },
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
