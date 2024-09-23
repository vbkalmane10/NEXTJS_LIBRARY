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
const timeZoneCurrencyMap: Record<string, string> = {
  "Asia/Calcutta": "INR",
  "America/New_York": "USD",
  "Europe/London": "GBP",
};
const exchangeRates: Record<string, number> = {
  USD: 0.012,    
  INR: 1,   
  GBP: 0.75, 
};
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
  const [currency, setCurrency] = useState<string>("USD");
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
   // const timeZone = "Europe/London";
    console.log(timeZone);
    const detectedCurrency = timeZoneCurrencyMap[timeZone] || "INR";
    setCurrency(detectedCurrency);
  }, []);
  useEffect(() => {
    setSortedBooks(sortBooksBy(books, sortBy));
  }, [books, sortBy]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSort = event.target.value;
    setSortBy(selectedSort);
  };
  const formatPrice = (price: number | null | string) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  
    if (numericPrice == null) return "";
  
    const baseCurrency = "INR"; 
    const convertedPrice = numericPrice * (exchangeRates[currency] / exchangeRates[baseCurrency]);
  
    switch (currency) {
      case "INR":
        return `₹${convertedPrice.toFixed(2)}`; 
      case "USD":
        return `$${convertedPrice.toFixed(2)}`;
      case "GBP":
        return `£${convertedPrice.toFixed(2)}`;
      default:
        return `$${convertedPrice.toFixed(2)}`;
    }
  };
  console.log(currency);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedBooks.map((book) => (
          <BookCard
            key={book.id}
            book={{ ...book, price: formatPrice(book.price) }}
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
    // case "price":
    //   return [...books].sort((a, b) => a.price! - b.price!);
    default:
      return books;
  }
};
