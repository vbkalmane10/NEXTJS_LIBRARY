import { Suspense } from "react";
import { handleFetchProfessors } from "@/lib/actions";
import ProfessorList from "@/components/ProfessorList";
import { Loader2 } from "lucide-react";
import { fetchProfessors } from "@/lib/repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Fetch all professors from the server-side
async function getProfessors() {
  const professors = await fetchProfessors();
  return professors;
}

export default async function ProfessorsPage() {
  const professors = await getProfessors();
  const session = await getServerSession(authOptions);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Professors</h1>
      <Suspense
        fallback={
          <div className="h-full w-full flex justify-center items-center">
            <Loader2 className="animate-spin" />
            <p className="ml-2">Loading...</p>
          </div>
        }
      >
        <ProfessorList professors={professors} userId={session.user.id} />
      </Suspense>
    </div>
  );
}
