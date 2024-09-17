"use client";

import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import Pagination from "./Pagination";
import Search from "./search";
import { iBook } from "@/lib/types";

interface BookProps {
  books: iBook[];
  userId: number;
  userName: string;
  currentPage: number;
  totalPages: number;
  query: string;
}

export default function ClientSideBooks({
  books,
  userId,
  userName,
  currentPage,
  totalPages,
  query,
}: BookProps) {
  const [sortBy, setSortBy] = useState<string>("");
  const [sortedBooks, setSortedBooks] = useState<iBook[]>(books);

  useEffect(() => {
    setSortedBooks(sortBooksBy(books, sortBy));
  }, [books, sortBy]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSort = event.target.value;
    setSortBy(selectedSort);
  };

  return (
    <div className="p-8">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Books</h1>
      </div>

      <div className="mt-4 flex gap-4 items-center">
        <Search placeholder="Search books..." />
        <select
          className="p-2 border border-gray-300 rounded"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="">Sort by</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="genre">Genre</option>
          <option value="price">Price</option>
        </select>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            userId={userId}
            username={userName}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}

const sortBooksBy = (books: iBook[], sortBy: string) => {
  switch (sortBy) {
    case "title":
      return [...books].sort((a, b) => a.title.localeCompare(b.title));
    case "author":
      return [...books].sort((a, b) => a.author.localeCompare(b.author));
    case "genre":
      return [...books].sort((a, b) => a.genre.localeCompare(b.genre));
    case "price":
      return [...books].sort((a, b) => a.price! - b.price!);
    default:
      return books;
  }
};
