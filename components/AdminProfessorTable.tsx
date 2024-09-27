"use client";
import React from "react";
import { Edit, RefreshCcw, Trash2 } from "lucide-react";
import { iMember, Professor } from "@/lib/types";
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
import { useTranslations } from "next-intl";

interface AdminProfessorTableProps {
  users: Professor[];
  onRefresh: (email: string) => void;
  //  onEdit: (id: number) => void;
  // onDelete: (id: number) => void;
}

const AdminProfessorTable: React.FC<AdminProfessorTableProps> = ({
  users,
  onRefresh,
  // onEdit,
  // onDelete,
}) => {
  const t = useTranslations("UserTable");
  return (
    <div className="mt-6 overflow-hidden rounded-lg shadow-md bg-white h-fit">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-white p-2">
          {/* Card View for Mobile Screens */}
          <div className="md:hidden">
            {users?.map((user, index) => (
              <div
                key={user.id}
                className="mb-2 w-full rounded-md bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium text-gray-800">
                      {index + 1}. {user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("email")}: {user.department}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("phoneNumber")}: {user.shortBio}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("membershipStatus")}: {user.calendlyLink}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      // onClick={() => onEdit(user.id)}
                      className="hover:bg-green-700 p-2 rounded transition-colors duration-200"
                    >
                      <Edit />
                    </button>
                    <button
                      // onClick={() => onDelete(user.id)}
                      className="hover:bg-red-600 p-2 rounded transition-colors duration-200"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table View for Larger Screens */}
          <div className="hidden md:block">
            <Table className="w-full border-separate border-spacing-y-2">
              <TableHeader className="bg-gray-200 text-gray-700">
                <TableRow>
                  <TableHead className="px-4 py-5 font-medium">
                    {t("serialNo")}
                  </TableHead>
                  <TableHead className="px-4 py-5 font-medium">
                    {t("name")}
                  </TableHead>
                  <TableHead className="px-4 py-5 font-medium">Email</TableHead>
                  <TableHead className="px-4 py-5 font-medium">
                    Department
                  </TableHead>
                  <TableHead className="px-4 py-5 font-medium">
                    Short Bio
                  </TableHead>
                  <TableHead className="px-4 py-5 font-medium">
                    Calendly Link
                  </TableHead>

                  <TableHead className="px-4 py-5 font-medium">
                    {t("actions")}
                  </TableHead>
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
                      {user.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-3 text-gray-700">
                      {user.email}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-3 py-3 text-gray-700">
                      {user.department}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-5 py-3 text-gray-700">
                      {user.shortBio}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-5 py-3 text-gray-700">
                      {user.calendlyLink}
                    </TableCell>

                    <TableCell className="whitespace-nowrap py-3 pr-3">
                      <div className="flex justify-start gap-2">
                        <button
                          // onClick={() => onEdit(user.id)}
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
                                {user.name} will be deleted from our database
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                //   onClick={() => onDelete(user.id)}
                                className="bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {!user.calendlyLink && (
                          <button
                             onClick={() => onRefresh(user.email)}
                            className="hover:bg-green-500 p-2 rounded transition-colors duration-200"
                          >
                            <RefreshCcw size={16} />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfessorTable;
