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
    { href: "/books", icon: "Home", text: "Books" },
    { href: "/books/myrequests", icon: "LibraryBig", text: "My Requests" },
    { href: "/books/mybooks", icon: "HelpCircle", text: "My Books" },
    { href: "/books/favorites", icon: "Heart", text: "My Favorites" },
    { href: "/profile", icon: "Bookmark", text: "My Profile" },
  ];
  return (
    <div className="flex h-screen w-full">
      <SideNav navItems={navItems} userName={session?.user.name} />

      <div className="flex flex-col flex-1">
        <Header />

        <div className="flex-grow overflow-y-auto md:overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
