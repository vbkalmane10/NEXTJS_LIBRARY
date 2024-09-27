"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { iBook, iMember, Professor } from "@/lib/types";
import EditUserForm from "@/components/EditUser";
import {
  fetchUserDetails,
  handleUserUpdate,
} from "@/lib/MemberRepository/actions";
import { toast } from "@/hooks/use-toast";
import { fetchProfessorDetails, handleProfessorUpdate } from "@/lib/actions";
import EditProfessorForm from "@/components/EditProfessor";

const EditBookPage = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const router = useRouter();
  const [user, setUser] = useState<Professor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const fetchedUser = await fetchProfessorDetails(id);
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          toast({
            title: "Error",
            description: "Failed to load professor details.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching professor details.",
          variant: "destructive",
        });
      }
    };

    fetchDetails();
  }, [id]);

  const handleEditSubmit = async (updatedUser: Professor) => {
   
    setIsSubmitting(true);
    try {
      const result = await handleProfessorUpdate(id, updatedUser);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          duration: 1000,
          className: "bg-green-400 text-white",
        });
        router.replace("/admin/viewprofessor");
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
        description: "Failed to update the user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClose = () => {
    router.push("/admin/viewprofessor");
  };

  if (!user) return <p>Loading user details...</p>;

  return (
    <div>
      <EditProfessorForm
        user={user}
        onClose={handleEditClose}
        onSubmit={handleEditSubmit}
        isPending={isSubmitting}
      />
    </div>
  );
};

export default EditBookPage;
