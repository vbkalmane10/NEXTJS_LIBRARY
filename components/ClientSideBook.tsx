"use client";

import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import Pagination from "./Pagination";
import Search from "./search";
import { iBook } from "@/lib/types";
import { useTranslations } from "next-intl";
import Chatbot from "./ChatBot";

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
  GBP: 0.009,
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
  const [currency, setCurrency] = useState<string>("INR");
  const [isChatOpen, setChatOpen] = useState(false);
  const t = useTranslations("BooksPage");
  const toggleChat = () => {
    setChatOpen((prev) => !prev); // Toggle chatbot visibility
  };
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // const timeZone = "Europe/London";

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

    if (numericPrice == null) return 0;

    const baseCurrency = "INR";
    const convertedPrice =
      numericPrice * (exchangeRates[currency] / exchangeRates[baseCurrency]);

    return convertedPrice;
  };

  return (
    <div className="p-2 md:p-4">
    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between mb-4">
      <h1 className="text-2xl font-bold mb-2 sm:mb-0">{t("Books")}</h1>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full sm:w-auto">
        <Search placeholder="Search books..." />
        <select
          className="p-2 border border-gray-300 rounded w-full sm:w-auto"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="">{t("label")}</option>
          <option value="title">{t("title")}</option>
          <option value="author">{t("author")}</option>
          <option value="genre">{t("genre")}</option>
          <option value="price">{t("price")}</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sortedBooks.map((book) => (
        <BookCard
          key={book.id}
          book={{ ...book, price: formatPrice(book.price) }}
          userId={userId}
          username={userName}
          currency={currency}
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
