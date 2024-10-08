import {
  CreateRequest,
  iBook,
  iBookBase,
  iMember,
  iMemberBase,
  iTransaction,
  Professor,
} from "./types";
import {
  booksTable,
  membersTable,
  transactionsTable,
  professorsTable,
  paymentsTable,
} from "@/drizzle/schema";
import { z } from "zod";
import { db } from "@/db";
import { eq, like, and, count } from "drizzle-orm";
import bcrypt from "bcrypt";
import { Request, RequestStatistics } from "./types";

export async function fetchAllRequests(page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;
    const requests = await db
      .select({
        id: transactionsTable.id,
        bookId: transactionsTable.bookId,
        bookTitle: transactionsTable.bookTitle,
        isbnNo: transactionsTable.isbnNo,
        status: transactionsTable.status,
        memberId: transactionsTable.memberId,
        firstName: membersTable.firstName,
        issueDate: transactionsTable.issueDate,
        dueDate: transactionsTable.dueDate,
        returnDate: transactionsTable.returnDate,
      })
      .from(transactionsTable)
      .innerJoin(membersTable, eq(transactionsTable.memberId, membersTable.id))
      .offset(offset)
      .limit(limit)
      .execute();
    const totalRequests = await db
      .select({ count: count() })
      .from(transactionsTable);
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
  type CreateRequest = Omit<Request, "id"> | undefined;
  let newRequest: CreateRequest;

  try {
    newRequest = {
      memberId: request.memberId,
      bookId: request.bookId,
      bookTitle: request.bookTitle,
      isbnNo: request.isbnNo,
      status: "Pending",
      issueDate: null,
      dueDate: null,
      returnDate: null,
      firstName: request.firstName,
    };

    await db.insert(transactionsTable).values(newRequest).execute();

    return {
      message: "Request created successfully",
      request: newRequest as Request,
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
        .from(transactionsTable)
        .where(eq(transactionsTable.id, req.id))
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
        .update(transactionsTable)
        .set({
          status: "Approved",
          returnDate: null,
          dueDate: formattedDueDate,
          issueDate: formattedBorrowDate,
        })
        .where(eq(transactionsTable.id, req.id));
      await trx
        .update(booksTable)
        .set({ availableCopies: availableCopies - 1 })
        .where(eq(booksTable.id, req.bookId));
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
export async function rejectRequest(
  req: Request
): Promise<{ message: string; transaction: iTransaction | undefined }> {
  const issueDate = new Date();

  const dueDate = new Date(issueDate);
  dueDate.setDate(issueDate.getDate() + 14);

  try {
    let newTransaction: iTransaction | undefined;
    await db.transaction(async (trx) => {
      const request = await trx
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.id, req.id))
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

      await trx
        .update(transactionsTable)
        .set({
          status: "Rejected",
          returnDate: null,
          dueDate: null,
          issueDate: null,
        })
        .where(eq(transactionsTable.id, req.id));

      // newTransaction = {
      //   bookId: req.bookId,
      //   memberId: req.memberId,
      //   returnDate: null,
      //   dueDate: formattedDueDate,
      //   issueDate: formattedBorrowDate,
      // };
      // await trx.insert(transactionsTable).values(newTransaction).execute();
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

export async function getUserRequests(userId: number, status?: string) {
  try {
    const conditions = status
      ? and(
          eq(transactionsTable.memberId, userId),
          eq(transactionsTable.status, status)
        )
      : eq(transactionsTable.memberId, userId);

    const requests = await db
      .select()
      .from(transactionsTable)
      .where(conditions);

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
      .select({ count: count(transactionsTable.id) })
      .from(transactionsTable)
      .where(eq(transactionsTable.memberId, memberId))
      .execute();
    const totalRequests = totalRequestsResult[0]?.count ?? 0;
    const approvedRequestsResult = await db
      .select({ count: count(transactionsTable.id) })
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.memberId, memberId),
          eq(transactionsTable.status, "Approved")
        )
      )
      .execute();
    const approvedRequests = approvedRequestsResult[0]?.count ?? 0;

    const pendingRequestsResult = await db
      .select({ count: count(transactionsTable.id) })
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.memberId, memberId),
          eq(transactionsTable.status, "Pending")
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
export async function getRecentApprovedRequestsWithBooks(userId: number) {
  const requestsWithBooks = await db
    .select({
      requestId: transactionsTable.id,
      bookId: transactionsTable.bookId,
      bookTitle: booksTable.title,
    })
    .from(transactionsTable)
    .leftJoin(booksTable, eq(transactionsTable.bookId, booksTable.id))
    .where(
      and(
        eq(transactionsTable.memberId, userId),
        eq(transactionsTable.status, "Approved")
      )
    )

    .limit(3);

  return requestsWithBooks;
}
export async function returnBook(
  req: Request
): Promise<{ message: string; transaction: iTransaction | undefined }> {
  const returnDate = new Date().toISOString().split("T")[0];

  try {
    let updatedTransaction: iTransaction | undefined;

    await db.transaction(async (trx) => {
      const transaction = await trx
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.id, req.id))
        .execute();

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      if (transaction[0].status === "Returned") {
        throw new Error("Request already returned");
      }

      if (transaction[0].status !== "Approved") {
        throw new Error("Only approved transactions can be returned");
      }

      const existingBook = await trx
        .select()
        .from(booksTable)
        .where(eq(booksTable.id, req.bookId))
        .execute();

      if (!existingBook) {
        throw new Error("Book not found");
      }

      await trx
        .update(transactionsTable)
        .set({
          status: "Returned",
          returnDate: returnDate,
        })
        .where(eq(transactionsTable.id, req.id));

      const availableCopies = existingBook[0].availableCopies;
      await trx
        .update(booksTable)
        .set({ availableCopies: availableCopies + 1 })
        .where(eq(booksTable.id, req.bookId));

      updatedTransaction = {
        ...transaction[0],

        returnDate: returnDate,
      };
    });

    return {
      message: "Book returned successfully",
      transaction: updatedTransaction,
    };
  } catch (error: any) {
    return {
      message: error.message,
      transaction: undefined,
    };
  }
}
export async function cancelRequest(requestId: number) {
  try {
    const existingTransaction = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.id, requestId))
      .execute();
    if (!existingTransaction) {
      throw new Error("Transaction not found");
    }
    await db
      .delete(transactionsTable)
      .where(eq(transactionsTable.id, requestId))
      .execute();
    return {
      message: "Request cancelled successfully",
      transaction: existingTransaction,
    };
  } catch (error) {
    throw new Error("Error while cancelling the request");
  }
}

