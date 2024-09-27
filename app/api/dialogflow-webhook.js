import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { queryResult } = body;

  // Get the book title from the parameters
  const bookTitle = queryResult.parameters.bookTitle;

  // Call your function to check book availability
  const isAvailable = await checkBookAvailability(bookTitle);

  // Create the response message
  let responseText = isAvailable 
    ? `Yes, the book "${bookTitle}" is available.` 
    : `Sorry, the book "${bookTitle}" is not available.`;

  // Return the response to Dialogflow
  return NextResponse.json({
    fulfillmentText: responseText,
  });
}

// Simulated function to check book availability
async function checkBookAvailability(title) {
  const availableBooks = ['The Great Gatsby', 'Moby Dick', '1984'];
  return availableBooks.includes(title);
}
