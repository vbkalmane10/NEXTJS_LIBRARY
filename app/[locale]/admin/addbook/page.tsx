"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PulseLoader } from "react-spinners";
import { addBook } from "@/lib/BookRepository/actions";
import { useToast } from "@/hooks/use-toast";
import { uploadImageToCloudinary } from "@/lib/Cloudinary";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";

const bookSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  publisher: z.string().min(1, { message: "Publisher is required" }),
  genre: z.string().min(1, { message: "Genre is required" }),
  isbnNo: z.string().length(13, { message: "ISBN must be 13 digits" }),
  pages: z.number().min(1, { message: "Pages must be at least 1" }),
  totalCopies: z
    .number()
    .min(1, { message: "Total copies must be at least 1" }),
  availableCopies: z
    .number()
    .min(1, { message: "Available copies must be at least 1" }),
  price: z.number().min(0, { message: "Price must be non-negative" }),
  imageUrl: z.string(),
});

type BookFormData = z.infer<typeof bookSchema>;

export default function AddBookPage() {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    publisher: "",
    genre: "",
    isbnNo: "",
    pages: 1,
    totalCopies: 1,
    availableCopies: 1,
    price: 1,
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<BookFormData>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      name === "pages" ||
      name === "totalCopies" ||
      name === "availableCopies" ||
      name === "price"
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear the error for this field when the user starts typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validatedData = bookSchema.parse(formData);

      if (!imageFile) {
        setErrors({ imageUrl: "Please upload a book image." });
        setLoading(false);
        return;
      }

      const imageUrl = await uploadImageToCloudinary(imageFile);

      const result = await addBook({ ...validatedData, imageUrl });
      if (result) {
        toast({
          title: "Success",
          description: result.message,
          variant: "destructive",
          className: "bg-green-500",
          duration: 1000,
        });
        router.replace("/admin");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as Partial<BookFormData>);
      } else {
        toast({
          title: "Error",
          description: "Failed to add book. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Add New Book
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              type="text"
              name="author"
              placeholder="Author"
              value={formData.author}
              onChange={handleChange}
            />
            {errors.author && (
              <p className="text-red-500 text-sm">{errors.author}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              type="text"
              name="publisher"
              placeholder="Publisher"
              value={formData.publisher}
              onChange={handleChange}
            />
            {errors.publisher && (
              <p className="text-red-500 text-sm">{errors.publisher}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              type="text"
              name="genre"
              placeholder="Genre"
              value={formData.genre}
              onChange={handleChange}
            />
            {errors.genre && (
              <p className="text-red-500 text-sm">{errors.genre}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              type="text"
              name="isbnNo"
              placeholder="ISBN"
              value={formData.isbnNo}
              onChange={handleChange}
            />
            {errors.isbnNo && (
              <p className="text-red-500 text-sm">{errors.isbnNo}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pages">Pages</Label>
            <Input
              type="number"
              name="pages"
              placeholder="Pages"
              value={formData.pages}
              onChange={handleChange}
            />
            {errors.pages && (
              <p className="text-red-500 text-sm">{errors.pages}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="total-copies">Total Copies</Label>
            <Input
              type="number"
              name="totalCopies"
              placeholder="Total Copies"
              value={formData.totalCopies}
              onChange={handleChange}
            />
            {errors.totalCopies && (
              <p className="text-red-500 text-sm">{errors.totalCopies}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="available-copies">Available Copies</Label>
            <Input
              type="number"
              name="availableCopies"
              placeholder="Available Copies"
              value={formData.availableCopies}
              onChange={handleChange}
            />
            {errors.availableCopies && (
              <p className="text-red-500 text-sm">{errors.availableCopies}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="book-image">Book Image</Label>
            <Input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm">{errors.imageUrl}</p>
            )}
          </div>
        </div>
        {imagePreview && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
            <div className="relative w-32 h-48 overflow-hidden rounded-md">
              <Image
                src={imagePreview}
                alt="Book cover preview"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-end">
          {loading ? (
            <PulseLoader color="#3498db" />
          ) : (
            <Button type="submit" className="w-50 bg-black">
              Add Book
            </Button>
          )}
          <Button
            onClick={() => router.replace("/admin")}
            className="bg-transparent text-black"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
