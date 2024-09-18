import { fetchBooks } from "@/lib/BookRepository/actions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ClientSideBooks from "@/components/ClientSideBook";

const sortBooks = (books: any[], sortBy: string) => {
  return [...books].sort((a, b) => {
    if (sortBy === "price") {
      return a.price - b.price;
    }
    return a[sortBy].localeCompare(b[sortBy]);
  });
};
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
  const userName = session.user?.name;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const booksPerPage = 8;

  const { books, totalPages } = await fetchBooks(
    query,
    currentPage,
    booksPerPage
  );

  return (
    <ClientSideBooks
      books={books}
      userId={userId}
      userName={userName}
      currentPage={currentPage}
      totalPages={totalPages}
      query={query}
    />
  );
  // return (
  //   <div className="p-8">
  //     <div className="flex w-full items-center justify-between">
  //       <h1 className="text-2xl font-bold">Books</h1>
  //     </div>

  //     <div className="mt-4 flex gap-4 items-center">
  //       <Search placeholder="Search books..." />
  //       <SortByDropdown currentSortOption={sortBy as "title" | "author" | "genre" | "price"} />
  //     </div>

  //     <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  //       {sortedBooks.map((book) => (
  //         <BookCard
  //           key={book.id}
  //           book={book}
  //           userId={userId}
  //           username={userName}
  //         />
  //       ))}
  //     </div>

  //     <div className="mt-8 flex justify-center">
  //       <Pagination currentPage={currentPage} totalPages={totalPages} />
  //     </div>
  //   </div>
  // );
}
