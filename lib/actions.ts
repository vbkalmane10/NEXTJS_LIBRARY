"use server";
import { db } from "@/db";
import { membersTable, booksTable } from "@/db/schema";
import { eq, like, and, gt } from "drizzle-orm";
import {
  iBook,
  iBookBase,
  iMember,
  iMemberBase,
  Request,
  RequestStatistics,
} from "./types";

import {
  fetchAllRequests,
  createRequest,
  approveRequest,
  getBooksByIsbn,
  getUserRequests,
  getRequestStatistics,
  getRecentApprovedRequestsWithBooks,
  rejectRequest,
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
export async function handleRejectRequest(request: Request) {
  try {
    const result = await rejectRequest(request);
    if (result !== undefined) {
      return result;
    } else {
      throw new Error("Error");
    }
  } catch (error) {
    console.log("Error while rejecting request");
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
export async function fetchRecentlyBorrowedBooks(userId: number) {
  try {
    const recentBooks = await getRecentApprovedRequestsWithBooks(userId);
    return recentBooks;
  } catch (error) {
    throw new Error("Error while fetching recent requests");
  }
}
