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
import { Loader2, Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Name</TableHead>
              <TableHead className="w-1/4">Department</TableHead>
              <TableHead className="w-1/3">About</TableHead>
              <TableHead className="w-1/6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professors.map((professor) => (
              <TableRow key={professor.id}>
                <TableCell className="font-medium">{professor.name}</TableCell>
                <TableCell>{professor.department}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {professor.shortBio}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      handleBookAppointment(
                        professor.name,
                        professor.calendlyLink
                      )
                    }
                  >
                    Book Appointment
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
