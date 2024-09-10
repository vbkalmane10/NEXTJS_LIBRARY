"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";
// import { ChevronDownIcon } from "@heroicons/react/outline";

export default function LandingPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20  text-black">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Digital Library
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Discover, request, and manage your favorite books all in one place.
        </p>
        <Link
          href="/books"
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-gray-200 transition duration-300"
        >
          Explore Books
        </Link>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose Our Library?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Explore Books</h3>
              <p className="text-gray-600">
                Browse through a vast collection of books across all genres.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Request Books</h3>
              <p className="text-gray-600">
                Request new books or borrow available copies easily.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Manage Transactions
              </h3>
              <p className="text-gray-600">
                Keep track of all your transactions and book requests in one
                place.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
