"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";

export default function GenreDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-blue-600">
          Genre
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white shadow-lg rounded-md p-2">
        <DropdownMenuItem asChild>
          <Link href="/genres/history" className="hover:text-blue-500">
            History
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/genres/fiction" className="hover:text-blue-500">
            Fiction
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/genres/religion" className="hover:text-blue-500">
            Religion
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/genres/computers" className="hover:text-blue-500">
            Computers
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
