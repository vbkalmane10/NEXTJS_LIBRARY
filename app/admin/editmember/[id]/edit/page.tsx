"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { iBook, iMember } from "@/lib/types";
import EditUserForm from "@/components/EditUser";
import { fetchUserDetails, handleUserUpdate } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";

const EditBookPage = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const router = useRouter();
  const [user, setUser] = useState<iMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const fetchedUser = await fetchUserDetails(id);
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          toast({
            title: "Error",
            description: "Failed to load user details.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching user details.",
          variant: "destructive",
        });
      }
    };

    fetchDetails();
  }, [id]);

  const handleEditSubmit = async (updatedUser: iMember) => {
    console.log("This is in the handleEditSubmit ", updatedUser);
    setIsSubmitting(true);
    try {
      const result = await handleUserUpdate(id, updatedUser);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          duration: 1000,
          className: "bg-green-700 text-white",
        });
        router.push("/admin/viewmember");
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
    router.push("/admin/viewmember");
  };

  if (!user) return <p>Loading user details...</p>;

  return (
    <div>
      <EditUserForm
        user={user}
        onClose={handleEditClose}
        onSubmit={handleEditSubmit}
        isPending={isSubmitting}
      />
    </div>
  );
};

export default EditBookPage;
