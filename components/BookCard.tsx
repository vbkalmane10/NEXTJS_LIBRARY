"use client";

import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { handleCreateRequest } from "@/lib/actions";
import { iBook } from "@/lib/types";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Building2,
  BookOpen,
  ChevronRight,
  BookCopy,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  book: iBook;
  userId: number | undefined;
  username: string | undefined;
  currency: string;
}

export default function BookCard({
  book,
  userId,
  username,
  currency,
}: BookCardProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("BooksPage");
  const { toast } = useToast();

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "INR":
        return "₹";
      case "USD":
        return "$";
      case "GBP":
        return "£";
      default:
        return "$";
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

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
    <Card className="w-[330px] h-[480px] overflow-hidden transition-all duration-300 hover:shadow-lg mt-6 relative">
      <div className="absolute inset-0 aspect-[3/4]">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-95" />
      <CardContent className="relative flex flex-col justify-end h-full pb-14 text-white">
        <h3 className="text-2xl font-bold line-clamp-2 mb-2">{book.title}</h3>
        <p className="text-sm mb-1 line-clamp-1">by {book.author}</p>
        <p className="text-sm mb-1 line-clamp-1">{book.publisher}</p>
        <p className="text-sm mb-1">ISBN: {book.isbnNo}</p>
        <p className="text-lg font-semibold text-green-400 mt-2">
          {getCurrencySymbol(currency)}
          {book.price!.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-black bg-opacity-5 z-20">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-3/4 bg-blue-300 text-black hover:text-white">
              {t("borrow")}
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
            <Button variant="ghost" size="icon" className="text-black bg-white">
            <ChevronRight className="h-5 w-5" />
          </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-[700px] bg-white text-black">
            {book && (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 relative aspect-[3/4]">
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
                      <span>Publisher: {book.publisher}</span>
                    </div>
                    <div className="flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      <span>Available Copies: {book.availableCopies}</span>
                    </div>
                    <div className="flex items-center">
                      <BookCopy className="w-4 h-4 mr-1" />
                      <span>Total Copies: {book.totalCopies}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>Pages: {book.pages}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("processing") : t("borrow")}
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
