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
import {
  getProfessors,
  handleProfessorDelete,
  refreshInvitationStatus,
} from "@/lib/actions";
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

  // const handleDelete = async (id: number | undefined) => {
  //   try {
  //     const result = await handleProfessorDelete(id);
  //     if (result) {
  //       toast({
  //         title: "Success",
  //         description: result.message,
  //         className: "bg-green-400 text-white",
  //         duration: 1000,
  //       });
  //       loadProfessors();
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to delete professor. Please try again.",
  //       className: "bg-red-600 text-white",
  //       duration: 1000,
  //     });
  //   }
  // };
  const handleEdit = (id: number | undefined) => {
    router.push(`/admin/editprofessor/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader2 className="animate-spin" />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }
  async function handleRefresh(email: string) {
    try {
      const result = await refreshInvitationStatus(email);

      if (result.accepted) {
        toast({
          title: "Invitation Accepted",
          description:
            "Professor accepted the invitation and Calendly link is updated.",
          className: "bg-green-600 text-white",
          duration: 1000,
        });
        loadProfessors(); 
      } else {
        toast({
          title: "No Update",
          description: "Professor has not yet accepted the invite.",
          className: "bg-yellow-600 text-white",
          duration: 1000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh invitation status.",
        className: "bg-red-600 text-white",
        duration: 1000,
      });
    }
  }

  return (
    <div className="flex flex-col w-full h-full">
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
            onRefresh={handleRefresh}
            onEdit={handleEdit}
            //onDelete={handleDelete}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
