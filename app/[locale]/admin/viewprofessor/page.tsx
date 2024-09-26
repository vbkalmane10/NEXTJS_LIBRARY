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
import { iBook, iMember, Professor } from "@/lib/types";
import AdminUserTable from "@/components/ViewMember";
import AddUser from "@/components/AddUser";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";
import { getProfessors } from "@/lib/actions";
import AdminProfessorTable from "@/components/AdminProfessorTable";
import AddProfessor from "@/components/AddProfessor";
export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const router = useRouter();
  async function loadProfessors() {
    try {
      const { professors, totalPages } = await getProfessors(
        query,
        currentPage,
        10
      );
      setProfessors(professors);
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
    loadProfessors();
    setLoading(false);
  }, [query, currentPage]);
  //   const handleDelete = async (id: number) => {
  //     try {
  //       const result = await handleUserDelete(id);
  //       if (result) {
  //         toast({
  //           title: "Success",
  //           description: result.message,
  //           className: "bg-green-400 text-white",
  //           duration: 1000,
  //         });
  //         loadUsers();
  //       }
  //     } catch (error) {
  //       toast({
  //         title: "Error",
  //         description: "Failed to delete book. Please try again.",
  //         className: "bg-red-600 text-white",
  //         duration: 1000,
  //       });
  //     }
  //   };
  //   const handleEdit = (id: number) => {
  //     router.push(`/admin/editmember/${id}/edit`);
  //   };
  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader2 className="animate-spin" /> {/* Loading spinner */}
        <p className="ml-2">Loading...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full">
      <div className="p-8">
        <div className="flex w-full items-center justify-between mt-4">
          <h1 className="text-2xl font-bold">Professors</h1>
        </div>

        <div className="mt-4 flex gap-4 items-center">
          <Search placeholder="Search Professors.." />
          <AddProfessor />
        </div>

        <div className="mt-6">
          <AdminProfessorTable
            users={professors}
            // onEdit={handleEdit}
            // onDelete={handleDelete}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
