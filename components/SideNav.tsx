"use client";
import Link from "next/link";
import NavLinks from "./nav-links";
import BookIcon from "../public/icon.svg";
import Image from "next/image";
import logo from "./bookImage.png";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
export default function SideNav() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" }); 
  };
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 justify-center items-center rounded-md bg-green-600 p-4 md:h-40"
        href="/books"
      >
        <div className="w-32 text-white md:w-40 justify-center items-center">
          <Image
            src={logo}
            alt="Logo"
            width={180}
            height={50}
            className="object-contain"
          />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
       
      </div>
    </div>
  );
}
