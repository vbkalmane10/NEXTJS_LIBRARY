"use server";
import { db } from "@/db";
import { membersTable, booksTable, requestsTable } from "@/db/schema";
import { eq, like, and, gt } from "drizzle-orm";
import {
  iBook,
  iBookBase,
  iMember,
  iMemberBase,
  Request,
  RequestStatistics,
} from "./types";
import { z } from "zod";

import {
  createBook,
  create,
  fetchAllRequests,
  createRequest,
  approveRequest,
  deleteBook,
  getBooksByIsbn,
  updateBook,
  fetchUsers,
  getUserRequests,
  getRequestStatistics,
} from "./repository";

export async function getUserId(email: string): Promise<number | null> {
  try {
    // Query the database to find the user by email
    const [user] = await db
      .select({
        id: membersTable.id, // Select the ID column
      })
      .from(membersTable)
      .where(eq(membersTable.email, email))
      .execute();

    // If a user is found, return the ID, otherwise return null
    return user?.id ?? null;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null; // Return null in case of an error
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
export async function createMember(member: iMemberBase) {
  try {
    const newMember = await create(member);
    return newMember;
  } catch (error) {
    console.error("Error creating member:", error);
    throw new Error("Failed to create member");
  }
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
export async function getRequests(page = 1) {
  try {
    const requests = await fetchAllRequests(page);
    return requests;
  } catch (error) {
    console.error("Error in server action fetching requests:", error);
    throw new Error("Failed to fetch requests");
  }
}
export async function handleCreateRequest(request: Request) {
  try {
    const result = await createRequest(request);
    if (result.request) {
      return {
        success: true,
        message: result.message,
        request: result.request,
      };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Error in handleCreateRequest:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
export async function handleApproveRequest(request: Request) {
  try {
    const result = await approveRequest(request);
    if (result !== undefined) {
      return result;
    } else {
      throw new Error("Error");
    }
  } catch (error) {
    console.log("Error inside handle approve");
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

export async function getUsers(
  searchTerm: string,
  currentPage: number,
  usersPerPage: number
) {
  const { users, totalPages } = await fetchUsers(
    searchTerm,
    currentPage,
    usersPerPage
  );
  if (users) {
    return { users, totalPages };
  } else {
    throw new Error("Error while fetching users");
  }
}
export async function fetchUserRequest(userId: number) {
  try {
    const requests = await getUserRequests(userId);
    return requests;
  } catch (error) {
    throw new Error("Error while fetching requests");
  }
}
export async function fetchRequestStatistics(
  memberId: number
): Promise<RequestStatistics> {
  try {
    const statistics = await getRequestStatistics(memberId);
    return statistics;
  } catch (error) {
    console.error("Error fetching request statistics:", error);
    throw new Error("Error while fetching request statistics.");
  }
}
