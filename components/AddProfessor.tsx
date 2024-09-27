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
import { fetchUserOrganization, sendInvitations } from "@/lib/Calendly";

export default function AddProfessor() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
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

      const result = await createProfessor(formData);

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
                      required
                    />
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
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Department</Label>
                  <Input
                    type="text"
                    name="department"
                    placeholder="Deaprtment"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="shortBio">Short Bio</Label>
                  <Input
                    type="text"
                    name="shortBio"
                    placeholder="Short Bio"
                    value={formData.shortBio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="calendlyLink">Calendly Link</Label>
                  <Input
                    type="text"
                    name="calendlyLink"
                    placeholder="Calendly Link"
                    value={formData.calendlyLink}
                    onChange={handleChange}
                  />
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
