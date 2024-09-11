import Search from "@/components/search";
import Pagination from "@/components/Pagination";
import BookCard from "@/components/BookCard";
import { fetchBooks } from "@/lib/actions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GenreMenu from "@/components/Genre";
import { authOptions } from "../api/auth/[...nextauth]/route";

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

  return (
    <div className="p-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Books</h1>
      </div>

      <div className="mt-4 flex gap-4 items-center">
        <Search placeholder="Search books..." />
        {/* <GenreMenu /> */}
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
