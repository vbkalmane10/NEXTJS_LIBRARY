import React from "react";
import { Request } from "@/lib/types";
import clsx from "clsx";
import { Button } from "./ui/button";
import { returnBook } from "@/lib/repository";
import { useToast } from "@/hooks/use-toast";
import { revalidatePath } from "next/cache";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface RequestCardProps {
  request: Request;
  onCancel: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onCancel,
}: RequestCardProps) => {
  const { toast } = useToast();
  // const handleReturn = async () => {
  //   try {
  //     const result = await returnBook(request);
  //     if (result) {
  //       toast({
  //         title: "Success",
  //         description: result.message,
  //         variant: "destructive",
  //         className: "bg-green-500",
  //         duration: 1000,
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to return book",
  //       variant: "destructive",
  //       className: "bg-red-500",
  //       duration: 1000,
  //     });
  //   }
  // };

  return (
    <div className="relative border border-gray-300 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow duration-300 h-48">
      {" "}
      <h2 className="text-lg font-semibold text-black">{request.bookTitle}</h2>
      <div className="mt-2 text-sm text-gray-700">
        <p>
          <span className="font-semibold">ISBN:</span> {request.isbnNo}
        </p>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <div
          className={clsx("px-3 py-1 rounded-full text-black font-medium", {
            "bg-green-500": request.status === "Approved",
            "bg-gray-400": request.status === "Pending",
            "bg-red-500": request.status === "Rejected",
          })}
        >
          {request.status}
        </div>
        {request.status === "Pending" && (
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Cancel</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel this request for{" "}
                    <span className="font-semibold">{request.bookTitle}</span>?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onCancel} className="bg-red-500">
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        {request.status === "Approved" && <Button>Return Book</Button>}
      </div>
    </div>
  );
};

export default RequestCard;
