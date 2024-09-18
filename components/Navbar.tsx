
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname(); 

 
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex space-x-4">
            <Link
              href="/books"
              className={`font-medium ${
                isActive("/books")
                  ? "text-blue-600 font-bold"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              All Books
            </Link>
            <Link
              href="/requests"
              className={`font-medium ${
                isActive("/requests")
                  ? "text-blue-600 font-bold"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              Requests
            </Link>
            <Link
              href="/transactions"
              className={`font-medium ${
                isActive("/transactions")
                  ? "text-blue-600 font-bold"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              Transactions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
