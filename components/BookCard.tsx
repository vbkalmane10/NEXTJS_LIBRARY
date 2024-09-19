"use client";

import { handleCreateRequest } from "@/lib/actions";
import { createRequest } from "@/lib/repository";
import Image from "next/image";
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    <Card className="w-[280px] h-[480px] overflow-hidden transition-all duration-300 hover:shadow-lg mt-6">
    <CardHeader className="p-0">
      <div className="relative h-[200px] w-full">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            layout="fill"
            objectFit="cover"
            className="transition-all duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-4 flex flex-col h-[220px]">
      <CardTitle className="text-lg font-bold line-clamp-2 mb-2">{book.title}</CardTitle>
      <p className="text-sm text-gray-600 mb-1 line-clamp-1">by {book.author}</p>
      <p className="text-sm text-gray-500 mb-1 line-clamp-1">{book.publisher}</p>
      <p className="text-sm text-gray-500 mb-1">ISBN: {book.isbnNo}</p>
      <p className="text-lg font-semibold text-green-600 mt-auto">${book.price}</p>
    </CardContent>
    <CardFooter className="p-4 pt-0 flex justify-between items-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-3/4" variant="default">
            Borrow
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Borrow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to borrow {book.title}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button variant="ghost" size="icon" onClick={() => console.log(`Adding to favorites: ${book.title}`)}>
        <Heart className="h-5 w-5 text-red-500" />
      </Button>
    </CardFooter>
  </Card>
  );
}
