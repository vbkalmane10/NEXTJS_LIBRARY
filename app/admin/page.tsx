"use client";

import React, { useState, useEffect } from "react";
import Search from "@/components/search";
import Pagination from "@/components/Pagination";
import { fetchBooks, handleDeleteBook } from "@/lib/BookRepository/actions";
import { signOut } from "next-auth/react";
import AdminBookTable from "@/components/AdminBookCard";
import AddBook from "@/components/AddBook";
import { toast } from "@/hooks/use-toast";
import { iBook } from "@/lib/types";
import { useRouter } from "next/navigation";
import SideNav from "@/components/SideNav";
import Header from "@/components/Header";

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const [books, setBooks] = useState<iBook[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const router = useRouter();

  async function loadBooks() {
    try {
      const { books, totalPages } = await fetchBooks(query, currentPage, 7);
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
    loadBooks();
  }, [query, currentPage]);

  // Handle the deletion of a book
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

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="p-8 flex-grow">
        <h1 className="text-3xl font-bold">Welcome, Admin</h1>

        <div className="flex w-full items-center justify-between mt-4">
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
      </div>
    </div>
  );
}
