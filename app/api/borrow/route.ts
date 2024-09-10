// /app/api/borrow/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db"; // Import your Drizzle ORM setup
import { transactionsTable } from "@/db/schema"; // Ensure this references your transaction schema
import { eq } from "drizzle-orm";

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Helper function to calculate the due date (e.g., 14 days from the issue date)
const calculateDueDate = (issueDate: Date, days: number = 14): string => {
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + days);
  return formatDate(dueDate);
};

export async function POST(request: Request) {
  try {
    const { bookId, memberId } = await request.json();

    
    const issueDate = formatDate(new Date());

    const dueDate = calculateDueDate(new Date());

    
    await db
      .insert(transactionsTable)
      .values({
        bookId,
        memberId,
        issueDate,
        dueDate,
        returnDate: null, 
      })
      .execute();

    return NextResponse.json({ message: "Book borrowed successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error borrowing book:", error);
    return NextResponse.json({ error: "Failed to borrow the book." }, { status: 500 });
  }
}
 