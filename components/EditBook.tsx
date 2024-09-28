"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { iBook } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadImageToCloudinary } from "@/lib/Cloudinary";
import { Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  console.log(book);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsUploading(true);

    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }

      onSubmit({ ...formData, imageUrl });
    } catch (error) {
      console.error("Error during form submission:", error);
      setErrorMessage("Failed to update book. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-center">Edit Book</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
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
              id="author"
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
              id="publisher"
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
              id="genre"
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
              id="isbnNo"
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
              id="pages"
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
              id="totalCopies"
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
              id="availableCopies"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleChange}
              placeholder="Available Copies"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="book-image">Book Image</Label>
            <Input
              type="file"
              id="book-image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Book Cover</h3>
          <div className="relative w-32 h-48 overflow-hidden rounded-md">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="New book cover preview"
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <Image
                src={book.imageUrl!}
                alt="Current book cover"
                layout="fill"
                objectFit="cover"
                onError={() => setImageError(true)}
              />
            )}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || isUploading}
            className="px-4 py-2"
          >
            {isPending || isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading ? "Uploading..." : "Saving..."}
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBookForm;
