import { iBook, iBookBase, iMember, iMemberBase, iTransaction } from "../types";
import { booksTable, membersTable, transactionsTable } from "@/drizzle/schema";
import { z } from "zod";
import { db } from "@/db";
import { eq, like, and, count, gt } from "drizzle-orm";
import bcrypt from "bcrypt";
import { Request, RequestStatistics } from "../types";

export async function createBook(
  book: iBookBase
): Promise<{ message: string; book?: iBook }> {
  const existingBooks = await db
    .select()
    .from(booksTable)
    .where(eq(booksTable.isbnNo, book.isbnNo))
    .execute();
  if (existingBooks.length > 0) {
    const existingBook = existingBooks[0];
    const updatedTotalCopies = existingBook.totalCopies + book.totalCopies;
    const updatedAvailableCopies =
      existingBook.availableCopies + book.totalCopies;

    await db
      .update(booksTable)
      .set({
        totalCopies: updatedTotalCopies,
        availableCopies: updatedAvailableCopies,
      })
      .where(eq(booksTable.isbnNo, book.isbnNo))
      .execute();

    const updatedBook: iBook = {
      ...existingBook,
      totalCopies: updatedTotalCopies,
      availableCopies: updatedAvailableCopies,
      price: 0,
    };

    return {
      message: "Book already existed , Increased number of copies",
      book: updatedBook,
    };
  } else {
    const newBookData: iBook = {
      ...book,
      availableCopies: book.totalCopies,
      id: 0,
    };

    await db.insert(booksTable).values(newBookData);

    return {
      message: "Book added successfully",
      book: newBookData,
    };
  }
}
export async function deleteBook(
  isbnNo: string
): Promise<{ message: string; book?: iBook }> {
  const existingBooks = await db
    .select()
    .from(booksTable)
    .where(eq(booksTable.isbnNo, isbnNo))
    .execute();

  if (existingBooks.length > 0) {
    const bookToDelete = existingBooks[0];

    await db.delete(booksTable).where(eq(booksTable.isbnNo, isbnNo)).execute();

    return {
      message: "Book deleted successfully",
      book: bookToDelete,
    };
  } else {
    return {
      message: "Book not found",
      book: undefined,
    };
  }
}
export async function getBooksByIsbn(isbnNo: string): Promise<iBook | null> {
  try {
    const book = await db
      .select({
        id: booksTable.id,
        title: booksTable.title,
        author: booksTable.author,
        publisher: booksTable.publisher,
        genre: booksTable.genre,
        isbnNo: booksTable.isbnNo,
        pages: booksTable.pages,
        totalCopies: booksTable.totalCopies,
        availableCopies: booksTable.availableCopies,
        price: booksTable.price,
      })
      .from(booksTable)
      .where(eq(booksTable.isbnNo, isbnNo))
      .execute();
    if (book.length > 0) {
      return book[0] as iBook;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Book not found with this ISBN");
  }
}
export async function updateBook(
  isbnNo: string,
  bookToUpdate: iBook
): Promise<iBook | null> {
  try {
    await db
      .update(booksTable)
      .set(bookToUpdate)
      .where(eq(booksTable.isbnNo, isbnNo))
      .execute();

    const updatedBook = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.isbnNo, isbnNo))
      .limit(1)
      .execute();

    return updatedBook.length > 0 ? updatedBook[0] : null;
  } catch (error) {
    console.error("Error updating book:", error);
    return null;
  }
}
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
