"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { iBook } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface EditBookFormProps {
  book: iBook;
  onClose: () => void;
  onSubmit: (updatedBook: iBook) => void;
  isPending: boolean;
}

const EditBookForm: React.FC<EditBookFormProps> = ({
  book,
  onClose,
  onSubmit,
  isPending,
}) => {
  const [formData, setFormData] = useState<iBook>({ ...book });
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md mx-auto flex justify-center items-center">
      <h2 className="text-2xl font-semibold text-center">Edit Book</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
            />
          </div>
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author"
              required
            />
          </div>
          <div>
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Publisher"
              required
            />
          </div>
          <div>
            <Label htmlFor="genre">Genre</Label>
            <Input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Genre"
            />
          </div>
          <div>
            <Label htmlFor="isbnNo">ISBN</Label>
            <Input
              type="text"
              name="isbnNo"
              value={formData.isbnNo}
              onChange={handleChange}
              placeholder="ISBN Number"
              disabled
            />
          </div>
          <div>
            <Label htmlFor="pages">Pages</Label>
            <Input
              type="number"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              placeholder="Pages"
            />
          </div>
          <div>
            <Label htmlFor="totalCopies">Total Copies</Label>
            <Input
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              placeholder="Total Copies"
            />
          </div>
          <div>
            <Label htmlFor="availableCopies">Available Copies</Label>
            <Input
              type="number"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleChange}
              placeholder="Available Copies"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-black bg-transparent rounded hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-white bg-black rounded"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBookForm;
