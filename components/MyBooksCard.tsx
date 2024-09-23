import React from "react";
import { Request } from "@/lib/types";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface RequestCardProps {
  request: Request;
  onReturn: (request: Request) => void; // Pass the return handler
}

const MyBooksCard: React.FC<RequestCardProps> = ({
  request,
  onReturn,
}) => {
  const { toast } = useToast();

  return (
    <div className="relative border border-gray-300 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow duration-300 h-48">
      <h2 className="text-lg font-semibold text-black">{request.bookTitle}</h2>
      <div className="mt-2 text-sm text-gray-700">
        <p>
          <span className="font-semibold">ISBN:</span> {request.isbnNo}
        </p>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <div className="bg-green-500 text-black py-1 px-3 rounded-full font-semibold">
          {request.status}
        </div>
        {request.status === "Approved" && (
          <Button
           
            onClick={() => onReturn(request)}
          >
            Return Book
          </Button>
        )}
      </div>
    </div>
  );
};

export default MyBooksCard;
