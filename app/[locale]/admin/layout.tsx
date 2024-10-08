import SideNav from "@/components/SideNav";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { getUserById } from "@/lib/MemberRepository/repository";
import Header from "@/components/Header";
export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  const userName = await getUserById(session.user?.id);
  const navItems = [
    { href: "/admin", text: "Books" },
    { href: "/admin/viewrequests", text: "Book Requests" },
    { href: "/admin/dueToday", text: "Due Today" },
    { href: "/admin/viewmember", text: "View Members" },
    { href: "/admin/viewprofessor", text: "View Professors" },

    { href: "/admin/myevents", text: "Events" },
    { href: "/admin/profile", text: "View Profile" },
  ];
  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-col flex-1">
        <Header navItems={navItems} userName={userName?.firstName} />
        <div className="flex-grow h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
