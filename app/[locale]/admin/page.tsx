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

import { useTranslations } from "next-intl";

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
  const [loading, setLoading] = useState<boolean>(true);
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const router = useRouter();
  const t = useTranslations("AdminPage");
  async function loadBooks() {
    try {
      const { books, totalPages } = await fetchBooks(query, currentPage, 7);
      setBooks(books);
      setTotalPages(totalPages);
    } catch (error) {
      toast({
        title: t("error.title"),
        description: t("error.fetchBooks"),
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    try {
      loadBooks();
    } catch (error) {
      throw new Error("Error while fetching books");
    } finally {
      setLoading(false);
    }
  }, [query, currentPage]);

  const handleDelete = async (isbnNo: string) => {
    try {
      const result = await handleDeleteBook(isbnNo);
      if (result) {
        toast({
          title: t("success.title"),
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
        title: t("error.title"),
        description: t("error.deleteBook"),
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
    <div className="flex flex-col w-full max-w-full overflow-x-hidden">
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{t("welcomeAdmin")}</h1>

      <div className="flex flex-col sm:flex-row w-full items-center justify-between mt-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t("booksHeading")}</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <Search placeholder={t("searchPlaceholder")} />
          <AddBook />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
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
