"use client";

import React, { useState, useEffect } from "react";
import Search from "@/components/search";
import Pagination from "@/components/Pagination";
import { fetchBooks, getUsers, handleDeleteBook } from "@/lib/actions";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminBookTable from "@/components/AdminBookCard";
import AddBook from "@/components/AddBook";
import { toast } from "@/hooks/use-toast";
import { iBook, iMember } from "@/lib/types";
import AdminUserTable from "@/components/ViewMember";
import AddUser from "@/components/AddUser";

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<iMember[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  useEffect(() => {
    async function loadUsers() {
      try {
        const { users, totalPages } = await getUsers(query, currentPage, 8);
        setUsers(users);
        setTotalPages(totalPages);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch books.",
          variant: "destructive",
        });
      }
    }

    loadUsers();
   
  }, [query, currentPage]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="w-full mr-4">
      <div className="my-4">
        <h1 className="text-3xl font-bold">Welcome, Admin</h1>
      </div>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      <div className="mt-4 flex gap-4 items-center">
        <Search placeholder="Search Users..." />
        <AddUser />
      </div>
      <div className="mt-6">
        <AdminUserTable users={users} />
      </div>
      <div className="mt-8 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
      <button
        onClick={handleSignOut}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
