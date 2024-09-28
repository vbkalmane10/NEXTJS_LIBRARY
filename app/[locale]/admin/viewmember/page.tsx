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
import { Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState<boolean>(true);
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const router = useRouter();
  async function loadUsers() {
    try {
      const { users, totalPages } = await getUsers(query, currentPage, 10);
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
    setLoading(false);
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
        description: "Failed to delete member. Please try again.",
        className: "bg-red-600 text-white",
        duration: 1000,
      });
    }
  };
  const handleEdit = (id: number) => {
    router.push(`/admin/editmember/${id}/edit`);
  };
  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader2 className="animate-spin" /> 
        <p className="ml-2">Loading...</p>
      </div>
    );
  }
  return (
  
    <div className="flex flex-col w-full max-w-full overflow-x-hidden">
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row w-full items-center justify-between mt-4 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Users</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <Search placeholder="Search Users.."/>
          <AddUser />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
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
