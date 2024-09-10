"use client"; 

import { signOut } from "next-auth/react";
import { PowerIcon } from "@heroicons/react/24/outline";

const SignOutButton = () => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 p-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
    >
      <PowerIcon className="h-5 w-5" />
 
    </button>
  );
};

export default SignOutButton;
