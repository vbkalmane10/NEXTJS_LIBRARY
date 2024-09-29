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
import { createMember } from "@/lib/MemberRepository/actions";
import { useToast } from "@/hooks/use-toast";
import {
  createProfessor,
  handleFetchOrganization,
  handleSendInvitations,
} from "@/lib/actions";
import { z } from "zod"
import { fetchUserOrganization, sendInvitations } from "@/lib/Calendly";
const professorSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  department: z.string().min(1, { message: "Department is required" }),
  shortBio: z.string().min(1, { message: "Short bio is required" }),
  calendlyLink: z.string().url({ message: "Invalid URL" }).or(z.literal("")),
})

type ProfessorFormData = z.infer<typeof professorSchema>
export default function AddProfessor() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProfessorFormData>({
    name: "",
    email: "",
    department: "",
    shortBio: "",
    calendlyLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [errors, setErrors] = useState<Partial<ProfessorFormData>>({})
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

    try {
      const urlRegex =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

      if (formData.calendlyLink && !urlRegex.test(formData.calendlyLink)) {
        setErrorMessage(
          "Please enter a valid Calendly link or leave it blank."
        );
        setLoading(false);
        return;
      }
      const validatedData = professorSchema.parse(formData)
      const userOrganizationUrl = await handleFetchOrganization();
      const userOrganization = userOrganizationUrl.split("/").pop();

      let calendlyLink = formData.calendlyLink;

      if (!calendlyLink) {
        const inviteResponse = await handleSendInvitations(
          formData.email,
          userOrganization
        );

        if (inviteResponse) {
          toast({
            title: "Calendly Invitation Sent",
            description: `An invite has been sent to ${formData.email}`,
            className: "bg-green-400 text-white",
          });
        } else {
          toast({
            title: "Error",
            description: `Error while sending invitation`,
            className: "bg-red-400 text-white",
          });
        }
      }

      const result = await createProfessor(validatedData);

      if (result) {
        toast({
          title: "Success",
          description: "Professor added successfully.",
          className: "bg-green-400 text-white",
        });
        setIsModalOpen(false);
        setFormData({
          name: "",
          email: "",
          department: "",
          shortBio: "",
          calendlyLink: "",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as Partial<ProfessorFormData>)
      }
      console.error("Error adding professor:", error);
      toast({
        title: "Error",
        description: "Failed to add professor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        + Add Professor
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-center">
                Add Professor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                     
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                   
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    type="text"
                    name="department"
                    placeholder="Deaprtment"
                    value={formData.department}
                    onChange={handleChange}
                  
                  />
                  {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="shortBio">Short Bio</Label>
                  <Input
                    type="text"
                    name="shortBio"
                    placeholder="Short Bio"
                    value={formData.shortBio}
                    onChange={handleChange}
                    
                  />
                  {errors.shortBio && <p className="text-red-500 text-sm">{errors.shortBio}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="calendlyLink">Calendly Link</Label>

                  <Input
                    type="text"
                    name="calendlyLink"
                    placeholder="Calendly link"
                    value={formData.calendlyLink}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-gray-500">
                    Leave blank if you don’t have one.
                  </p>
                  {errorMessage && (
                    <div className="text-red-500 text-sm">{errorMessage}</div>
                  )}
                </div>

                <div className="flex gap-3">
                  {loading ? (
                    <div className="flex justify-center mt-4">
                      <PulseLoader color="#3498db" />
                    </div>
                  ) : (
                    <Button type="submit" className="w-50 bg-black">
                      Add Professor
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
