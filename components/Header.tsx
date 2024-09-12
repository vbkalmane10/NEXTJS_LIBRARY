"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex items-center px-6 py-4 bg-white shadow-md md:justify-between justify-center">
      <div className="text-2xl font-bold text-black">Booksphere</div>

      {session && (
        <nav className="absolute right-6">
          <button onClick={toggleMenu} className="flex items-center gap-2">
            <Link href="/profile">
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
    </header>
  );
}
