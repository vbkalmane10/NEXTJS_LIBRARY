"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const switchLocale = (locale: "en" | "kn") => {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;

    const storedPath = currentPath.substring(3);

    const newPath = `/${locale}${storedPath}${currentSearch}`;

    router.replace(newPath);
  };
  return (
    <header className="flex items-center px-6 py-4 bg-white shadow-md md:justify-between justify-center">
      <div className="text-2xl font-bold text-black">Booksphere</div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => switchLocale("en")}
          className="px-3 py-1 bg-gray-200 rounded-full text-sm"
        >
          English
        </button>
        <button
          onClick={() => switchLocale("kn")}
          className="px-3 py-1 bg-gray-200 rounded-full text-sm"
        >
          ಕನ್ನಡ
        </button>
        {session && (
          <nav>
            <button
              onClick={toggleMenu}
              className="flex items-center gap-2 md:items-end"
            >
              <Link href="/books/profile">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {session?.user?.name
                      ? session.user.name.substring(0, 2).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </button>

            {/* <DropdownMenuContent>
              <Link href="/profile">
                <DropdownMenuItem>My Account</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent> */}
          </nav>
        )}
      </div>
    </header>
  );
}
