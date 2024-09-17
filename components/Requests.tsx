import React from "react";
import { Check, X } from "lucide-react";
import { Request } from "@/lib/types";
import { handleApproveRequest } from "@/lib/actions";
import { revalidatePath } from "next/cache";

interface RequestTableProps {
  requests: Request[];
  onApprove: (request: Request) => void;
  onReject: (request: Request) => void;
}

const RequestTable: React.FC<RequestTableProps> = ({
  requests,
  onApprove,
  onReject,
}) => {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {requests?.map((request, index) => (
              <div
                key={request.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">
                      {index + 1}. {request.bookTitle}
                    </p>
                    <p className="text-sm text-gray-500">
                      User: {request.firstName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Book ID: {request.bookId}
                    </p>
                    <p className="text-sm text-gray-500">
                      ISBN: {request.isbnNo}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {request.status}
                    </p>
                  </div>
                  {request.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApprove(request)}
                        className="hover:bg-green-400 p-2 rounded"
                      >
                        <Check />
                      </button>
                      <button
                        onClick={() => onReject(request)}
                        className="hover:bg-red-400 p-2 rounded"
                      >
                        <X />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Table layout for larger screens */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal bg-gray-200">
              <tr>
                <th className="px-4 py-5 font-medium">S.No</th>
                <th className="px-4 py-5 font-medium">User</th>
                <th className="px-4 py-5 font-medium">Book ID</th>
                <th className="px-4 py-5 font-medium">Book Title</th>
                <th className="px-4 py-5 font-medium">ISBN Number</th>
                <th className="px-4 py-5 font-medium">Status</th>
                <th className="px-4 py-5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {requests?.map((request, index) => (
                <tr
                  key={request.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {request.firstName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {request.bookId}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {request.bookTitle}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {request.isbnNo}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {request.status}
                  </td>
                  <td className="whitespace-nowrap py-3  pr-3">
                    {request.status === "Pending" && (
                      <div className="flex justify-start gap-2">
                        <button
                          onClick={() => onApprove(request)}
                          className="hover:bg-green-400 p-2 rounded"
                        >
                          <Check />
                        </button>
                        <button
                          onClick={() => onReject(request)}
                          className="hover:bg-red-400 p-2 rounded"
                        >
                          <X />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestTable;
