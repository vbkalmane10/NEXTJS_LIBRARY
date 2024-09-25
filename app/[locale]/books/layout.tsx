import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/MemberRepository/repository";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
export default async function Layout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  const userName = await getUserById(session.user?.id);
  const t = await getTranslations("Header");
  const navItems = [
    { href: "/books", text: t("Books") },
    { href: "/books/myrequests", text: t("My Transactions") },
    { href: "/books/mybooks", text: t("My Books") },
    { href: "/books/professors", text: t("Professors") },
    { href: "/books/myevents", text: t("My Events") },
    { href: "/books/profile", text: t("My Profile") },
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
