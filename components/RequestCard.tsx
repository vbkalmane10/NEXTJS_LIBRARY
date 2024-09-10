import React from "react";
import { Request } from "@/lib/types";
import clsx from "clsx";
interface RequestCardProps {
  request: Request;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  return (
    <div className="border border-gray-300 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-lg font-semibold text-black">{request.bookTitle}</h2>
      <div className="mt-2 text-sm text-gray-700">
        <p>
          <span className="font-semibold">ISBN:</span> {request.isbnNo}
        </p>
        <div
          className={clsx(
            "mt-3 px-3 py-1 rounded-full text-black font-medium w-fit",
            {
              "bg-green-500 ": request.status === "Approved",
              "bg-gray-400": request.status === "Pending",
              "bg-red-500": request.status === "Rejected",
            }
          )}
        >
          {request.status}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
