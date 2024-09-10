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
import { addBook, createMember } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
export default function AddBook() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    membershipStatus: "active",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await createMember(formData);
      if (result) {
        toast({
          title: "Success",
          description: result.message,
          variant: "destructive",
          color: "#000000",
          duration: 1000,
        });
        setIsModalOpen(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          address: "",
          membershipStatus: "active",
          password: "",
        });
        
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setErrorMessage("Failed to add user. Please try again.");
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  };
  const modalReset = async () => {
    setIsModalOpen(false);
    setResponseMessage(null);
  };
  return (
    <>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        + Add User
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-center">
                Add User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="membershipStatus">Membership Status</Label>
                  <Input
                    type="text"
                    name="membershipStatus"
                    placeholder="Membership Status"
                    value={formData.membershipStatus}
                    onChange={handleChange}
                    required
                  />
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  {loading ? (
                    <div className="flex justify-center mt-4">
                      <PulseLoader color="#3498db" />
                    </div>
                  ) : (
                    <Button type="submit" className="w-50 bg-blue-400">
                      Add User
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
