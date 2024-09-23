"use server";
import { db } from "@/db";
import { membersTable, booksTable } from "@/drizzle/schema";
import { eq, like, and, gt } from "drizzle-orm";
import {
  iBook,
  iBookBase,
  iMember,
  iMemberBase,
  Request,
  RequestStatistics,
} from "./types";
import nodemailer from "nodemailer";
import {
  fetchAllRequests,
  createRequest,
  approveRequest,
  getBooksByIsbn,
  getUserRequests,
  getRequestStatistics,
  getRecentApprovedRequestsWithBooks,
  rejectRequest,
  cancelRequest,
  dueToday,
  returnBook,
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

export async function fetchUserRequest(userId: number, status?: string) {
  try {
    const requests = await getUserRequests(userId, status);
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
export async function handleCancelRequest(requestId: number) {
  try {
    const result = await cancelRequest(requestId);
    return result;
  } catch (error) {
    throw new Error("Error while cancelling the request");
  }
}
export async function getTransactionsDueToday(date: Date) {
  try {
    const result = await dueToday(date);
    return result;
  } catch (error) {
    throw new Error("Error while fetching due today");
  }
}
export async function sendEmailNotification(
  memberEmail: string | undefined,
  bookTitle: string
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve, reject) => {
    if (!memberEmail) {
      return reject({ success: false, message: "No member email provided" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_EMAIL_ID,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.APP_EMAIL_ID,
      to: memberEmail,
      subject: "Due Book Notification",
      text: `Dear member, the following book is due today: ${bookTitle}`,
      html: `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding-bottom: 20px;">
         <h1>BookSphere</h1>
          <h2 style="color: #333;">Your Book is Due Today!</h2>
        </div>
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);">
          <p style="color: #333;">Dear Member,</p>
          <p style="color: #333;">We noticed that your borrowed book <strong style="color: #007bff;">${bookTitle}</strong> is due today.</p>
          <p style="color: #333;">Please return it to avoid any late fees or renew it if you still need it.</p>
          
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #888;">Thank you for using our library services.</p>
          <p style="color: #888;">Contact us at <a href="mailto:support@library.com" style="color: #007bff;">support@library.com</a> for any questions.</p>
        </div>
        <div style="background-color: #007bff; padding: 10px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: #fff; margin: 0;">&copy; 2024 Your Library. All rights reserved.</p>
        </div>
      </div>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return reject({ success: false, message: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return resolve({ success: true, message: "Email sent successfully" });
      }
    });
  });
}
export async function handleReturnBook(req: Request) {
  try {
    const result = await returnBook(req);
    return result;
  } catch (error) {
    throw new Error("Error while returning book");
  }
}
