"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { iBook } from "@/lib/types";
import EditBookForm from "@/components/EditBook";
import { fetchBookDetails, handleBookUpdate } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";

const EditBookPage = ({ params }: { params: { isbnNo: string } }) => {
  const { isbnNo } = params;
  const router = useRouter();
  const [book, setBook] = useState<iBook | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
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
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching book details.",
          variant: "destructive",
        });
      }
    };

    fetchDetails();
  }, [isbnNo]);

  const handleEditSubmit = async (updatedBook: iBook) => {
    setIsSubmitting(true);
    try {
      const result = await handleBookUpdate(isbnNo, updatedBook);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          duration: 1000,
          className: "bg-green-700 text-white",
        });
        router.push("/admin");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        isPending={isSubmitting}
      />
    </div>
  );
};

export default EditBookPage;
