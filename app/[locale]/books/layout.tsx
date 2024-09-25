import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/MemberRepository/repository";
import { useLocale } from "next-intl";
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
    { href: "/books", text: "Books" },
    {
      href: "/books/myrequests",

      text: "My Transactions",
    },
    { href: "/books/mybooks", text: "My Books" },

    ,
    { href: "/books/professors", text: "Professors" },
    { href: "/books/myevents", text: "My Events" },
    { href: "/books/profile", text: "My Profile" },
  ];
  return (
    <div className="flex h-screen w-full  ">
      <div className="flex flex-col flex-1">
        <Header navItems={navItems} userName={userName?.firstName} />

        <div className="flex-grow overflow-y-auto md:overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
