import React from "react";
import { Request } from "@/lib/types";
import clsx from "clsx";
import { Button } from "./ui/button";
import { returnBook } from "@/lib/repository";
import { useToast } from "@/hooks/use-toast";

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

import { Book, Calendar,Hash } from "lucide-react";
interface RequestCardProps {
  request: Request;
  onCancel: () => void;
  //onReturn: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onCancel,
 // onReturn,
}: RequestCardProps) => {
  const statusColors = {
    Approved: "bg-green-100 text-green-800 border-green-300",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Rejected: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 truncate">
          {request.bookTitle}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusColors[request.status as keyof typeof statusColors]
          } border`}
        >
          {request.status}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Book className="w-4 h-4 mr-2 text-primary" />
          <span className="text-sm">ISBN: {request.isbnNo}</span>
        </div>
       
        <div className="flex items-center text-gray-600">
          <Hash className="w-4 h-4 mr-2 text-primary" />
          <span className="text-sm">Request ID: {request.id}</span>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 px-6 py-4">
      {request.status === "Pending" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50">
              Cancel Request
            </Button>
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
              <AlertDialogCancel>No, keep it</AlertDialogCancel>
              <AlertDialogAction onClick={onCancel} className="bg-red-500 hover:bg-red-600 text-white">
                Yes, cancel request
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {request.status === "Approved" && (
        <div className="text-center text-green-600 font-semibold">
          Your request has been approved
        </div>
      )}
      {request.status === "Rejected" && (
        <div className="text-center text-red-600 font-semibold">
          Your request has been rejected
        </div>
      )}
    </div>
  </div>
  );
};

export default RequestCard;
