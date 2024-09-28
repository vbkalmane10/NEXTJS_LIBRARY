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
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";

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
  const t = useTranslations("UserTable");
  return (
    <div className="overflow-hidden rounded-lg shadow-md bg-white">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-white p-2">
            {/* Card View for Mobile Screens */}
            <div className="sm:hidden space-y-4">
              {users?.map((user, index) => (
                <div
                  key={user.id}
                  className="w-full rounded-md bg-white p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between pb-4">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-800">
                        {index + 1}. {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Email: {user.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        Phone: {user.phoneNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {user.membershipStatus}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onEdit(user.id)}
                        className="bg-green-600 hover:bg-green-400 p-2 rounded transition-colors duration-200"
                      >
                        <Edit size={20} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button className="bg-red-600 hover:bg-red-400 p-2 rounded transition-colors duration-200">
                            <Trash2 size={20} />
                          </Button>
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
                              className="bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table View for Larger Screens */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>{user.membershipStatus}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => onEdit(user.id)}
                            className="bg-green-600 hover:bg-green-400 p-2 rounded transition-colors duration-200"
                          >
                            <Edit size={16} />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button className="bg-red-600 hover:bg-red-400 p-2 rounded transition-colors duration-200">
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {user.firstName} will be deleted from our
                                  database
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(user.id)}
                                  className="bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                >
                                  Delete
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
      </div>
    </div>
  );
};

export default AdminUserTable;
