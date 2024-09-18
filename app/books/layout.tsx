import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/MemberRepository/repository";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userName = await getUserById(session.user?.id);
  const navItems = [
    { href: "/books", text: "Books" },
    {
      href: "/books/myrequests",

      text: "My Requests",
    },
    // { href: "/books/mybooks", text: "My Books" },
    // { href: "/books/favorites", text: "My Favorites" },
    { href: "/books/profile", text: "My Profile" },
  ];
  return (
    <div className="flex h-screen w-full">
      <SideNav navItems={navItems} userName={userName?.firstName} />

      <div className="flex flex-col flex-1">
        <Header membershipStatus={userName?.membershipStatus} />

        <div className="flex-grow overflow-y-auto md:overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
