"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function AddBook() {
  const router = useRouter();

  const handleAddBookClick = () => {
    router.push("/admin/addbook");
  };

  return (
    <Button
      className="bg-black text-white p-4 rounded"
      onClick={handleAddBookClick}
    >
      + Add Book
    </Button>
  );
}
