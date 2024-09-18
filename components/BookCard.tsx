"use client";

import { handleCreateRequest } from "@/lib/actions";
import { createRequest } from "@/lib/repository";

import { getServerSession } from "next-auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PulseLoader } from "react-spinners";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { iBook } from "@/lib/types";
interface Book {
  id: number;
  title: string;
  author: string;
  isbnNo: string;
}

interface BookCardProps {
  book: iBook;
  userId: number | undefined;
  username: string | undefined;
}
export default function BookCard({ book, userId, username }: BookCardProps) {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const handleBorrow = () => {
    setShowConfirm(true);
  };
  const handleConfirm = async () => {
    setIsSubmitting(true);
    setShowConfirm(false);

    try {
      const request = {
        id: 0,
        memberId: userId!,
        bookId: book.id,
        bookTitle: book.title,
        isbnNo: book.isbnNo,
        status: "Pending",
        issueDate: null,
        returnDate: null,
        dueDate: null,
        firstName: username,
      };

      const result = await handleCreateRequest(request);

      if (result.success) {
        setSuccessMessage(result.message);
        toast({
          title: "Success",
          description: result.message,
          variant: "destructive",
          duration: 1000,
          className: "bg-green-600 text-white",
        });
      } else {
        setError(result.message || "Failed to create request");
      }
    } catch (error) {
      console.error("Error creating request:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };
  const handleFavorite = () => {
    console.log(`Adding to favorites: ${book.title}`);
  };
  return (
    <div className="p-4 border rounded-lg shadow-md flex flex-col justify-between h-56">
      <div className="flex-grow">
        <h2 className="text-lg font-semibold line-clamp-2">{book.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-1">
          Author: {book.author}
        </p>
        <p className="text-sm text-gray-600 line-clamp-1">
          Publisher: {book.publisher}
        </p>
        <p className="text-sm text-gray-500 line-clamp-1">
          ISBN: {book.isbnNo}
        </p>
        <p className="text-sm text-gray-500 line-clamp-1">
          Price: {book.price}
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <AlertDialog>
          <AlertDialogTrigger className="bg-black text-white px-3 py-1 rounded hover:bg-blue-100 hover:text-black transition flex-grow">
            Borrow
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Borrow ?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to borrow {book.title}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm} className="bg-black">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <button
          onClick={handleFavorite}
          className="bg-white text-red-500 p-2 rounded-full  transition flex items-center justify-center"
        ></button>
      </div>
      {showConfirm && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold flex justify-center ">
              Confirm Borrow
            </h3>
            <h3>Are you sure you want to borrow {book.title} ?</h3>

            <div className="flex gap-4 mt-4 justify-center">
              {isSubmitting ? (
                <div className="flex justify-center mt-4">
                  <PulseLoader color="#3498db" />
                </div>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-black"
                >
                  Confirm
                </button>
              )}
              <button
                onClick={handleCancel}
                className="bg-transparent text-black px-4 py-2 rounded  transition"
              >
                Cancel
              </button>
            </div>

            {error && <p className="mt-4 text-red-600">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
