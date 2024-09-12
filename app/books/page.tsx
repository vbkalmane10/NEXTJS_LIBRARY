import Search from "@/components/search";
import Pagination from "@/components/Pagination";
import BookCard from "@/components/BookCard";
import { fetchBooks } from "@/lib/actions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GenreMenu from "@/components/Genre";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SideNav from "@/components/SideNav";
import Header from "@/components/Header";
import { Home, Settings, HelpCircle, Bookmark } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = session.user?.id;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const booksPerPage = 8;

  const { books, totalPages } = await fetchBooks(
    query,
    currentPage,
    booksPerPage
  );

  const navItems = [
    { href: "/books", icon: "Home", text: "Books" },
    { href: "/books/myrequests", icon: "Settings", text: "My Requests" },
    { href: "/books/mybooks", icon: "HelpCircle", text: "My Books" },
    { href: "/books/favorites", icon: "Bookmark", text: "My Favorites" },
  ];

  return (
    <div className="p-8">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Books</h1>
      </div>

      <div className="mt-4 flex gap-4 items-center">
        <Search placeholder="Search books..." />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} userId={userId} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
