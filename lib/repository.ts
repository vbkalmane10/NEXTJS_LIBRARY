import { iBook, iBookBase, iMember, iMemberBase, iTransaction } from "./types";
import {
  booksTable,
  membersTable,
  requestsTable,
  transactionsTable,
} from "@/db/schema";
import { z } from "zod";
import { db } from "@/db";
import { eq, like, and, count } from "drizzle-orm";
import bcrypt from "bcrypt";
import { Request, RequestStatistics } from "./types";

const iMemberBaseSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(1, "Password is required"),
});
export async function create(
  member: iMemberBase
): Promise<{ message: string; user?: iMember }> {
  const validatedMember = iMemberBaseSchema.parse(member);
  const existingMembers = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.email, member.email))
    .execute();

  if (existingMembers.length > 0) {
    return {
      message: "Member Already exists",
      user: undefined,
    };
  } else {
    const hashedPassword = await bcrypt.hash(validatedMember.password, 10);
    const newMemberData: iMember = {
      ...validatedMember,
      password: hashedPassword,
      membershipStatus: "active",
      id: 0,
      role: "user",
    };

    await db.insert(membersTable).values(newMemberData).execute();
    return {
      message: "Member added successfully",
      user: newMemberData,
    };
  }
}

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
export async function fetchAllRequests(page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;
    const requests = await db
      .select()
      .from(requestsTable)
      .offset(offset)
      .limit(limit)
      .execute();
    const totalRequests = await db
      .select({ count: count() })
      .from(requestsTable);
    const totalCount = totalRequests[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    return {
      data: requests,
      totalCount,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw new Error("Failed to fetch requests");
  }
}

export async function createRequest(
  request: Request
): Promise<{ message: string; request: Request | undefined }> {
  const memberExists = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.id, request.memberId));

  if (!memberExists || memberExists.length === 0) {
    return {
      message: "Member does not exist",
      request: undefined,
    };
  }

  const bookExists = await db
    .select()
    .from(booksTable)
    .where(eq(booksTable.id, request.bookId));

  if (!bookExists || bookExists.length === 0) {
    return {
      message: "Book does not exist",
      request: undefined,
    };
  }

  const availableCopies = bookExists[0].availableCopies;
  if (
    availableCopies === undefined ||
    availableCopies === null ||
    availableCopies <= 0
  ) {
    return {
      message: "No available copies",
      request: undefined,
    };
  }

  let newRequest: Request | undefined;
  try {
    newRequest = {
      id: 0,
      memberId: request.memberId,
      bookId: request.bookId,
      bookTitle: request.bookTitle,
      isbnNo: request.isbnNo,
      status: "Pending",
    };

    await db.insert(requestsTable).values(newRequest).execute();

    return {
      message: "Request created successfully",
      request: newRequest,
    };
  } catch (error) {
    console.error("Error creating request:", error);
    return {
      message: "Failed to create request",
      request: undefined,
    };
  }
}
export async function approveRequest(
  req: Request
): Promise<{ message: string; transaction: iTransaction | undefined }> {
  const issueDate = new Date();
  const formattedBorrowDate = issueDate.toISOString().split("T")[0];
  const dueDate = new Date(issueDate);
  dueDate.setDate(issueDate.getDate() + 14);
  const formattedDueDate = dueDate.toISOString().split("T")[0];
  try {
    let newTransaction: iTransaction | undefined;
    await db.transaction(async (trx) => {
      const request = await trx
        .select()
        .from(requestsTable)
        .where(eq(requestsTable.id, req.id))
        .execute();
      if (!request) {
        throw new Error("Request not found");
      }
      if (req.status === "Approved") {
        throw new Error("Request already approved");
      }
      const existingBook = await trx
        .select()
        .from(booksTable)
        .where(eq(booksTable.id, req.bookId));
      if (!existingBook) {
        throw new Error("Book not found");
      }
      const availableCopies = existingBook[0].availableCopies;
      if (availableCopies === null || availableCopies <= 0) {
        throw new Error("No available copies");
      }
      await trx
        .update(requestsTable)
        .set({ status: "Approved" })
        .where(eq(requestsTable.id, req.id));
      await trx
        .update(booksTable)
        .set({ availableCopies: availableCopies - 1 })
        .where(eq(booksTable.id, req.bookId));

      newTransaction = {
        bookId: req.bookId,
        memberId: req.memberId,
        returnDate: null,
        dueDate: formattedDueDate,
        issueDate: formattedBorrowDate,
      };
      await trx.insert(transactionsTable).values(newTransaction).execute();
    });
    return {
      message: "Transaction Successful",
      transaction: newTransaction,
    };
  } catch (error: any) {
    return {
      message: error.message,
      transaction: undefined,
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
      .select()
      .from(booksTable)
      .where(eq(booksTable.isbnNo, isbnNo))
      .execute();
    if (book.length > 0) {
      return book[0];
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
    // Perform the update operation
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

export async function fetchUsers(
  searchTerm: string,
  currentPage: number,
  usersPerPage: number
) {
  const limit = usersPerPage;
  const offset = (currentPage - 1) * limit;

  const usersQuery = db
    .select()
    .from(membersTable)
    .where(
      searchTerm
        ? and(like(membersTable.firstName, `%${searchTerm}%`))
        : undefined
    )
    .limit(limit)
    .offset(offset)
    .execute();

  const totalUsersQuery = db
    .select()
    .from(membersTable)
    .where(
      searchTerm
        ? and(like(membersTable.firstName, `%${searchTerm}%`))
        : undefined
    )
    .execute();

  const totalUsers = await totalUsersQuery;

  return {
    users: await usersQuery,
    totalPages: Math.ceil(totalUsers.length / limit),
  };
}
export async function getUserRequests(userId: number) {
  try {
    const requests = await db
      .select()
      .from(requestsTable)
      .where(eq(requestsTable.memberId, userId));
    return requests;
  } catch (error) {
    throw new Error("Error while fetching the requests");
  }
}
export async function getRequestStatistics(
  memberId: number
): Promise<RequestStatistics> {
  try {
    const totalRequestsResult = await db
      .select({ count: count(requestsTable.id) })
      .from(requestsTable)
      .where(eq(requestsTable.memberId, memberId))
      .execute();
    const totalRequests = totalRequestsResult[0]?.count ?? 0;
    const approvedRequestsResult = await db
      .select({ count: count(requestsTable.id) })
      .from(requestsTable)
      .where(
        and(
          eq(requestsTable.memberId, memberId),
          eq(requestsTable.status, "Approved")
        )
      )
      .execute();
    const approvedRequests = approvedRequestsResult[0]?.count ?? 0;

    const pendingRequestsResult = await db
      .select({ count: count(requestsTable.id) })
      .from(requestsTable)
      .where(
        and(
          eq(requestsTable.memberId, memberId),
          eq(requestsTable.status, "pending")
        )
      )
      .execute();
    const pendingRequests = pendingRequestsResult[0]?.count ?? 0;
    return {
      totalRequests,
      approvedRequests,
      pendingRequests,
    };
  } catch (error: any) {
    throw new Error("Error fetching request statistics: " + error.message);
  }
}
