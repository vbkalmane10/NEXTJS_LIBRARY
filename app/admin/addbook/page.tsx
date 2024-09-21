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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function AddBookPage() {
  const [formData, setFormData] = useState({
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (formData.isbnNo.length !== 13) {
        setErrorMessage("ISBN should be 13 digits");
        return;
      }
      if (!imageFile) {
        setErrorMessage("Please upload a book image.");
        setLoading(false);
        return;
      }
      const imageUrl = await uploadImageToCloudinary(imageFile);

      const result = await addBook({ ...formData, imageUrl });
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
      setErrorMessage("Failed to add book. Please try again.");
      toast({
        title: "Error",
        description: "Failed to add book. Please try again.",
        variant: "destructive",
      });
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
                  required
                />

          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
                  type="text"
                  name="author"
                  placeholder="Author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publisher">Publisher</Label>
            <Input
                type="text"
                name="publisher"
                placeholder="Publisher"
                value={formData.publisher}
                onChange={handleChange}
                required
              />


          </div>
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
                type="text"
                name="genre"
                placeholder="Genre"
                value={formData.genre}
                onChange={handleChange}
                required
              />

          </div>
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
                type="text"
                name="isbnNo"
                placeholder="ISBN"
                value={formData.isbnNo}
                onChange={handleChange}
                required
              />

          </div>
          <div className="space-y-2">
            <Label htmlFor="pages">Pages</Label>
            <Input
                  type="number"
                  name="pages"
                  placeholder="Pages"
                  value={formData.pages}
                  onChange={handleChange}
                  required
                />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total-copies">Total Copies</Label>
            <Input
                  type="number"
                  name="totalCopies"
                  placeholder="Total Copies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  required
                />
          </div>
          <div className="space-y-2">
            <Label htmlFor="available-copies">Available Copies</Label>
            <Input
                  type="number"
                  name="availableCopies"
                  placeholder="Available Copies"
                  value={formData.availableCopies}
                  onChange={handleChange}
                  required
                />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

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
          </div>
        </div>

      
         <div className="flex gap-4 justify-end">
              {loading ? (
                <PulseLoader color="#3498db" />
              ) : (
                <Button type="submit" className="w-50 bg-black">
                  Add Book
                </Button>
              )}
              <Button onClick={() => router.replace("/admin")} className="bg-transparent text-black">Cancel</Button>
            </div>
      </form>
    </div>
  );
}
