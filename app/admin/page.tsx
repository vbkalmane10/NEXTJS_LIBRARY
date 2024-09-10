"use client";

import React, { useState, useEffect } from "react";
import Search from "@/components/search";
import Pagination from "@/components/Pagination";
import { fetchBooks, handleDeleteBook } from "@/lib/actions";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminBookTable from "@/components/AdminBookCard";
import AddBook from "@/components/AddBook";
import { toast } from "@/hooks/use-toast";
import { iBook } from "@/lib/types";

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

  const [books, setBooks] = useState<iBook[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  async function loadBooks() {
    try {
      const { books, totalPages } = await fetchBooks(query, currentPage, 8);
      setBooks(books);
      setTotalPages(totalPages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch books.",
        variant: "destructive",
      });
    }
  }
  useEffect(() => {
    if (status === "authenticated") {
      if (session!.user?.role !== "admin") {
        router.push("/login");
      } else {
        loadBooks();
      }
    }
  }, [query, currentPage, router, session]);

  const handleDelete = async (isbnNo: string) => {
    try {
      const result = await handleDeleteBook(isbnNo);
      if (result) {
        toast({
          title: "Success",
          description: result.message,
          className: "bg-green-600 text-white",
          duration: 1000,
        });

        const { books, totalPages } = await fetchBooks(query, currentPage, 8);
        setBooks(books);
        setTotalPages(totalPages);
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

  const handleEdit = (isbnNo: string) => {
    router.push(`/admin/${isbnNo}/edit`);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
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
        <h1 className="text-2xl font-bold">Books</h1>
      </div>

      <div className="mt-4 flex gap-4 items-center">
        <Search placeholder="Search books..." />
        <AddBook />
      </div>
      <div className="mt-6">
        <AdminBookTable
          books={books}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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
