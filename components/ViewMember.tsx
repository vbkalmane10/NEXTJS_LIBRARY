"use client";
import React from "react";
import { Edit, Trash2, Trash } from "lucide-react";
import { iBook, iMember } from "@/lib/types"; // Assuming `Book` type is defined in your types file
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
interface AdminUserTableProps {
  users: iMember[];
}

const AdminUserTable: React.FC<AdminUserTableProps> = ({ users }) => {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {users?.map((user, index) => (
              <div
                key={user.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">
                      {index + 1}. {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">Email: {user.email}</p>

                    <p className="text-sm text-gray-500">
                      Phone Number: {user.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      Membership Status: {user.membershipStatus}
                    </p>
                  </div>

                  {/* <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(book.isbnNo)}
                      className="hover:bg-green-400 p-2 rounded"
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => onDelete(book.isbnNo)}
                      className="hover:bg-red-400 p-2 rounded"
                    >
                      <Trash2 />
                    </button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-5 font-medium">S.No</TableHead>
                <TableHead className="px-4 py-5 font-medium">Name</TableHead>
                <TableHead className="px-4 py-5 font-medium">Email</TableHead>

                <TableHead className="px-4 py-5 font-medium">
                  Phone Number
                </TableHead>
                <TableHead className="px-4 py-5 font-medium">Address</TableHead>
                <TableHead className="px-4 py-5 font-medium">
                  Membership Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <tbody className="bg-white">
              {users?.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="whitespace-nowrap py-3 pl-6 pr-3">
                    {index + 1}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3">
                    {user.email}
                  </TableCell>

                  <TableCell className="whitespace-nowrap px-5 py-3">
                    {user.phoneNumber}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-5 py-3">
                    {user.address}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-10 py-3">
                    {user.membershipStatus}
                  </TableCell>
                  <TableCell className="whitespace-nowrap py-3  pr-3">
                    {/* <div className="flex justify-start gap-2">
                      <button
                        onClick={() => onEdit(book.isbnNo)}
                        className="hover:bg-green-400 p-2 rounded"
                      >
                        <Edit size={16} />
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <button className="hover:bg-green-400 p-2 rounded">
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {book.title} will be deleted from our database
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(book.isbnNo)}
                              className="bg-blue-400"
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div> */}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserTable;
