"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleUser } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const linkClassName = (path: string) =>
    `hover:text-blue-500 ${
      pathname === path ? "text-blue-600 font-semibold" : ""
    }`;

  // Determine user role
  const userRole = session?.user?.role;

  return (
    <header className="flex items-center px-6 py-4 bg-white shadow-md justify-between">
      <div className="text-2xl font-bold text-black">Booksphere</div>

      <div className="flex gap-5">
        {userRole === "admin" ? (
          <>
            <Link href="/admin" className={linkClassName("/admin")}>
              Books
            </Link>
            <Link
              href="/admin/viewrequests"
              className={linkClassName("/admin/viewrequests")}
            >
              Book Requests
            </Link>
            <Link
              href="/books/due-today"
              className={linkClassName("/books/due-today")}
            >
              Due Today
            </Link>
          </>
        ) : (
          <>
            <Link href="/books" className={linkClassName("/books")}>
              Books
            </Link>
            <Link
              href="/books/myrequests"
              className={linkClassName("/books/myrequests")}
            >
              My Requests
            </Link>
          </>
        )}
      </div>

      <nav className="hidden md:flex gap-4">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button onClick={toggleMenu} className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                  <AvatarFallback>
                    {session?.user?.name
                      ? session.user.name.substring(0, 2).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            {isMenuOpen && (
              <DropdownMenuContent>
                <Link href="/profile">
                  <DropdownMenuItem>My Account</DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        ) : (
          <>
            <Link href="/login" className="hover:text-blue-500">
              Login
            </Link>
            <Link href="/signup" className="hover:text-blue-500">
              Register
            </Link>
          </>
        )}
      </nav>

      <button className="md:hidden text-blue-500"></button>

      <nav className="absolute right-6 top-16 bg-white shadow-lg p-4 rounded-md flex flex-col gap-2 md:hidden">
        <Link href="/" className="hover:text-blue-500">
          Home
        </Link>
        <Link href="/books" className="hover:text-blue-500">
          Books
        </Link>
        {session ? (
          <>
            <Link href="/profile" className="hover:text-blue-500">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-left hover:text-blue-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-blue-500">
              Login
            </Link>
            <Link href="/signup" className="hover:text-blue-500">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
