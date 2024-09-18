"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

import { Label } from "./ui/label";
import { Input } from "@/components/ui/input";
import { PulseLoader } from "react-spinners";
import { addBook } from "@/lib/BookRepository/actions";
import { useToast } from "@/hooks/use-toast";
import { cloudinary } from "@/lib/Cloudinary";
import { CloudinaryUploadResponse } from "@/lib/types";
export default function AddBook() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const { toast } = useToast();
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
      let publicId = null;
      let imageUrl = formData.imageUrl;
  
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
  
        const uploadResponse = await new Promise<CloudinaryUploadResponse>(
          (resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: "library_books",
                public_id: `${formData.isbnNo}-${Date.now()}`,
              },
              function (error: any, result: any) {
                if (error) {
                  reject(error);
                  return;
                }
                if (result) {
                  resolve(result);
                  return;
                }
              }
            ).end(buffer);
          }
        );
  
        if (uploadResponse) {
          imageUrl = uploadResponse.secure_url as string;
          publicId = uploadResponse.public_id;
        } else {
          throw new Error("Failed to upload image to Cloudinary");
        }
      }
      const newBookData = { ...formData, imageUrl };
      const result = await addBook(newBookData);
      if (result) {
        toast({
          title: "Success",
          description: result.message,
          variant: "destructive",
          className: "bg-green-500",
          duration: 1000,
        });
        setIsModalOpen(false);
        setFormData({
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
      }
    } catch (error) {
      console.error("Error adding book:", error);
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
    <>
      <button
        className="bg-black text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        + Add Book
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-xl max-h-screen overflow-y-auto">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-center">
                Add Book
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
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
                  <div className="space-y-1">
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
                </div>
                <div className="space-y-1">
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
                <div className="space-y-1">
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
                <div className="space-y-1">
                  <Label htmlFor="isbnNo">ISBN</Label>
                  <Input
                    type="text"
                    name="isbnNo"
                    placeholder="ISBN"
                    value={formData.isbnNo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    type="number"
                    name="pages"
                    placeholder="Pages"
                    value={formData.pages}
                    onChange={handleChange}
                    required
                  />
                  <div className="space-y-1">
                    <Label htmlFor="totalCopies">Total Copies</Label>
                    <Input
                      type="number"
                      name="totalCopies"
                      placeholder="Total Copies"
                      value={formData.totalCopies}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="availableCopies">Available Copies</Label>
                    <Input
                      type="number"
                      name="availableCopies"
                      placeholder="Available Copies"
                      value={formData.availableCopies}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1">
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
                  <div className="space-y-1">
                    <Label htmlFor="image">Book Image</Label>
                    <Input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </div>
                  <p className="text-red-600 font-semibold">{errorMessage}</p>
                </div>
                <div className="flex justify-between">
                  {loading ? (
                    <div className="flex justify-center mt-4">
                      <PulseLoader color="#3498db" />
                    </div>
                  ) : (
                    <Button type="submit" className="w-50 bg-black">
                      Add Book
                    </Button>
                  )}
                  <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
