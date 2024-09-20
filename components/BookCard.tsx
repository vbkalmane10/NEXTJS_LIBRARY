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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Badge,
  BookOpen,
  ChevronRight,
  Clock,
  Heart,
  Building2,
  BookCopy,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";
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
  const [open, setOpen] = useState(false);
  const router = useRouter();
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

  return (
    <Card className="w-[280px] h-[480px] overflow-hidden transition-all duration-300 hover:shadow-lg mt-6">
      <CardHeader className="p-0">
        <div className=" relative h-[200px] w-full">
          {book.imageUrl ? (
            <Image
              src={book.imageUrl}
              alt={book.title}
              layout="fill"
              objectFit="contain"
              className=" transition-all duration-300 hover:scale-105 aspect-auto"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col h-[220px]">
        <CardTitle className="text-lg font-bold line-clamp-2 mb-2">
          {book.title}
        </CardTitle>
        <p className="text-sm text-gray-600 mb-1 line-clamp-1">
          by {book.author}
        </p>
        <p className="text-sm text-gray-500 mb-1 line-clamp-1">
          {book.publisher}
        </p>
        <p className="text-sm text-gray-500 mb-1">ISBN: {book.isbnNo}</p>
        <p className="text-lg font-semibold text-green-600 mt-auto">
          ${book.price}
        </p>
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
              <AlertDialogAction
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-[700px] bg-white text-black">
            {book && (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 relative aspect-[2/3]">
                  <Image
                    src={
                      book.imageUrl || "/placeholder.svg?height=600&width=400"
                    }
                    alt={book.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
                  <p className="text-xl text-gray-400 mb-4">{book.author}</p>

                  <div className="bg-green-300 text-black rounded-xl w-fit px-2">
                    <span>{book.genre}</span>
                  </div>

                  <div className="flex flex-col gap-4 mb-6 text-sm mt-3">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      <span>Publisher : {book.publisher}</span>
                    </div>
                    <div className="flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      <span>Available Copies : {book.availableCopies} </span>
                    </div>
                    <div className="flex items-center">
                      <BookCopy className="w-4 h-4 mr-1" />
                      <span>Total Copies : {book.totalCopies} pages</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>Pages : {book.pages}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Borrow Now"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
