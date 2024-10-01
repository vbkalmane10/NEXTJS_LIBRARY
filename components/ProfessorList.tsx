"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Mail, Calendar } from "lucide-react";
import {
  handleCheckBookingStatus,
  handleCreatePaymentRecord,
} from "@/lib/actions";
import {
  handleDeductCredits,
  fetchUserDetails,
} from "@/lib/MemberRepository/actions";

interface Professor {
  id?: number;
  name: string;
  email: string;
  department: string | null;
  shortBio: string | null;
  calendlyLink: string | null;
}

interface ProfessorListProps {
  professors: Professor[];
  userId: number;
}

export default function ProfessorList({
  professors,
  userId,
}: ProfessorListProps) {
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const router = useRouter();

  const MEETING_COST = 20;

  useEffect(() => {
    const getUserCredits = async () => {
      const userDetails = await fetchUserDetails(userId);
      if (userDetails) {
        setUserCredits(userDetails.credits!);
      }
    };
    getUserCredits();
  }, [userId]);

  const handleBookAppointment = async (professor: Professor) => {
    if (!professor.id) {
      alert("Unable to book appointment. Professor ID is missing.");
      return;
    }

    setIsLoading(professor.id);

    try {
      const result = await handleCheckBookingStatus(userId, professor.id);

      if (
        result &&
        result.length > 0 &&
        result[0].payment_status === "Success"
      ) {
        router.push(
          `/books/professors/${professor.name}?calendlyUrl=${encodeURIComponent(
            professor.calendlyLink || ""
          )}`
        );
      } else {
        setSelectedProfessor(professor);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error checking booking status:", error);
      alert(
        "An error occurred while checking your booking status. Please try again."
      );
    } finally {
      setIsLoading(null);
    }
  };

  const handlePayment = async () => {
    if (!selectedProfessor || !selectedProfessor.id) return;

    setIsLoading(selectedProfessor.id);

    try {
      const deductResult = await handleDeductCredits(userId, MEETING_COST);
      if (!deductResult.success) {
        throw new Error(deductResult.message);
      }

      const paymentResult = await handleCreatePaymentRecord(
        userId,
        selectedProfessor.id,
        `payment_${Date.now()}`
      );
      if (!paymentResult.success) {
        throw new Error(paymentResult.message);
      }

      setUserCredits((prevCredits) => prevCredits - MEETING_COST);
      setIsDialogOpen(false);

      router.push(
        `/books/professors/${
          selectedProfessor.name
        }?calendlyUrl=${encodeURIComponent(
          selectedProfessor.calendlyLink || ""
        )}`
      );
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(
        "An error occurred while processing your payment. Please try again."
      );
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professors.map((professor) => (
          <Card key={professor.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {professor.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {professor.department && (
                <div className="flex items-center text-sm mb-2">
                  <BookOpen className="w-4 h-4 mr-2 text-primary" />
                  <span>{professor.department}</span>
                </div>
              )}
              <div className="flex items-center text-sm mb-4">
                <Mail className="w-4 h-4 mr-2 text-primary" />
                <a
                  href={`mailto:${professor.email}`}
                  className="hover:underline"
                >
                  {professor.email}
                </a>
              </div>
              {professor.shortBio && (
                <p className="text-sm text-gray-600">{professor.shortBio}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleBookAppointment(professor)}
                disabled={isLoading === professor.id}
              >
                {isLoading === professor.id ? (
                  <>
                    <Calendar className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Book Appointment with {selectedProfessor?.name}
            </DialogTitle>
            <DialogDescription>
              This professor charges {MEETING_COST} credits for a meeting.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg font-semibold">Your credits: {userCredits}</p>
            <p className="text-lg font-semibold">
              Cost: {MEETING_COST} credits
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={handlePayment}
              disabled={
                userCredits < MEETING_COST ||
                isLoading === selectedProfessor?.id
              }
            >
              {isLoading === selectedProfessor?.id ? (
                <>
                  <Calendar className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay with {MEETING_COST} credits</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