export async function dueToday(date: Date) {
  try {
    const formattedDate = date.toISOString().split("T")[0];
    const transactions = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.dueDate, formattedDate));

    return transactions;
  } catch (error) {
    throw new Error("Error while fetching due today transactions");
  }
}
export async function fetchProfessors() {
  try {
    const professors = await db.select().from(professorsTable);
    return professors;
  } catch (error) {
    console.error("Error fetching professors:", error);
    throw new Error("Unable to fetch professors");
  }
}
export async function fetchAdminProfessors(
  searchTerm: string,
  currentPage: number,
  usersPerPage: number
) {
  const limit = usersPerPage;
  const offset = (currentPage - 1) * limit;

  const professorQuery = db
    .select()
    .from(professorsTable)
    .where(
      searchTerm
        ? and(like(professorsTable.name, `%${searchTerm}%`))
        : undefined
    )
    .limit(limit)
    .offset(offset)
    .execute();

  const totalProfessorsQuery = db
    .select()
    .from(professorsTable)
    .where(
      searchTerm
        ? and(like(professorsTable.name, `%${searchTerm}%`))
        : undefined
    )
    .execute();

  const totalProfessors = await totalProfessorsQuery;

  return {
    professors: await professorQuery,
    totalPages: Math.ceil(totalProfessors.length / limit),
  };
}
export async function createProfessors(
  professor: Professor
): Promise<{ message: string; professor?: Professor }> {
  try {
    const existingProfessor = await db
      .select()
      .from(professorsTable)
      .where(eq(professorsTable.name, professor.name));

    if (existingProfessor.length > 0) {
      return {
        message: "Professor Already exists",
        professor: undefined,
      };
    } else {
      const newProfessorData: Omit<Professor, "id"> = {
        ...professor,
      };

      const insertedProfessor = await db
        .insert(professorsTable)
        .values(newProfessorData)
        .returning();

      const newMember = insertedProfessor[0];
      return {
        message: "Professor added successfully",
        professor: newMember,
      };
    }
  } catch (error) {
    throw new Error("Error while creating professor");
  }
}
export async function updateProfessorCalendlyLink(
  email: string,
  calendlyLink: string
) {
  try {
    const result = await db
      .update(professorsTable)
      .set({ calendlyLink })
      .where(eq(professorsTable.email, email));

    if (result.rowCount === 0) {
      throw new Error(`No professor found with email: ${email}`);
    }

    return result;
  } catch (error) {
    console.error(
      `Failed to update Calendly link for professor with email: ${email}`,
      error
    );
    throw new Error("Could not update professor Calendly link.");
  }
}
export async function getProfessorById(id: number): Promise<Professor | null> {
  try {
    const [professor] = await db
      .select()
      .from(professorsTable)
      .where(eq(professorsTable.id, id));
    return professor || null;
  } catch (error) {
    throw new Error("Error while getting user by id");
  }
}
export async function updateProfessor(
  id: number,
  data: Professor
): Promise<Professor | null> {
  const existingMembers = await db
    .select()
    .from(professorsTable)
    .where(eq(professorsTable.id, id))
    .execute();

  if (existingMembers.length === 0) {
    console.log("NO PROFESSORS  FOUND");
    return null;
  }

  const existingMember = existingMembers[0];
  const updatedMember = {
    ...existingMember,
    ...data,
  };

  await db
    .update(professorsTable)
    .set(updatedMember)
    .where(eq(professorsTable.id, id))
    .execute();

  return updatedMember as Professor;
}
export async function deleteProfessor(
  id: number
): Promise<Professor | undefined> {
  try {
    const existingMembers = await db
      .select()
      .from(professorsTable)
      .where(eq(professorsTable.id, id))
      .execute();

    if (existingMembers.length > 0) {
      const memberToDelete = existingMembers[0];

      await db
        .delete(professorsTable)
        .where(eq(professorsTable.id, id))
        .execute();

      return memberToDelete as Professor;
    }
  } catch (error) {
    throw new Error("Professor not found");
  }
}
// export async function createPaymentRecord(
//   userId: number,
//   professorId: number,
//   paymentId: string
// ) {
//   try {
//     const newRecord = {
//       userId,
//       professorId,
//       paymentId,
//       payment_status: "Success",
//     };

//     const result = await db.insert(paymentsTable).values(newRecord);

//     return result;
//   } catch (error) {
//     console.error("Error creating payment record:", error);
//     throw new Error("Failed to create payment record");
//   }
// }
export async function getBookingStatus(userId: number, professorId: number) {
  try {
    const result = await db
      .select()
      .from(paymentsTable)
      .where(
        and(
          eq(paymentsTable.userId, userId),
          eq(paymentsTable.professorId, professorId)
        )
      );

    return result;
  } catch (error) {
    throw new Error("Error in database");
  }
}
export async function createPaymentRecord(
  userId: number,
  professorId: number,
  paymentId: string
) {
  try {
    const newRecord = {
      userId,
      professorId,
      paymentId,
      payment_status: "Success",
    };

    await db.insert(paymentsTable).values(newRecord);

    return {
      success: true,
      message: "Payment record created successfully"
    };
  } catch (error) {
    console.error("Error creating payment record:", error);
    throw new Error("Failed to create payment record");
  }
}