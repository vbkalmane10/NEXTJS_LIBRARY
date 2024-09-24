"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const lang = pathname.startsWith("/kn") ? "kn" : "en";
    setCurrentLanguage(lang);
  }, [pathname]);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const switchLocale = (locale: "en" | "kn") => {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;

    const storedPath = currentPath.substring(3);

    const newPath = `/${locale}${storedPath}${currentSearch}`;
    setCurrentLanguage(locale);
    router.replace(newPath);
  };
  return (
    <header className="flex items-center justify-between px-4 py-4 bg-white shadow-md md:px-6">
      <div className="text-2xl font-bold text-black">Booksphere</div>

      <div className="flex items-center gap-2 md:gap-4">
        <Select onValueChange={switchLocale} value={currentLanguage}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
          </SelectContent>
        </Select>

        {session && (
          <div className="relative">
            <button
              // onClick={() => router.push("/profile")}
              className="flex items-center gap-2"
            >
              <Avatar className="h-10 w-10 border border-black">
                <AvatarFallback>
                  {session?.user?.name
                    ? session.user.name.substring(0, 2).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
             
            </button>

            {/* {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/books/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )} */}
          </div>
        )}
      </div>
    </header>
  );
}
