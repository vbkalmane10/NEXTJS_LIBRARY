// app/books/[isbnNo]/edit/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { iBook } from "@/lib/types";
import EditBookForm from "@/components/EditBook";
import { fetchBookDetails, handleBookUpdate } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";

const EditBookPage = ({ params }: { params: { isbnNo: string } }) => {
  const { isbnNo } = params;
  const router = useRouter();
  const [book, setBook] = useState<iBook | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchDetails = async () => {
      const fetchedBook = await fetchBookDetails(isbnNo);
      if (fetchedBook) {
        setBook(fetchedBook);
      } else {
        toast({
          title: "Error",
          description: "Failed to load book details.",
          variant: "destructive",
        });
      }
    };

    fetchDetails();
  }, [isbnNo]);

  const handleEditSubmit = (updatedBook: iBook) => {
    startTransition(async () => {
      const result = await handleBookUpdate(isbnNo, updatedBook);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          variant: "destructive",
        });
        router.push("/admin");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleEditClose = () => {
    router.push("/admin");
  };

  if (!book) return <p>Loading book details...</p>;

  return (
    <div>
      <EditBookForm
        book={book}
        onClose={handleEditClose}
        onSubmit={handleEditSubmit}
        isPending={isPending}
      />
    </div>
  );
};

export default EditBookPage;
