"use client";

import React, { useState, useEffect } from "react";
import Search from "@/components/search";
import Pagination from "@/components/Pagination";
import { fetchBooks, handleDeleteBook } from "@/lib/BookRepository/actions";
import { handleUserDelete, getUsers } from "@/lib/MemberRepository/actions";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminBookTable from "@/components/AdminBookCard";
import AddBook from "@/components/AddBook";
import { toast } from "@/hooks/use-toast";
import { iBook, iMember } from "@/lib/types";
import AdminUserTable from "@/components/ViewMember";
import AddUser from "@/components/AddUser";
import Header from "@/components/Header";

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const [users, setUsers] = useState<iMember[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const router = useRouter();
  async function loadUsers() {
    try {
      const { users, totalPages } = await getUsers(query, currentPage, 8);
      setUsers(users);
      setTotalPages(totalPages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
    }
  }
  useEffect(() => {
    loadUsers();
  }, [query, currentPage]);
  const handleDelete = async (id: number) => {
    try {
      const result = await handleUserDelete(id);
      if (result) {
        toast({
          title: "Success",
          description: result.message,
          className: "bg-green-400 text-white",
          duration: 1000,
        });
        loadUsers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        className: "bg-red-600 text-white",
        duration: 1000,
      });
    }
  };
  const handleEdit = (id: number) => {
    router.push(`/admin/editmember/${id}/edit`);
  };
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />
      <div className="w-full p-8">
        <h1 className="text-2xl font-bold">Users</h1>

        <div className="mt-4 flex gap-4 items-center">
          <Search placeholder="Search Users..." />
          <AddUser />
        </div>
        <div className="mt-6">
          <AdminUserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
