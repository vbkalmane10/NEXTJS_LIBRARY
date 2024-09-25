"use client";

import { useEffect, useState } from "react";
import { handleFetchProfessors } from "@/lib/actions";
import { Professor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GraduationCap, Info, Loader2, Router, User,BookText,University } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("Professors");
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
  }, []);
  const handleBookAppointment = (
    professorName: string,
    calendlyLink: string
  ) => {
    router.push(
      `/books/professors/${professorName}?calendlyUrl=${encodeURIComponent(
        calendlyLink
      )}`
    );
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
      <h1 className="text-3xl font-bold mb-6">{t("Professors")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {professors.map((professor) => (
          <Card key={professor.id} className="hover:shadow-lg transition-shadow">
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
                onClick={() => handleBookAppointment(professor.name, professor.calendlyLink)}
                className="w-full"
              >
                Book Appointment
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
