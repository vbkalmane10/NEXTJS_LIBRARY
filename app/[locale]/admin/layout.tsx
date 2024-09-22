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
    { href: "/admin/profile", text: "View Profile" },
  ];
  return (
    <div className="flex h-screen w-full">
      <SideNav
        navItems={navItems}
        userName={userName?.firstName}
        membershipStatus={userName?.membershipStatus}
        locale={locale}
      />

      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-grow overflow-y-auto md:overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
