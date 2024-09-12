"use client";
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { iMember } from "@/lib/types";
import {
  Table,
  TableBody,
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
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const AdminUserTable: React.FC<AdminUserTableProps> = ({
  users,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="mt-6 overflow-hidden rounded-lg shadow-md bg-white h-screen">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-white p-2">
          <div className="md:hidden">
            {users?.map((user, index) => (
              <div
                key={user.id}
                className="mb-2 w-full rounded-md bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium text-gray-800">
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(user.id)}
                      className="hover:bg-green-700 p-2 rounded transition-colors duration-200"
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="hover:bg-red-600 p-2 rounded transition-colors duration-200"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Table className="w-full border-separate border-spacing-y-2">
            <TableHeader className="bg-gray-200 text-gray-700">
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
                <TableHead className="px-4 py-5 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {users?.map((user, index) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <TableCell className="whitespace-nowrap py-3 pl-6 pr-3 text-gray-700">
                    {index + 1}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 text-gray-700">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3 text-gray-700">
                    {user.email}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-5 py-3 text-gray-700">
                    {user.phoneNumber}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-5 py-3 text-gray-700">
                    {user.address}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-10 py-3 text-gray-700">
                    {user.membershipStatus}
                  </TableCell>
                  <TableCell className="whitespace-nowrap py-3 pr-3">
                    <div className="flex justify-start gap-2">
                      <button
                        onClick={() => onEdit(user.id)}
                        className="hover:bg-green-500 p-2 rounded transition-colors duration-200"
                      >
                        <Edit size={16} />
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <button className="hover:bg-red-500 p-2 rounded transition-colors duration-200">
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {user.firstName} will be deleted from our database
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(user.id)}
                              className="bg-black text-white hover:bg-red-600 transition-colors duration-200"
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserTable;
