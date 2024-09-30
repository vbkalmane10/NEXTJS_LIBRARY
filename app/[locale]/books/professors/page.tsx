"use client";

import { useEffect, useState } from "react";
import {
  handleCheckBookingStatus,
  handleCreatePaymentRecord,
  handleFetchProfessors,
} from "@/lib/actions";
import { Professor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, User, BookText, University } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import RazorpayPayment from "@/components/PaymentButton";
import { useSession } from "next-auth/react";

export default function ProfessorsPage() {
  const { data: session } = useSession();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );
  const [bookingStatus, setBookingStatus] = useState<Record<number, boolean>>(
    {}
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await handleFetchProfessors();
        if (result !== null) {
          setProfessors(result);
          setIsLoading(false);
        }
       
      } catch (error) {
        setError("Failed to load professors.");
        setIsLoading(false);
      }
    }
    fetchData();
  }, [session?.user?.id]);

  const handleBookAppointment = async (professor: Professor) => {
    const paymentStatus = await handleCheckBookingStatus(
      session?.user.id!,
      professor.id!
    );
  
    if (paymentStatus === "Success") {
      router.push(
        `/books/professors/${professor.name}?calendlyUrl=${encodeURIComponent(
          professor.calendlyLink || ""
        )}`
      );
    } else {
      setSelectedProfessor(professor);
      setIsModalOpen(true);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    if (selectedProfessor && session?.user?.id) {
      console.log(session.user.id);
      console.log(selectedProfessor.id!);
      console.log(paymentId);
      await handleCreatePaymentRecord(
        session.user.id,
        selectedProfessor.id!,
        paymentId
      );
      setIsModalOpen(false);
      router.push(
        `/books/professors/${
          selectedProfessor.name
        }?calendlyUrl=${encodeURIComponent(selectedProfessor.calendlyLink!)}`
      );
    }
  };

  const handlePaymentFailure = () => {
    console.error("Payment failed");
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loader2 className="animate-spin" />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Professors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {professors.map((professor) => (
          <Card
            key={professor.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>{professor.name}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <BookText className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {professor.department}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <University className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {professor.shortBio}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleBookAppointment(professor)}
                className="w-full"
              >
                Book Appointment
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Book an appointment with {selectedProfessor?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg font-semibold"></p>
            <p className="text-lg font-semibold">Price: ₹500</p>
            <p className="text-sm text-gray-500">
              This fee covers a 30-minute consultation.
            </p>
          </div>
          <DialogFooter>
            <RazorpayPayment
              amount={500}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              professorId={selectedProfessor?.id ?? 0}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
