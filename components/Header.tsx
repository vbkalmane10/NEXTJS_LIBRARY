"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

export default function Header({
  membershipStatus,
}: {
  membershipStatus: string | undefined;
}) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const membershipColor =
    membershipStatus === "active" ? "bg-green-500" : "bg-red-500";
  const membershipLabel = membershipStatus === "active" ? "Active" : "Expired";
  return (
    <header className="flex items-center px-6 py-4 bg-white shadow-md md:justify-between justify-center">
      <div className="text-2xl font-bold text-black">Booksphere</div>
      <div className="flex items-center gap-1">
        {membershipStatus && (
          <div
            className={`ml-4 px-3 py-1 text-sm font-semibold text-white rounded-full ${membershipColor}`}
          >
            {membershipLabel}
          </div>
        )}
        {session && (
          <nav>
            <button onClick={toggleMenu} className="flex items-center gap-2">
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
