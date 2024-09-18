"use server";
import { db } from "@/db";
import { membersTable, booksTable } from "@/db/schema";
import { eq, like, and, gt } from "drizzle-orm";
import { iBook, iBookBase } from "../types";
import { createBook, deleteBook, getBooksByIsbn, updateBook } from "./repository";
export async function fetchBooks(
  searchTerm: string,
  currentPage: number,
  booksPerPage: number
) {
  const limit = booksPerPage;
  const offset = (currentPage - 1) * limit;

  const booksQuery = db
    .select()
    .from(booksTable)
    .where(
      searchTerm
        ? and(like(booksTable.title, `%${searchTerm}%`))
        : undefined && gt(booksTable.availableCopies, 1)
    )
    .limit(limit)
    .offset(offset)
    .execute();

  const totalBooksQuery = db
    .select()
    .from(booksTable)
    .where(
      searchTerm
        ? and(like(booksTable.title, `%${searchTerm}%`))
        : undefined && gt(booksTable.availableCopies, 1)
    )
    .execute();

  const totalBooks = await totalBooksQuery;

  return {
    books: await booksQuery,
    totalPages: Math.ceil(totalBooks.length / limit),
  };
}

export async function addBook(book: iBookBase) {
  try {
    const newBook = await createBook(book);
    return newBook;
  } catch (error) {
    console.error("Error creating book:", error);
    throw new Error("Failed to create book");
  }
}

export async function handleDeleteBook(isbnNo: string) {
  try {
    const deletedBook = await deleteBook(isbnNo);
    return deletedBook;
  } catch (error) {
    console.error("Error in handleDeleteBook:", error);
    throw new Error("Failed to delete book");
  }
}

export const fetchBookDetails = async (
  isbnNo: string
): Promise<iBook | null> => {
  return await getBooksByIsbn(isbnNo);
};

export const handleBookUpdate = async (isbnNo: string, updatedBook: iBook) => {
  try {
    await updateBook(isbnNo, updatedBook);
    return { success: true, message: "Book updated successfully!" };
  } catch (error) {
    console.error("Error updating book:", error);
    return { success: false, message: "Failed to update the book." };
  }
};
